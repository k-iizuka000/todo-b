from datetime import datetime, timedelta
from typing import Optional
import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from app.models.user import User
from app.core.config import settings

class AuthService:
    """認証関連のサービスを提供するクラス"""
    
    def __init__(self):
        self.security = HTTPBearer()
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.secret_key = settings.SECRET_KEY
        self.algorithm = "HS256"
        self.access_token_expire_minutes = 30
        self.refresh_token_expire_days = 7

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """パスワードの検証を行う

        Args:
            plain_password (str): 平文のパスワード
            hashed_password (str): ハッシュ化されたパスワード

        Returns:
            bool: 検証結果
        """
        return self.pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        """パスワードをハッシュ化する

        Args:
            password (str): 平文のパスワード

        Returns:
            str: ハッシュ化されたパスワード
        """
        return self.pwd_context.hash(password)

    def create_access_token(self, user_id: int) -> str:
        """アクセストークンを生成する

        Args:
            user_id (int): ユーザーID

        Returns:
            str: 生成されたアクセストークン
        """
        expires_delta = timedelta(minutes=self.access_token_expire_minutes)
        expire = datetime.utcnow() + expires_delta
        to_encode = {
            "exp": expire,
            "user_id": user_id,
            "type": "access"
        }
        return jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)

    def create_refresh_token(self, user_id: int) -> str:
        """リフレッシュトークンを生成する

        Args:
            user_id (int): ユーザーID

        Returns:
            str: 生成されたリフレッシュトークン
        """
        expires_delta = timedelta(days=self.refresh_token_expire_days)
        expire = datetime.utcnow() + expires_delta
        to_encode = {
            "exp": expire,
            "user_id": user_id,
            "type": "refresh"
        }
        return jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)

    def decode_token(self, token: str) -> dict:
        """トークンをデコードする

        Args:
            token (str): デコードするトークン

        Returns:
            dict: デコードされたトークンの内容

        Raises:
            HTTPException: トークンが無効な場合
        """
        try:
            decoded_token = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return decoded_token
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token has expired")
        except jwt.JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")

    async def get_current_user(self, credentials: HTTPAuthorizationCredentials = Security(HTTPBearer())) -> Optional[dict]:
        """現在のユーザー情報を取得する

        Args:
            credentials (HTTPAuthorizationCredentials): 認証情報

        Returns:
            Optional[dict]: ユーザー情報

        Raises:
            HTTPException: 認証に失敗した場合
        """
        try:
            token = credentials.credentials
            decoded_token = self.decode_token(token)
            if decoded_token["type"] != "access":
                raise HTTPException(status_code=401, detail="Invalid token type")
            return decoded_token
        except Exception as e:
            raise HTTPException(status_code=401, detail=str(e))

    def refresh_tokens(self, refresh_token: str) -> tuple[str, str]:
        """トークンを更新する

        Args:
            refresh_token (str): リフレッシュトークン

        Returns:
            tuple[str, str]: 新しいアクセストークンとリフレッシュトークン

        Raises:
            HTTPException: リフレッシュトークンが無効な場合
        """
        try:
            decoded_token = self.decode_token(refresh_token)
            if decoded_token["type"] != "refresh":
                raise HTTPException(status_code=401, detail="Invalid token type")
            
            user_id = decoded_token["user_id"]
            new_access_token = self.create_access_token(user_id)
            new_refresh_token = self.create_refresh_token(user_id)
            
            return new_access_token, new_refresh_token
        except Exception as e:
            raise HTTPException(status_code=401, detail=str(e))

auth_service = AuthService()