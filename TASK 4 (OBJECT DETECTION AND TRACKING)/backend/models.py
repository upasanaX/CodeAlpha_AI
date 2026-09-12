"""
Database and Pydantic models for Object Detection & Tracking.
"""
from datetime import datetime
from typing import Optional, List
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field
from db import Base

# SQLAlchemy Models
class SessionModel(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    source_type = Column(String, nullable=False)  # "webcam" or "file"
    video_filename = Column(String, nullable=True)
    duration_sec = Column(Float, nullable=True, default=0.0)
    total_frames = Column(Integer, default=0)
    notes = Column(String, nullable=True)

    detections = relationship("DetectionModel", back_populates="session", cascade="all, delete-orphan")


class DetectionModel(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=False)
    frame_index = Column(Integer, nullable=False)
    timestamp_ms = Column(Float, nullable=False)
    class_name = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    track_id = Column(Integer, nullable=False)
    bbox_x = Column(Integer, nullable=False)
    bbox_y = Column(Integer, nullable=False)
    bbox_w = Column(Integer, nullable=False)
    bbox_h = Column(Integer, nullable=False)

    session = relationship("SessionModel", back_populates="detections")


# Pydantic Schemas
class SessionBase(BaseModel):
    source_type: str
    video_filename: Optional[str] = None
    notes: Optional[str] = None

class SessionCreate(SessionBase):
    pass

class SessionResponse(SessionBase):
    id: int
    created_at: datetime
    duration_sec: Optional[float] = 0.0
    total_frames: Optional[int] = 0
    detections_count: Optional[int] = 0

    class Config:
        from_attributes = True


class DetectionResponse(BaseModel):
    id: int
    session_id: int
    frame_index: int
    timestamp_ms: float
    class_name: str
    confidence: float
    track_id: int
    bbox_x: int
    bbox_y: int
    bbox_w: int
    bbox_h: int

    class Config:
        from_attributes = True


class StartProcessingRequest(BaseModel):
    source_type: str = Field(..., description="'webcam' or 'file'")
    video_id: Optional[str] = Field(None, description="UUID or filename of uploaded video")
    notes: Optional[str] = None


class StartProcessingResponse(BaseModel):
    session_id: int
    status: str
    message: str


class StopProcessingRequest(BaseModel):
    session_id: Optional[int] = None


class UploadVideoResponse(BaseModel):
    video_id: str
    session_id: int
    filename: str
    status: str
    message: str
