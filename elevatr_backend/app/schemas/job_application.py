"""Job Application tracker schemas."""

import uuid
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field, HttpUrl

JOB_STATUS = Literal[
    "applied", "screening", "interview", "offer", "rejected", "accepted", "withdrawn"
]


class JobAddRequest(BaseModel):
    company: str = Field(..., min_length=1, max_length=200)
    role: str = Field(..., min_length=1, max_length=200)
    status: JOB_STATUS = "applied"
    job_url: Optional[str] = Field(None, max_length=500)
    notes: Optional[str] = Field(None, max_length=2000)
    salary_range: Optional[str] = Field(None, max_length=100)
    location: Optional[str] = Field(None, max_length=200)
    applied_at: Optional[datetime] = None
    follow_up_at: Optional[datetime] = None


class JobUpdateRequest(BaseModel):
    company: Optional[str] = Field(None, max_length=200)
    role: Optional[str] = Field(None, max_length=200)
    status: Optional[JOB_STATUS] = None
    job_url: Optional[str] = None
    notes: Optional[str] = None
    salary_range: Optional[str] = None
    location: Optional[str] = None
    applied_at: Optional[datetime] = None
    follow_up_at: Optional[datetime] = None


class JobOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    company: str
    role: str
    status: str
    job_url: Optional[str]
    notes: Optional[str]
    salary_range: Optional[str]
    location: Optional[str]
    applied_at: Optional[datetime]
    follow_up_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class JobStatsResponse(BaseModel):
    total: int
    by_status: dict[str, int]
