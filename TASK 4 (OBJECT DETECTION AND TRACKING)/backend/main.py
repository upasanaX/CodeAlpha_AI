"""
Main FastAPI server for TrackOptic AI.
Provides REST endpoints, User Authentication, Telemetry Export, and WebSocket video streaming.
"""
import os
import io
import csv
import uuid
import shutil
from typing import Optional, List, Dict
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, Depends, HTTPException, Query, Response
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

import config
from db import init_db, get_db
from models import (
    UserModel,
    SessionModel,
    DetectionModel,
    UserRegisterRequest,
    UserLoginRequest,
    UserResponse,
    AuthTokenResponse,
    SessionResponse,
    DetectionResponse,
    StartProcessingRequest,
    StartProcessingResponse,
    StopProcessingRequest,
    UploadVideoResponse
)
from auth import verify_password, get_password_hash, create_access_token, decode_token, get_current_user_optional
from detector import ObjectDetector
from video_processor import VideoProcessor

# Initialize FastAPI application
app = FastAPI(
    title="TrackOptic AI API",
    description="Real-Time Computer Vision & Tracking Suite - CodeAlpha AI Internship Task 4",
    version="2.0.0"
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
        "app_name": "TrackOptic AI",
        "model": detector.model_name if detector else config.MODEL_NAME,
        "device": config.DEVICE,
        "conf_threshold": config.CONF_THRESHOLD,
        "iou_threshold": config.IOU_THRESHOLD,
        "class_filter": detector.class_filter if detector else "all"
    }


# ==========================================
# AUTHENTICATION ENDPOINTS
# ==========================================

@app.post("/api/auth/register", response_model=AuthTokenResponse)
def register_user(req: UserRegisterRequest, db: Session = Depends(get_db)):
    """Register a new user account."""
    # Check if username or email already exists
    if db.query(UserModel).filter(UserModel.username == req.username).first():
        raise HTTPException(status_code=400, detail="Username already registered.")
    if db.query(UserModel).filter(UserModel.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already registered.")

    hashed_pw = get_password_hash(req.password)
    user = UserModel(
        username=req.username,
        email=req.email,
        hashed_password=hashed_pw
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "username": user.username})
    return AuthTokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@app.post("/api/auth/login", response_model=AuthTokenResponse)
def login_user(req: UserLoginRequest, db: Session = Depends(get_db)):
    """Login with username/email and password."""
    user = db.query(UserModel).filter(
        (UserModel.username == req.username_or_email) | (UserModel.email == req.username_or_email)
    ).first()

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username/email or password.")

    token = create_access_token({"sub": str(user.id), "username": user.username})
    return AuthTokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@app.get("/api/auth/me", response_model=UserResponse)
