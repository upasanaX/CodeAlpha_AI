# TrackOptic AI – Real-Time Multi-Object Detection & Tracking

A production-quality full-stack AI web application for real-time multi-object detection and tracking using live webcam feeds or uploaded video files. Built with **FastAPI**, **YOLOv8**, **SORT (Kalman Filter + Hungarian Algorithm)**, and **React + TypeScript + Tailwind CSS** with a high-tech tactical reddish command center design system featuring seamless **Light & Dark Mode** support, **JWT User Authentication**, **Live Sensitivity Sliders**, **Reticle HUD**, and **Telemetry Exports**.

---

## 📌 Project Overview

**TrackOptic AI** was developed as part of **Task 4: Object Detection & Tracking** for the **CodeAlpha AI Internship**. It provides an advanced real-time computer vision pipeline that:
1. Detects objects across 80 COCO classes using pre-trained **YOLOv8s** (Precision) and **YOLOv8n** (Speed) models with workplace/indoor filtering presets.
2. Tracks objects continuously across frames using **SORT** enhanced with **strict class-consistent IoU association** and **10-frame confidence-weighted temporal voting** to prevent identity switches and classification flickering.
3. **Kalman Motion Trajectory Trails**: Dynamic centroid ribbons rendered behind tracked targets to visualize velocity, vector direction, and Kalman motion continuity.
4. **Virtual Laser Tripwire & Flow Counter**: Interactive tripwire line across viewport with automatic crossing detection, bidirectional flow tracking (`⬆️ IN` / `⬇️ OUT` / `Total`), live HUD counters, and instant reset.
5. **Multi-Spectrum Optical Vision Filters**: Instant client-side shaders for **Optical (RGB)**, **FLIR Thermal Heatmap (IR)**, and **Tactical Night Vision (NVG)**.
6. Renders bounding boxes, class labels, confidence scores, and consistent color-coded track IDs on each frame.
7. Streams annotated video in real-time over **WebSocket** alongside telemetry (FPS, latency in ms, detected objects, active tracks, class distribution, tripwire counts).
8. **Interactive Vision Command Center**: Live interactive confidence and IoU sensitivity sliders, tactical targeting reticle overlay, audio target chime toggle, 1-click snapshot capture (PNG), and fullscreen viewport.
9. **JWT User Authentication & Session Ownership**: Secure password hashing with bcrypt, access tokens, 1-click Demo Analyst mode, user profile pill, and author-tagged session history.
10. **Telemetry Exports**: 1-click session audit export to **CSV** and **JSON**, plus detailed detection record explorer.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS with a clean, formal reddish theme (`#DC2626` / `red-600` primary, `red-700` hover, neutral grays, dark slate command center, glassmorphism cards)
- **Theme**: Complete Light and Dark mode with persistence in `localStorage`
- **Icons**: Lucide React
- **Rendering**: HTML5 Canvas rendering streamed base64 JPEG frames with low latency and hardware acceleration
- **Components**:
  - `Header.tsx`: Application title, TrackOptic logo, Task 4 badge, live model & device status indicators, theme toggle, and user authentication dropdown
  - `VisionToolbar.tsx`: Live confidence & IoU threshold sliders, tactical reticle switch, audio alert toggle, 1-click snapshot capture, and fullscreen trigger
  - `ControlPanel.tsx`: Start/Stop Webcam, Camera switcher, Upload Video picker, Status & FPS telemetry bar
  - `VideoDisplay.tsx`: High-definition video viewport with real-time HUD telemetry overlay, tactical targeting reticle, and snapshot renderer
  - `AuthModal.tsx`: Sign In / Register dialog with direct 1-click Demo Analyst login
  - `SessionTable.tsx`: Audit history of webcam sessions and uploaded video analyses with author tagging, CSV/JSON export, and deletion
  - `DetectionModal.tsx`: Detailed detection record explorer for past sessions

### Backend
- **Framework**: Python FastAPI (ASGI)
- **Authentication**: JWT tokens (`pyjwt`) with secure salted password hashing via `bcrypt`
- **Computer Vision**: OpenCV (`cv2`) for frame capture, scaling, and annotation
- **Object Detection**: Pre-trained **YOLOv8n** (Ultralytics) on PyTorch
- **Object Tracking**: **SORT** (Simple Online and Realtime Tracking) implemented using:
  - Constant-velocity 7-state Kalman Filters (`[x, y, s, r, vx, vy, vs]`)
  - Hungarian algorithm IoU association (`scipy.optimize.linear_sum_assignment`)
  - Track lifecycle management (birth, age, hit streaks, track pruning after `MAX_AGE`)
- **Database**: SQLite with SQLAlchemy (`users`, `sessions`, and `detections` tables)
- **Communication**: Full-duplex WebSocket (`/ws/video`) streaming annotated frames, dynamic threshold adjustment commands, and live JSON telemetry

