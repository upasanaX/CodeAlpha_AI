# TrackOptic AI – Real-Time Multi-Object Detection & Tracking

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)](https://pytorch.org)
[![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-00599C?style=for-the-badge&logo=opencv&logoColor=white)](https://ultralytics.com)
[![OpenCV](https://img.shields.io/badge/OpenCV-4.10+-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)](https://opencv.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![WebSockets](https://img.shields.io/badge/WebSockets-Real--Time-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://websockets.readthedocs.io)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)
[![JWT](https://img.shields.io/badge/JWT-Secure_Auth-black?style=for-the-badge&logo=jsonwebtokens)](https://jwt.io)

A high-performance, full-stack computer vision application engineered by **Upasana Roy** for **Task 4: Object Detection & Tracking** during the **CodeAlpha AI Internship**. Built with **FastAPI**, **YOLOv8s/YOLOv8n**, **SORT (Kalman Filter + Hungarian Algorithm)**, and **React + TypeScript + Tailwind CSS**, featuring an executive landing page, live command center, multi-spectrum vision shaders, Kalman motion trails, and an automated virtual laser tripwire flow counter.

---

## 🌟 About TrackOptic AI

**TrackOptic AI** bridges deep learning computer vision research with production-grade web infrastructure. Designed to emulate advanced industrial and tactical surveillance command centers, it processes live webcam feeds or uploaded video files at high frame rates, identifies multiple object classes simultaneously, tracks continuous spatial motion over time, and enforces rigorous boundary crossing logic.

### 🎯 Key Real-World Use Cases
- **Smart City & Traffic Flow Monitoring**: Automated vehicle and pedestrian counting with directional ingress/egress analysis (`⬆️ IN` vs `⬇️ OUT`).
- **Industrial Workplace Safety & Occupancy**: Enforcing perimeter security and monitoring workplace occupancy using indoor object presets and containment filters.
- **Low-Light & Tactical Operations**: Real-time simulation of multi-spectrum vision sensors including **FLIR Thermal IR** heatmaps and military **Night Vision (NVG)**.
- **Security & Asset Protection**: Instantaneous target acquisition chimes, continuous velocity trail ribbons, and 1-click forensic HD snapshots.

---

## 📌 Technical Highlights & Perception Pipeline

1. **Pre-Trained Deep Learning Detection**:
   - Seamlessly toggle between **YOLOv8s** (high-precision 11.2M parameter model) and **YOLOv8n** (ultra-fast 3.2M parameter model).
   - Real-time bounding box regression, 80 COCO category classification, and confidence scoring.
   - Built-in **Workplace / Office Preset** filtering out absurd outdoor misclassifications.
   - **Spatial Containment Suppression** removing low-confidence hallucinations nested within larger objects.

2. **Persistent Multi-Object Tracking (SORT)**:
   - **Constant-Velocity Kalman Filtering**: 7-state state-space vector modeling position, bounding box scale, aspect ratio, and velocity differentials.
   - **Strict Class-Consistent Hungarian Matching**: Forces $IoU = 0.0$ across differing object classes, eliminating identity switches between adjacent targets.
   - **10-Frame Confidence-Weighted Temporal Voting**: Sliding classification history eliminates single-frame flickering.

3. **Continuous Motion Trajectory Trails**:
   - Visualizes the last 24 historical centroid coordinates as glowing tapered velocity ribbons directly behind active tracks.

4. **Virtual Laser Tripwire & Bidirectional Flow Counter**:
   - Interactive horizontal laser threshold detecting crossing vectors in real time, calculating `IN`, `OUT`, and `TOTAL` events with live HUD overlay and 1-click reset.

5. **Multi-Spectrum Optical Filters**:
   - Zero-latency client-side shaders: **Optical (RGB)**, **FLIR Thermal IR**, and **Tactical Night Vision (NVG)**.

6. **Full-Duplex WebSocket Telemetry & Control**:
   - Bidirectional communication streaming base64 JPEG video frames alongside live FPS, latency (ms), detection counts, track counts, and class distributions.
   - Real-time sensitivity threshold adjustments over WebSocket without stream interruptions.

7. **JWT Authentication & Audit Export**:
   - User account ownership, 1-click Demo Analyst access, and exportable session audit logs in **CSV** and **JSON** formats.

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

