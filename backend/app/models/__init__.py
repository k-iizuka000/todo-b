"""
Database models initialization file
This module initializes all database models and provides them for the application.
"""

from sqlalchemy.ext.declarative import declarative_base

# Create the base class for all models
Base = declarative_base()

# Import all models to ensure they are registered with SQLAlchemy
from .user import User
from .prompt import Prompt
from .comment import Comment
from .rating import Rating
from .tag import Tag
from .category import Category
from .notification import Notification
from .activity import Activity
from .prompt_tag import PromptTag
from .user_following import UserFollowing

# List of all models for easy access
__all__ = [
    'User',
    'Prompt',
    'Comment',
    'Rating',
    'Tag',
    'Category',
    'Notification',
    'Activity',
    'PromptTag',
    'UserFollowing',
]

def init_models():
    """
    Initialize all models and their relationships.
    This function should be called when setting up the database.
    """
    # The imports above will automatically register the models with SQLAlchemy
    return Base

# Optional: Add any model-related utility functions here
def get_model_names():
    """
    Returns a list of all model names in the application.
    
    Returns:
        list: List of model names as strings
    """
    return __all__