---

## 🚀 Setup & Run Instructions

### Prerequisites
- **Python 3.10+** (Tested on Python 3.11)
- **Node.js 18+** and **npm**

---

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd "TASK 4 (OBJECT DETECTION AND TRACKING)/backend"

# Create a Python virtual environment
python -m venv venv

# Activate the virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database tables (users, sessions & detections)
python -c "from db import init_db; init_db()"

# Start the FastAPI server
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Backend will be accessible at: `http://127.0.0.1:8000`  
API Swagger Documentation: `http://127.0.0.1:8000/docs`

---

### 2. Frontend Setup

```bash
# In a separate terminal, navigate to the frontend directory
cd "TASK 4 (OBJECT DETECTION AND TRACKING)/frontend"

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Frontend will be accessible at: `http://127.0.0.1:5173`

---

## 🎯 Usage Instructions

1. **Open the Web Application**:
   - Open your browser and navigate to `http://localhost:5173`.
2. **Sign In / Analyst Profile**:
   - Click **"Sign In"** in the top-right navigation bar.
   - Click **"⚡ 1-Click Demo Analyst Sign In"** for immediate authentication as `demo_analyst` (`Lead Analyst`), or register a personal account.
3. **Live Webcam Tracking**:
   - Click **"Start Webcam"**.
   - The backend opens camera index 0 and streams real-time annotated frames with stable track IDs.
   - Click **"Cam: 0"** to switch between camera inputs if multiple cameras are connected.
   - Adjust the **Confidence Threshold** or **IoU Overlap** slider in real-time without restarting the stream.
   - Toggle **"Tactical Reticle"** to overlay military-grade crosshairs and distance marks.
   - Click **"Snapshot"** to immediately save a high-res PNG of the currently tracked frame.
4. **Video File Upload & Tracking**:
   - Click **"Upload Video"** and select any MP4, AVI, MOV, or WEBM video (max 50 MB).
   - Once uploaded, click **"Process Video"**.
   - The application streams the video frame-by-frame with real-time detection and tracking annotations.
5. **Inspecting Telemetry & History**:
   - Scroll down to the **"Telemetry Audit Log & History"** table.
   - Filter by **"My Sessions"** vs **"All Sessions"**.
   - Click **"Export CSV"** or **"Export JSON"** to download raw telemetry data.
   - Click **"Telemetry"** on any session to inspect individual logged detection records.

---

## 🔍 Understanding the Visual Overlays

| Element | Description |
| :--- | :--- |
| **Bounding Box** | Color-coded box surrounding the detected object. Each track is assigned a unique, consistent color derived deterministically from its `track_id`. |
| **Label Badge** | Displays `ID: <track_id> <class_name> <confidence>` (e.g., `ID: 1 person 0.88`). |
| **Tactical Grid Reticle** | High-precision holographic targeting reticle with corner brackets and millimeter crosshairs. |
| **Top-Left Frame HUD** | Embedded frame banner displaying real-time FPS, total detected objects, and active SORT tracks. |
| **Top-Right Viewport HUD** | High-contrast telemetry pill displaying real-time FPS, latency in ms, and tracking statistics. |

---

## ⚙️ Configuration & Customization

All core parameters can be adjusted via `backend/config.py` or environment variables:

```python
# Model choice (e.g., 'yolov8n.pt', 'yolov8s.pt', 'yolov8m.pt')
MODEL_NAME = "yolov8n.pt"

# Minimum detection confidence threshold
CONF_THRESHOLD = 0.40

# SORT tracking parameters
IOU_THRESHOLD = 0.30       # Minimum IoU overlap to associate detection with track
MAX_AGE = 30               # Maximum consecutive frames to keep a lost track before termination
MIN_HITS = 3              # Minimum detection matches before track is confirmed as valid

# Performance & Logging
TARGET_STREAM_FPS = 25     # Target frame rate for video file playback
DETAILED_LOGGING = False   # Set to True to log every frame's detections to DB
DB_LOG_INTERVAL = 10       # Default: log every 10th frame to prevent DB I/O bottlenecks

# JWT Auth Secret Key
SECRET_KEY = "trackoptic-super-secret-key-change-in-production"
```

---

## 🛡️ Key Edge Cases & Error Handling

1. **No Webcam Device Available**: If no physical camera is connected or permission is denied, the backend safely intercepts the failure and emits a clear JSON error over the WebSocket; the frontend displays a helpful banner suggesting video upload mode.
2. **High-Resolution Video Optimization**: Videos with resolution > 960px are automatically scaled to ensure steady 20–30 FPS inference on CPU.
3. **Database Throttling**: Writing hundreds of detections per second can freeze event loops. Logging is sampled every 10 frames by default, ensuring smooth streaming without database locks.
4. **Bcrypt Compatibility**: Built using native `bcrypt` cryptography to prevent passlib 72-byte truncation bugs.

