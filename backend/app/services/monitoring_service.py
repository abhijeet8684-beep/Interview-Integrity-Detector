"""Orchestrates browser-frame decoding, face validation, and risk responses."""

from app.config import settings
from app.models.request_models import AnalyzeRequest
from app.models.response_models import AnalyzeResponse
from app.services.risk_engine import RiskEngine
from app.services.signal_processor import SignalProcessor
from app.utils.logger import get_logger
from app.vision.face_detector import FaceDetector
from app.vision.face_validator import FaceValidator
from app.vision.frame_decoder import FrameDecodeError, decode_jpeg_frame

logger = get_logger(__name__)


class MonitoringService:
    """Analyzes browser-provided frames without accessing local camera hardware."""

    def __init__(self) -> None:
        self._face_detector = FaceDetector(settings.face_detection_confidence)
        self._face_validator = FaceValidator()
        self._signal_processor = SignalProcessor()
        self._risk_engine = RiskEngine()

    def analyze(self, request: AnalyzeRequest) -> AnalyzeResponse:
        """Decode one browser JPEG frame and return monitoring results."""
        try:
            frame = decode_jpeg_frame(request.image)
        except FrameDecodeError:
            logger.warning("Frame %s could not be decoded", request.frame_id)
            return self._create_response("Unavailable", "Waiting", "Not Available", "Not Available")

        try:
            detection = self._face_detector.detect(frame)
        except Exception:
            logger.exception("Face detection failed for frame %s", request.frame_id)
            return self._create_response("Active", "Waiting", "Not Available", "Not Available")

        face_status = self._face_status(detection.face_count)
        if detection.bounding_box is None:
            return self._create_response("Active", face_status, "Not Available", "Not Available")

        validation = self._face_validator.validate(detection.bounding_box)
        return self._create_response("Active", face_status, validation.position, validation.distance)

    def shutdown(self) -> None:
        """Release MediaPipe resources during application shutdown."""
        self._face_detector.close()

    def _create_response(
        self,
        camera: str,
        face_detection: str,
        face_position: str,
        face_distance: str,
    ) -> AnalyzeResponse:
        """Compose one compatible API response from computed monitoring states."""
        assessment = self._risk_engine.assess(face_detection)
        return AnalyzeResponse(
            risk_score=assessment.score,
            status=assessment.status,
            signals=self._signal_processor.build_signals(camera, face_detection),
            face_position=face_position,
            face_distance=face_distance,
            recommendation=assessment.recommendation,
        )

    @staticmethod
    def _face_status(face_count: int) -> str:
        """Map detected face counts to stable monitoring states."""
        if face_count == 0:
            return "No Face"
        if face_count == 1:
            return "One Face Detected"
        return "Multiple Faces"
