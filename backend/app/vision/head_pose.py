"""Head-pose estimation from MediaPipe landmarks using OpenCV solvePnP."""

from dataclasses import dataclass
from math import atan2, degrees, sqrt
from typing import Protocol, Sequence

import cv2
import numpy as np


class Landmark(Protocol):
    """Minimal MediaPipe landmark interface used by the pose estimator."""

    x: float
    y: float


@dataclass(frozen=True)
class HeadPose:
    """Head orientation in degrees using yaw, pitch, and roll axes."""

    yaw: float | None
    pitch: float | None
    roll: float | None


class HeadPoseEstimator:
    """Uses six stable face landmarks and OpenCV solvePnP for coarse pose."""

    _LANDMARK_INDICES = (1, 152, 33, 263, 61, 291)
    _MODEL_POINTS = np.array([(0.0, 0.0, 0.0), (0.0, -330.0, -65.0), (-225.0, 170.0, -135.0), (225.0, 170.0, -135.0), (-150.0, -150.0, -125.0), (150.0, -150.0, -125.0)], dtype=np.float64)

    def estimate(self, landmarks: Sequence[Landmark], frame_width: int, frame_height: int) -> HeadPose:
        """Estimate Euler angles from 2D landmarks and a canonical 3D face model."""
        try:
            image_points = np.array([(landmarks[index].x * frame_width, landmarks[index].y * frame_height) for index in self._LANDMARK_INDICES], dtype=np.float64)
        except IndexError:
            return HeadPose(yaw=None, pitch=None, roll=None)

        focal_length = float(frame_width)
        camera_matrix = np.array([[focal_length, 0.0, frame_width / 2], [0.0, focal_length, frame_height / 2], [0.0, 0.0, 1.0]], dtype=np.float64)
        success, rotation_vector, _ = cv2.solvePnP(self._MODEL_POINTS, image_points, camera_matrix, np.zeros((4, 1), dtype=np.float64), flags=cv2.SOLVEPNP_ITERATIVE)
        if not success:
            return HeadPose(yaw=None, pitch=None, roll=None)

        rotation_matrix, _ = cv2.Rodrigues(rotation_vector)
        pitch, yaw, roll = self._euler_angles(rotation_matrix)
        return HeadPose(yaw=round(yaw, 2), pitch=round(pitch, 2), roll=round(roll, 2))

    @staticmethod
    def _euler_angles(rotation_matrix: np.ndarray) -> tuple[float, float, float]:
        """Convert a rotation matrix to pitch, yaw, and roll angles in degrees."""
        singularity = sqrt(rotation_matrix[0, 0] ** 2 + rotation_matrix[1, 0] ** 2)
        if singularity < 1e-6:
            pitch = atan2(-rotation_matrix[1, 2], rotation_matrix[1, 1])
            yaw = atan2(-rotation_matrix[2, 0], singularity)
            roll = 0.0
        else:
            pitch = atan2(rotation_matrix[2, 1], rotation_matrix[2, 2])
            yaw = atan2(-rotation_matrix[2, 0], singularity)
            roll = atan2(rotation_matrix[1, 0], rotation_matrix[0, 0])
        return degrees(pitch), degrees(yaw), degrees(roll)
