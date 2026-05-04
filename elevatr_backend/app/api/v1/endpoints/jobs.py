"""
Job Application tracker endpoints.
POST   /jobs/add
GET    /jobs/list
GET    /jobs/stats
PUT    /jobs/{id}
DELETE /jobs/{id}
"""

import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.job_application import (
    JobAddRequest,
    JobOut,
    JobStatsResponse,
    JobUpdateRequest,
)
from app.services.job_service import (
    add_job,
    delete_job,
    get_job_stats,
    list_jobs,
    update_job,
)

router = APIRouter(prefix="/jobs", tags=["Job Tracker"])


@router.post(
    "/add",
    response_model=JobOut,
    status_code=status.HTTP_201_CREATED,
    summary="Add a new job application",
)
async def add(
    payload: JobAddRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await add_job(db, current_user.id, payload)


@router.get(
    "/list",
    response_model=List[JobOut],
    summary="List all job applications (filterable by status)",
)
async def list_all(
    status: Optional[str] = Query(None, description="Filter by status"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await list_jobs(db, current_user.id, status_filter=status)


@router.get(
    "/stats",
    response_model=JobStatsResponse,
    summary="Get job application statistics",
)
async def stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_job_stats(db, current_user.id)


@router.put(
    "/{job_id}",
    response_model=JobOut,
    summary="Update a job application",
)
async def update(
    job_id: uuid.UUID,
    payload: JobUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await update_job(db, job_id, current_user.id, payload)


@router.delete(
    "/{job_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a job application",
)
async def delete(
    job_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await delete_job(db, job_id, current_user.id)
