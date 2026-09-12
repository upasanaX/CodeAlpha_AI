"""
Main FastAPI server for Real-Time Object Detection & Tracking.
Provides REST endpoints and WebSocket video streaming.
"""
import os
import uuid
import shutil
from typing import Optional, List, Dict
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

import config
from db import init_db, get_db
from models import (
    SessionModel,
    DetectionModel,
    SessionResponse,
    DetectionResponse,
    StartProcessingRequest,
    StartProcessingResponse,
    StopProcessingRequest,
    UploadVideoResponse
)
from detector import ObjectDetector
from video_processor import VideoProcessor

# Initialize FastAPI application
app = FastAPI(
    title="Real-Time Object Detection & Tracking API",
    description="Task 4 AI Internship - YOLOv8 + SORT Tracking with WebSocket streaming",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Shared detector instance (loaded on startup)
detector: Optional[ObjectDetector] = None

# Active video processors dictionary: session_id -> VideoProcessor
active_processors: Dict[int, VideoProcessor] = {}

# Active video files mapping: video_id -> file path
uploaded_videos: Dict[str, str] = {}


@app.on_event("startup")
def on_startup():
    """Initialize database tables and load YOLOv8 model."""
    print("[Main] Initializing database...")
    init_db()
    global detector
    print("[Main] Pre-loading YOLOv8 object detection model...")
    detector = ObjectDetector(model_name=config.MODEL_NAME, conf_threshold=config.CONF_THRESHOLD)
    print("[Main] Application startup complete.")


@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "model": config.MODEL_NAME,
        "device": config.DEVICE,
        "conf_threshold": config.CONF_THRESHOLD,
        "iou_threshold": config.IOU_THRESHOLD
    }


@app.post("/api/upload_video", response_model=UploadVideoResponse)
async def upload_video(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Accepts video file upload, stores it in uploads directory, and registers a database session.
    """
    # Validate extension
    ext = Path(file.filename).suffix.lower()
    if ext not in [".mp4", ".avi", ".mov", ".mkv", ".webm"]:
        raise HTTPException(status_code=400, detail="Unsupported video format. Allowed: .mp4, .avi, .mov, .mkv, .webm")

    video_id = str(uuid.uuid4())
    dest_path = config.UPLOAD_DIR / f"{video_id}{ext}"

    # Stream write to disk
    try:
        with open(dest_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save video: {str(e)}")

    # Check file size
    file_size_mb = os.path.getsize(dest_path) / (1024 * 1024)
    if file_size_mb > config.MAX_UPLOAD_SIZE_MB:
        dest_path.unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail=f"File too large ({file_size_mb:.1f}MB). Max {config.MAX_UPLOAD_SIZE_MB}MB.")

    uploaded_videos[video_id] = str(dest_path)

    # Create session record
    new_session = SessionModel(
        source_type="file",
        video_filename=file.filename,
        notes=f"Uploaded {file.filename} ({file_size_mb:.1f} MB)"
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return UploadVideoResponse(
        video_id=video_id,
        session_id=new_session.id,
        filename=file.filename,
        status="ready",
        message="Video uploaded successfully and ready for real-time tracking."
    )


@app.post("/api/start_processing", response_model=StartProcessingResponse)
def start_processing(
    req: StartProcessingRequest,
    db: Session = Depends(get_db)
):
    """
    Creates a new processing session record for either webcam or file.
    """
    if req.source_type == "file":
        if not req.video_id or req.video_id not in uploaded_videos:
            raise HTTPException(status_code=404, detail="Video file not found or expired.")

    new_session = SessionModel(
        source_type=req.source_type,
        video_filename=uploaded_videos.get(req.video_id, None) if req.source_type == "file" else None,
        notes=req.notes or f"Processing {req.source_type}"
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return StartProcessingResponse(
        session_id=new_session.id,
        status="processing",
        message=f"Session {new_session.id} started for {req.source_type}."
    )


@app.post("/api/stop_processing")
def stop_processing(req: StopProcessingRequest):
    """Stops an ongoing video processing session."""
    if req.session_id and req.session_id in active_processors:
        active_processors[req.session_id].stop()
        del active_processors[req.session_id]
        return {"status": "stopped", "session_id": req.session_id}

    # Stop all if no specific id given
    for sid, proc in list(active_processors.items()):
        proc.stop()
    active_processors.clear()
    return {"status": "all_stopped"}


@app.get("/api/sessions", response_model=List[SessionResponse])
def get_sessions(db: Session = Depends(get_db)):
    """Lists recent detection and tracking sessions with aggregated statistics."""
    sessions = db.query(SessionModel).order_by(SessionModel.created_at.desc()).limit(30).all()
    results = []
    for s in sessions:
        det_count = db.query(func.count(DetectionModel.id)).filter(DetectionModel.session_id == s.id).scalar() or 0
        results.append(
            SessionResponse(
                id=s.id,
                created_at=s.created_at,
                source_type=s.source_type,
                video_filename=s.video_filename,
                duration_sec=s.duration_sec,
                total_frames=s.total_frames,
                notes=s.notes,
                detections_count=det_count
            )
        )
    return results


@app.get("/api/sessions/{session_id}/detections", response_model=List[DetectionResponse])
def get_session_detections(session_id: int, db: Session = Depends(get_db)):
    """Fetches detection records for a session (up to 200 records)."""
    detections = db.query(DetectionModel).filter(DetectionModel.session_id == session_id).order_by(DetectionModel.frame_index.asc()).limit(200).all()
    return detections


@app.websocket("/ws/video")
async def websocket_video_stream(
    websocket: WebSocket,
    source_type: str = Query("webcam"),
    video_id: Optional[str] = Query(None),
    session_id: Optional[int] = Query(None),
    camera_index: int = Query(0)
):
    """
    WebSocket endpoint streaming annotated video frames with real-time detection and SORT tracking.
    """
    await websocket.accept()
    print(f"[WebSocket] Client connected: source_type={source_type}, video_id={video_id}, session_id={session_id}")

    db = next(get_db())
    if not session_id:
        sess = SessionModel(
            source_type=source_type,
            notes=f"WebSocket live stream: {source_type}"
        )
        db.add(sess)
        db.commit()
        db.refresh(sess)
        session_id = sess.id
    db.close()

    processor = VideoProcessor(detector=detector, session_id=session_id)
    active_processors[session_id] = processor

    try:
        if source_type == "file":
            if not video_id or video_id not in uploaded_videos:
                # Check if video_id directly exists as a file in upload dir
                direct_path = config.UPLOAD_DIR / f"{video_id}"
                if direct_path.exists():
                    video_path = str(direct_path)
                else:
                    await websocket.send_json({"type": "error", "message": f"Video '{video_id}' not found."})
                    return
            else:
                video_path = uploaded_videos[video_id]

            await processor.stream_video_file(websocket, video_path)
        else:
            await processor.stream_webcam(websocket, camera_index=camera_index)

    except WebSocketDisconnect:
        print(f"[WebSocket] Client disconnected from session {session_id}")
    except Exception as e:
        print(f"[WebSocket] Exception during streaming: {e}")
    finally:
        processor.stop()
        if session_id in active_processors:
            del active_processors[session_id]
        try:
            await websocket.close()
        except Exception:
            pass
