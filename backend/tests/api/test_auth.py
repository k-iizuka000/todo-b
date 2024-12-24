import pytest
from fastapi.testclient import TestClient
from fastapi import status
from backend.main import app
from backend.core.security import create_access_token
from backend.models.user import User
from backend.db.session import get_db

client = TestClient(app)

# テスト用のユーザーデータ
test_user_data = {
    "email": "test@example.com",
    "password": "testpassword123",
    "username": "testuser"
}

@pytest.fixture
def db_session():
    """テスト用のデータベースセッションを提供するフィクスチャ"""
    db = next(get_db())
    try:
        yield db
    finally:
        db.close()

class TestAuth:
    def test_register_user(self):
        """ユーザー登録のテスト"""
        response = client.post(
            "/api/auth/register",
            json=test_user_data
        )
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert "id" in data
        assert data["email"] == test_user_data["email"]
        assert data["username"] == test_user_data["username"]
        assert "password" not in data  # パスワードは返されないことを確認

    def test_register_duplicate_email(self):
        """重複メールアドレスでの登録テスト"""
        # 最初のユーザーを登録
        client.post("/api/auth/register", json=test_user_data)
        
        # 同じメールアドレスで再度登録
        response = client.post(
            "/api/auth/register",
            json=test_user_data
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_login_success(self):
        """ログイン成功のテスト"""
        # ユーザーを登録
        client.post("/api/auth/register", json=test_user_data)
        
        # ログインを試行
        login_data = {
            "email": test_user_data["email"],
            "password": test_user_data["password"]
        }
        response = client.post("/api/auth/login", json=login_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert "token_type" in data
        assert data["token_type"] == "bearer"

    def test_login_invalid_credentials(self):
        """無効な認証情報でのログインテスト"""
        login_data = {
            "email": "wrong@example.com",
            "password": "wrongpassword"
        }
        response = client.post("/api/auth/login", json=login_data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_current_user(self, db_session):
        """現在のユーザー情報取得テスト"""
        # ユーザーを登録
        register_response = client.post(
            "/api/auth/register",
            json=test_user_data
        )
        user_id = register_response.json()["id"]
        
        # アクセストークンを生成
        access_token = create_access_token({"sub": str(user_id)})
        
        # ユーザー情報を取得
        response = client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["email"] == test_user_data["email"]
        assert data["username"] == test_user_data["username"]

    def test_logout(self):
        """ログアウトのテスト"""
        # ユーザーを登録してログイン
        client.post("/api/auth/register", json=test_user_data)
        login_response = client.post(
            "/api/auth/login",
            json={
                "email": test_user_data["email"],
                "password": test_user_data["password"]
            }
        )
        access_token = login_response.json()["access_token"]
        
        # ログアウト
        response = client.post(
            "/api/auth/logout",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        assert response.status_code == status.HTTP_200_OK

    def test_password_reset_request(self):
        """パスワードリセットリクエストのテスト"""
        # ユーザーを登録
        client.post("/api/auth/register", json=test_user_data)
        
        response = client.post(
            "/api/auth/password-reset-request",
            json={"email": test_user_data["email"]}
        )
        assert response.status_code == status.HTTP_200_OK

    @pytest.mark.parametrize("invalid_password", [
        "short",  # 短すぎるパスワード
        "no_numbers",  # 数字を含まないパスワード
        "12345678",  # 文字を含まないパスワード
    ])
    def test_register_invalid_password(self, invalid_password):
        """無効なパスワードでの登録テスト"""
        invalid_user_data = test_user_data.copy()
        invalid_user_data["password"] = invalid_password
        
        response = client.post(
            "/api/auth/register",
            json=invalid_user_data
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST