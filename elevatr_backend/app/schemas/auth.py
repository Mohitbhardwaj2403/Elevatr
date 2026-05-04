"""Auth request/response schemas."""

import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, examples=["Jane Doe"])
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)

    @field_validator("name")
    @classmethod
    def name_no_extra_spaces(cls, v: str) -> str:
        return " ".join(v.split())


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


class UserOut(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    plan: str
    avatar_url: str | None
    bio: str | None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class RegisterResponse(BaseModel):
    id: uuid.UUID
    email: str
    name: str

    model_config = {"from_attributes": True}


class ProfileUpdateRequest(BaseModel):
    name: str | None = Field(None, min_length=2, max_length=100)
    bio: str | None = Field(None, max_length=500)
    avatar_url: str | None = Field(None, max_length=500)
