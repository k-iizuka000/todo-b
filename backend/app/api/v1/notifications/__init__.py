"""
Notifications API module initialization.
This module handles all notification-related operations including:
- User activity notifications
- Comment notifications
- Rating notifications
- System notifications
"""

from fastapi import APIRouter

# Create router instance for notifications
notifications_router = APIRouter()

# Import notification-related routes and handlers
from .routes import *

# Define API tags metadata
tags_metadata = [
    {
        "name": "notifications",
        "description": "Operations with user notifications including creation, retrieval, and management.",
    }
]

__all__ = [
    'notifications_router',
]
