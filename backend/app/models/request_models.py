"""Pydantic request models for the API."""

from datetime import datetime

from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    """Browser frame metadata and JPEG image content for one analysis request."""

    frame_id: int = Field(..., ge=0, description="Client-generated frame identifier")
    timestamp: datetime = Field(..., description="ISO 8601 client timestamp")
    image: str = Field(..., min_length=1, description="Base64-encoded JPEG frame")
