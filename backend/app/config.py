"""Central application configuration."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    """Static settings for the backend and browser-frame vision modules."""

    application_name: str = "Interview Integrity Detector"
    version: str = "1.0"
    allowed_origins: tuple[str, ...] = ("http://localhost:5173",)
    face_model_path: str = "models/face_detection"
    eye_tracking_model_path: str = "models/eye_tracking"
    head_pose_model_path: str = "models/head_pose"
    face_detection_confidence: float = 0.5


settings = Settings()
