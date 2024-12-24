from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

# セキュリティ設定
SECRET_KEY = "your-secret-key-here"  # 本番環境では環境変数から読み込むべき
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# パスワードハッシュ化の設定
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2スキームの設定
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    プレーンテキストのパスワードとハッシュ化されたパスワードを比較検証する
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    パスワードをハッシュ化する
    """
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    アクセストークンを生成する
    
    Args:
        data: トークンに含めるデータ
        expires_delta: トークンの有効期限
    
    Returns:
        生成されたJWTトークン
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def verify_token(token: str) -> Optional[TokenData]:
    """
    トークンを検証し、含まれるデータを取得する
    
    Args:
        token: 検証するJWTトークン
    
    Returns:
        トークンに含まれるデータ、または無効な場合はNone
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        return TokenData(username=username)
    except jwt.JWTError:
        return None

def create_refresh_token(data: dict) -> str:
    """
    リフレッシュトークンを生成する
    
    Args:
        data: トークンに含めるデータ
    
    Returns:
        生成されたリフレッシュトークン
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)  # リフレッシュトークンは7日間有効
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

class SecurityConfig:
    """セキュリティ設定を管理するクラス"""
    
    @staticmethod
    def get_password_requirements() -> dict:
        """パスワードの要件を定義"""
        return {
            "min_length": 8,
            "require_uppercase": True,
            "require_lowercase": True,
            "require_numbers": True,
            "require_special_chars": True
        }

    @staticmethod
    def validate_password(password: str) -> bool:
        """
        パスワードが要件を満たしているか検証する
        
        Args:
            password: 検証するパスワード
        
        Returns:
            パスワードが要件を満たしている場合はTrue
        """
        requirements = SecurityConfig.get_password_requirements()
        
        if len(password) < requirements["min_length"]:
            return False
        
        if requirements["require_uppercase"] and not any(c.isupper() for c in password):
            return False
            
        if requirements["require_lowercase"] and not any(c.islower() for c in password):
            return False
            
        if requirements["require_numbers"] and not any(c.isdigit() for c in password):
            return False
            
        if requirements["require_special_chars"] and not any(not c.isalnum() for c in password):
            return False
            
        return True