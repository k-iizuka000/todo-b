import pytest
from unittest.mock import Mock, patch
from datetime import datetime
from services.user_service import UserService
from services.prompt_service import PromptService
from services.comment_service import CommentService
from services.notification_service import NotificationService
from models.user import User
from models.prompt import Prompt
from models.comment import Comment
from exceptions.service_exceptions import ValidationError, ResourceNotFoundError

class TestUserService:
    @pytest.fixture
    def user_service(self):
        return UserService()

    @pytest.fixture
    def mock_user_data(self):
        return {
            "username": "testuser",
            "email": "test@example.com",
            "password": "SecurePass123!"
        }

    def test_create_user_success(self, user_service, mock_user_data):
        with patch('repositories.user_repository.UserRepository.create') as mock_create:
            mock_create.return_value = User(**mock_user_data)
            user = user_service.create_user(mock_user_data)
            assert user.username == mock_user_data["username"]
            assert user.email == mock_user_data["email"]

    def test_create_user_invalid_data(self, user_service):
        with pytest.raises(ValidationError):
            user_service.create_user({"username": "", "email": "invalid"})

class TestPromptService:
    @pytest.fixture
    def prompt_service(self):
        return PromptService()

    @pytest.fixture
    def mock_prompt_data(self):
        return {
            "title": "Test Prompt",
            "content": "This is a test prompt content",
            "user_id": 1,
            "category": "general",
            "tags": ["test", "example"]
        }

    def test_create_prompt_success(self, prompt_service, mock_prompt_data):
        with patch('repositories.prompt_repository.PromptRepository.create') as mock_create:
            mock_create.return_value = Prompt(**mock_prompt_data)
            prompt = prompt_service.create_prompt(mock_prompt_data)
            assert prompt.title == mock_prompt_data["title"]
            assert prompt.content == mock_prompt_data["content"]

    def test_search_prompts(self, prompt_service):
        with patch('repositories.prompt_repository.PromptRepository.search') as mock_search:
            mock_search.return_value = [
                Prompt(id=1, title="Test1", content="Content1"),
                Prompt(id=2, title="Test2", content="Content2")
            ]
            results = prompt_service.search_prompts(keyword="test")
            assert len(results) == 2

class TestCommentService:
    @pytest.fixture
    def comment_service(self):
        return CommentService()

    def test_add_comment_success(self, comment_service):
        comment_data = {
            "prompt_id": 1,
            "user_id": 1,
            "content": "Great prompt!"
        }
        with patch('repositories.comment_repository.CommentRepository.create') as mock_create:
            mock_create.return_value = Comment(**comment_data)
            comment = comment_service.add_comment(comment_data)
            assert comment.content == comment_data["content"]

class TestNotificationService:
    @pytest.fixture
    def notification_service(self):
        return NotificationService()

    def test_create_notification(self, notification_service):
        notification_data = {
            "user_id": 1,
            "type": "comment",
            "content": "New comment on your prompt",
            "reference_id": 1
        }
        with patch('repositories.notification_repository.NotificationRepository.create') as mock_create:
            result = notification_service.create_notification(**notification_data)
            assert result is not None

    def test_get_user_notifications(self, notification_service):
        with patch('repositories.notification_repository.NotificationRepository.get_by_user') as mock_get:
            mock_get.return_value = [
                {"id": 1, "content": "Notification 1"},
                {"id": 2, "content": "Notification 2"}
            ]
            notifications = notification_service.get_user_notifications(user_id=1)
            assert len(notifications) == 2

class TestRatingService:
    @pytest.fixture
    def rating_service(self):
        return RatingService()

    def test_add_rating(self, rating_service):
        rating_data = {
            "prompt_id": 1,
            "user_id": 1,
            "score": 5
        }
        with patch('repositories.rating_repository.RatingRepository.create') as mock_create:
            result = rating_service.add_rating(**rating_data)
            assert result is not None

    def test_get_prompt_average_rating(self, rating_service):
        with patch('repositories.rating_repository.RatingRepository.get_average') as mock_get:
            mock_get.return_value = 4.5
            average = rating_service.get_prompt_average_rating(prompt_id=1)
            assert average == 4.5

# ヘルパー関数のテスト
def test_validate_email():
    from services.helpers import validate_email
    assert validate_email("valid@example.com") is True
    assert validate_email("invalid.email") is False

def test_validate_password():
    from services.helpers import validate_password
    assert validate_password("SecurePass123!") is True
    assert validate_password("weak") is False