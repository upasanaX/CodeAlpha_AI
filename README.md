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

## 🛠️ Technologies Used

- **Backend**: Python 3, Flask, SQLite / PostgreSQL (optional)
- **AI & NLP**: `deep-translator`, Google Cloud Translation API v3 engine, `gTTS`
- **Frontend**: Vanilla HTML5, Vanilla CSS3 (Glassmorphism, CSS Variables), Modern ES6+ JavaScript
- **Web APIs**: Web Speech API (SpeechRecognition & SpeechSynthesis), Clipboard API
- **Auth Microservice (Optional)**: Node.js, Express, JSON Web Tokens (JWT), `bcryptjs`

---

## 👩‍💻 Author

**Upasana Roy**  
*AI Intern @ CodeAlpha*  
- GitHub: [@upasanaX](https://github.com/upasanaX)
- Project: [CodeAlpha_AI](https://github.com/upasanaX/CodeAlpha_AI)