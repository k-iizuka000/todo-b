import pytest
from fastapi.testclient import TestClient
from datetime import datetime
from backend.main import app
from backend.models.comment import Comment
from backend.models.user import User
from backend.models.prompt import Prompt

client = TestClient(app)

@pytest.fixture
def test_user():
    return {
        "id": "test_user_id",
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword123"
    }

@pytest.fixture
def test_prompt():
    return {
        "id": "test_prompt_id",
        "title": "Test Prompt",
        "content": "This is a test prompt content",
        "user_id": "test_user_id",
        "created_at": datetime.now().isoformat()
    }

@pytest.fixture
def test_comment():
    return {
        "id": "test_comment_id",
        "content": "This is a test comment",
        "prompt_id": "test_prompt_id",
        "user_id": "test_user_id",
        "created_at": datetime.now().isoformat()
    }

class TestCommentAPI:
    def test_create_comment(self, test_user, test_prompt, client):
        # ログイン状態をモック
        client.headers = {"Authorization": f"Bearer test_token"}
        
        comment_data = {
            "content": "New test comment",
            "prompt_id": test_prompt["id"]
        }
        
        response = client.post("/api/comments/", json=comment_data)
        assert response.status_code == 201
        
        data = response.json()
        assert data["content"] == comment_data["content"]
        assert data["prompt_id"] == comment_data["prompt_id"]
        assert "id" in data
        assert "created_at" in data

    def test_get_comment(self, test_comment, client):
        response = client.get(f"/api/comments/{test_comment['id']}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == test_comment["id"]
        assert data["content"] == test_comment["content"]

    def test_get_prompt_comments(self, test_prompt, test_comment, client):
        response = client.get(f"/api/prompts/{test_prompt['id']}/comments")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        assert data[0]["prompt_id"] == test_prompt["id"]

    def test_update_comment(self, test_comment, client):
        # ログイン状態をモック
        client.headers = {"Authorization": f"Bearer test_token"}
        
        update_data = {
            "content": "Updated comment content"
        }
        
        response = client.put(
            f"/api/comments/{test_comment['id']}", 
            json=update_data
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["content"] == update_data["content"]
        assert data["id"] == test_comment["id"]

    def test_delete_comment(self, test_comment, client):
        # ログイン状態をモック
        client.headers = {"Authorization": f"Bearer test_token"}
        
        response = client.delete(f"/api/comments/{test_comment['id']}")
        assert response.status_code == 204

    def test_create_comment_unauthorized(self, test_prompt, client):
        comment_data = {
            "content": "New test comment",
            "prompt_id": test_prompt["id"]
        }
        
        response = client.post("/api/comments/", json=comment_data)
        assert response.status_code == 401

    def test_create_comment_invalid_prompt(self, client):
        # ログイン状態をモック
        client.headers = {"Authorization": f"Bearer test_token"}
        
        comment_data = {
            "content": "New test comment",
            "prompt_id": "invalid_prompt_id"
        }
        
        response = client.post("/api/comments/", json=comment_data)
        assert response.status_code == 404

    def test_update_comment_not_owner(self, test_comment, client):
        # 異なるユーザーでログイン状態をモック
        client.headers = {"Authorization": f"Bearer different_user_token"}
        
        update_data = {
            "content": "Updated comment content"
        }
        
        response = client.put(
            f"/api/comments/{test_comment['id']}", 
            json=update_data
        )
        assert response.status_code == 403