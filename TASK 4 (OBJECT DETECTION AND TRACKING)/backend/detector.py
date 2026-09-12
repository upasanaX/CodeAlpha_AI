"""
Object Detection module using Ultralytics YOLOv8 with precision filtering and model switching.
"""
from dataclasses import dataclass
from typing import List, Tuple, Optional, Set
import time
import numpy as np
from ultralytics import YOLO
import config

@dataclass
class DetectionResult:
    class_name: str
    confidence: float
    bbox: Tuple[int, int, int, int]  # (x1, y1, x2, y2) in pixel coordinates

# Known spurious COCO classes commonly hallucinated on webcam clothing/faces at lower confidences
COMMON_FALSE_POSITIVES: Set[str] = {
    "donut", "frisbee", "sports ball", "kite", "baseball glove",
    "skis", "snowboard", "surfboard", "tennis racket", "toilet",
    "sink", "airplane", "boat"
}

# Standard indoor & workplace objects for high-precision indoor mode
WORKPLACE_CLASSES: Set[str] = {
    "person", "cell phone", "laptop", "mouse", "keyboard", "bottle",
    "cup", "chair", "couch", "book", "tv", "backpack", "handbag",
    "tie", "scissors", "clock", "potted plant", "dining table", "bed"
}

class ObjectDetector:
    """Wrapper around YOLOv8 model with precision filtering and model switching."""

    def __init__(self, model_name: str = config.MODEL_NAME, conf_threshold: float = config.CONF_THRESHOLD):
        self.model_name = model_name
        self.conf_threshold = conf_threshold
        self.device = config.DEVICE
        self.class_filter: str = "all"  # 'all' | 'workplace'
        print(f"[ObjectDetector] Loading YOLO model '{self.model_name}' on device '{self.device}'...")
        self.model = YOLO(self.model_name)
        # Warmup model
        dummy = np.zeros((320, 320, 3), dtype=np.uint8)
        self.model.predict(dummy, device=self.device, verbose=False)
        print(f"[ObjectDetector] Model '{self.model_name}' loaded successfully.")

    def set_model(self, new_model_name: str):
        """Switch detection model dynamically (e.g. 'yolov8s.pt' or 'yolov8n.pt')."""
        if new_model_name != self.model_name:
            print(f"[ObjectDetector] Switching model from '{self.model_name}' to '{new_model_name}'...")
            self.model_name = new_model_name
            self.model = YOLO(self.model_name)
            dummy = np.zeros((320, 320, 3), dtype=np.uint8)
            self.model.predict(dummy, device=self.device, verbose=False)
            print(f"[ObjectDetector] Switched to '{new_model_name}' successfully.")

    def set_class_filter(self, filter_mode: str):
        """Set class filter mode ('all' or 'workplace')."""
        self.class_filter = filter_mode
        print(f"[ObjectDetector] Set class filter to: {filter_mode}")

    def detect(
        self,
        frame: np.ndarray,
        conf_threshold: Optional[float] = None,
        filter_mode: Optional[str] = None
    ) -> Tuple[List[DetectionResult], float]:
        """
        Run object detection on an input RGB/BGR frame.
        Includes NMS suppression, containment filtering, and spurious detection rejection.
        Returns a tuple of (detections_list, inference_time_ms).
        """
        if frame is None or frame.size == 0:
            return [], 0.0

        conf = conf_threshold if conf_threshold is not None else self.conf_threshold
        active_filter = filter_mode if filter_mode is not None else self.class_filter

        t0 = time.time()
        results = self.model.predict(
            source=frame,
            conf=max(0.10, conf),
            iou=0.45,  # Tight NMS to eliminate overlapping duplicate boxes
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

        raw_candidates: List[DetectionResult] = []

        for box in boxes:
            cls_id = int(box.cls[0].item())
            class_name = names.get(cls_id, f"class_{cls_id}")
            confidence = float(box.conf[0].item())
            xyxy = box.xyxy[0].cpu().numpy().astype(int)
            x1, y1, x2, y2 = int(xyxy[0]), int(xyxy[1]), int(xyxy[2]), int(xyxy[3])

            # Apply class filter if active
            if active_filter == "workplace" and class_name not in WORKPLACE_CLASSES:
                continue

            # Reject known common webcam hallucinated classes unless confidence is extraordinarily high
            if class_name in COMMON_FALSE_POSITIVES and confidence < 0.70:
                continue

            raw_candidates.append(
                DetectionResult(
                    class_name=class_name,
                    confidence=confidence,
                    bbox=(x1, y1, x2, y2)
                )
            )

        # Containment filter: Suppress low-confidence phantom boxes inside primary objects (e.g. donut/remote inside person)
        filtered: List[DetectionResult] = []
        for i, det_a in enumerate(raw_candidates):
            ax1, ay1, ax2, ay2 = det_a.bbox
            area_a = max(1, (ax2 - ax1) * (ay2 - ay1))
            is_suppressed = False

            for j, det_b in enumerate(raw_candidates):
                if i == j:
                    continue
                bx1, by1, bx2, by2 = det_b.bbox
                area_b = max(1, (bx2 - bx1) * (by2 - by1))

                # Check if box A is almost completely enclosed inside larger box B
                if area_b > 2.5 * area_a:
                    inter_x1 = max(ax1, bx1)
                    inter_y1 = max(ay1, by1)
                    inter_x2 = min(ax2, bx2)
                    inter_y2 = min(ay2, by2)
                    inter_w = max(0, inter_x2 - inter_x1)
                    inter_h = max(0, inter_y2 - inter_y1)
                    inter_area = inter_w * inter_h

                    # If > 75% of box A is inside box B, and A has lower confidence (< 0.55) or is commonly hallucinated
                    if inter_area / area_a > 0.75:
                        if det_a.confidence < 0.55 or det_a.class_name in ("remote", "cell phone", "donut", "tie"):
                            is_suppressed = True
                            break

            if not is_suppressed:
                filtered.append(det_a)

        return filtered, round(inference_ms, 1)
