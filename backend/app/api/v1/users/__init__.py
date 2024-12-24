"""
User API initialization module.
This module serves as the entry point for the users API endpoints.
It provides the necessary imports and configurations for user-related operations.
"""

from fastapi import APIRouter
from .routes import (
    auth,
    profile,
    settings,
    activity
)

# Create the main users router
users_router = APIRouter()

# Include all user-related routes
users_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["authentication"]
)

users_router.include_router(
    profile.router,
    prefix="/profile",
    tags=["profile"]
)

users_router.include_router(
    settings.router,
    prefix="/settings",
    tags=["settings"]
)

users_router.include_router(
    activity.router,
    prefix="/activity",
    tags=["activity"]
)

# Export the router for use in the main application
__all__ = ["users_router"]