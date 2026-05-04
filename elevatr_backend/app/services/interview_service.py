"""
Interview service.
Generates questions and evaluates answers using AI.
"""

import json
import logging
import uuid
from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.openai_client import chat_completion
from app.ai.prompts import ANSWER_ANALYSIS_SYSTEM, INTERVIEW_QUESTIONS_SYSTEM
from app.core.config import settings
from app.core.exceptions import raise_forbidden, raise_not_found
from app.database.redis_client import cache_get, cache_set, make_cache_key
from app.models.ai_conversation import AIConversation
from app.models.interview_session import InterviewSession
from app.schemas.interview import (
    AnalyzeAnswerRequest,
    AnswerFeedback,
    GenerateQuestionsRequest,
    GenerateQuestionsResponse,
)

logger = logging.getLogger(__name__)


async def generate_questions(
    user_id: uuid.UUID, payload: GenerateQuestionsRequest
) -> GenerateQuestionsResponse:
    """Generate interview questions (cached by role + difficulty + count)."""
    cache_key = make_cache_key(
        "iq", payload.job_role, payload.difficulty, str(payload.num_questions)
    )
    cached = await cache_get(cache_key)
    if cached:
        return GenerateQuestionsResponse(**cached)

    focus = ""
    if payload.focus_areas:
        focus = f"\nFocus on: {', '.join(payload.focus_areas)}."

    user_msg = (
        f"Role: {payload.job_role}\n"
        f"Difficulty: {payload.difficulty}\n"
        f"Number of questions: {payload.num_questions}{focus}\n\n"
        "Generate exactly the requested number of interview questions."
    )
    raw, _ = await chat_completion(
        system_prompt=INTERVIEW_QUESTIONS_SYSTEM,
        user_message=user_msg,
        response_format="json",
        temperature=0.8,
    )

    try:
        data = json.loads(raw)
        questions: List[str] = data.get("questions", [raw])
    except json.JSONDecodeError:
        questions = [raw]

    result = GenerateQuestionsResponse(
        job_role=payload.job_role,
        difficulty=payload.difficulty,
        questions=questions[: payload.num_questions],
    )
    await cache_set(cache_key, result.model_dump(), ttl=3600)
    return result


async def analyze_answer(
    db: AsyncSession,
    user_id: uuid.UUID,
    payload: AnalyzeAnswerRequest,
) -> tuple[InterviewSession, AnswerFeedback]:
    """Evaluate a candidate's answer and persist the session."""
    user_msg = (
        f"Job Role: {payload.job_role}\n"
        f"Difficulty: {payload.difficulty}\n"
        f"Question: {payload.question}\n"
        f"Candidate's Answer: {payload.answer}"
    )
    raw, tokens = await chat_completion(
        system_prompt=ANSWER_ANALYSIS_SYSTEM,
        user_message=user_msg,
        response_format="json",
        temperature=0.3,
    )

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        data = {}

    score = float(data.get("score", data.get("score_value", 0)))
    grade = data.get("grade", _score_to_grade(score))
    feedback_text = data.get("feedback", "")
    strengths = data.get("strengths", data.get("strengths_list", []))
    improvements = data.get("improvements", [])
    hint = data.get("model_answer_hint", "")

    # Persist or update session
    if payload.session_id:
        session = await db.scalar(
            select(InterviewSession).where(InterviewSession.id == payload.session_id)
        )
        if not session:
            raise_not_found("Interview session not found.")
        if session.user_id != user_id:
            raise_forbidden()
    else:
        session = InterviewSession(
            user_id=user_id,
            job_role=payload.job_role,
            difficulty=payload.difficulty,
            question=payload.question,
        )
        db.add(session)

    session.answer = payload.answer
    session.feedback = feedback_text
    session.score = score
    session.strengths = strengths
    session.improvements = improvements
    session.status = "evaluated"

    # Store AI conversation
    convo = AIConversation(
        user_id=user_id,
        conversation_type="interview_feedback",
        user_message=f"Q: {payload.question}\nA: {payload.answer[:500]}",
        ai_response=raw[:5000],
        tokens_used=tokens,
        model=settings.OPENAI_MODEL,
    )
    db.add(convo)
    await db.flush()

    feedback = AnswerFeedback(
        score=score,
        grade=grade,
        feedback=feedback_text,
        strengths=strengths,
        improvements=improvements,
        model_answer_hint=hint,
    )
    return session, feedback


async def get_interview_history(
    db: AsyncSession, user_id: uuid.UUID
) -> List[InterviewSession]:
    result = await db.execute(
        select(InterviewSession)
        .where(InterviewSession.user_id == user_id)
        .order_by(InterviewSession.created_at.desc())
        .limit(100)
    )
    return list(result.scalars().all())


async def get_session(
    db: AsyncSession, session_id: uuid.UUID, user_id: uuid.UUID
) -> InterviewSession:
    session = await db.scalar(
        select(InterviewSession).where(InterviewSession.id == session_id)
    )
    if not session:
        raise_not_found("Interview session not found.")
    if session.user_id != user_id:
        raise_forbidden()
    return session


def _score_to_grade(score: float) -> str:
    if score >= 90:
        return "A"
    if score >= 80:
        return "B"
    if score >= 70:
        return "C"
    if score >= 60:
        return "D"
    return "F"
