"""MediaPipe face-detection adapter."""

from threading import Lock

import cv2
import mediapipe as mp
import numpy as np


class FaceDetector:
    """Counts faces in OpenCV BGR frames using Google MediaPipe Face Detection."""

    def __init__(self, minimum_detection_confidence: float) -> None:
        self._detector = mp.solutions.face_detection.FaceDetection(
            model_selection=0,
            min_detection_confidence=minimum_detection_confidence,
        )
        self._lock = Lock()

    def count_faces(self, frame: np.ndarray) -> int:
        """Return the number of faces detected in one BGR webcam frame."""
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        with self._lock:
            results = self._detector.process(rgb_frame)
        return len(results.detections or [])

    def close(self) -> None:
        """Release MediaPipe resources during application shutdown."""
        self._detector.close()
