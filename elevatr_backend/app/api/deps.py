"""
Shared FastAPI dependencies.
"""

import uuid

from fastapi import Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import raise_unauthorized
from app.core.security import decode_access_token
from app.database.session import get_db
from app.models.user import User
from app.services.auth_service import get_user_by_id


async def get_current_user(
    authorization: str = Header(..., description="Bearer <token>"),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Dependency that validates the JWT and returns the current User.
    Usage: user: User = Depends(get_current_user)
    """
    if not authorization.startswith("Bearer "):
        raise_unauthorized("Invalid Authorization header format. Use: Bearer <token>")

    token = authorization.split(" ", 1)[1]
    user_id_str = decode_access_token(token)
    if not user_id_str:
        raise_unauthorized("Invalid or expired token.")

    try:
        user_id = uuid.UUID(user_id_str)
    except ValueError:
        raise_unauthorized("Malformed token payload.")

    user = await get_user_by_id(db, user_id)
    if not user.is_active:
        raise_unauthorized("Account deactivated.")
    return user
