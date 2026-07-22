"""HTTP endpoints exposed by the backend foundation."""

from fastapi import APIRouter
from starlette.concurrency import run_in_threadpool

from app.models.request_models import AnalyzeRequest
from app.models.response_models import AnalyzeResponse, HealthResponse, RootResponse
from app.services.monitoring_service import MonitoringService

router = APIRouter(tags=["system"])
monitoring_service = MonitoringService()


@router.get("/", response_model=RootResponse)
async def get_application_status() -> RootResponse:
    """Return basic application metadata."""
    return RootResponse(
        application="Interview Integrity Detector",
        version="1.0",
        status="Running",
    )


@router.get("/health", response_model=HealthResponse)
async def get_health() -> HealthResponse:
    """Return readiness information for the placeholder backend."""
    return HealthResponse(
        backend="Healthy",
        camera="Not Connected",
        model="Not Loaded",
        uptime="OK",
    )


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_frame(request: AnalyzeRequest) -> AnalyzeResponse:
    """Analyze one browser-provided webcam frame without changing the API schema."""
    return await run_in_threadpool(monitoring_service.analyze, request)
