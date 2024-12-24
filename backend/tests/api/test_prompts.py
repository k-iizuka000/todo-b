import pytest
from fastapi.testclient import TestClient
from datetime import datetime
from backend.main import app
from backend.models.prompt import Prompt
from backend.models.user import User
from backend.database import get_db

client = TestClient(app)

@pytest.fixture
def test_user():
    return {
        "email": "test@example.com",
        "password": "testpassword123",
        "username": "testuser"
    }

@pytest.fixture
def test_prompt():
    return {
        "title": "Test Prompt",
        "content": "This is a test prompt content",
        "category": "general",
        "tags": ["test", "example"],
        "is_public": True
    }

class TestPromptEndpoints:
    def test_create_prompt(self, test_user, test_prompt):
        # ユーザー登録
        response = client.post("/api/users/register", json=test_user)
        assert response.status_code == 201
        
        # ログイン
        login_data = {
            "email": test_user["email"],
            "password": test_user["password"]
        }
        response = client.post("/api/auth/login", json=login_data)
        assert response.status_code == 200
        token = response.json()["access_token"]
        
        # プロンプト作成
        headers = {"Authorization": f"Bearer {token}"}
        response = client.post("/api/prompts/", json=test_prompt, headers=headers)
        assert response.status_code == 201
        created_prompt = response.json()
        assert created_prompt["title"] == test_prompt["title"]
        assert created_prompt["content"] == test_prompt["content"]

    def test_get_prompt(self, test_user, test_prompt):
        # プロンプト作成のセットアップ
        response = client.post("/api/users/register", json=test_user)
        login_response = client.post("/api/auth/login", 
                                   json={"email": test_user["email"], 
                                        "password": test_user["password"]})
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        create_response = client.post("/api/prompts/", 
                                    json=test_prompt, 
                                    headers=headers)
        prompt_id = create_response.json()["id"]

        # プロンプト取得テスト
        response = client.get(f"/api/prompts/{prompt_id}")
        assert response.status_code == 200
        prompt = response.json()
        assert prompt["title"] == test_prompt["title"]

    def test_update_prompt(self, test_user, test_prompt):
        # セットアップ
        client.post("/api/users/register", json=test_user)
        login_response = client.post("/api/auth/login", 
                                   json={"email": test_user["email"], 
                                        "password": test_user["password"]})
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        create_response = client.post("/api/prompts/", 
                                    json=test_prompt, 
                                    headers=headers)
        prompt_id = create_response.json()["id"]

        # プロンプト更新
        updated_data = {
            "title": "Updated Title",
            "content": "Updated content",
            "category": "updated",
            "tags": ["updated", "test"],
            "is_public": True
        }
        response = client.put(f"/api/prompts/{prompt_id}", 
                            json=updated_data, 
                            headers=headers)
        assert response.status_code == 200
        updated_prompt = response.json()
        assert updated_prompt["title"] == updated_data["title"]

    def test_delete_prompt(self, test_user, test_prompt):
        # セットアップ
        client.post("/api/users/register", json=test_user)
        login_response = client.post("/api/auth/login", 
                                   json={"email": test_user["email"], 
                                        "password": test_user["password"]})
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        create_response = client.post("/api/prompts/", 
                                    json=test_prompt, 
                                    headers=headers)
        prompt_id = create_response.json()["id"]

        # プロンプト削除
        response = client.delete(f"/api/prompts/{prompt_id}", headers=headers)
        assert response.status_code == 204

    def test_search_prompts(self, test_user, test_prompt):
        # セットアップ
        client.post("/api/users/register", json=test_user)
        login_response = client.post("/api/auth/login", 
                                   json={"email": test_user["email"], 
                                        "password": test_user["password"]})
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        client.post("/api/prompts/", json=test_prompt, headers=headers)

        # プロンプト検索
        response = client.get("/api/prompts/search?q=test")
        assert response.status_code == 200
        results = response.json()
        assert len(results) > 0
        assert results[0]["title"] == test_prompt["title"]

    def test_like_prompt(self, test_user, test_prompt):
        # セットアップ
        client.post("/api/users/register", json=test_user)
        login_response = client.post("/api/auth/login", 
                                   json={"email": test_user["email"], 
                                        "password": test_user["password"]})
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        create_response = client.post("/api/prompts/", 
                                    json=test_prompt, 
                                    headers=headers)
        prompt_id = create_response.json()["id"]

        # いいね機能のテスト
        response = client.post(f"/api/prompts/{prompt_id}/like", headers=headers)
        assert response.status_code == 200
        liked_prompt = response.json()
        assert liked_prompt["likes_count"] == 1