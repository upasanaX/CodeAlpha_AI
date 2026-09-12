"""
Automated unit and integration tests for Coursemate AI FAQ Chatbot.
Covers:
1. NLP preprocessing pipeline (lowercasing, cleaning, tokenizing, stopword removal, lemmatization).
2. TF-IDF vectorization and cosine similarity calculations.
3. Confidence thresholding and fallback logic.
4. FastAPI endpoint integrations (/api/health, /api/chat, /api/faqs).
"""

import pytest
from fastapi.testclient import TestClient

from nlp_utils import preprocess_text, build_tfidf_matrix, find_best_match, FAQMatcher
from main import app
from db import init_db, SessionLocal, FAQ


client = TestClient(app)


def test_preprocess_text_basic():
    """Verify that preprocessing converts to lowercase and removes punctuation."""
    raw = "How do I RESET my password?!"
    processed = preprocess_text(raw)
    assert "reset" in processed
    assert "password" in processed
    assert "!" not in processed
    assert "?" not in processed
    # Stopwords like 'do', 'i', 'my' should be removed
    assert "how" not in processed.split()


def test_preprocess_text_lemmatization():
    """Verify that lemmatization reduces plurals and verb inflections."""
    raw = "courses certificates downloads"
    processed = preprocess_text(raw)
    assert "course" in processed
    assert "certificate" in processed
    assert "download" in processed


def test_similarity_matching_exact():
    """Verify that an exact or nearly exact question gets high confidence."""
    questions = [
        "How do I reset my password?",
        "Can I get a refund for my course?",
        "Can I access courses on mobile devices?",
    ]
    answers = [
        "Reset password via email link.",
        "Refunds available within 30 days.",
        "Yes, our site works on mobile.",
    ]

    vectorizer, matrix = build_tfidf_matrix(questions)

    match = find_best_match(
        user_question="How can I reset my password?",
        questions=questions,
        answers=answers,
        vectorizer=vectorizer,
        tfidf_matrix=matrix,
        threshold=0.25,
    )

    assert match["matched_question"] == "How do I reset my password?"
    assert match["answer"] == "Reset password via email link."
    assert match["confidence"] > 0.60
    assert not match["is_fallback"]


def test_similarity_matching_fallback():
    """Verify that irrelevant questions trigger fallback with low confidence."""
    questions = ["How do I reset my password?"]
    answers = ["Reset password via email link."]

    vectorizer, matrix = build_tfidf_matrix(questions)

    match = find_best_match(
        user_question="What is the weather in Antarctica tomorrow morning?",
        questions=questions,
        answers=answers,
        vectorizer=vectorizer,
        tfidf_matrix=matrix,
        threshold=0.25,
    )

    assert match["confidence"] < 0.25
    assert match["is_fallback"] is True
    assert "I'm not completely sure" in match["answer"] or "closest topic" in match["answer"]


def test_api_health_endpoint():
    """Verify that the /api/health endpoint returns 200 and valid structure."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "faqs_count" in data
    assert "threshold" in data


def test_api_chat_endpoint_matching():
    """Verify chat API matches a known question correctly."""
    response = client.post("/api/chat", json={"message": "I forgot my password, how to reset it?"})
    assert response.status_code == 200
    data = response.json()
    assert "password" in data["answer"].lower()
    assert data["confidence"] > 0.40
    assert not data["is_fallback"]


def test_api_faqs_crud_flow():
    """Verify adding, querying, and deleting an FAQ."""
    # 1. Create a custom test FAQ
    new_faq_payload = {
        "question": "Can I audit courses for free without paying?",
        "answer": "Yes, you can audit the lecture videos for free, but certificates require enrollment.",
        "category": "Courses & Access",
    }
    create_res = client.post("/api/faqs", json=new_faq_payload)
    assert create_res.status_code == 201
    created_faq = create_res.json()
    faq_id = created_faq["id"]

    # 2. Test chat matching on newly created FAQ
    chat_res = client.post("/api/chat", json={"message": "Can I audit classes for free?"})
    assert chat_res.status_code == 200
    chat_data = chat_res.json()
    assert "audit" in chat_data["answer"].lower()

    # 3. Clean up / delete test FAQ
    del_res = client.delete(f"/api/faqs/{faq_id}")
    assert del_res.status_code == 200
