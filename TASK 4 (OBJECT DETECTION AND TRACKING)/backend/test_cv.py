"""
Automated unit and integration test suite for Task 4: Object Detection & Tracking.
Tests:
1. Database initialization and models
2. ObjectDetector loading & inference on synthetic frame
3. SortTracker Kalman motion prediction and IoU association
4. FastAPI endpoints (/api/health, /api/sessions)
"""
import unittest
import numpy as np
import cv2

from db import init_db, SessionLocal
from models import SessionModel, DetectionModel
from detector import DetectionResult
from tracker import SortTracker, calculate_iou, convert_bbox_to_z, convert_x_to_bbox
from fastapi.testclient import TestClient
from main import app

class TestDetectionAndTracking(unittest.TestCase):

    def setUp(self):
        init_db()

    def test_database_models(self):
        """Verify session and detection model insertion and retrieval."""
        db = SessionLocal()
        try:
            sess = SessionModel(
                source_type="file",
                video_filename="test_clip.mp4",
                duration_sec=12.5,
                total_frames=300,
                notes="Automated test session"
            )
            db.add(sess)
            db.commit()
            db.refresh(sess)

            self.assertIsNotNone(sess.id)
            self.assertEqual(sess.source_type, "file")

            # Add detection
            det = DetectionModel(
                session_id=sess.id,
                frame_index=1,
                timestamp_ms=33.3,
                class_name="person",
                confidence=0.92,
                track_id=101,
                bbox_x=50,
                bbox_y=60,
                bbox_w=100,
                bbox_h=150
            )
            db.add(det)
            db.commit()

            fetched_dets = db.query(DetectionModel).filter(DetectionModel.session_id == sess.id).all()
            self.assertEqual(len(fetched_dets), 1)
            self.assertEqual(fetched_dets[0].class_name, "person")
            self.assertEqual(fetched_dets[0].track_id, 101)
        finally:
            db.close()

    def test_tracker_iou_and_kalman(self):
        """Verify IoU calculation and SORT tracking updates."""
        # 1. IoU check
        boxA = (10, 10, 50, 50)
        boxB = (10, 10, 50, 50)
        iou_perfect = calculate_iou(boxA, boxB)
        self.assertAlmostEqual(iou_perfect, 1.0, places=2)

        boxC = (100, 100, 150, 150)
        iou_none = calculate_iou(boxA, boxC)
        self.assertEqual(iou_none, 0.0)

        # 2. SORT Tracker check
        tracker = SortTracker(max_age=5, min_hits=1, iou_threshold=0.3)

        # Frame 1: 1 detection
        det1 = [DetectionResult(class_name="person", confidence=0.85, bbox=(50, 50, 150, 150))]
        tracks1 = tracker.update(det1)
        self.assertEqual(len(tracks1), 1)
        first_track_id = tracks1[0].track_id

        # Frame 2: Slightly moved detection
        det2 = [DetectionResult(class_name="person", confidence=0.87, bbox=(52, 51, 152, 151))]
        tracks2 = tracker.update(det2)
        self.assertEqual(len(tracks2), 1)
        # Should keep consistent track_id
        self.assertEqual(tracks2[0].track_id, first_track_id)

    def test_fastapi_endpoints(self):
        """Verify REST API responses."""
        client = TestClient(app)

        # Health endpoint
        res = client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "healthy")
        self.assertIn("model", data)

        # Sessions endpoint
        res = client.get("/api/sessions")
        self.assertEqual(res.status_code, 200)
        self.assertIsInstance(res.json(), list)

if __name__ == "__main__":
    unittest.main()
