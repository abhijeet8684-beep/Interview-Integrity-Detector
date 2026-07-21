"""Orchestrates local frame capture, face detection, and response construction."""

from app.config import settings
from app.models.request_models import AnalyzeRequest
from app.models.response_models import AnalyzeResponse
from app.services.risk_engine import RiskEngine
from app.services.signal_processor import SignalProcessor
from app.utils.logger import get_logger
from app.vision.camera import Camera
from app.vision.face_detector import FaceDetector

logger = get_logger(__name__)


class MonitoringService:
    """Coordinates implemented monitoring capabilities behind the API contract."""

    def __init__(self) -> None:
        self._camera = Camera(settings.camera_index)
        self._face_detector = FaceDetector(settings.face_detection_confidence)
        self._signal_processor = SignalProcessor()
        self._risk_engine = RiskEngine()

    def analyze(self, _: AnalyzeRequest) -> AnalyzeResponse:
        """Capture one local frame and return dynamic face-monitoring results."""
        frame = self._camera.read_frame()
        if frame is None:
            return self._create_response("Unavailable", "Waiting")

        try:
            face_count = self._face_detector.count_faces(frame)
        except Exception:
            logger.exception("Face detection failed for the current camera frame")
            return self._create_response("Active", "Waiting")

        return self._create_response("Active", self._face_status(face_count))

    def shutdown(self) -> None:
        """Release local vision resources cleanly."""
        self._camera.release()
        self._face_detector.close()

    def _create_response(self, camera: str, face_detection: str) -> AnalyzeResponse:
        """Compose the unchanged response model from current signal values."""
        assessment = self._risk_engine.assess(face_detection)
        return AnalyzeResponse(
            risk_score=assessment.score,
            status=assessment.status,
            signals=self._signal_processor.build_signals(camera, face_detection),
            recommendation=assessment.recommendation,
        )

    @staticmethod
    def _face_status(face_count: int) -> str:
        """Map a detected face count to the documented API signal values."""
        if face_count == 0:
            return "Face Missing"
        if face_count == 1:
            return "Detected"
        return "Multiple Faces"