def get_me(current_user: Optional[UserModel] = Depends(get_current_user_optional)):
    """Get profile of currently logged-in user."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated.")
    return current_user


# ==========================================
# VIDEO UPLOAD & PROCESSING ENDPOINTS
# ==========================================

@app.post("/api/upload_video", response_model=UploadVideoResponse)
async def upload_video(
    file: UploadFile = File(...),
    current_user: Optional[UserModel] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Accepts video file upload and creates a session record."""
    ext = Path(file.filename).suffix.lower()
    if ext not in [".mp4", ".avi", ".mov", ".mkv", ".webm"]:
        raise HTTPException(status_code=400, detail="Unsupported video format. Allowed: .mp4, .avi, .mov, .mkv, .webm")

    video_id = str(uuid.uuid4())
    dest_path = config.UPLOAD_DIR / f"{video_id}{ext}"

    try:
        with open(dest_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save video: {str(e)}")

    file_size_mb = os.path.getsize(dest_path) / (1024 * 1024)
    if file_size_mb > config.MAX_UPLOAD_SIZE_MB:
        dest_path.unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail=f"File too large ({file_size_mb:.1f}MB). Max {config.MAX_UPLOAD_SIZE_MB}MB.")

    uploaded_videos[video_id] = str(dest_path)

    new_session = SessionModel(
        user_id=current_user.id if current_user else None,
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
    current_user: Optional[UserModel] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Creates a new processing session record."""
    if req.source_type == "file":
        if not req.video_id or req.video_id not in uploaded_videos:
            raise HTTPException(status_code=404, detail="Video file not found or expired.")

    new_session = SessionModel(
        user_id=current_user.id if current_user else None,
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

    for sid, proc in list(active_processors.items()):
        proc.stop()
    active_processors.clear()
    return {"status": "all_stopped"}


# ==========================================
# SESSIONS & TELEMETRY ENDPOINTS
# ==========================================

@app.get("/api/sessions", response_model=List[SessionResponse])
def get_sessions(
    filter_user: Optional[bool] = Query(False),
    current_user: Optional[UserModel] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Lists sessions with aggregated statistics, optionally filtered by user."""
    query = db.query(SessionModel)
    if filter_user and current_user:
        query = query.filter(SessionModel.user_id == current_user.id)

    sessions = query.order_by(SessionModel.created_at.desc()).limit(50).all()
    results = []
    for s in sessions:
        det_count = db.query(func.count(DetectionModel.id)).filter(DetectionModel.session_id == s.id).scalar() or 0
        username = s.user.username if s.user else None
        results.append(
            SessionResponse(
                id=s.id,
                user_id=s.user_id,
                username=username,
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


@app.delete("/api/sessions/{session_id}")
def delete_session(session_id: int, db: Session = Depends(get_db)):
    """Deletes a session and its detection history."""
    sess = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found.")

    db.delete(sess)
    db.commit()
    return {"status": "deleted", "session_id": session_id}


@app.get("/api/sessions/{session_id}/detections", response_model=List[DetectionResponse])
def get_session_detections(session_id: int, db: Session = Depends(get_db)):
    """Fetches detection records for a session."""
    detections = db.query(DetectionModel).filter(DetectionModel.session_id == session_id).order_by(DetectionModel.frame_index.asc()).limit(300).all()
    return detections


@app.get("/api/sessions/{session_id}/export")
def export_session_detections(session_id: int, format: str = Query("csv"), db: Session = Depends(get_db)):
    """Exports session telemetry records as CSV or JSON file."""
    sess = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found.")

    detections = db.query(DetectionModel).filter(DetectionModel.session_id == session_id).order_by(DetectionModel.frame_index.asc()).all()

    if format.lower() == "json":
        records = [
            {
                "id": d.id,
                "session_id": d.session_id,
                "frame_index": d.frame_index,
                "timestamp_ms": d.timestamp_ms,
                "class_name": d.class_name,
                "confidence": d.confidence,
                "track_id": d.track_id,
                "bbox": [d.bbox_x, d.bbox_y, d.bbox_w, d.bbox_h]
            }
            for d in detections
        ]
        import json
        json_str = json.dumps({"session_id": session_id, "detections": records}, indent=2)
        return Response(
            content=json_str,
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename=trackoptic_session_{session_id}.json"}
        )
    else:
        # Default CSV export
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["id", "session_id", "frame_index", "timestamp_ms", "track_id", "class_name", "confidence", "bbox_x", "bbox_y", "bbox_w", "bbox_h"])
        for d in detections:
            writer.writerow([d.id, d.session_id, d.frame_index, f"{d.timestamp_ms:.1f}", d.track_id, d.class_name, f"{d.confidence:.3f}", d.bbox_x, d.bbox_y, d.bbox_w, d.bbox_h])

        output.seek(0)
        return StreamingResponse(
            io.BytesIO(output.getvalue().encode("utf-8")),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=trackoptic_session_{session_id}.csv"}
        )


# ==========================================
# WEBSOCKET STREAMING ENDPOINT
# ==========================================

@app.websocket("/ws/video")
async def websocket_video_stream(
    websocket: WebSocket,
    source_type: str = Query("webcam"),
    video_id: Optional[str] = Query(None),
    session_id: Optional[int] = Query(None),
    camera_index: int = Query(0),
    conf_threshold: float = Query(config.CONF_THRESHOLD),
    iou_threshold: float = Query(config.IOU_THRESHOLD),
    class_filter: str = Query("all"),
    model_name: Optional[str] = Query(None),
    token: Optional[str] = Query(None)
):
    """
    WebSocket endpoint streaming annotated video frames with real-time detection,
    SORT tracking, and dynamic sensitivity controls.
    """
    await websocket.accept()
    print(f"[WebSocket] Client connected: source_type={source_type}, video_id={video_id}, session_id={session_id}, filter={class_filter}")

    # Determine user from token if supplied
    user_id = None
    if token:
        payload = decode_token(token)
        if payload and "sub" in payload:
            try:
                user_id = int(payload["sub"])
            except ValueError:
                pass

    db = next(get_db())
    if not session_id:
        sess = SessionModel(
            user_id=user_id,
            source_type=source_type,
            notes=f"WebSocket live stream: {source_type}"
        )
        db.add(sess)
        db.commit()
        db.refresh(sess)
        session_id = sess.id
    db.close()

    processor = VideoProcessor(
        detector=detector,
        session_id=session_id,
        conf_threshold=conf_threshold,
        iou_threshold=iou_threshold
    )
    processor.set_thresholds(class_filter=class_filter, model_name=model_name)
    active_processors[session_id] = processor

    try:
        if source_type == "file":
            if not video_id or video_id not in uploaded_videos:
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
