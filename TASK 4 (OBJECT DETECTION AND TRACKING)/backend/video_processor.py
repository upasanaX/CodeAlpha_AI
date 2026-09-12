"""
Video Processor Module for Webcam & Video File streams with real-time detection,
SORT tracking, frame annotation, and WebSocket transmission with dynamic thresholding.
"""
import asyncio
import base64
import time
from typing import Optional, List, Dict
import cv2
import numpy as np
from fastapi import WebSocket

import config
from detector import ObjectDetector, DetectionResult
from tracker import SortTracker, TrackedObject, get_track_color
from models import SessionModel, DetectionModel
from db import SessionLocal

class VideoProcessor:
    """Manages real-time frame acquisition, processing, dynamic thresholding, and streaming."""

    def __init__(self, detector: ObjectDetector, session_id: int, conf_threshold: float = config.CONF_THRESHOLD, iou_threshold: float = config.IOU_THRESHOLD):
        self.detector = detector
        self.session_id = session_id
        self.conf_threshold = conf_threshold
        self.tracker = SortTracker(
            max_age=config.MAX_AGE,
            min_hits=config.MIN_HITS,
            iou_threshold=iou_threshold
        )
        self.class_filter: str = "all"
        self.is_running = True
        self.frame_count = 0
        self.start_time = time.time()
        self.logged_detections_count = 0

    def set_thresholds(
        self,
        conf: Optional[float] = None,
        iou: Optional[float] = None,
        class_filter: Optional[str] = None,
        model_name: Optional[str] = None
    ):
        """Update detection, tracking, filter mode, and model on the fly."""
        if conf is not None:
            self.conf_threshold = max(0.05, min(0.95, conf))
        if iou is not None:
            self.tracker.iou_threshold = max(0.05, min(0.95, iou))
        if class_filter is not None:
            self.class_filter = class_filter
            self.detector.set_class_filter(class_filter)
        if model_name is not None and model_name in ("yolov8n.pt", "yolov8s.pt"):
            self.detector.set_model(model_name)
        print(f"[VideoProcessor] Updated settings for session {self.session_id}: conf={self.conf_threshold}, iou={self.tracker.iou_threshold}, filter={self.class_filter}, model={self.detector.model_name}")

    def stop(self):
        """Signal processor loop to stop."""
        self.is_running = False

    def annotate_frame(
        self,
        frame: np.ndarray,
        tracked_objects: List[TrackedObject],
        raw_detections: List[DetectionResult],
        fps: float,
        inference_ms: float
    ) -> np.ndarray:
        """
        Draw bounding boxes, labels, track IDs, and HUD telemetry onto the frame.
        """
        annotated = frame.copy()
        h, w, _ = annotated.shape

        # Draw tracked objects
        for obj in tracked_objects:
            x1, y1, x2, y2 = obj.bbox

            x1 = max(0, min(w - 1, x1))
            y1 = max(0, min(h - 1, y1))
            x2 = max(0, min(w - 1, x2))
            y2 = max(0, min(h - 1, y2))

            if x2 <= x1 or y2 <= y1:
                continue

            color = get_track_color(obj.track_id)

            # Draw bounding box
            cv2.rectangle(annotated, (x1, y1), (x2, y2), color, 2)

            # Draw label banner
            label = f"ID:{obj.track_id} {obj.class_name} {obj.confidence:.2f}"
            font = cv2.FONT_HERSHEY_SIMPLEX
            font_scale = 0.48
            thickness = 1
            (text_w, text_h), baseline = cv2.getTextSize(label, font, font_scale, thickness)

            # Badge background
            badge_y1 = max(0, y1 - text_h - 6)
            badge_y2 = y1
            badge_x2 = min(w, x1 + text_w + 8)
            cv2.rectangle(annotated, (x1, badge_y1), (badge_x2, badge_y2), color, -1)

            # Text
            cv2.putText(
                annotated,
                label,
                (x1 + 4, badge_y2 - 3),
                font,
                font_scale,
                (255, 255, 255),
                thickness,
                lineType=cv2.LINE_AA
            )

        # Draw HUD badge in top-left
        hud_text = f"FPS: {fps:4.1f} | Latency: {inference_ms:4.1f}ms | Objs: {len(raw_detections)} | Tracks: {len(tracked_objects)}"
        cv2.rectangle(annotated, (8, 8), (430, 36), (15, 18, 24), -1)
        cv2.rectangle(annotated, (8, 8), (430, 36), (40, 40, 220), 1)  # Crimson border
        cv2.putText(
            annotated,
            hud_text,
            (16, 26),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.46,
            (240, 240, 240),
            1,
            lineType=cv2.LINE_AA
        )

        return annotated

    def log_detections_to_db(self, tracked_objects: List[TrackedObject], frame_idx: int, timestamp_ms: float):
        """Persist detection telemetry to SQLite."""
        if not tracked_objects:
            return

        db = SessionLocal()
        try:
            records = []
            for obj in tracked_objects:
                x1, y1, x2, y2 = obj.bbox
                w = max(0, x2 - x1)
                h = max(0, y2 - y1)
                records.append(
                    DetectionModel(
                        session_id=self.session_id,
                        frame_index=frame_idx,
                        timestamp_ms=timestamp_ms,
                        class_name=obj.class_name,
                        confidence=obj.confidence,
                        track_id=obj.track_id,
                        bbox_x=x1,
                        bbox_y=y1,
                        bbox_w=w,
                        bbox_h=h
                    )
                )
            db.add_all(records)
            db.commit()
            self.logged_detections_count += len(records)
        except Exception as e:
            print(f"[VideoProcessor] Error logging detections to DB: {e}")
            db.rollback()
        finally:
            db.close()

    def update_session_summary(self, duration: float, total_frames: int):
        """Update session record upon completion."""
        db = SessionLocal()
        try:
            sess = db.query(SessionModel).filter(SessionModel.id == self.session_id).first()
            if sess:
                sess.duration_sec = round(duration, 2)
                sess.total_frames = total_frames
                db.commit()
        except Exception as e:
            print(f"[VideoProcessor] Error updating session: {e}")
            db.rollback()
        finally:
            db.close()

    async def _handle_incoming_messages(self, websocket: WebSocket):
        """Background listener for live threshold adjustments and commands from client."""
        try:
            while self.is_running:
                data = await websocket.receive_json()
                if not data:
                    continue
                action = data.get("action")
                if action == "set_thresholds":
                    conf = data.get("conf_threshold")
                    iou = data.get("iou_threshold")
                    class_filter = data.get("class_filter")
                    model_name = data.get("model_name")
                    self.set_thresholds(conf, iou, class_filter, model_name)
                elif action == "stop":
                    self.stop()
                    break
        except Exception:
            pass

    async def stream_webcam(self, websocket: WebSocket, camera_index: int = 0):
        """Captures frames from live webcam, runs detection + tracking, and streams via WebSocket."""
        print(f"[VideoProcessor] Opening webcam index {camera_index} for session {self.session_id}...")
        cap = cv2.VideoCapture(camera_index, cv2.CAP_DSHOW) if hasattr(cv2, "CAP_DSHOW") else cv2.VideoCapture(camera_index)

        if not cap.isOpened():
            cap = cv2.VideoCapture(camera_index)

        if not cap.isOpened():
            error_payload = {
                "type": "error",
                "message": f"Unable to access camera index {camera_index}. Please ensure a camera is connected and permissions are granted, or test with an uploaded video."
            }
            await websocket.send_json(error_payload)
            return

        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

        prev_time = time.time()
        fps = 0.0

        # Start incoming message listener
        listener_task = asyncio.create_task(self._handle_incoming_messages(websocket))

        try:
            while self.is_running:
                ret, frame = cap.read()
                if not ret or frame is None:
                    await asyncio.sleep(0.05)
                    continue

                curr_time = time.time()
                elapsed = curr_time - prev_time
                prev_time = curr_time
                if elapsed > 0:
                    current_fps = 1.0 / elapsed
                    fps = 0.9 * fps + 0.1 * current_fps if fps > 0 else current_fps

                self.frame_count += 1

                if frame.shape[1] > 800:
                    scale = 800.0 / frame.shape[1]
                    frame = cv2.resize(frame, (0, 0), fx=scale, fy=scale)

                # Detection with dynamic confidence threshold and active class filter
                detections, inference_ms = self.detector.detect(
                    frame,
                    conf_threshold=self.conf_threshold,
                    filter_mode=self.class_filter
                )
                tracked_objects = self.tracker.update(detections)

                # Class breakdown
                class_dist: Dict[str, int] = {}
                for d in detections:
                    class_dist[d.class_name] = class_dist.get(d.class_name, 0) + 1

                # DB logging (throttled)
                if config.DETAILED_LOGGING or (self.frame_count % config.DB_LOG_INTERVAL == 0):
                    timestamp_ms = (curr_time - self.start_time) * 1000.0
                    self.log_detections_to_db(tracked_objects, self.frame_count, timestamp_ms)

                # Annotation
                annotated = self.annotate_frame(frame, tracked_objects, detections, fps, inference_ms)

                # JPEG encode
                encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 80]
                _, buffer = cv2.imencode('.jpg', annotated, encode_param)
                jpg_as_text = base64.b64encode(buffer).decode('utf-8')

                payload = {
                    "type": "frame",
                    "frame_data": jpg_as_text,
                    "fps": round(fps, 1),
                    "inference_ms": inference_ms,
                    "objects_count": len(detections),
                    "tracks_count": len(tracked_objects),
                    "frame_index": self.frame_count,
                    "class_distribution": class_dist,
                    "resolution": f"{frame.shape[1]}x{frame.shape[0]}"
                }
                await websocket.send_json(payload)
                await asyncio.sleep(0.005)

        except Exception as e:
            print(f"[VideoProcessor] Webcam stream interrupted: {e}")
        finally:
            listener_task.cancel()
            cap.release()
            total_duration = time.time() - self.start_time
            self.update_session_summary(total_duration, self.frame_count)
            print(f"[VideoProcessor] Webcam stream finished. Total frames: {self.frame_count}, duration: {total_duration:.1f}s")

    async def stream_video_file(self, websocket: WebSocket, video_path: str):
        """Processes an uploaded video file frame-by-frame and streams the annotated output."""
        print(f"[VideoProcessor] Processing video file '{video_path}' for session {self.session_id}...")
        cap = cv2.VideoCapture(video_path)

        if not cap.isOpened():
            await websocket.send_json({
                "type": "error",
                "message": f"Unable to open video file '{video_path}'."
            })
            return

        video_fps = cap.get(cv2.CAP_PROP_FPS)
        if not video_fps or np.isnan(video_fps) or video_fps <= 0 or video_fps > 120:
            video_fps = float(config.TARGET_STREAM_FPS)

        frame_delay = 1.0 / video_fps
        prev_time = time.time()
        fps = 0.0

        listener_task = asyncio.create_task(self._handle_incoming_messages(websocket))

        try:
            while self.is_running:
                loop_start = time.time()
                ret, frame = cap.read()
                if not ret or frame is None:
                    await websocket.send_json({
                        "type": "finished",
                        "message": "Video playback and processing finished.",
                        "total_frames": self.frame_count
                    })
                    break

                curr_time = time.time()
                elapsed = curr_time - prev_time
                prev_time = curr_time
                if elapsed > 0:
                    current_fps = 1.0 / elapsed
                    fps = 0.9 * fps + 0.1 * current_fps if fps > 0 else current_fps

                self.frame_count += 1

                if frame.shape[1] > 960:
                    scale = 960.0 / frame.shape[1]
                    frame = cv2.resize(frame, (0, 0), fx=scale, fy=scale)

                detections, inference_ms = self.detector.detect(
                    frame,
                    conf_threshold=self.conf_threshold,
                    filter_mode=self.class_filter
                )
                tracked_objects = self.tracker.update(detections)

                class_dist: Dict[str, int] = {}
                for d in detections:
                    class_dist[d.class_name] = class_dist.get(d.class_name, 0) + 1

                if config.DETAILED_LOGGING or (self.frame_count % config.DB_LOG_INTERVAL == 0):
                    timestamp_ms = (self.frame_count / video_fps) * 1000.0
                    self.log_detections_to_db(tracked_objects, self.frame_count, timestamp_ms)

                annotated = self.annotate_frame(frame, tracked_objects, detections, fps, inference_ms)

                encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 80]
                _, buffer = cv2.imencode('.jpg', annotated, encode_param)
                jpg_as_text = base64.b64encode(buffer).decode('utf-8')

                payload = {
                    "type": "frame",
                    "frame_data": jpg_as_text,
                    "fps": round(fps, 1),
                    "inference_ms": inference_ms,
                    "objects_count": len(detections),
                    "tracks_count": len(tracked_objects),
                    "frame_index": self.frame_count,
                    "class_distribution": class_dist,
                    "resolution": f"{frame.shape[1]}x{frame.shape[0]}"
                }
                await websocket.send_json(payload)

                computation_time = time.time() - loop_start
                sleep_time = max(0.005, frame_delay - computation_time)
                await asyncio.sleep(sleep_time)

        except Exception as e:
            print(f"[VideoProcessor] Video file stream error: {e}")
        finally:
            listener_task.cancel()
            cap.release()
            total_duration = time.time() - self.start_time
            self.update_session_summary(total_duration, self.frame_count)
            print(f"[VideoProcessor] Video file processing complete. Total frames: {self.frame_count}")
