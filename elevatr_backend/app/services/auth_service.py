"""
Authentication service.
Handles user registration, login, and profile management.
"""

import logging
import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import raise_conflict, raise_not_found, raise_unauthorized
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.auth import LoginRequest, ProfileUpdateRequest, RegisterRequest

logger = logging.getLogger(__name__)


async def register_user(db: AsyncSession, payload: RegisterRequest) -> User:
    """Create a new user. Raises 409 if email already exists."""
    existing = await db.scalar(select(User).where(User.email == payload.email.lower()))
    if existing:
        raise_conflict("An account with this email already exists.")

    user = User(
        name=payload.name,
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
        plan="free",
    )
    db.add(user)
    await db.flush()   # get the generated id
    logger.info("Registered new user id=%s email=%s", user.id, user.email)
    return user


async def login_user(db: AsyncSession, payload: LoginRequest) -> tuple[User, str]:
    """
    Authenticate user credentials.

    Returns
    -------
    (user, access_token)
    """
    user = await db.scalar(select(User).where(User.email == payload.email.lower()))
    if not user or not verify_password(payload.password, user.password_hash):
        raise_unauthorized("Invalid email or password.")

    if not user.is_active:
        raise_unauthorized("Account is deactivated. Please contact support.")

    token = create_access_token(subject=str(user.id))
    logger.info("User logged in id=%s", user.id)
    return user, token


async def get_user_by_id(db: AsyncSession, user_id: uuid.UUID) -> User:
    user = await db.scalar(select(User).where(User.id == user_id))
    if not user:
        raise_not_found("User not found.")
    return user


async def update_profile(
    db: AsyncSession, user_id: uuid.UUID, payload: ProfileUpdateRequest
) -> User:
    user = await get_user_by_id(db, user_id)
    if payload.name is not None:
        user.name = payload.name
    if payload.bio is not None:
        user.bio = payload.bio
    if payload.avatar_url is not None:
        user.avatar_url = payload.avatar_url
    await db.flush()
    return user
