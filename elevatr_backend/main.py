"""
Elevatr – AI Resume Builder & Job Preparation Tool
FastAPI Backend – Production Entry Point
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.api.v1.router import api_router
from app.core.config import parse_cors_origins, settings
from app.core.logging import setup_logging
from app.database.session import create_tables

# ─────────────────────────── logging ────────────────────────────
setup_logging()
logger = logging.getLogger(__name__)


# ─────────────────────────── lifespan ───────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    logger.info("🚀  Elevatr backend starting up …")

    try:
        await create_tables()
        logger.info("✅ Database tables ready.")
    except Exception as e:
        logger.error(f"❌ DB connection failed: {e}")

    yield

    logger.info("🛑  Elevatr backend shutting down.")


# ─────────────────────────── app ────────────────────────────────
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-powered resume builder, ATS scorer, mock interviews & career guidance.",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# ─────────────────────────── middleware ─────────────────────────
cors_origins = parse_cors_origins(getattr(settings, "CORS_ORIGINS", None))

print("CORS ORIGINS:", cors_origins)

if not cors_origins:
    cors_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://elevatr-jet.vercel.app",
    ]

if "*" in cors_origins:
    logger.warning("CORS_ORIGINS contains '*' while credentials are enabled; removing wildcard.")
    cors_origins = [origin for origin in cors_origins if origin != "*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if settings.ENVIRONMENT == "production":
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.ALLOWED_HOSTS)

# ─────────────────────────── routes ─────────────────────────────
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": settings.PROJECT_NAME, "version": settings.VERSION}


@app.get(f"{settings.API_V1_PREFIX}/health", tags=["Health"])
async def versioned_health_check():
    return {"status": "ok", "service": settings.PROJECT_NAME, "version": settings.VERSION}
