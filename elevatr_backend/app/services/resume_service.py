"""
Resume service.
Handles CRUD operations and AI-powered resume improvement.
"""

import json
import logging
import uuid
from typing import List
import re

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.openai_client import chat_completion
from app.ai.prompts import RESUME_IMPROVE_SYSTEM
from app.core.config import settings
from app.core.exceptions import raise_forbidden, raise_not_found
from app.database.redis_client import cache_get, cache_set, cache_delete, make_cache_key
from app.models.ai_conversation import AIConversation
from app.models.resume import Resume
from app.schemas.resume import ATSScoreRequest, ATSScoreResponse, ResumeCreateRequest, ResumeImproveRequest, ResumeUpdateRequest

logger = logging.getLogger(__name__)

ATS_DATASET = {
    "software_engineer": {
        "keywords": ["python", "java", "react", "node", "sql", "api", "docker"],
        "sections": ["skills", "experience", "projects", "education"],
    },
    "data_scientist": {
        "keywords": ["python", "pandas", "numpy", "machine learning", "tensorflow", "statistics"],
        "sections": ["skills", "projects", "experience", "education"],
    },
}


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
    """Run deterministic ATS analysis and return structured score response."""
    cache_key = make_cache_key(
        "ats-dataset",
        payload.resume_text[:500],
        payload.job_description[:300],
        (payload.job_role or "")[:100],
    )
    cached = await cache_get(cache_key)
    if cached:
        logger.debug("ATS cache hit for user=%s", user_id)
        return ATSScoreResponse(**cached)

    response = _dataset_ats_score(
        resume_text=payload.resume_text,
        job_description=payload.job_description,
        job_role=payload.job_role,
    )

    await cache_set(cache_key, response.model_dump(), ttl=600)

    # Store conversation
    convo = AIConversation(
        user_id=user_id,
        conversation_type="ats_analysis",
        user_message=f"ATS check – resume snippet: {payload.resume_text[:200]}",
        ai_response=json.dumps(response.model_dump())[:5000],
        model="dataset-rules-v1",
    )
    db.add(convo)
    await db.flush()
    return response


async def score_ats_public(payload: ATSScoreRequest) -> ATSScoreResponse:
    """Run ATS analysis without authentication/session persistence."""
    response = _dataset_ats_score(
        resume_text=payload.resume_text,
        job_description=payload.job_description,
        job_role=payload.job_role,
    )
    return response


# ─── Internal helpers ────────────────────────────────────────────

def _dataset_ats_score(resume_text: str, job_description: str, job_role: str | None) -> ATSScoreResponse:
    text = (resume_text or "").strip()
    text_l = text.lower()
    words = re.findall(r"\b\w+\b", text_l)
    word_count = len(words)

    if word_count < 50:
        return ATSScoreResponse(
            score=10,
            mode="dataset",
            is_resume=False,
            feedback=["No readable content found in uploaded file"],
        )

    base_sections = ["skills", "experience", "education", "projects"]
    found_base_sections = [section for section in base_sections if re.search(rf"\b{re.escape(section)}\b", text_l)]
    if len(found_base_sections) < 2:
        return ATSScoreResponse(
            score=20,
            mode="dataset",
            is_resume=False,
            feedback=["Uploaded file is not a valid resume"],
        )

    role_key = (job_role or "").strip().lower().replace(" ", "_")
    if role_key not in ATS_DATASET:
        role_key = _infer_role_from_text(job_description) or "software_engineer"

    role_data = ATS_DATASET.get(role_key, ATS_DATASET["software_engineer"])
    role_keywords = role_data["keywords"]
    role_sections = role_data["sections"]

    matched_keywords = [kw for kw in role_keywords if kw.lower() in text_l]
    missing_keywords = [kw for kw in role_keywords if kw.lower() not in text_l]
    keyword_match_percentage = round((len(matched_keywords) / max(len(role_keywords), 1)) * 100)

    sections_found = [section for section in role_sections if re.search(rf"\b{re.escape(section)}\b", text_l)]
    missing_sections = [section for section in role_sections if section not in sections_found]
    section_score = round((len(sections_found) / max(len(role_sections), 1)) * 100)

    content_quality_score, content_feedback = _content_quality(text)
    formatting_score, formatting_feedback = _formatting_quality(text)

    final_score = round(
        (keyword_match_percentage * 0.4)
        + (section_score * 0.2)
        + (content_quality_score * 0.2)
        + (formatting_score * 0.2)
    )

    # Resume unrelated to role: has resume structure but poor role keyword relevance.
    if keyword_match_percentage < 15:
        final_score = max(30, final_score - 15)

    feedback = []
    feedback.extend(content_feedback)
    feedback.extend(formatting_feedback)
    if missing_keywords:
        feedback.append(f"Missing role keywords: {', '.join(missing_keywords)}")
    if missing_sections:
        feedback.append(f"Missing sections: {', '.join(missing_sections)}")

    return ATSScoreResponse(
        score=max(0, min(100, int(final_score))),
        mode="dataset",
        is_resume=True,
        keyword_match=keyword_match_percentage,
        matched_keywords=matched_keywords,
        missing_keywords=missing_keywords,
        sections_found=sections_found,
        missing_sections=missing_sections,
        content_quality_score=content_quality_score,
        formatting_score=formatting_score,
        feedback=feedback[:8],
    )


