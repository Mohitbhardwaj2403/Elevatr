"""
Interview endpoints.
POST /interview/generate-questions
POST /interview/analyze-answer
GET  /interview/history
GET  /interview/{session_id}
"""

import uuid
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.interview import (
    AnalyzeAnswerRequest,
    AnswerFeedback,
    GenerateQuestionsRequest,
    GenerateQuestionsResponse,
    InterviewHistoryItem,
    InterviewSessionOut,
)
from app.services.interview_service import (
    analyze_answer,
    generate_questions,
    get_interview_history,
    get_session,
)

router = APIRouter(prefix="/interview", tags=["Mock Interview"])


@router.post(
    "/generate-questions",
    response_model=GenerateQuestionsResponse,
    summary="Generate AI interview questions for a role",
)
async def gen_questions(
    payload: GenerateQuestionsRequest,
    current_user: User = Depends(get_current_user),
):
    return await generate_questions(current_user.id, payload)


@router.post(
    "/analyze-answer",
    summary="Submit an answer and get AI feedback",
)
async def analyze(
    payload: AnalyzeAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    session, feedback = await analyze_answer(db, current_user.id, payload)
    return {
        "session": InterviewSessionOut.model_validate(session),
        "feedback": feedback,
    }


@router.get(
    "/history",
    response_model=List[InterviewHistoryItem],
    summary="Get user's interview session history",
)
async def history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_interview_history(db, current_user.id)


@router.get(
    "/{session_id}",
    response_model=InterviewSessionOut,
    summary="Get a specific interview session",
)
async def get_one(
    session_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_session(db, session_id, current_user.id)
