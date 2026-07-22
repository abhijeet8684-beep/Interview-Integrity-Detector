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
    face_mesh_detection_confidence: float = 0.5
    face_mesh_tracking_confidence: float = 0.5
    behavior_consecutive_frame_threshold: int = 3
    behavior_head_yaw_threshold_degrees: float = 15.0
    behavior_offscreen_gaze_risk: int = 15
    behavior_head_orientation_risk: int = 15


settings = Settings()
