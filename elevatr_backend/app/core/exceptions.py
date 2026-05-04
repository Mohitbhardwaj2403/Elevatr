"""
Domain exceptions and FastAPI HTTP error helpers.
"""

from fastapi import HTTPException, status


class ElevatrException(Exception):
    """Base domain exception."""
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class NotFoundError(ElevatrException):
    pass


class ConflictError(ElevatrException):
    pass


class AuthError(ElevatrException):
    pass


# ─── FastAPI helpers ─────────────────────────────────────────────

def raise_not_found(detail: str = "Resource not found") -> None:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


def raise_conflict(detail: str = "Resource already exists") -> None:
    raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=detail)


def raise_unauthorized(detail: str = "Authentication required") -> None:
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


def raise_bad_request(detail: str = "Bad request") -> None:
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)


def raise_forbidden(detail: str = "Forbidden") -> None:
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=detail)
