"""Orchestrates browser-frame decoding, face detection, and response construction."""

from app.config import settings
from app.models.request_models import AnalyzeRequest
from app.models.response_models import AnalyzeResponse
from app.services.risk_engine import RiskEngine
from app.services.signal_processor import SignalProcessor
from app.utils.logger import get_logger
from app.vision.face_detector import FaceDetector
from app.vision.frame_decoder import FrameDecodeError, decode_jpeg_frame

logger = get_logger(__name__)


class MonitoringService:
    """Analyzes browser-provided frames without accessing local camera hardware."""

    def __init__(self) -> None:
        self._face_detector = FaceDetector(settings.face_detection_confidence)
        self._signal_processor = SignalProcessor()
        self._risk_engine = RiskEngine()

    def analyze(self, request: AnalyzeRequest) -> AnalyzeResponse:
        """Decode one browser JPEG frame and return dynamic face-monitoring results."""
        try:
            frame = decode_jpeg_frame(request.image)
        except FrameDecodeError:
            logger.warning("Frame %s could not be decoded", request.frame_id)
            return self._create_response("Unavailable", "Waiting")

        try:
            face_count = self._face_detector.count_faces(frame)
        except Exception:
            logger.exception("Face detection failed for frame %s", request.frame_id)
            return self._create_response("Active", "Waiting")

        return self._create_response("Active", self._face_status(face_count))

    def shutdown(self) -> None:
        """Release MediaPipe resources during application shutdown."""
        self._face_detector.close()

    def _create_response(self, camera: str, face_detection: str) -> AnalyzeResponse:
        """Compose the unchanged response model from current signal values."""
        assessment = self._risk_engine.assess(face_detection)
        return AnalyzeResponse(risk_score=assessment.score, status=assessment.status, signals=self._signal_processor.build_signals(camera, face_detection), recommendation=assessment.recommendation)

    @staticmethod
    def _face_status(face_count: int) -> str:
        """Map detected face counts to stable, readable monitoring states."""
        if face_count == 0:
            return "No Face"
        if face_count == 1:
            return "One Face Detected"
        return "Multiple Faces"
