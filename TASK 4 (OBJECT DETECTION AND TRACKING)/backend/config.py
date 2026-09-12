"""
Configuration settings for Object Detection & Tracking Backend.
"""
import os
from pathlib import Path
import torch

# Base directory
BASE_DIR = Path(__file__).resolve().parent

# Upload directory
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Database
DATABASE_URL = f"sqlite:///{BASE_DIR}/tracking.db"

# Detection & Tracking Model Parameters
MODEL_NAME = os.getenv("DETECTION_MODEL", "yolov8n.pt")  # Pre-trained YOLOv8 nano model
CONF_THRESHOLD = float(os.getenv("CONF_THRESHOLD", "0.40"))  # Confidence threshold for detections
IOU_THRESHOLD = float(os.getenv("IOU_THRESHOLD", "0.30"))   # IoU threshold for SORT tracker
MAX_AGE = int(os.getenv("MAX_AGE", "30"))                    # Max frames to keep lost track alive
MIN_HITS = int(os.getenv("MIN_HITS", "3"))                   # Min hits before track is confirmed

# Processing & Logging Options
MAX_UPLOAD_SIZE_MB = 50
TARGET_STREAM_FPS = 25
DETAILED_LOGGING = os.getenv("DETAILED_LOGGING", "False").lower() in ("true", "1", "yes")
DB_LOG_INTERVAL = 10  # Log detections every N frames to avoid DB write bottleneck

# Compute Device
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
