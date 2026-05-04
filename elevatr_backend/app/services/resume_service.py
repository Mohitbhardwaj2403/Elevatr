"""
Resume service.
Handles CRUD operations and AI-powered resume improvement.
"""

import json
import logging
import uuid
from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.openai_client import chat_completion
from app.ai.prompts import ATS_SCORE_SYSTEM, RESUME_IMPROVE_SYSTEM
from app.core.config import settings
from app.core.exceptions import raise_forbidden, raise_not_found
from app.database.redis_client import cache_get, cache_set, cache_delete, make_cache_key
from app.models.ai_conversation import AIConversation
from app.models.resume import Resume
from app.schemas.resume import (
    ATSScoreRequest,
    ATSScoreResponse,
    ATSSuggestion,
    ResumeCreateRequest,
    ResumeImproveRequest,
    ResumeUpdateRequest,
)

logger = logging.getLogger(__name__)


async def create_resume(
    db: AsyncSession, user_id: uuid.UUID, payload: ResumeCreateRequest
) -> Resume:
    """Create a resume and optionally run ATS scoring if job_description provided."""
    resume = Resume(
        user_id=user_id,
        title=payload.title,
        resume_text=payload.resume_text,
        template=payload.template,
        job_description=payload.job_description,
    )

    if payload.job_description:
        score_data = await _run_ats_analysis(payload.resume_text, payload.job_description)
        _apply_ats_data(resume, score_data)

    db.add(resume)
    await db.flush()
    logger.info("Created resume id=%s user=%s", resume.id, user_id)
    return resume


async def get_resume(db: AsyncSession, resume_id: uuid.UUID, user_id: uuid.UUID) -> Resume:
    resume = await db.scalar(select(Resume).where(Resume.id == resume_id))
    if not resume:
        raise_not_found("Resume not found.")
    if resume.user_id != user_id:
        raise_forbidden("You do not own this resume.")
    return resume


async def list_resumes(db: AsyncSession, user_id: uuid.UUID) -> List[Resume]:
    result = await db.execute(
        select(Resume).where(Resume.user_id == user_id).order_by(Resume.created_at.desc())
    )
    return list(result.scalars().all())


async def update_resume(
    db: AsyncSession,
    resume_id: uuid.UUID,
    user_id: uuid.UUID,
    payload: ResumeUpdateRequest,
) -> Resume:
    resume = await get_resume(db, resume_id, user_id)
    if payload.title is not None:
        resume.title = payload.title
    if payload.resume_text is not None:
        resume.resume_text = payload.resume_text
        resume.version += 1
    if payload.job_description is not None:
        resume.job_description = payload.job_description
    if payload.template is not None:
        resume.template = payload.template

    # Invalidate cache
    await cache_delete(make_cache_key("resume", str(resume_id)))
    await db.flush()
    return resume


async def delete_resume(
    db: AsyncSession, resume_id: uuid.UUID, user_id: uuid.UUID
) -> None:
    resume = await get_resume(db, resume_id, user_id)
    await db.delete(resume)
    await cache_delete(make_cache_key("resume", str(resume_id)))
    logger.info("Deleted resume id=%s user=%s", resume_id, user_id)


async def improve_resume(
    db: AsyncSession, user_id: uuid.UUID, payload: ResumeImproveRequest
) -> Resume:
    """Use AI to improve resume content and store the result."""
    resume = await get_resume(db, payload.resume_id, user_id)

    focus_note = ""
    if payload.focus_areas:
        focus_note = f"\nFocus areas requested by user: {', '.join(payload.focus_areas)}"

    user_msg = f"RESUME CONTENT:\n{resume.resume_text[:settings.MAX_RESUME_SIZE_CHARS]}{focus_note}"
    raw, tokens = await chat_completion(
        system_prompt=RESUME_IMPROVE_SYSTEM,
        user_message=user_msg,
        response_format="json",
        temperature=0.5,
    )

    try:
        data = json.loads(raw)
        resume.improved_text = data.get("improved_text", raw)
        resume.suggestions = data.get("tips", [])
    except (json.JSONDecodeError, AttributeError):
        resume.improved_text = raw

    # Persist AI conversation
    convo = AIConversation(
        user_id=user_id,
        conversation_type="resume_improvement",
        user_message=f"Improve resume: {resume.title}",
        ai_response=raw[:5000],
        tokens_used=tokens,
        model=settings.OPENAI_MODEL,
    )
    db.add(convo)
    await db.flush()
    logger.info("Improved resume id=%s user=%s tokens=%s", resume.id, user_id, tokens)
    return resume


async def score_ats(
    db: AsyncSession, user_id: uuid.UUID, payload: ATSScoreRequest
) -> ATSScoreResponse:
    """Run ATS analysis and return structured score response."""
    # Cache keyed on content hash to avoid duplicate AI calls
    cache_key = make_cache_key("ats", payload.resume_text[:500], payload.job_description[:300])
    cached = await cache_get(cache_key)
    if cached:
        logger.debug("ATS cache hit for user=%s", user_id)
        return ATSScoreResponse(**cached)

    data = await _run_ats_analysis(payload.resume_text, payload.job_description)
    response = _build_ats_response(data)

    await cache_set(cache_key, response.model_dump(), ttl=600)

    # Store conversation
    convo = AIConversation(
        user_id=user_id,
        conversation_type="ats_analysis",
        user_message=f"ATS check – resume snippet: {payload.resume_text[:200]}",
        ai_response=json.dumps(data)[:5000],
        model=settings.OPENAI_MODEL,
    )
    db.add(convo)
    await db.flush()
    return response


# ─── Internal helpers ────────────────────────────────────────────

async def _run_ats_analysis(resume_text: str, job_description: str) -> dict:
    """Call AI and return parsed JSON dict."""
    user_msg = (
        f"JOB DESCRIPTION:\n{job_description[:3000]}\n\n"
        f"RESUME:\n{resume_text[:settings.MAX_RESUME_SIZE_CHARS]}"
    )
    raw, _ = await chat_completion(
        system_prompt=ATS_SCORE_SYSTEM,
        user_message=user_msg,
        response_format="json",
        temperature=0.2,
    )
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        logger.warning("Failed to parse ATS JSON response – using defaults.")
        return {}


def _apply_ats_data(resume: Resume, data: dict) -> None:
    resume.ats_score = float(data.get("score", 0))
    resume.suggestions = [
        s.get("message", "") for s in data.get("suggestions", []) if isinstance(s, dict)
    ]
    resume.keywords_found = data.get("keywords_found", [])
    resume.keywords_missing = data.get("keywords_missing", [])
    resume.strengths = data.get("strengths", [])


def _build_ats_response(data: dict) -> ATSScoreResponse:
    score = float(data.get("score", 0))
    grade = data.get("grade", _score_to_grade(score))
    return ATSScoreResponse(
        score=score,
        grade=grade,
        message=data.get("message", "Analysis complete."),
        keywords_found=data.get("keywords_found", []),
        keywords_missing=data.get("keywords_missing", []),
        strengths=data.get("strengths", []),
        suggestions=[
            ATSSuggestion(**s) for s in data.get("suggestions", []) if isinstance(s, dict)
        ],
        section_scores=data.get("section_scores", {}),
    )


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
