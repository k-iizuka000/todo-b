from pydantic_settings import BaseSettings
from typing import Optional, List
from functools import lru_cache
import os
from pathlib import Path

class Settings(BaseSettings):
    # アプリケーション基本設定
    APP_NAME: str = "PromptHub"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = False
    VERSION: str = "1.0.0"
    
    # セキュリティ設定
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-here")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24時間
    ALGORITHM: str = "HS256"
    
    # データベース設定
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://user:password@localhost:5432/prompthub"
    )
    
    # CORS設定
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "https://prompthub.com"
    ]
    
    # ファイルアップロード設定
    UPLOAD_DIR: Path = Path("uploads")
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024  # 5MB
    ALLOWED_FILE_TYPES: List[str] = ["image/jpeg", "image/png", "image/gif"]
    
    # メール設定
    SMTP_HOST: Optional[str] = os.getenv("SMTP_HOST")
    SMTP_PORT: Optional[int] = os.getenv("SMTP_PORT", 587)
    SMTP_USER: Optional[str] = os.getenv("SMTP_USER")
    SMTP_PASSWORD: Optional[str] = os.getenv("SMTP_PASSWORD")
    
    # キャッシュ設定
    REDIS_URL: Optional[str] = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # 検索エンジン設定
    ELASTICSEARCH_URL: Optional[str] = os.getenv("ELASTICSEARCH_URL")
    
    # 多言語対応設定
    DEFAULT_LANGUAGE: str = "en"
    SUPPORTED_LANGUAGES: List[str] = ["en", "ja", "es", "fr"]
    
    # 通知設定
    ENABLE_EMAIL_NOTIFICATIONS: bool = True
    ENABLE_PUSH_NOTIFICATIONS: bool = True
    
    # レート制限設定
    RATE_LIMIT_PER_MINUTE: int = 60
    
    class Config:
        case_sensitive = True
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    """
    設定のシングルトンインスタンスを取得する
    キャッシュを使用して、パフォーマンスを最適化
    """
    return Settings()

# グローバル設定インスタンス
settings = get_settings()

# 開発環境での設定の上書き
if os.getenv("ENVIRONMENT") == "development":
    settings.DEBUG = True
    
# テスト環境での設定の上書き
if os.getenv("ENVIRONMENT") == "test":
    settings.DATABASE_URL = "sqlite:///./test.db"
    settings.DEBUG = True

def initialize_upload_directory():
    """アップロードディレクトリの初期化"""
    if not settings.UPLOAD_DIR.exists():
        settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# アプリケーション起動時に必要なディレクトリを作成
initialize_upload_directory()