# CodeAlpha_AI - Artificial Intelligence Internship Projects

[![GitHub Repo](https://img.shields.io/badge/GitHub-CodeAlpha__AI-181717?style=for-the-badge&logo=github)](https://github.com/upasanaX/CodeAlpha_AI)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0+-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

Welcome to the **CodeAlpha AI Internship** project repository developed by **Upasana Roy**. This repository contains AI solutions developed during the internship, starting with **Task 1: AI Language Translation Web Application**.

---

## 📌 Projects Overview

| Task # | Project Name | Description | Folder | Status |
|---|---|---|---|---|
| **Task 1** | **LinguoFlow PRO ✨** | Intelligent Multilingual AI Translation Web App with Voice Dictation, Speech Synthesis, Theme Switching, and Cloud Sync | [`TASK 1(TRANSLATION APP AI)/`](TASK%201(TRANSLATION%20APP%20AI)/) | ✅ Complete & Verified |
| **Task 2** | **Coursemate AI FAQ Assistant 🤖** | Production-Ready FAQ Chatbot Web App with NLTK Preprocessing, TF-IDF Vectorization, Cosine Similarity & Admin Knowledge Base | [`TASK 2 (FAQ CHATBOT AI)/`](TASK%202%20(FAQ%20CHATBOT%20AI)/) | ✅ Complete & Verified |

---

## 🌟 Task 1: LinguoFlow PRO (AI Translation App)

**LinguoFlow PRO** is a feature-packed multilingual translation suite built with **Python (Flask)**, **deep-translator / Google Cloud Translation**, and a high-performance **Vanilla HTML5/CSS3/JavaScript** frontend.

### ✨ Key Features

- 🌐 **Comprehensive Multilingual Translation**: Seamless translation across 24+ languages (English, Spanish, French, German, Hindi, Bengali, Japanese, Chinese, Arabic, Russian, and more).
- 🔍 **Automatic Language Detection**: Accurately detects input language and provides instant visual feedback tags.
- 🔊 **Highlighted Translation Voice (TTS)**:
  - **Dynamic Voice Mention Bar**: Highlights and mentions native pronunciation readiness (`🔊 Spanish Voice Ready ✨`) right below the output.
  - **Pulsing Halo Effect**: Toolbar listen button pulses with a glowing aura upon translation completion.
  - **Quick-Play Pill**: 1-click audio playback with synchronized animation states (`⏸️ Playing Voice...`).
- 🎙️ **Voice Dictation (Speech-to-Text)**: Speak directly into the microphone with live speech transcription.
- 🎭 **Tone & Personality Transformer**: One-click tone variations:
  - ⚡ *Standard*
  - 🤩 *Casual & Fun*
  - 💼 *Business & Formal*
  - 🌸 *Poetic & Elegant*
- 🎨 **5 Rich Aesthetic Vibes & Light/Dark Mode**:
  - ☀️ *Pure Light Mode* (High contrast, crisp cards, optimized icons)
  - 🌌 *Cyber Neon* (Deep indigo & cyan glow)
  - 🌅 *Sunset Horizon* (Warm rose & amber)
  - 🌿 *Emerald Forest* (Jade & turquoise)
  - 🔮 *Cosmic Candy* (Vibrant violet & magenta)
- 👤 **Optional User Accounts & Cloud Sync**:
  - Register & Sign In (JWT auth, bcrypt password hashing).
  - Sync translations to personal cloud history across sessions.
  - Full offline / guest mode remains completely functional without requiring login.
- ⭐ **Favorites & History Management**: Star favorite translations, view persistent local history, copy to clipboard, or export translations as `.txt` files.
- 🎨 **Creative Continuous Ribbon "L&F" Monogram Logo**: Custom SVG vector branding featuring an interlocking ribbon monogram.
- 🏷️ **Creator Credit**: Built with pride by **Upasana Roy**.

---

## 📁 Repository Structure

```
CodeAlpha_AI/
├── README.md                              # Root repository documentation
├── .gitignore                             # Root ignore rules for virtual environments & secrets
│
└── TASK 1(TRANSLATION APP AI)/            # 🚀 Task 1 Project Directory
    ├── app.py                             # Flask backend with translation engine & SQLite sync
    ├── requirements.txt                   # Python dependencies (Flask, deep-translator, gTTS, etc.)
    ├── test_app.py                        # Automated test suite
    ├── .env.example                       # Environment configuration template
    ├── .gitignore                         # Project-level gitignore
    ├── README.md                          # Comprehensive Task 1 documentation
    │
    ├── templates/
    │   └── index.html                     # Semantic HTML5 frontend with modern responsive UI
    │
    ├── static/
    │   ├── style.css                      # Modern CSS design system (5 themes + Light Mode)
    │   ├── script.js                      # Application controller (Audio, Translation, Auth, State)
    │   ├── linguoflow-icon.svg            # Creative LF ribbon monogram app icon
    │   └── linguoflow-logo.svg            # Full horizontal brand lockup vector
    │
    └── auth-backend/                      # Optional Node.js/Express enterprise microservice
        ├── package.json                   # Node dependencies (Express, JWT, bcrypt, pg)
        ├── schema.sql                     # PostgreSQL schema for multi-tenant accounts
        └── src/
            ├── server.js                  # Express API server entry point
            ├── db.js                      # Database connection pool
            ├── middleware/auth.js         # JWT verification middleware
            └── routes/                    # Auth and saved translation routes
│
└── TASK 2 (FAQ CHATBOT AI)/               # 🤖 Task 2 Project Directory
    ├── README.md                          # Comprehensive Task 2 documentation
    ├── backend/
    │   ├── main.py                        # FastAPI application with chat & admin endpoints
    │   ├── nlp_utils.py                   # NLTK preprocessing pipeline & TF-IDF similarity matcher
    │   ├── db.py                          # SQLAlchemy engine & FAQ models
    │   ├── faq_seed.py                    # Seeder preloading 22 curated FAQs across 5 categories
    │   ├── test_faq.py                    # Pytest test suite (NLP, similarity, API routes)
    │   └── requirements.txt               # Backend dependencies
    └── frontend/
        ├── package.json                   # React, Vite, TypeScript, Tailwind, Lucide dependencies
        ├── vite.config.ts                 # Vite server configuration with API proxying
        ├── tailwind.config.js             # Tailwind CSS theme setup
        ├── index.html                     # HTML5 entry point
        └── src/
            ├── App.tsx                    # Top-level application with tabbed navigation
            ├── components/                # ChatWindow, MessageBubble, ChatInput, Navbar
            ├── pages/                     # HomePage (Chat UI) & AdminPage (Knowledge Base)
            ├── api/chatApi.ts             # REST client for /api/chat and /api/faqs
            └── types/faq.ts               # TypeScript data models
```

---

## 🚀 Quick Start Guide (Task 1)

### 1. Clone the Repository
```bash
git clone https://github.com/upasanaX/CodeAlpha_AI.git
cd CodeAlpha_AI
```

### 2. Navigate to Task 1
```bash
cd "TASK 1(TRANSLATION APP AI)"
```

### 3. Set Up Python Virtual Environment

**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Launch the Application
```bash
python app.py
```

Open your browser at **[http://127.0.0.1:5000](http://127.0.0.1:5000)**.

---

## 🧪 Running Automated Tests

To run the automated test suite for Task 1:
```bash
cd "TASK 1(TRANSLATION APP AI)"
python -m unittest test_app.py
```

---

## 🌟 Task 2: Coursemate AI (FAQ Chatbot)

**Coursemate AI FAQ Assistant** is a production-ready chatbot web application built with **FastAPI**, **NLTK**, **Scikit-learn (TF-IDF + Cosine Similarity)**, **SQLite**, and **React (Vite + TypeScript + Tailwind CSS)**.

### ✨ Key Features

- 💬 **Intelligent Chat UI**: Live user and bot conversation bubbles with animated typing indicators and quick suggestion buttons.
- 🧠 **Full NLP Pipeline**: Text lowercasing, punctuation stripping, tokenization, stopword removal, and WordNet lemmatization.
- 📊 **TF-IDF & Cosine Similarity**: Unigram & bigram vectorization with confidence score calculation and badge display.
- 🛡️ **Confidence Thresholding & Fallback**: Automatically responds with contextual suggestions if similarity is below threshold.
- 🗄️ **Persistent Knowledge Base**: Preloaded with 22 diverse Q&As across 5 categories in SQLite.
- ⚙️ **Live Admin Management**: Search, add, update, delete FAQs or reset seed data with instantaneous zero-downtime model re-training.

### 🚀 Quick Start Guide (Task 2)

#### 1. Start the Backend:
```powershell
cd "TASK 2 (FAQ CHATBOT AI)\backend"
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python faq_seed.py
uvicorn main:app --reload --port 8000
```

#### 2. Start the Frontend:
```powershell
cd "TASK 2 (FAQ CHATBOT AI)\frontend"
npm install
npm run dev
```

Open your browser at **[http://localhost:5173](http://localhost:5173)**.

#### 3. Run Backend Automated Tests:
```powershell
cd "TASK 2 (FAQ CHATBOT AI)\backend"
.\venv\Scripts\python -m pytest test_faq.py -v
```

---

## 🛠️ Technologies Used

### Task 1: LinguoFlow PRO (AI Translation)
- **Backend**: Python 3, Flask, SQLite / PostgreSQL (optional)
- **AI & NLP**: `deep-translator`, Google Cloud Translation API v3 engine, `gTTS`
- **Frontend**: Vanilla HTML5, Vanilla CSS3 (Glassmorphism, CSS Variables), Modern ES6+ JavaScript
- **Web APIs**: Web Speech API (SpeechRecognition & SpeechSynthesis), Clipboard API
- **Auth Microservice (Optional)**: Node.js, Express, JSON Web Tokens (JWT), `bcryptjs`

### Task 2: Coursemate AI (FAQ Chatbot)
- **Backend**: Python 3.11, FastAPI, Pydantic v2, SQLAlchemy, Uvicorn
- **AI & NLP**: `nltk` (tokenization, stopword removal, WordNet lemmatizer), `scikit-learn` (TfidfVectorizer, cosine_similarity), `numpy`
- **Database**: SQLite 3 (persistent knowledge base with automatic seeding)
- **Frontend**: React 18, Vite 5, TypeScript 5, Tailwind CSS 3, Lucide React icons
- **Testing**: `pytest`, `httpx`, `TestClient`

---

## 👩‍💻 Author

**Upasana Roy**  
*AI Intern @ CodeAlpha*  
- GitHub: [@upasanaX](https://github.com/upasanaX)
- Project: [CodeAlpha_AI](https://github.com/upasanaX/CodeAlpha_AI)