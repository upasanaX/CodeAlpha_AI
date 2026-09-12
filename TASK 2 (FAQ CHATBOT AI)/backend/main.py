"""
FastAPI application for FAQ Chatbot.
Provides REST API endpoints for user chat interaction, similarity matching,
and FAQ administration (CRUD operations).
"""

from contextlib import asynccontextmanager
from typing import List, Optional
from datetime import datetime

from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict
from sqlalchemy.orm import Session

from db import init_db, get_db, SessionLocal, FAQ
from faq_seed import seed_database, force_reseed_database
from nlp_utils import faq_matcher, preprocess_text


# --- Lifespan Context Manager ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup:
    1. Initialize database tables
    2. Seed initial FAQs if empty
    3. Fit in-memory TF-IDF vectorizer from database
    """
    print("[*] Initializing database and tables...")
    init_db()
    seed_database()

    print("[*] Training TF-IDF vectorizer on existing FAQs...")
    db = SessionLocal()
    try:
        loaded_count = faq_matcher.fit_from_db(db)
        print(f"[+] FAQ Matcher fitted successfully with {loaded_count} FAQs.")
    finally:
        db.close()

    yield
    print("[*] Application shutting down.")


# --- FastAPI Instance ---
app = FastAPI(
    title="Coursemate AI FAQ Chatbot API",
    description="Production-ready FAQ matching API utilizing NLTK NLP Preprocessing and Scikit-learn TF-IDF + Cosine Similarity.",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for frontend integration (Vite dev server and production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Pydantic Schemas ---
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000, description="User's question or message")


class ChatResponse(BaseModel):
    answer: str
    matched_question: Optional[str] = None
    confidence: float
    category: Optional[str] = None
    faq_id: Optional[int] = None
    is_fallback: bool = False


class FAQCreate(BaseModel):
    question: str = Field(..., min_length=5, max_length=500)
    answer: str = Field(..., min_length=5)
    category: str = Field(default="General", max_length=100)


class FAQUpdate(BaseModel):
    question: Optional[str] = Field(None, min_length=5, max_length=500)
    answer: Optional[str] = Field(None, min_length=5)
    category: Optional[str] = Field(None, max_length=100)


class FAQResponse(BaseModel):
    id: int
    question: str
    answer: str
    category: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class HealthResponse(BaseModel):
    status: str
    faqs_count: int
    threshold: float
    categories: List[str]


# --- API Endpoints ---

@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint showing current model and FAQ status."""
    count = db.query(FAQ).count()
    cats = [c[0] for c in db.query(FAQ.category).distinct().all()]
    return {
        "status": "healthy",
        "faqs_count": count,
        "threshold": faq_matcher.threshold,
        "categories": cats,
    }


@app.post("/api/chat", response_model=ChatResponse, tags=["Chat"])
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Chat endpoint:
    - Preprocesses user message
    - Computes TF-IDF cosine similarity against FAQ questions
    - Returns best matching answer or polite fallback if confidence < threshold
    """
    user_message = request.message.strip()
    if not user_message:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User message cannot be empty.",
        )

    # If matcher has not been fitted, attempt fitting now
    if not faq_matcher.questions:
        faq_matcher.fit_from_db(db)

    # Perform matching
    match_result = faq_matcher.match(user_message)
    return match_result


@app.get("/api/faqs", response_model=List[FAQResponse], tags=["FAQs Admin"])
def get_faqs(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search term in question or answer"),
    db: Session = Depends(get_db),
):
    """List all FAQs with optional search and category filters."""
    query = db.query(FAQ)
    if category and category.lower() != "all":
        query = query.filter(FAQ.category.ilike(f"%{category}%"))
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (FAQ.question.ilike(search_pattern)) | (FAQ.answer.ilike(search_pattern))
        )
    return query.order_by(FAQ.id.desc()).all()


@app.post("/api/faqs", response_model=FAQResponse, status_code=status.HTTP_201_CREATED, tags=["FAQs Admin"])
def create_faq(faq_data: FAQCreate, db: Session = Depends(get_db)):
    """Create a new FAQ entry and immediately re-train the TF-IDF vectorizer."""
    new_faq = FAQ(
        question=faq_data.question.strip(),
        answer=faq_data.answer.strip(),
        category=faq_data.category.strip() or "General",
    )
    db.add(new_faq)
    db.commit()
    db.refresh(new_faq)

    # Refresh in-memory TF-IDF index with new data
    faq_matcher.fit_from_db(db)
    return new_faq


@app.put("/api/faqs/{faq_id}", response_model=FAQResponse, tags=["FAQs Admin"])
def update_faq(faq_id: int, faq_data: FAQUpdate, db: Session = Depends(get_db)):
    """Update an existing FAQ entry and refresh the TF-IDF index."""
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"FAQ with id {faq_id} not found",
        )

    if faq_data.question is not None:
        faq.question = faq_data.question.strip()
    if faq_data.answer is not None:
        faq.answer = faq_data.answer.strip()
    if faq_data.category is not None:
        faq.category = faq_data.category.strip() or "General"

    db.commit()
    db.refresh(faq)

    # Refresh in-memory TF-IDF index
    faq_matcher.fit_from_db(db)
    return faq


@app.delete("/api/faqs/{faq_id}", status_code=status.HTTP_200_OK, tags=["FAQs Admin"])
def delete_faq(faq_id: int, db: Session = Depends(get_db)):
    """Delete an FAQ and refresh the TF-IDF index."""
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"FAQ with id {faq_id} not found",
        )

    db.delete(faq)
    db.commit()

    # Refresh in-memory TF-IDF index
    faq_matcher.fit_from_db(db)
    return {"message": f"FAQ {faq_id} deleted successfully."}


@app.post("/api/faqs/seed", tags=["FAQs Admin"])
def reset_seed_faqs(db: Session = Depends(get_db)):
    """Resets the FAQ database to default sample FAQs and re-fits TF-IDF."""
    count = force_reseed_database()
    faq_matcher.fit_from_db(db)
    return {"message": f"Successfully reseeded database with {count} FAQs.", "count": count}


@app.get("/api/categories", response_model=List[str], tags=["FAQs Admin"])
def get_categories(db: Session = Depends(get_db)):
    """Get list of all distinct FAQ categories."""
    cats = db.query(FAQ.category).distinct().all()
    return sorted([c[0] for c in cats if c[0]])
