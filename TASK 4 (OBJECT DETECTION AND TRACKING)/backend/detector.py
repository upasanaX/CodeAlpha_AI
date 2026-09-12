"""
Object Detection module using Ultralytics YOLOv8.
"""
from dataclasses import dataclass
from typing import List, Tuple, Optional
import time
import numpy as np
from ultralytics import YOLO
import config

@dataclass
class DetectionResult:
    class_name: str
    confidence: float
    bbox: Tuple[int, int, int, int]  # (x1, y1, x2, y2) in pixel coordinates

class ObjectDetector:
    """Wrapper around YOLOv8 model for real-time inference."""

    def __init__(self, model_name: str = config.MODEL_NAME, conf_threshold: float = config.CONF_THRESHOLD):
        self.model_name = model_name
        self.conf_threshold = conf_threshold
        self.device = config.DEVICE
        print(f"[ObjectDetector] Loading YOLO model '{self.model_name}' on device '{self.device}'...")
        self.model = YOLO(self.model_name)
        # Warmup model
        dummy = np.zeros((320, 320, 3), dtype=np.uint8)
        self.model.predict(dummy, device=self.device, verbose=False)
        print(f"[ObjectDetector] Model '{self.model_name}' loaded successfully.")

    def detect(self, frame: np.ndarray, conf_threshold: Optional[float] = None) -> Tuple[List[DetectionResult], float]:
        """
        Run object detection on an input RGB/BGR frame.
        Returns a tuple of (detections_list, inference_time_ms).
        """
        if frame is None or frame.size == 0:
            return [], 0.0

        conf = conf_threshold if conf_threshold is not None else self.conf_threshold

        t0 = time.time()
        results = self.model.predict(
            source=frame,
            conf=conf,
            device=self.device,
            verbose=False
        )
        inference_ms = (time.time() - t0) * 1000.0

        detections: List[DetectionResult] = []
        if not results:
            return detections, round(inference_ms, 1)

        res = results[0]
        boxes = res.boxes
        if boxes is None or len(boxes) == 0:
            return detections, round(inference_ms, 1)

        names = res.names  # dict of class id -> class name

        for box in boxes:
            cls_id = int(box.cls[0].item())
            class_name = names.get(cls_id, f"class_{cls_id}")
            confidence = float(box.conf[0].item())
            xyxy = box.xyxy[0].cpu().numpy().astype(int)
            x1, y1, x2, y2 = int(xyxy[0]), int(xyxy[1]), int(xyxy[2]), int(xyxy[3])

            detections.append(
                DetectionResult(
                    class_name=class_name,
                    confidence=confidence,
                    bbox=(x1, y1, x2, y2)
                )
            )

        return detections, round(inference_ms, 1)
