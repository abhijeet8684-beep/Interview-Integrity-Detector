"""Pydantic request models for the API."""

from datetime import datetime

from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    """Metadata for a future frame analysis request.

    The current backend does not accept or process image content.
    """

    frame_id: int = Field(..., ge=0, description="Client-generated frame identifier")
    timestamp: datetime = Field(..., description="ISO 8601 client timestamp")
