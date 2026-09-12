"""
SORT (Simple Online and Realtime Tracking) Multi-Object Tracker.
Uses Kalman Filter for motion prediction and Hungarian algorithm for IoU association.
"""
from dataclasses import dataclass
from typing import List, Tuple, Optional
import numpy as np
from scipy.optimize import linear_sum_assignment
from detector import DetectionResult
import config

@dataclass
class TrackedObject:
    track_id: int
    bbox: Tuple[int, int, int, int]  # (x1, y1, x2, y2)
    class_name: str
    confidence: float
    age: int
    time_since_update: int
    hits: int

def convert_bbox_to_z(bbox: Tuple[int, int, int, int]) -> np.ndarray:
    """
    Takes a bounding box in the form [x1,y1,x2,y2] and returns z in the form
    [x, y, s, r] where x,y is the centre of the box, s is the scale/area and r is
    the aspect ratio.
    """
    x1, y1, x2, y2 = bbox
    w = max(1e-4, float(x2 - x1))
    h = max(1e-4, float(y2 - y1))
    x = float(x1) + w / 2.0
    y = float(y1) + h / 2.0
    s = w * h  # scale is just area
    r = w / h
    return np.array([x, y, s, r]).reshape((4, 1))

def convert_x_to_bbox(x: np.ndarray) -> Tuple[int, int, int, int]:
    """
    Takes a bounding box state vector in the form [x, y, s, r, ...] and returns [x1, y1, x2, y2].
    """
    x_val = float(x[0, 0])
    y_val = float(x[1, 0])
    s = max(1e-4, float(x[2, 0]))
    r = max(1e-4, float(x[3, 0]))

    w = np.sqrt(s * r)
    h = s / w

    x1 = int(round(x_val - w / 2.0))
    y1 = int(round(y_val - h / 2.0))
    x2 = int(round(x_val + w / 2.0))
    y2 = int(round(y_val + h / 2.0))
    return (x1, y1, x2, y2)

def calculate_iou(bb_test: Tuple[int, int, int, int], bb_gt: Tuple[int, int, int, int]) -> float:
    """
    Computes Intersection over Union (IoU) between two bounding boxes [x1, y1, x2, y2].
    """
    xx1 = max(bb_test[0], bb_gt[0])
    yy1 = max(bb_test[1], bb_gt[1])
    xx2 = min(bb_test[2], bb_gt[2])
    yy2 = min(bb_test[3], bb_gt[3])

    w = max(0.0, float(xx2 - xx1))
    h = max(0.0, float(yy2 - yy1))
    intersection = w * h

    area_test = max(1e-4, float((bb_test[2] - bb_test[0]) * (bb_test[3] - bb_test[1])))
    area_gt = max(1e-4, float((bb_gt[2] - bb_gt[0]) * (bb_gt[3] - bb_gt[1])))

    union = area_test + area_gt - intersection
    return float(intersection / union) if union > 0 else 0.0

