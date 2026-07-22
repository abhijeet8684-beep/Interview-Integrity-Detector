"""MediaPipe face-detection adapter."""

from dataclasses import dataclass
from threading import Lock

import cv2
import mediapipe as mp
import numpy as np


@dataclass(frozen=True)
class FaceBoundingBox:
    """A normalized bounding box reported by MediaPipe."""

    x: float
    y: float
    width: float
    height: float


@dataclass(frozen=True)
class FaceDetectionResult:
    """Face-count result and the primary face box when exactly one face exists."""

    face_count: int
    bounding_box: FaceBoundingBox | None


class FaceDetector:
    """Runs Google MediaPipe Face Detection on OpenCV BGR frames."""

    def __init__(self, minimum_detection_confidence: float) -> None:
        self._detector = mp.solutions.face_detection.FaceDetection(
            model_selection=0,
            min_detection_confidence=minimum_detection_confidence,
        )
        self._lock = Lock()

    def detect(self, frame: np.ndarray) -> FaceDetectionResult:
        """Return face count and normalized box data from one BGR frame."""
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        with self._lock:
            results = self._detector.process(rgb_frame)

        detections = results.detections or []
        if len(detections) != 1:
            return FaceDetectionResult(face_count=len(detections), bounding_box=None)

        box = detections[0].location_data.relative_bounding_box
        return FaceDetectionResult(
            face_count=1,
            bounding_box=FaceBoundingBox(
                x=float(box.xmin),
                y=float(box.ymin),
                width=float(box.width),
                height=float(box.height),
            ),
        )

    def close(self) -> None:
        """Release MediaPipe resources during application shutdown."""
        self._detector.close()
