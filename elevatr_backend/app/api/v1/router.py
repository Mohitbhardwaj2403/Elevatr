"""API v1 router – registers all feature routers."""

from fastapi import APIRouter

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.resume import router as resume_router
from app.api.v1.endpoints.interview import router as interview_router
from app.api.v1.endpoints.jobs import router as jobs_router
from app.api.v1.endpoints.ai import router as ai_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(resume_router)
api_router.include_router(interview_router)
api_router.include_router(jobs_router)
api_router.include_router(ai_router)
