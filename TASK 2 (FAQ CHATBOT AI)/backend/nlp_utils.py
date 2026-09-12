"""
Natural Language Processing (NLP) and Similarity Matching Engine for FAQ Chatbot.

Key components:
1. NLTK Preprocessing Pipeline:
   - Lowercasing
   - Punctuation & special character cleaning
   - Tokenization
   - Stopword removal
   - Lemmatization (WordNet)
2. Scikit-learn TF-IDF Vectorization:
   - Fits on preprocessed FAQ questions
   - Generates vocabulary & TF-IDF term weights
3. Cosine Similarity Matching:
   - Computes angular distance between user vector and FAQ vectors
   - Applies confidence threshold with friendly fallback replies
"""

import re
from typing import List, Dict, Any, Tuple, Optional
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# Ensure required NLTK resources are available locally
def download_nltk_resources():
    """Download required NLTK datasets quietly if not already installed."""
    resources = [
        "tokenizers/punkt",
        "tokenizers/punkt_tab",
        "corpora/stopwords",
        "corpora/wordnet",
    ]
    for resource_path in resources:
        try:
            nltk.data.find(resource_path)
        except Exception:
            pass


# Initialize resources on module load
download_nltk_resources()

# Initialize Lemmatizer and Stopword set
lemmatizer = WordNetLemmatizer()
try:
    stop_words = set(stopwords.words("english"))
except Exception:
    stop_words = {"a", "an", "the", "in", "on", "at", "to", "for", "of", "and", "or", "is", "are", "was", "were"}

# Default fallback reply for low confidence matches
DEFAULT_FALLBACK_MESSAGE = (
    "I'm not completely sure about that. Could you please rephrase your question or "
    "check the FAQ Knowledge Base? You can also reach our student support team at support@coursemate.ai."
)


def preprocess_text(text: str) -> str:
    """
    Applies the full NLP preprocessing pipeline to raw text.
    1. Lowercases the string.
    2. Strips URLs and non-alphanumeric punctuation.
    3. Tokenizes text into individual words.
    4. Removes common stopwords.
    5. Lemmatizes each token to its root dictionary form.
    6. Joins tokens back into a normalized string for TF-IDF.
    """
    if not text or not isinstance(text, str):
        return ""

    # Step 1: Lowercasing
    text_lower = text.lower()

    # Step 2: Remove URLs and non-alphanumeric characters (keep basic word boundaries)
    cleaned = re.sub(r"https?://\S+|www\.\S+", "", text_lower)
    cleaned = re.sub(r"[^\w\s]", " ", cleaned)

    # Step 3: Tokenization
    try:
        tokens = word_tokenize(cleaned)
    except Exception:
        # Fallback to whitespace regex tokenization if punkt table encounters environment edge cases
        tokens = cleaned.split()

    # Steps 4 & 5: Stopword removal and Lemmatization
    processed_tokens = []
    for token in tokens:
        token = token.strip()
        if token and token not in stop_words and len(token) > 1:
            try:
                lemma = lemmatizer.lemmatize(token)
            except Exception:
                lemma = token
            processed_tokens.append(lemma)

    # Step 6: Join tokens back
    result = " ".join(processed_tokens)
    # If all tokens were stopwords (e.g. "what is it"), preserve cleaned words to avoid empty string
    if not result.strip():
        return " ".join([t for t in tokens if t.strip()])
    return result


def build_tfidf_matrix(questions: List[str]) -> Tuple[Optional[TfidfVectorizer], Any]:
    """
    Fits a TfidfVectorizer on a list of preprocessed FAQ questions.

    Returns:
        (vectorizer, tfidf_matrix) tuple.
    """
    if not questions:
        return None, None

    # Preprocess all FAQ questions
    preprocessed_questions = [preprocess_text(q) for q in questions]

    # Initialize TF-IDF Vectorizer with unigram and bigram features for better context matching
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=1)
    tfidf_matrix = vectorizer.fit_transform(preprocessed_questions)

    return vectorizer, tfidf_matrix


