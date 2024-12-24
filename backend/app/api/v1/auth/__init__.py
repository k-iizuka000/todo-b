"""
Authentication API initialization module.
This module initializes the authentication related routes and components.
"""

from flask import Blueprint

# Create Blueprint for authentication routes
auth = Blueprint('auth', __name__)

# Import route handlers after Blueprint creation to avoid circular imports
from . import routes
from . import jwt_handlers
from . import oauth_handlers

# Initialize authentication related configurations
def init_auth(app):
    """
    Initialize authentication related configurations for the application.
    
    Args:
        app: Flask application instance
    """
    # Register the auth blueprint with the application
    app.register_blueprint(auth, url_prefix='/api/v1/auth')
    
    # Initialize JWT configuration
    jwt_handlers.init_jwt(app)
    
    # Initialize OAuth providers if configured
    oauth_handlers.init_oauth(app)

# Export the necessary components
__all__ = ['auth', 'init_auth']