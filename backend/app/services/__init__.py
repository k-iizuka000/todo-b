"""
Services layer initialization file.
This module provides the initialization for all service-related modules in the application.
"""

from .auth_service import AuthService
from .prompt_service import PromptService
from .comment_service import CommentService
from .notification_service import NotificationService
from .user_service import UserService
from .rating_service import RatingService
from .share_service import ShareService
from .admin_service import AdminService
from .search_service import SearchService
from .export_service import ExportService

# Define version
__version__ = '1.0.0'

# Export all service classes for easy access
__all__ = [
    'AuthService',
    'PromptService',
    'CommentService',
    'NotificationService',
    'UserService',
    'RatingService',
    'ShareService',
    'AdminService',
    'SearchService',
    'ExportService'
]

# Service layer configuration
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100
CACHE_TIMEOUT = 3600  # 1 hour in seconds

# Initialize service configurations
service_config = {
    'enable_caching': True,
    'enable_logging': True,
    'default_language': 'en',
    'supported_languages': ['en', 'ja', 'es', 'fr'],
    'max_prompt_length': 5000,
    'max_comment_length': 1000,
    'max_file_size': 5 * 1024 * 1024  # 5MB
}

def get_service_config():
    """
    Returns the current service configuration.
    
    Returns:
        dict: The service configuration dictionary
    """
    return service_config

def configure_services(config):
    """
    Configure the service layer with custom settings.
    
    Args:
        config (dict): Configuration dictionary to update service settings
        
    Returns:
        dict: Updated service configuration
    """
    global service_config
    service_config.update(config)
    return service_config

def init_services():
    """
    Initialize all services with required dependencies and configurations.
    This function should be called during application startup.
    
    Returns:
        bool: True if initialization is successful, False otherwise
    """
    try:
        # Initialize service dependencies here
        return True
    except Exception as e:
        print(f"Failed to initialize services: {str(e)}")
        return False