"""
Comments API initialization module.
This module serves as the entry point for the comments API endpoints.
"""

from fastapi import APIRouter

# Create the comments router
comments_router = APIRouter()

# Import all routes after router creation to avoid circular imports
from .routes import *  # noqa: F403, E402

# Export the router for use in the main application
__all__ = ['comments_router']