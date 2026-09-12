# Task 4: Real-Time Object Detection & Tracking Web Application

A production-quality full-stack AI web application for real-time multi-object detection and tracking using live webcam feeds or uploaded video files. Built with **FastAPI**, **YOLOv8**, **SORT (Kalman Filter + Hungarian Algorithm)**, and **React + TypeScript + Tailwind CSS** with a formal, reddish design system.

---

## 📌 Project Overview

This project was developed as part of **Task 4: Object Detection & Tracking** for the **CodeAlpha AI Internship**. It provides a real-time computer vision pipeline that:
1. Detects objects across 80 COCO classes using a pre-trained **YOLOv8** model.
2. Tracks objects continuously across frames using the **SORT** algorithm, associating detections with Kalman-filtered bounding box trajectories and assigning unique, persistent tracking IDs.
3. Renders bounding boxes, class labels, confidence scores, and consistent color-coded track IDs on each frame.
4. Streams annotated video in real-time over **WebSocket** alongside telemetry (FPS, detected objects, active tracks).
5. Logs session history and detection snapshots into an **SQLite** database via **SQLAlchemy**.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS with a clean, formal reddish theme (`#DC2626` / `red-600` primary, `red-700` hover, neutral grays, white card surfaces)
- **Icons**: Lucide React
- **Rendering**: HTML5 Canvas rendering streamed base64 JPEG frames with low latency and hardware acceleration
- **Components**:
  - `Header.tsx`: Application title, Task 4 badge, live model & device status indicators
  - `ControlPanel.tsx`: Start/Stop Webcam, Camera switcher, Upload Video picker, Status & FPS telemetry bar
  - `VideoDisplay.tsx`: High-definition video viewport with real-time HUD telemetry overlay
  - `SessionTable.tsx`: Audit history of webcam sessions and uploaded video analyses
  - `DetectionModal.tsx`: Detailed detection record explorer for past sessions

### Backend
- **Framework**: Python FastAPI (ASGI)
- **Computer Vision**: OpenCV (`cv2`) for frame capture, scaling, and annotation
- **Object Detection**: Pre-trained **YOLOv8n** (Ultralytics) on PyTorch
- **Object Tracking**: **SORT** (Simple Online and Realtime Tracking) implemented using:
  - Constant-velocity 7-state Kalman Filters (`[x, y, s, r, vx, vy, vs]`)
  - Hungarian algorithm IoU association (`scipy.optimize.linear_sum_assignment`)
  - Track lifecycle management (birth, age, hit streaks, track pruning after `MAX_AGE`)
- **Database**: SQLite with SQLAlchemy (`sessions` and `detections` tables)
- **Communication**: Full-duplex WebSocket (`/ws/video`) streaming annotated frames and live JSON telemetry

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

# Initialize database tables (sessions & detections)
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
2. **Live Webcam Tracking**:
   - Click **"Start Webcam"**.
   - The backend opens camera index 0 (or your selected camera) and streams real-time annotated frames with stable track IDs.
   - Click **"Stop"** to terminate the stream and automatically record session statistics.
   - Click **"Cam: 0"** to switch between camera inputs if multiple cameras are connected.
3. **Video File Upload & Tracking**:
   - Click **"Upload Video"** and select any short MP4, AVI, MOV, or WEBM video (max 50 MB).
   - Once uploaded, click **"Process Video"**.
   - The application streams the video frame-by-frame with real-time detection and tracking annotations.
4. **Inspecting Telemetry & History**:
   - Scroll down to the **"Recent Processing Sessions"** table.
   - Click **"View Telemetry"** on any session to inspect individual logged detection records (timestamps, classes, confidence scores, bounding boxes).

---

## 🔍 Understanding the Visual Overlays

| Element | Description |
| :--- | :--- |
| **Bounding Box** | Color-coded box surrounding the detected object. Each track is assigned a unique, consistent color derived deterministically from its `track_id`. |
| **Label Badge** | Displays `ID: <track_id> <class_name> <confidence>` (e.g., `ID: 1 person 0.88`). |
| **Top-Left Frame HUD** | Embedded frame banner displaying real-time FPS, total detected objects, and active SORT tracks. |
| **Top-Right Viewport HUD** | High-contrast telemetry pill displaying real-time FPS and tracking statistics. |

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
```

---

## 🛡️ Key Edge Cases & Error Handling

1. **No Webcam Device Available**: If no physical camera is connected or permission is denied, the backend safely intercepts the failure and emits a clear JSON error over the WebSocket; the frontend displays a helpful banner suggesting video upload mode.
2. **High-Resolution Video Optimization**: Videos with resolution > 960px are automatically scaled to ensure steady 20–30 FPS inference on CPU.
3. **Database Throttling**: Writing hundreds of detections per second can freeze event loops. Logging is sampled every 10 frames by default, ensuring smooth streaming without database locks.

---

## 📈 Future Extensions
- Deep SORT integration with Re-ID feature embeddings for occlusion recovery.
- Multi-camera simultaneous monitoring dashboard.
- Export of tracking trajectories in CSV / GeoJSON format.
