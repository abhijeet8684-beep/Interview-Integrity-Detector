"""Independent MediaPipe Face Mesh behavior-analysis service."""

from collections import deque
from dataclasses import dataclass
from threading import Lock

import cv2
import mediapipe as mp
import numpy as np

from app.config import settings
from app.vision.gaze_estimator import GazeEstimator
from app.vision.head_pose import HeadPose, HeadPoseEstimator


@dataclass(frozen=True)
class BehaviorObservation:
    """Behavior data appended to the existing monitoring response."""

    gaze_direction: str
    head_pose: HeadPose
    alerts: list[str]
    risk_contribution: int

    @classmethod
    def unavailable(cls) -> "BehaviorObservation":
        """Return stable data when behavior cannot be evaluated."""
        return cls("NOT_AVAILABLE", HeadPose(None, None, None), [], 0)


class BehaviorAnalyzer:
    """Combines Face Mesh gaze, head pose, and consecutive-frame history."""

    def __init__(self) -> None:
        self._face_mesh = mp.solutions.face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, refine_landmarks=True, min_detection_confidence=settings.face_mesh_detection_confidence, min_tracking_confidence=settings.face_mesh_tracking_confidence)
        self._gaze_estimator = GazeEstimator()
        self._head_pose_estimator = HeadPoseEstimator()
        self._history = deque(maxlen=settings.behavior_consecutive_frame_threshold)
        self._lock = Lock()

    def analyze(self, frame: np.ndarray) -> BehaviorObservation:
        """Analyze one BGR frame and update consecutive-frame behavior history."""
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        with self._lock:
            mesh_result = self._face_mesh.process(rgb_frame)
        if not mesh_result.multi_face_landmarks:
            self.reset()
            return BehaviorObservation.unavailable()

        landmarks = mesh_result.multi_face_landmarks[0].landmark
        gaze = self._gaze_estimator.estimate(landmarks)
        pose = self._head_pose_estimator.estimate(landmarks, frame.shape[1], frame.shape[0])
        self._history.append((gaze.direction, pose.yaw))
        alerts, risk = self._evaluate_history(gaze.direction, pose.yaw)
        return BehaviorObservation(gaze.direction, pose, alerts, risk)

    def reset(self) -> None:
        """Clear behavior history when the current frame does not contain one face."""
        with self._lock:
            self._history.clear()

    def close(self) -> None:
        """Release Face Mesh resources during application shutdown."""
        self._face_mesh.close()

    def _evaluate_history(self, gaze_direction: str, yaw: float | None) -> tuple[list[str], int]:
        """Generate behavior alerts after configured repeated observations."""
        required = settings.behavior_consecutive_frame_threshold
        if len(self._history) < required:
            return [], 0
        gazes = [gaze for gaze, _ in self._history]
        yaws = [value for _, value in self._history]
        alerts: list[str] = []
        risk = 0
        if gaze_direction in {"LEFT", "RIGHT", "UP", "DOWN"} and all(gaze == gaze_direction for gaze in gazes):
            alerts.append("Prolonged Off-Screen Gaze")
            risk += settings.behavior_offscreen_gaze_risk
        if yaw is not None and all(value is not None and abs(value) > settings.behavior_head_yaw_threshold_degrees for value in yaws):
            alerts.append("Persistent Head Orientation")
            risk += settings.behavior_head_orientation_risk
        return alerts, risk
