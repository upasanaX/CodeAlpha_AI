# CodeAlpha_AI — Artificial Intelligence Internship Projects

[![GitHub Repo](https://img.shields.io/badge/GitHub-CodeAlpha__AI-181717?style=for-the-badge&logo=github)](https://github.com/upasanaX/CodeAlpha_AI)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)](https://pytorch.org)
[![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-00599C?style=for-the-badge&logo=opencv&logoColor=white)](https://ultralytics.com)
[![OpenCV](https://img.shields.io/badge/OpenCV-4.10+-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)](https://opencv.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Flask](https://img.shields.io/badge/Flask-3.0+-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![WebSockets](https://img.shields.io/badge/WebSockets-Real--Time-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://websockets.readthedocs.io)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.5+-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![NLTK](https://img.shields.io/badge/NLTK-NLP-154F5B?style=for-the-badge&logo=python&logoColor=white)](https://www.nltk.org)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0+-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white)](https://www.sqlalchemy.org)
[![JWT](https://img.shields.io/badge/JWT-Secure_Auth-black?style=for-the-badge&logo=jsonwebtokens)](https://jwt.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 🌟 About the Repository & Internship

Welcome to the official **CodeAlpha Artificial Intelligence Internship** portfolio repository, engineered and maintained by **Upasana Roy**.

This repository is a curated collection of production-grade, full-stack AI web applications developed to solve real-world problems in **Natural Language Processing (NLP)**, **Neural Language Translation**, and **Real-Time Computer Vision & Object Tracking**. Rather than isolated machine learning scripts, each project in this portfolio is an end-to-end software system featuring robust asynchronous backends, mathematical and deep learning models, persistent relational databases, and modern, responsive frontend interfaces with rich telemetry.

---

### 🏛️ Engineering Philosophy & Core Pillars

Every application in this repository was engineered adhering to rigorous production standards:

1. **Applied AI & Machine Learning First**:
   - Leveraging proven deep learning architectures (**YOLOv8s** for spatial object detection, **Kalman Filters** for continuous motion state estimation, **NLTK & TF-IDF** for semantic information retrieval, and **Neural Machine Translation** engines).
   - Addressing real-world ML edge cases such as identity switching in multi-object tracking, classification flickering, spatial containment anomalies, and low-confidence NLP fallback routing.

2. **High-Throughput, Low-Latency Architecture**:
   - Full-duplex **WebSocket (`ws://`)** streaming pipelines delivering 30+ FPS video processing with sub-50ms inference feedback.
   - GPU-accelerated client-side **HTML5 Canvas** rendering and multi-spectrum shaders (**FLIR Thermal IR**, **Tactical Night Vision NVG**).
   - Asynchronous Python backends powered by **FastAPI** (ASGI) and **Flask** (WSGI).

3. **Enterprise-Grade Full-Stack Integration**:
   - Modern frontend stacks built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**.
   - Dual-theme design systems featuring seamless **Light & Dark Mode** switching with persistent user preferences.
   - **JWT (JSON Web Token)** user authentication with salted **bcrypt** password hashing and user-owned session audit registries.
   - Automated export pipelines generating structured **CSV** and **JSON** telemetry data for downstream analytics.

---

### 📂 Featured Internship Projects

| Task # | Project Name | Domain | Core AI & Tech Stack | Description | Folder Link | Status |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: |
| **01** | **LinguoFlow PRO ✨** | Natural Language Processing | `Flask` • `deep-translator` • `Web Speech API` • `TTS/STT` | Feature-rich multilingual translation suite supporting 24+ languages, live speech dictation, native audio synthesis, tone adaptation, and cloud history sync. | [`TASK 1(TRANSLATION APP AI)/`](TASK%201(TRANSLATION%20APP%20AI)/) | ✅ Complete & Verified |
| **02** | **Coursemate AI 🤖** | Conversational AI & NLP | `FastAPI` • `NLTK` • `Scikit-Learn` • `TF-IDF` • `React` | Intelligent FAQ chatbot with NLP text normalization, cosine similarity confidence scoring, an interactive SQLite knowledge base, and live admin retraining. | [`TASK 2 (FAQ CHATBOT AI)/`](TASK%202%20(FAQ%20CHATBOT%20AI)/) | ✅ Complete & Verified |
| **04** | **TrackOptic AI 🎯** | Computer Vision & Tracking | `FastAPI` • `YOLOv8s` • `SORT` • `Kalman Filter` • `WebSockets` | Real-time object detection and tracking suite with Kalman motion trails, virtual laser tripwire crossing counter, multi-spectrum vision filters, and telemetry audit. | [`TASK 4 (OBJECT DETECTION AND TRACKING)/`](TASK%204%20(OBJECT%20DETECTION%20AND%20TRACKING)/) | ✅ Complete & Verified |

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
│
└── TASK 4 (OBJECT DETECTION AND TRACKING)/ # 🎯 Task 4 Project Directory
    ├── README.md                          # Comprehensive Task 4 documentation
    ├── backend/
    │   ├── main.py                        # FastAPI server, REST & WebSocket /ws/video
    │   ├── detector.py                    # YOLOv8 object detector module
    │   ├── tracker.py                     # SORT multi-object tracking (Kalman + Hungarian)
    │   ├── video_processor.py             # Frame capture, annotation, FPS & WS streaming
    │   ├── db.py                          # SQLAlchemy SQLite engine & session setup
    │   ├── models.py                      # Session and Detection DB & Pydantic models
    │   ├── config.py                      # Thresholds, model settings, and logging config
    │   └── requirements.txt               # Backend computer vision dependencies
    └── frontend/
        ├── package.json                   # Vite, React, TypeScript, Tailwind CSS, Lucide
        ├── vite.config.ts                 # Dev server configuration with backend proxy
        ├── tailwind.config.js             # Formal reddish theme palette setup
        ├── index.html                     # HTML5 entry point
        └── src/
            ├── App.tsx                    # Main controller, HUD, WebSocket, and view router
            ├── components/                # LandingPage, Header, ControlPanel, VideoDisplay, VisionToolbar, SessionTable, DetectionModal, AuthModal
            ├── api/videoApi.ts            # REST client & WebSocket helper
            └── types.ts                   # TypeScript interfaces and telemetry models
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

## 🎯 Task 4: TrackOptic AI (Precision Vision & Multi-Object Tracking)

**TrackOptic AI** is a state-of-the-art computer vision platform built with **FastAPI**, **Ultralytics YOLOv8**, **SORT (Kalman Filter + Hungarian Algorithm)**, and **React + TypeScript + Tailwind CSS** with a formal, reddish design system featuring an **Executive Landing Page**, **Command Center View**, **Kalman Motion Trails**, **Virtual Laser Tripwire Flow Counter**, **Multi-Spectrum Optical Filters**, and seamless **Light & Dark Mode** switching.

### ✨ Key Features

- 🚀 **Executive Landing Page & Hero Showcase**: High-tech landing experience highlighting features, stats, architecture, and a 1-click transition to the live vision console.
- 🎨 **TrackOptic AI Vector Branding**: Custom SVG optical reticle target logo with adaptive light/dark appearance.
- 🌓 **Instant Light & Dark Mode**: Persistent theme toggle with deep slate and reddish glow dark mode palette.
- 〰️ **Kalman Motion Trajectory Trails**: Centroid motion polylines tracking up to 24 historical points behind objects, visually demonstrating velocity vectors and Kalman motion continuity.
- ⚡ **Virtual Laser Tripwire & Bidirectional Flow Counter**: Interactive laser line projected across the viewport with real-time crossing math (`⬆️ IN` / `⬇️ OUT` / `Total`), live HUD counters, and 1-click reset.
- 👁️ **Multi-Spectrum Optical Vision Filters**: Instant GPU-accelerated client canvas filters:
  - **Optical (RGB)**: Native color spectrum
  - **Thermal IR (FLIR)**: High-contrast heat signature simulation with amber/cyan spectrum mapping
  - **Night Vision (NVG)**: Military-grade tactical green phosphor night-vision shader
- 🎯 **Precision Classification & Tracking Engine**:
  - **YOLOv8s (Precision)** & **YOLOv8n (Fast)** model selection
  - **Strict Class-Consistent SORT**: Tracks only associate with detections of the exact same class ($IoU = 0.0$ for differing classes), completely preventing label switching
  - **10-Frame Confidence-Weighted Temporal Voting**: Eliminates transient classification flickering
  - **Spatial Containment Filter**: Eliminates phantom duplicate boxes enclosed inside larger detections
  - **Workplace/Indoor Category Filter**: Focuses detection on office/workspace objects while filtering irrelevant COCO outdoor classes
- 🔐 **JWT User Authentication & Session Ownership**: Secure password hashing with bcrypt, JWT bearer tokens, 1-click Demo Analyst mode, user profile badge, and "My Sessions" vs "All Sessions" audit view.
- 🎛️ **Dynamic Vision Control Toolbar**: Real-time confidence and IoU overlap sliders that adjust inference parameters on the fly via WebSocket without restarting the stream.
- 🎯 **Tactical Targeting Reticle**: Military-grade holographic crosshair overlay with corner brackets and millimeter tick marks.
- 📸 **1-Click High-Res Snapshot**: Instant PNG capture of the currently tracked frame with bounding boxes and track badges.
- 🔊 **Target Lock Audio Alerts**: Interactive web audio chimes when high-confidence targets are acquired.
- 📹 **Dual-Mode Video Input**: Real-time live webcam processing or short video file upload (MP4, AVI, MOV, WEBM).
- 📊 **Live Class Distribution & Latency HUD**: Dynamic pill tags showing detected object categories and inference time in milliseconds.
- 💾 **Telemetry Audit & Instant Exports**: Export session metrics and detection tracks directly to CSV and JSON with 1 click.
- ⚡ **WebSocket Streaming**: Full-duplex WebSocket connection streaming base64 JPEG frames alongside live FPS, latency, detection count, and track count.

### 🚀 Quick Start Guide (Task 4)

#### 1. Start the Backend:
```powershell
cd "TASK 4 (OBJECT DETECTION AND TRACKING)\backend"
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -c "from db import init_db; init_db()"
uvicorn main:app --reload --port 8000
```

#### 2. Start the Frontend:
```powershell
cd "TASK 4 (OBJECT DETECTION AND TRACKING)\frontend"
npm install
npm run dev
```

Open your browser at **[http://localhost:5173](http://localhost:5173)**.

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

### Task 4: TrackOptic AI (Real-Time Vision & Tracking)
- **Backend**: Python 3.11, FastAPI, WebSockets, OpenCV (`cv2`), SQLAlchemy, Pydantic v2, Uvicorn
- **Authentication**: JWT (`pyjwt`), salted password hashing (`bcrypt`)
- **Computer Vision & Tracking**: Ultralytics `YOLOv8n`, PyTorch, TorchVision, SciPy (`linear_sum_assignment`), NumPy
- **Frontend**: React 18, Vite 5, TypeScript 5, Tailwind CSS 3 (Reddish Theme), HTML5 Canvas, Lucide React
- **Database**: SQLite 3 (`users`, `sessions`, and `detections` tables)

---

## 👩‍💻 Author

**Upasana Roy**  
*AI Intern @ CodeAlpha*  
- GitHub: [@upasanaX](https://github.com/upasanaX)
- Project: [CodeAlpha_AI](https://github.com/upasanaX/CodeAlpha_AI)