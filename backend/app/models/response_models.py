"""Pydantic response models for the API."""

from pydantic import BaseModel


class RootResponse(BaseModel):
    """Application metadata returned by the root endpoint."""

    application: str
    version: str
    status: str


class HealthResponse(BaseModel):
    """Health information returned by the health endpoint."""

    backend: str
    camera: str
    model: str
    uptime: str


class SignalStatus(BaseModel):
    """Current and future monitoring signal states."""

    camera: str
    face_detection: str
    eye_tracking: str
    head_pose: str
    attention: str


class HeadPoseResponse(BaseModel):
    """Euler angles estimated from MediaPipe Face Mesh landmarks."""

    yaw: float | None
    pitch: float | None
    roll: float | None


class BehaviorResponse(BaseModel):
    """Supplementary behavior observations for one analyzed frame."""

    gaze_direction: str
    head_pose: HeadPoseResponse
    behavior_alerts: list[str]
    behavior_risk: int


class AnalyzeResponse(BaseModel):
    """Monitoring response returned for one browser-provided frame."""

    risk_score: int
    status: str
    signals: SignalStatus
    face_position: str
    face_distance: str
    behavior: BehaviorResponse
    recommendation: str
