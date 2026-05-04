"""
Resume endpoints.
POST   /resume/create
POST   /resume/improve
POST   /resume/ats-score
GET    /resume/             – list all resumes
GET    /resume/{id}
PUT    /resume/{id}
DELETE /resume/{id}
"""

import uuid
from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.resume import (
    ATSScoreRequest,
    ATSScoreResponse,
    ResumeCreateRequest,
    ResumeImproveRequest,
    ResumeListItem,
    ResumeOut,
    ResumeUpdateRequest,
)
from app.services.resume_service import (
    create_resume,
    delete_resume,
    get_resume,
    improve_resume,
    list_resumes,
    score_ats,
    update_resume,
)

router = APIRouter(prefix="/resume", tags=["Resume"])


@router.post(
    "/create",
    response_model=ResumeOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create / upload a resume (AI ATS scoring if job_description provided)",
)
async def create(
    payload: ResumeCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await create_resume(db, current_user.id, payload)


@router.post(
    "/improve",
    response_model=ResumeOut,
    summary="AI-improve an existing resume",
)
async def improve(
    payload: ResumeImproveRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await improve_resume(db, current_user.id, payload)


@router.post(
    "/ats-score",
    response_model=ATSScoreResponse,
    summary="Score a resume against a job description",
)
async def ats_score(
    payload: ATSScoreRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await score_ats(db, current_user.id, payload)


@router.get(
    "/",
    response_model=List[ResumeListItem],
    summary="List all resumes for the current user",
)
async def list_all(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await list_resumes(db, current_user.id)


@router.get(
    "/{resume_id}",
    response_model=ResumeOut,
    summary="Get a single resume by ID",
)
async def get_one(
    resume_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_resume(db, resume_id, current_user.id)


@router.put(
    "/{resume_id}",
    response_model=ResumeOut,
    summary="Update a resume",
)
async def update(
    resume_id: uuid.UUID,
    payload: ResumeUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await update_resume(db, resume_id, current_user.id, payload)


@router.delete(
    "/{resume_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a resume",
)
async def delete(
    resume_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await delete_resume(db, resume_id, current_user.id)
