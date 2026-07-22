"""Orchestrates existing face monitoring and independent behavior analysis."""

from app.config import settings
from app.models.request_models import AnalyzeRequest
from app.models.response_models import AnalyzeResponse, BehaviorResponse, HeadPoseResponse
from app.services.behavior_analyzer import BehaviorAnalyzer, BehaviorObservation
from app.services.risk_engine import RiskEngine
from app.services.signal_processor import SignalProcessor
from app.utils.logger import get_logger
from app.vision.face_detector import FaceDetector
from app.vision.face_validator import FaceValidator
from app.vision.frame_decoder import FrameDecodeError, decode_jpeg_frame

logger = get_logger(__name__)


class MonitoringService:
    """Runs face detection and behavior analysis on each browser-provided frame."""

    def __init__(self) -> None:
        self._face_detector = FaceDetector(settings.face_detection_confidence)
        self._face_validator = FaceValidator()
        self._behavior_analyzer = BehaviorAnalyzer()
        self._signal_processor = SignalProcessor()
        self._risk_engine = RiskEngine()

    def analyze(self, request: AnalyzeRequest) -> AnalyzeResponse:
        """Combine unchanged face signals with supplementary behavior observations."""
        try:
            frame = decode_jpeg_frame(request.image)
        except FrameDecodeError:
            logger.warning("Frame %s could not be decoded", request.frame_id)
            self._behavior_analyzer.reset()
            return self._create_response("Unavailable", "Waiting", "Not Available", "Not Available", BehaviorObservation.unavailable())

        try:
            detection = self._face_detector.detect(frame)
        except Exception:
            logger.exception("Face detection failed for frame %s", request.frame_id)
            self._behavior_analyzer.reset()
            return self._create_response("Active", "Waiting", "Not Available", "Not Available", BehaviorObservation.unavailable())

        face_status = self._face_status(detection.face_count)
        if detection.bounding_box is None:
            self._behavior_analyzer.reset()
            return self._create_response("Active", face_status, "Not Available", "Not Available", BehaviorObservation.unavailable())

        validation = self._face_validator.validate(detection.bounding_box)
        try:
            behavior = self._behavior_analyzer.analyze(frame)
        except Exception:
            logger.exception("Behavior analysis failed for frame %s", request.frame_id)
            behavior = BehaviorObservation.unavailable()
        return self._create_response("Active", face_status, validation.position, validation.distance, behavior)

    def shutdown(self) -> None:
        """Release the existing face detector and independent Face Mesh resources."""
        self._face_detector.close()
        self._behavior_analyzer.close()

    def _create_response(self, camera: str, face_detection: str, face_position: str, face_distance: str, behavior: BehaviorObservation) -> AnalyzeResponse:
        """Append behavior fields while preserving the established response fields."""
        base_assessment = self._risk_engine.assess(face_detection)
        assessment = self._risk_engine.add_behavior_risk(base_assessment, behavior.risk_contribution)
        return AnalyzeResponse(
            risk_score=assessment.score,
            status=assessment.status,
            signals=self._signal_processor.build_signals(camera, face_detection),
            face_position=face_position,
            face_distance=face_distance,
            behavior=BehaviorResponse(
                gaze_direction=behavior.gaze_direction,
                head_pose=HeadPoseResponse(yaw=behavior.head_pose.yaw, pitch=behavior.head_pose.pitch, roll=behavior.head_pose.roll),
                behavior_alerts=behavior.alerts,
                behavior_risk=behavior.risk_contribution,
            ),
            recommendation=assessment.recommendation,
        )

    @staticmethod
    def _face_status(face_count: int) -> str:
        """Map detected face counts to the existing monitoring states."""
        if face_count == 0:
            return "No Face"
        if face_count == 1:
            return "One Face Detected"
        return "Multiple Faces"
