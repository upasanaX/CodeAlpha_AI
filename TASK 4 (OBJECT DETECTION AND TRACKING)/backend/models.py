"""
Database and Pydantic models for Object Detection & Tracking with User Authentication.
"""
from datetime import datetime
from typing import Optional, List, Dict
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field
from db import Base

# SQLAlchemy Models
class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    sessions = relationship("SessionModel", back_populates="user", cascade="all, delete-orphan")


class SessionModel(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    source_type = Column(String, nullable=False)  # "webcam" or "file"
    video_filename = Column(String, nullable=True)
    duration_sec = Column(Float, nullable=True, default=0.0)
    total_frames = Column(Integer, default=0)
    notes = Column(String, nullable=True)

    user = relationship("UserModel", back_populates="sessions")
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

# User Auth Schemas
class UserRegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., min_length=5, max_length=100)
    password: str = Field(..., min_length=6)

class UserLoginRequest(BaseModel):
    username_or_email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# Session & Detection Schemas
class SessionBase(BaseModel):
    source_type: str
    video_filename: Optional[str] = None
    notes: Optional[str] = None

class SessionCreate(SessionBase):
    pass

class SessionResponse(SessionBase):
    id: int
    user_id: Optional[int] = None
    username: Optional[str] = None
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
