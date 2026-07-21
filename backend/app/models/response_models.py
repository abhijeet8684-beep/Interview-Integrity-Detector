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
    """Placeholder monitoring signal states."""

    camera: str
    face_detection: str
    eye_tracking: str
    head_pose: str
    attention: str


class AnalyzeResponse(BaseModel):
    """Mock response schema for future analysis endpoint integration."""

    risk_score: int
    status: str
    signals: SignalStatus
    recommendation: str
