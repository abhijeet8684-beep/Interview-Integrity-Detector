"""Signal response construction for currently implemented monitoring modules."""

from app.models.response_models import SignalStatus


class SignalProcessor:
    """Builds API signal states while later modules remain pending."""

    def build_signals(self, camera: str, face_detection: str) -> SignalStatus:
        """Create a response preserving pending states for future detectors."""
        return SignalStatus(
            camera=camera,
            face_detection=face_detection,
            eye_tracking="Pending",
            head_pose="Pending",
            attention="Pending",
        )
