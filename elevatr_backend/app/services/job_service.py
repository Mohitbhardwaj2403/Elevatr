"""
Job Application tracker service.
"""

import logging
import uuid
from typing import List

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import raise_forbidden, raise_not_found
from app.models.job_application import JobApplication
from app.schemas.job_application import JobAddRequest, JobStatsResponse, JobUpdateRequest

logger = logging.getLogger(__name__)


async def add_job(
    db: AsyncSession, user_id: uuid.UUID, payload: JobAddRequest
) -> JobApplication:
    job = JobApplication(
        user_id=user_id,
        company=payload.company,
        role=payload.role,
        status=payload.status,
        job_url=payload.job_url,
        notes=payload.notes,
        salary_range=payload.salary_range,
        location=payload.location,
        applied_at=payload.applied_at,
        follow_up_at=payload.follow_up_at,
    )
    db.add(job)
    await db.flush()
    logger.info("Added job application id=%s user=%s company=%s", job.id, user_id, job.company)
    return job


async def list_jobs(
    db: AsyncSession,
    user_id: uuid.UUID,
    status_filter: str | None = None,
) -> List[JobApplication]:
    query = select(JobApplication).where(JobApplication.user_id == user_id)
    if status_filter:
        query = query.where(JobApplication.status == status_filter)
    query = query.order_by(JobApplication.created_at.desc())
    result = await db.execute(query)
    return list(result.scalars().all())


async def get_job(
    db: AsyncSession, job_id: uuid.UUID, user_id: uuid.UUID
) -> JobApplication:
    job = await db.scalar(select(JobApplication).where(JobApplication.id == job_id))
    if not job:
        raise_not_found("Job application not found.")
    if job.user_id != user_id:
        raise_forbidden()
    return job


async def update_job(
    db: AsyncSession,
    job_id: uuid.UUID,
    user_id: uuid.UUID,
    payload: JobUpdateRequest,
) -> JobApplication:
    job = await get_job(db, job_id, user_id)
    update_fields = payload.model_dump(exclude_none=True)
    for field, value in update_fields.items():
        setattr(job, field, value)
    await db.flush()
    return job


async def delete_job(
    db: AsyncSession, job_id: uuid.UUID, user_id: uuid.UUID
) -> None:
    job = await get_job(db, job_id, user_id)
    await db.delete(job)
    logger.info("Deleted job application id=%s user=%s", job_id, user_id)


async def get_job_stats(db: AsyncSession, user_id: uuid.UUID) -> JobStatsResponse:
    result = await db.execute(
        select(JobApplication.status, func.count(JobApplication.id))
        .where(JobApplication.user_id == user_id)
        .group_by(JobApplication.status)
    )
    rows = result.all()
    by_status = {row[0]: row[1] for row in rows}
    total = sum(by_status.values())
    return JobStatsResponse(total=total, by_status=by_status)
