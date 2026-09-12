# Coursemate AI — Production-Ready FAQ Chatbot Web Application

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![NLTK](https://img.shields.io/badge/NLP-NLTK-green?style=for-the-badge)](https://www.nltk.org)
[![Scikit-Learn](https://img.shields.io/badge/ML-Scikit--Learn-orange?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![SQLite](https://img.shields.io/badge/Database-SQLite_3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)

An intelligent, full-stack FAQ Chatbot web application designed for **Coursemate Academy** (an Online Learning Platform). The chatbot ingests student questions, applies an **NLP preprocessing pipeline** (lowercasing, cleaning, tokenization, stopword removal, lemmatization), and matches inquiries to curated answers using **TF-IDF Vectorization** and **Cosine Similarity** with confidence thresholding and fallback responses.

---

## 📌 Features

- 💬 **Interactive Chat Interface**:
  - Instant user-message rendering and animated assistant typing indicator (`Computing similarity...`).
  - Color-coded similarity confidence badges (e.g. *High Match 85%*, *Similarity 60%*, *Low Match Fallback*).
  - Matched FAQ question attribution displayed transparently above the answer.
  - Quick-prompt suggestions and 1-click clipboard copy for responses.
- 🧠 **NLP & TF-IDF Similarity Engine**:
  - Preprocessing pipeline using **NLTK**: converts to lower-case, strips punctuation, tokenizes, filters stopwords, and reduces inflections with **WordNet Lemmatizer**.
  - **Scikit-learn TF-IDF Vectorizer**: extracts unigrams and bigrams from all questions in the knowledge base.
  - **Cosine Similarity**: calculates the angular distance between the query vector and FAQ question vectors.
  - **Configurable Confidence Threshold** (default: `0.25`): gracefully triggers informative fallback replies when queries are out of scope.
- 🗄️ **Persistent Database & Sample Knowledge Base**:
  - Stored in **SQLite via SQLAlchemy ORM** (`faqs.db`).
  - Pre-seeded with **22 diverse Q&As** across 5 categories:
    1. *Account & Security* (password resets, 2FA, email changes, deletion)
    2. *Billing & Refunds* (refund criteria, accepted payment methods, invoices, student discounts)
    3. *Courses & Access* (lifetime access, mobile responsiveness, offline downloads, prerequisites)
    4. *Certificates* (downloading, LinkedIn integration, name changes, employer verification)
    5. *Technical Support* (video buffering, browser compatibility, instructor Q&A, quiz submission)
- ⚙️ **Knowledge Base Admin Panel**:
  - Search FAQs by keyword or filter by category pills.
  - Add new FAQs or edit/delete existing FAQs.
  - **Automatic Re-training**: Any added, modified, or deleted FAQ immediately triggers in-memory model re-fitting with zero application downtime.
  - "Reset Sample Seed" button to restore default database state at any time.

---

## 🏗️ Project Structure

```
TASK 2 (FAQ CHATBOT AI)/
├── backend/
│   ├── db.py                 # SQLAlchemy engine, session maker & FAQ model
│   ├── faq_seed.py           # Seed script with 22 curated Q&As
│   ├── nlp_utils.py          # NLTK preprocessing, TF-IDF vectorizer & cosine matcher
│   ├── main.py               # FastAPI server, REST routes & startup lifespan
│   ├── test_faq.py           # Automated test suite (NLP, similarity, and API tests)
│   ├── requirements.txt      # Python dependencies
│   └── faqs.db               # SQLite database (generated on startup)
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── chatApi.ts    # Fetch API client connecting to backend
│   │   ├── components/
│   │   │   ├── Navbar.tsx        # View switcher & live health status badge
│   │   │   ├── ChatWindow.tsx    # Message list, quick suggestions, typing indicator
│   │   │   ├── MessageBubble.tsx # Formatted user/bot bubbles with confidence badges
│   │   │   └── ChatInput.tsx     # Auto-expanding textarea & keyboard shortcuts
│   │   ├── pages/
│   │   │   ├── HomePage.tsx      # Chat interface page
│   │   │   └── AdminPage.tsx     # FAQ Knowledge Base management panel
│   │   ├── types/
│   │   │   └── faq.ts            # TypeScript interfaces
│   │   ├── App.tsx               # Root component with tabbed navigation
│   │   ├── main.tsx              # React DOM render root
│   │   └── index.css             # Tailwind directives & design system
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.10+** (Tested on Python 3.11.9)
- **Node.js 18+** and **npm**

---

### 1. Backend Setup (FastAPI + NLP)

Open a terminal and navigate to the `backend` directory:

```bash
cd "TASK 2 (FAQ CHATBOT AI)/backend"
```

#### Create & Activate Virtual Environment:
- **Windows (PowerShell):**
  ```powershell
  python -m venv venv
  .\venv\Scripts\Activate.ps1
  ```
- **macOS / Linux:**
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

#### Install Dependencies:
```bash
pip install -r requirements.txt
```

#### Seed Initial FAQs (Optional — also done automatically on startup):
```bash
python faq_seed.py
```

#### Run Backend Server:
```bash
uvicorn main:app --reload --port 8000
```

> **API Documentation**: Once running, visit `http://127.0.0.1:8000/docs` to test endpoints via Swagger UI.

---

### 2. Frontend Setup (React + Vite + Tailwind)

Open a second terminal and navigate to the `frontend` directory:

```bash
cd "TASK 2 (FAQ CHATBOT AI)/frontend"
```

#### Install Node Dependencies:
```bash
npm install
```

#### Start Development Server:
```bash
npm run dev
```

Open your browser at:
```
http://localhost:5173
```

---

## 🧪 Running Automated Tests

Run backend tests using `pytest` to verify text preprocessing, TF-IDF vectorization, similarity matching, fallback triggering, and FastAPI endpoints:

```bash
cd "TASK 2 (FAQ CHATBOT AI)/backend"
.\venv\Scripts\python -m pytest test_faq.py -v
```

---

## 🧠 How NLP & Similarity Matching Works

1. **Text Normalization**:
   User input is converted to lowercase and stripped of special characters or URLs.
2. **Tokenization**:
   The string is split into individual word tokens via `nltk.word_tokenize`.
3. **Stopword Removal**:
   Common English filler words (`"is"`, `"the"`, `"at"`, `"and"`) are removed using `nltk.corpus.stopwords`.
4. **Lemmatization**:
   Tokens are reduced to their root forms using `nltk.stem.WordNetLemmatizer` (e.g. `"certificates"` → `"certificate"`, `"resetting"` → `"reset"`).
5. **TF-IDF Vectorization**:
   A `TfidfVectorizer` fitted on the knowledge base transforms the normalized query into a numerical vector of term frequencies weighted by inverse document frequencies.
6. **Cosine Similarity**:
   `sklearn.metrics.pairwise.cosine_similarity` computes the cosine of the angle between the query vector and all FAQ question vectors.
7. **Thresholding & Confidence**:
   - If `confidence >= 0.25`: Returns the matched FAQ answer and question.
   - If `confidence < 0.25`: Returns an polite fallback message with related suggestions.

---

## 👥 Author Credit
Developed with pride by **Upasana Roy** as part of the **CodeAlpha Artificial Intelligence Internship**.