def _apply_ats_data(resume: Resume, data: dict) -> None:
    resume.ats_score = float(data.get("score", 0))
    resume.suggestions = [
        s.get("message", "") for s in data.get("suggestions", []) if isinstance(s, dict)
    ]
    resume.keywords_found = data.get("keywords_found", [])
    resume.keywords_missing = data.get("keywords_missing", [])
    resume.strengths = data.get("strengths", [])


def _infer_role_from_text(job_description: str) -> str | None:
    jd = (job_description or "").lower()
    if "data scientist" in jd or any(k in jd for k in ["pandas", "numpy", "tensorflow", "machine learning"]):
        return "data_scientist"
    if "software engineer" in jd or any(k in jd for k in ["react", "node", "docker", "api", "java"]):
        return "software_engineer"
    return None


def _content_quality(text: str) -> tuple[int, list[str]]:
    text_l = text.lower()
    score = 0
    feedback: list[str] = []

    bullet_count = len(re.findall(r"(?m)^\s*[-•]\s+", text))
    action_verbs = ["developed", "built", "designed", "implemented"]
    verb_hits = sum(1 for verb in action_verbs if re.search(rf"\b{verb}\b", text_l))
    measurable_hits = len(re.findall(r"\b\d+%|\b\d+\+|\b\d+\b", text_l))

    if bullet_count >= 4:
        score += 35
    elif bullet_count >= 1:
        score += 20
        feedback.append("Use more bullet points for readability.")
    else:
        feedback.append("Add bullet points for key achievements.")

    if verb_hits >= 3:
        score += 35
    elif verb_hits >= 1:
        score += 20
        feedback.append("Use more action verbs like developed/built/designed/implemented.")
    else:
        feedback.append("Missing strong action verbs in experience descriptions.")

    if measurable_hits >= 3:
        score += 30
    elif measurable_hits >= 1:
        score += 15
        feedback.append("Add more measurable outcomes (metrics, percentages, counts).")
    else:
        feedback.append("No measurable results detected.")

    return max(0, min(100, score)), feedback


def _formatting_quality(text: str) -> tuple[int, list[str]]:
    text_l = text.lower()
    lines = [ln for ln in text.splitlines() if ln.strip()]
    score = 0
    feedback: list[str] = []

    sections = ["skills", "experience", "projects", "education"]
    section_hits = sum(1 for section in sections if re.search(rf"\b{section}\b", text_l))
    if section_hits >= 3:
        score += 40
    elif section_hits >= 2:
        score += 25
        feedback.append("Add clearer section headings.")
    else:
        feedback.append("Resume structure appears weak or inconsistent.")

    if len(lines) >= 12:
        score += 35
    elif len(lines) >= 6:
        score += 20
        feedback.append("Use clearer line breaks/paragraphs.")
    else:
        feedback.append("Formatting is too compact; add structured line breaks.")

    avg_line_len = sum(len(ln) for ln in lines) / max(len(lines), 1)
    if avg_line_len <= 120:
        score += 25
    else:
        score += 15
        feedback.append("Long lines reduce readability; keep sections concise.")

    return max(0, min(100, score)), feedback
