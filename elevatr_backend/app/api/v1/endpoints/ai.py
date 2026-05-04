"""
AI career guidance endpoint.
POST /ai/career-advice
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.ai import CareerAdviceRequest, CareerAdviceResponse
from app.services.ai_service import get_career_advice

router = APIRouter(prefix="/ai", tags=["AI Career Guidance"])


@router.post(
    "/career-advice",
    response_model=CareerAdviceResponse,
    summary="Get personalised AI career guidance",
)
async def career_advice(
    payload: CareerAdviceRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_career_advice(db, current_user.id, payload)
