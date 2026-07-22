"""Gaze-direction estimation from MediaPipe Face Mesh iris landmarks."""

from dataclasses import dataclass
from typing import Protocol, Sequence


class Landmark(Protocol):
    """Minimal MediaPipe landmark interface used by the estimator."""

    x: float
    y: float


@dataclass(frozen=True)
class GazeEstimate:
    """A coarse screen-relative gaze direction."""

    direction: str


class GazeEstimator:
    """Estimates gaze using iris position within the visible eye regions."""

    _LEFT_EYE_CORNERS = (33, 133)
    _RIGHT_EYE_CORNERS = (362, 263)
    _LEFT_EYE_LIDS = (159, 145)
    _RIGHT_EYE_LIDS = (386, 374)
    _LEFT_IRIS_CENTER = 468
    _RIGHT_IRIS_CENTER = 473

    def estimate(self, landmarks: Sequence[Landmark]) -> GazeEstimate:
        """Classify iris displacement as CENTER, LEFT, RIGHT, UP, or DOWN."""
        try:
            horizontal = self._axis_position(landmarks, self._LEFT_IRIS_CENTER, self._LEFT_EYE_CORNERS, "x")
            horizontal += self._axis_position(landmarks, self._RIGHT_IRIS_CENTER, self._RIGHT_EYE_CORNERS, "x")
            vertical = self._axis_position(landmarks, self._LEFT_IRIS_CENTER, self._LEFT_EYE_LIDS, "y")
            vertical += self._axis_position(landmarks, self._RIGHT_IRIS_CENTER, self._RIGHT_EYE_LIDS, "y")
        except (IndexError, ZeroDivisionError):
            return GazeEstimate(direction="NOT_AVAILABLE")

        if horizontal / 2 < 0.35:
            return GazeEstimate(direction="LEFT")
        if horizontal / 2 > 0.65:
            return GazeEstimate(direction="RIGHT")
        if vertical / 2 < 0.35:
            return GazeEstimate(direction="UP")
        if vertical / 2 > 0.65:
            return GazeEstimate(direction="DOWN")
        return GazeEstimate(direction="CENTER")

    @staticmethod
    def _axis_position(landmarks: Sequence[Landmark], iris_index: int, boundaries: tuple[int, int], axis: str) -> float:
        """Normalize an iris coordinate within two eye-boundary landmarks."""
        iris = getattr(landmarks[iris_index], axis)
        first = getattr(landmarks[boundaries[0]], axis)
        second = getattr(landmarks[boundaries[1]], axis)
        lower, upper = sorted((first, second))
        return (iris - lower) / (upper - lower)
