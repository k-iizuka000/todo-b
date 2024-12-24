"""
Admin API initialization module.
This module serves as the entry point for all admin-related API endpoints.
"""

from fastapi import APIRouter

# Create the admin router
admin_router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    responses={
        404: {"description": "Not found"},
        403: {"description": "Forbidden"},
        401: {"description": "Unauthorized"}
    }
)

# Import all admin-related routes
# These imports are placed here to avoid circular dependencies
from .users import router as users_router
from .prompts import router as prompts_router
from .reports import router as reports_router
from .analytics import router as analytics_router
from .settings import router as settings_router

# Include all admin sub-routers
admin_router.include_router(users_router)
admin_router.include_router(prompts_router)
admin_router.include_router(reports_router)
admin_router.include_router(analytics_router)
admin_router.include_router(settings_router)

# Export the admin router for use in the main application
__all__ = ['admin_router']