def find_best_match(
    user_question: str,
    questions: List[str],
    answers: List[str],
    vectorizer: Optional[TfidfVectorizer],
    tfidf_matrix: Any,
    threshold: float = 0.25,
    categories: Optional[List[str]] = None,
    ids: Optional[List[int]] = None,
) -> Dict[str, Any]:
    """
    Matches user query to the most similar FAQ question using Cosine Similarity over TF-IDF.

    Args:
        user_question: Raw query string from user.
        questions: Original list of FAQ questions.
        answers: Corresponding FAQ answers.
        vectorizer: Fitted TfidfVectorizer.
        tfidf_matrix: Pre-computed TF-IDF matrix for all FAQ questions.
        threshold: Minimum similarity score (0.0 to 1.0) required for confident answer.
        categories: Optional list of category names.
        ids: Optional list of FAQ database IDs.

    Returns:
        Dictionary containing matched answer, matched question, confidence score, and category.
    """
    if not questions or vectorizer is None or tfidf_matrix is None:
        return {
            "answer": "Our FAQ database is currently empty. Please contact support or add FAQs in the admin panel.",
            "matched_question": None,
            "confidence": 0.0,
            "category": None,
            "faq_id": None,
            "is_fallback": True,
        }

    # Step 1: Preprocess user question using the exact same pipeline
    cleaned_user_q = preprocess_text(user_question)
    if not cleaned_user_q.strip():
        return {
            "answer": "Please ask a question with more details so I can find the best answer for you.",
            "matched_question": None,
            "confidence": 0.0,
            "category": None,
            "faq_id": None,
            "is_fallback": True,
        }

    # Step 2: Transform user query to TF-IDF vector using fitted vocabulary
    user_vec = vectorizer.transform([cleaned_user_q])

    # Step 3: Compute cosine similarity between user vector and all FAQ vectors
    similarities = cosine_similarity(user_vec, tfidf_matrix)[0]

    # Step 4: Identify best matching question and score
    best_idx = int(similarities.argmax())
    best_score = float(similarities[best_idx])
    # Round confidence to 4 decimal places
    best_score = round(best_score, 4)

    cat = categories[best_idx] if categories and best_idx < len(categories) else "General"
    faq_id = ids[best_idx] if ids and best_idx < len(ids) else None

    # Step 5: Compare against confidence threshold
    if best_score >= threshold:
        return {
            "answer": answers[best_idx],
            "matched_question": questions[best_idx],
            "confidence": best_score,
            "category": cat,
            "faq_id": faq_id,
            "is_fallback": False,
        }
    else:
        # Fallback response when score is below threshold
        return {
            "answer": (
                f"I'm not fully certain about that (confidence: {int(best_score * 100)}%). "
                f"The closest topic I found was: \"{questions[best_idx]}\".\n\n"
                f"{answers[best_idx]}\n\n"
                f"If this wasn't what you needed, please rephrase or reach out to support@coursemate.ai."
                if best_score > 0.12
                else DEFAULT_FALLBACK_MESSAGE
            ),
            "matched_question": questions[best_idx] if best_score > 0.12 else None,
            "confidence": best_score,
            "category": cat if best_score > 0.12 else None,
            "faq_id": faq_id if best_score > 0.12 else None,
            "is_fallback": True,
        }


class FAQMatcher:
    """
    Cached FAQ matcher instance that holds in-memory vectorizer and matrix
    and automatically re-fits when database FAQs are updated.
    """

    def __init__(self, threshold: float = 0.25):
        self.threshold = threshold
        self.questions: List[str] = []
        self.answers: List[str] = []
        self.categories: List[str] = []
        self.ids: List[int] = []
        self.vectorizer: Optional[TfidfVectorizer] = None
        self.tfidf_matrix: Any = None

    def fit_from_db(self, db_session) -> int:
        """Loads all FAQs from database and fits the TF-IDF model."""
        from db import FAQ

        faqs = db_session.query(FAQ).order_by(FAQ.id.asc()).all()
        self.ids = [f.id for f in faqs]
        self.questions = [f.question for f in faqs]
        self.answers = [f.answer for f in faqs]
        self.categories = [f.category for f in faqs]

        if self.questions:
            self.vectorizer, self.tfidf_matrix = build_tfidf_matrix(self.questions)
        else:
            self.vectorizer = None
            self.tfidf_matrix = None

        return len(self.questions)

    def match(self, user_question: str) -> Dict[str, Any]:
        """Matches a user question against the current fitted FAQ model."""
        return find_best_match(
            user_question=user_question,
            questions=self.questions,
            answers=self.answers,
            vectorizer=self.vectorizer,
            tfidf_matrix=self.tfidf_matrix,
            threshold=self.threshold,
            categories=self.categories,
            ids=self.ids,
        )


# Global singleton matcher
faq_matcher = FAQMatcher(threshold=0.25)