class KalmanBoxTracker:
    """
    Represents the internal state of individual tracked objects observed as bbox.
    Constant velocity motion model with state: [x, y, s, r, x', y', s']^T.
    """
    count = 0

    def __init__(self, bbox: Tuple[int, int, int, int], class_name: str, confidence: float):
        # State vector: 7x1
        self.x = np.zeros((7, 1))
        self.x[:4] = convert_bbox_to_z(bbox)

        # State Transition Matrix F: 7x7
        self.F = np.eye(7)
        self.F[0, 4] = 1.0  # x = x + x'
        self.F[1, 5] = 1.0  # y = y + y'
        self.F[2, 6] = 1.0  # s = s + s'

        # Measurement Matrix H: 4x7
        self.H = np.zeros((4, 7))
        self.H[0, 0] = 1.0
        self.H[1, 1] = 1.0
        self.H[2, 2] = 1.0
        self.H[3, 3] = 1.0

        # Measurement Uncertainty R: 4x4
        self.R = np.eye(4)
        self.R[2:, 2:] *= 10.0

        # State Uncertainty P: 7x7
        self.P = np.eye(7) * 10.0
        self.P[4:, 4:] *= 1000.0  # High uncertainty in initial velocities

        # Process Uncertainty Q: 7x7
        self.Q = np.eye(7)
        self.Q[4:, 4:] *= 0.01

        self.time_since_update = 0
        self.id = KalmanBoxTracker.count + 1
        KalmanBoxTracker.count += 1
        self.history: List[Tuple[int, int, int, int]] = []
        self.hits = 1
        self.hit_streak = 1
        self.age = 0
        self.class_history: List[Tuple[str, float]] = [(class_name, confidence)]
        self.class_name = class_name
        self.confidence = confidence

    def update(self, bbox: Tuple[int, int, int, int], class_name: str, confidence: float):
        """
        Updates the state vector with observed bbox and stabilises classification.
        """
        self.time_since_update = 0
        self.history = []
        self.hits += 1
        self.hit_streak += 1

        # Stabilize classification through temporal confidence-weighted voting
        self.class_history.append((class_name, confidence))
        if len(self.class_history) > 10:
            self.class_history.pop(0)

        scores: dict = {}
        for c, conf in self.class_history:
            scores[c] = scores.get(c, 0.0) + conf
        best_class = max(scores.items(), key=lambda item: item[1])[0]
        self.class_name = best_class
        self.confidence = confidence

        z = convert_bbox_to_z(bbox)

        # Innovation: y = z - H * x
        y = z - (self.H @ self.x)

        # Innovation covariance: S = H * P * H^T + R
        S = self.H @ self.P @ self.H.T + self.R

        # Kalman gain: K = P * H^T * inv(S)
        K = self.P @ self.H.T @ np.linalg.inv(S)

        # Updated state: x = x + K * y
        self.x = self.x + (K @ y)

        # Updated uncertainty: P = (I - K * H) * P
        I = np.eye(7)
        self.P = (I - (K @ self.H)) @ self.P

    def predict(self) -> Tuple[int, int, int, int]:
        """
        Advances the state vector and returns the predicted bounding box estimate.
        """
        # Constrain area scale to non-negative
        if (self.x[6, 0] + self.x[2, 0]) <= 0:
            self.x[6, 0] = 0.0

        # Predict state: x = F * x
        self.x = self.F @ self.x

        # Predict uncertainty: P = F * P * F^T + Q
        self.P = self.F @ self.P @ self.F.T + self.Q

        self.age += 1
        if self.time_since_update > 0:
            self.hit_streak = 0
        self.time_since_update += 1

        predicted_bbox = convert_x_to_bbox(self.x)
        self.history.append(predicted_bbox)
        return predicted_bbox

    def get_state(self) -> Tuple[int, int, int, int]:
        """
        Returns the current bounding box estimate.
        """
        return convert_x_to_bbox(self.x)

