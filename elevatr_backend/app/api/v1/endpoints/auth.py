"""
Authentication endpoints.
POST /auth/register
POST /auth/login
GET  /auth/profile
PUT  /auth/profile
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    ProfileUpdateRequest,
    RegisterRequest,
    RegisterResponse,
    TokenResponse,
    UserOut,
)
from app.services.auth_service import login_user, register_user, update_profile

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
)
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_db)):
    user = await register_user(db, payload)
    return user


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login and receive JWT access token",
)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    user, token = await login_user(db, payload)
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.get(
    "/profile",
    response_model=UserOut,
    summary="Get current user profile",
)
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put(
    "/profile",
    response_model=UserOut,
    summary="Update current user profile",
)
async def update_user_profile(
    payload: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    user = await update_profile(db, current_user.id, payload)
    return user
