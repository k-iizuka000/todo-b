"""
Utility functions initialization file for the PromptHub platform.
This module provides common utility functions used across the application.
"""

from typing import Any, Dict, List, Optional, Union
import datetime
import json
import uuid
import re

# Re-export commonly used utility functions
from .string_utils import sanitize_text, truncate_text
from .validation_utils import validate_email, validate_password
from .security_utils import generate_hash, verify_hash
from .date_utils import format_datetime, get_current_timestamp
from .file_utils import save_file, delete_file, get_file_extension
from .notification_utils import send_notification
from .search_utils import normalize_search_query

# Version of the utils package
__version__ = '1.0.0'

# Common utility functions that might be needed across the application
def generate_unique_id() -> str:
    """Generate a unique identifier using UUID4."""
    return str(uuid.uuid4())

def format_response(
    success: bool,
    message: str,
    data: Optional[Union[Dict, List, Any]] = None
) -> Dict:
    """
    Format a standard API response.
    
    Args:
        success (bool): Indicates if the operation was successful
        message (str): Response message
        data (Optional[Union[Dict, List, Any]]): Response data
    
    Returns:
        Dict: Formatted response dictionary
    """
    return {
        "success": success,
        "message": message,
        "data": data,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

def parse_json_safely(json_str: str) -> Dict:
    """
    Safely parse JSON string to dictionary.
    
    Args:
        json_str (str): JSON string to parse
    
    Returns:
        Dict: Parsed dictionary or empty dict if parsing fails
    """
    try:
        return json.loads(json_str)
    except (json.JSONDecodeError, TypeError):
        return {}

# Initialize default configurations
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100
ALLOWED_FILE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf'}
DEFAULT_LANGUAGE = 'en'

# Export all the utility functions that should be available when importing from this package
__all__ = [
    'generate_unique_id',
    'format_response',
    'parse_json_safely',
    'sanitize_text',
    'truncate_text',
    'validate_email',
    'validate_password',
    'generate_hash',
    'verify_hash',
    'format_datetime',
    'get_current_timestamp',
    'save_file',
    'delete_file',
    'get_file_extension',
    'send_notification',
    'normalize_search_query'
]