class SortTracker:
    """
    SORT Multi-Object Tracker managing instances of KalmanBoxTracker.
    """

    def __init__(self, max_age: int = config.MAX_AGE, min_hits: int = config.MIN_HITS, iou_threshold: float = config.IOU_THRESHOLD):
        self.max_age = max_age
        self.min_hits = min_hits
        self.iou_threshold = iou_threshold
        self.trackers: List[KalmanBoxTracker] = []
        self.frame_count = 0

    def update(self, detections: List[DetectionResult]) -> List[TrackedObject]:
        """
        Processes detections for the current frame and returns the active TrackedObject list.
        """
        self.frame_count += 1

        # 1. Predict new locations of existing tracks
        predicted_boxes = []
        to_del = []
        for t, trk in enumerate(self.trackers):
            pos = trk.predict()
            if np.any(np.isnan(pos)):
                to_del.append(t)
            else:
                predicted_boxes.append(pos)

        for t in reversed(to_del):
            self.trackers.pop(t)

        # 2. Associate detections to track predictions via IoU matrix and Hungarian algorithm
        matched, unmatched_dets, unmatched_trks = self._associate_detections_to_trackers(
            detections, predicted_boxes
        )

        # 3. Update matched trackers with assigned detections
        for m in matched:
            det_idx = m[0]
            trk_idx = m[1]
            det = detections[det_idx]
            self.trackers[trk_idx].update(det.bbox, det.class_name, det.confidence)

        # 4. Create new trackers for unmatched detections
        for i in unmatched_dets:
            det = detections[i]
            trk = KalmanBoxTracker(det.bbox, det.class_name, det.confidence)
            self.trackers.append(trk)

        # 5. Filter active tracks to return and prune dead tracks
        active_tracked_objects: List[TrackedObject] = []
        i = len(self.trackers)
        for trk in reversed(self.trackers):
            d = trk.get_state()
            # Return tracks that have been updated recently and meet min_hits
            if (trk.time_since_update < 1) and (trk.hit_streak >= self.min_hits or self.frame_count <= self.min_hits):
                active_tracked_objects.append(
                    TrackedObject(
                        track_id=trk.id,
                        bbox=d,
                        class_name=trk.class_name,
                        confidence=trk.confidence,
                        age=trk.age,
                        time_since_update=trk.time_since_update,
                        hits=trk.hits
                    )
                )
            i -= 1
            # Prune dead tracks that exceeded max_age
            if trk.time_since_update > self.max_age:
                self.trackers.pop(i)

        return active_tracked_objects

    def _associate_detections_to_trackers(
        self,
        detections: List[DetectionResult],
        predicted_boxes: List[Tuple[int, int, int, int]]
    ):
        """
        Assigns detections to tracked object predictions using IoU cost matrix.
        """
        if len(self.trackers) == 0:
            return [], list(range(len(detections))), []

        iou_matrix = np.zeros((len(detections), len(predicted_boxes)), dtype=np.float32)

        for d, det in enumerate(detections):
            for t, pred_box in enumerate(predicted_boxes):
                # Enforce class consistency: never match detections with tracks of a different class
                if det.class_name == self.trackers[t].class_name:
                    iou_matrix[d, t] = calculate_iou(det.bbox, pred_box)
                else:
                    iou_matrix[d, t] = 0.0

        # Linear sum assignment (Hungarian algorithm) maximizes IoU (minimizes -IoU)
        if min(iou_matrix.shape) > 0:
            row_ind, col_ind = linear_sum_assignment(-iou_matrix)
            matched_indices = np.column_stack((row_ind, col_ind))
        else:
            matched_indices = np.empty((0, 2), dtype=int)

        unmatched_detections = []
        for d in range(len(detections)):
            if d not in matched_indices[:, 0]:
                unmatched_detections.append(d)

        unmatched_trackers = []
        for t in range(len(predicted_boxes)):
            if t not in matched_indices[:, 1]:
                unmatched_trackers.append(t)

        # Filter out matches with IoU below threshold
        matches = []
        for m in matched_indices:
            if iou_matrix[m[0], m[1]] < self.iou_threshold:
                unmatched_detections.append(m[0])
                unmatched_trackers.append(m[1])
            else:
                matches.append(m.reshape(1, 2))

        if len(matches) == 0:
            matches = np.empty((0, 2), dtype=int)
        else:
            matches = np.concatenate(matches, axis=0)

        return matches, unmatched_detections, unmatched_trackers

def get_track_color(track_id: int) -> Tuple[int, int, int]:
    """
    Generate a deterministic, aesthetically pleasing BGR color from a track_id.
    """
    np.random.seed(track_id * 17 + 42)
    # Bright saturated colors in BGR
    b = int(np.random.randint(50, 255))
    g = int(np.random.randint(50, 255))
    r = int(np.random.randint(50, 255))
    return (b, g, r)
