"""
Schema initialization module for the PromptHub application.
This module exports all schema classes used throughout the application.
"""

from .user import UserCreate, UserUpdate, UserResponse, UserInDB
from .prompt import PromptCreate, PromptUpdate, PromptResponse, PromptInDB
from .comment import CommentCreate, CommentUpdate, CommentResponse
from .rating import RatingCreate, RatingResponse
from .notification import NotificationCreate, NotificationResponse
from .tag import TagCreate, TagResponse
from .category import CategoryCreate, CategoryResponse
from .profile import ProfileUpdate, ProfileResponse
from .token import Token, TokenData
from .base import BaseModel, BaseResponse

# Export all schemas for easy access
__all__ = [
    # User related schemas
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "UserInDB",
    
    # Prompt related schemas
    "PromptCreate",
    "PromptUpdate",
    "PromptResponse",
    "PromptInDB",
    
    # Comment related schemas
    "CommentCreate",
    "CommentUpdate",
    "CommentResponse",
    
    # Rating related schemas
    "RatingCreate",
    "RatingResponse",
    
    # Notification related schemas
    "NotificationCreate",
    "NotificationResponse",
    
    # Tag related schemas
    "TagCreate",
    "TagResponse",
    
    # Category related schemas
    "CategoryCreate",
    "CategoryResponse",
    
    # Profile related schemas
    "ProfileUpdate",
    "ProfileResponse",
    
    # Authentication related schemas
    "Token",
    "TokenData",
    
    # Base schemas
    "BaseModel",
    "BaseResponse"
]