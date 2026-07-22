"""Face position and distance validation using MediaPipe bounding boxes."""

from dataclasses import dataclass

from app.vision.face_detector import FaceBoundingBox


@dataclass(frozen=True)
class FaceValidation:
    """Human-readable framing guidance for one detected face."""

    position: str
    distance: str


class FaceValidator:
    """Derives framing guidance from normalized face-box geometry only."""

    def validate(self, box: FaceBoundingBox) -> FaceValidation:
        """Evaluate face placement and apparent distance in the camera frame."""
        center_x = box.x + box.width / 2
        center_y = box.y + box.height / 2
        area = box.width * box.height

        position = self._position(center_x, center_y)
        distance = self._distance(area)
        return FaceValidation(position=position, distance=distance)

    @staticmethod
    def _position(center_x: float, center_y: float) -> str:
        """Map face-centre position to concise candidate guidance."""
        if center_x < 0.38:
            return "Move Slightly Right"
        if center_x > 0.62:
            return "Move Slightly Left"
        if center_y < 0.35:
            return "Move Slightly Down"
        if center_y > 0.65:
            return "Move Slightly Up"
        return "Centered"

    @staticmethod
    def _distance(area: float) -> str:
        """Use normalized face-box area as an apparent distance heuristic."""
        if area < 0.08:
            return "Move Closer to Camera"
        if area > 0.35:
            return "Move Slightly Back"
        return "Normal Distance"
