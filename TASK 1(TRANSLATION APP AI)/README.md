# LinguoFlow PRO ✨ - Intelligent AI Language Translation

[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0+-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![CodeAlpha](https://img.shields.io/badge/CodeAlpha-Task_1-indigo?style=for-the-badge)](https://github.com/upasanaX/CodeAlpha_AI)
[![Author](https://img.shields.io/badge/Built_by-Upasana_Roy-rose?style=for-the-badge)](https://github.com/upasanaX)

A full-stack, AI-powered multilingual translation web application developed for **CodeAlpha Task 1**, featuring real-time speech dictation, native voice pronunciation with dynamic highlights, 5 aesthetic vibes, tone variation, and optional user cloud synchronization.

---

## ✨ Feature Highlights

1. 🌐 **Universal Multilingual Support**: Translates between 24+ global languages including English, Spanish, French, German, Hindi, Bengali, Chinese, Japanese, Korean, Arabic, and more.
2. 🔍 **Automatic Language Detection**: Auto-detects input language with confidence and visual badges.
3. 🔊 **Translation Voice Mention & Pulsing Highlight**:
   - Prominently mentions language-specific voice readiness (e.g., `🔊 🇪🇸 Spanish Voice Ready ✨`) right below the translation box.
   - Toolbar speaker button pulses with an eye-catching glowing halo.
   - Interactive `▶️ Play Voice` quick-button with synchronized playback states.
4. 🎙️ **Microphone Speech Dictation (STT)**: Direct voice-to-text recording with live pulse indicator.
5. 🎭 **Tone & Personality Transformer**: Easily translate into Standard, Casual & Fun, Business & Formal, or Poetic & Elegant tones.
6. ☀️ **Light & Dark Mode**: One-click toggle between pure high-contrast Light Mode and 4 immersive Dark Mode vibes (Cyber Neon, Sunset Horizon, Emerald Forest, Cosmic Candy).
7. 👤 **Optional User Auth & Cloud Sync**: Sign up or log in with JWT authentication to save and sync translations across sessions, while leaving guest access 100% free and functional.
8. 💾 **Export & Clipboard Tools**: One-click clipboard copy with confetti animations and `.txt` file export.

---

## 📁 Directory Structure

```
TASK 1(TRANSLATION APP AI)/
├── app.py                  # Python Flask server & translation backend
├── requirements.txt        # Python package dependencies
├── test_app.py             # Automated unit and API tests
├── .env.example            # Environment variables template
├── .gitignore              # Project-level git ignore rules
├── README.md               # Application documentation
├── templates/
│   └── index.html          # Semantic HTML5 layout
├── static/
│   ├── style.css           # Glassmorphic stylesheet (5 themes + Light Mode)
│   ├── script.js           # Client-side audio, auth, and translation logic
│   ├── linguoflow-icon.svg # Creative 'LF' continuous ribbon monogram
│   └── linguoflow-logo.svg # Full brand lockup logo
└── auth-backend/           # Optional Node.js + Express + PostgreSQL auth service
    ├── package.json
    ├── schema.sql
    └── src/
```

---

## 🚀 Running the Application

### 1. Set Up Virtual Environment
```bash
python -m venv venv
```

**Activate Environment:**
- **Windows (PowerShell):** `.\venv\Scripts\Activate.ps1`
- **Windows (CMD):** `venv\Scripts\activate.bat`
- **macOS / Linux:** `source venv/bin/activate`

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Start the Server
```bash
python app.py
```

Open your browser and navigate to:
👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

---

## 🧪 Testing

Execute automated unit tests:
```bash
python -m unittest test_app.py
```

---

## 👩‍💻 Author
**Upasana Roy**  
*CodeAlpha AI Internship*
