"""FastAPI application entry point for the Interview Integrity Detector."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from time import perf_counter

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import RequestResponseEndpoint

from app.api.routes import router
from app.api.routes import monitoring_service
from app.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    """Manage application lifecycle logging."""
    logger.info("%s v%s startup complete", settings.application_name, settings.version)
    yield
    monitoring_service.shutdown()
    logger.info("%s shutdown complete", settings.application_name)


app = FastAPI(
    title=settings.application_name,
    version=settings.version,
    description="Scalable backend foundation for interview integrity monitoring.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.allowed_origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(
    request: Request,
    call_next: RequestResponseEndpoint,
) -> Response:
    """Log incoming requests, completed responses, and unexpected errors."""
    started_at = perf_counter()
    logger.info("Incoming request: %s %s", request.method, request.url.path)

    try:
        response = await call_next(request)
    except Exception:
        logger.exception("Unhandled error while processing %s %s", request.method, request.url.path)
        raise

    elapsed_ms = (perf_counter() - started_at) * 1000
    logger.info(
        "Completed request: %s %s -> %s in %.2fms",
        request.method,
        request.url.path,
        response.status_code,
        elapsed_ms,
    )
    return response


app.include_router(router)
