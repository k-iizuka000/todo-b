"""
プロンプトAPI用の初期化ファイル
このモジュールは、プロンプト関連のAPIエンドポイントを初期化し、必要なコンポーネントをまとめます。
"""

from fastapi import APIRouter
from typing import List, Optional

# プロンプトAPIのルーターを作成
prompts_router = APIRouter()

# バージョン情報
__version__ = "1.0.0"

# APIのプレフィックス
API_PREFIX = "/api/v1/prompts"

# デフォルトのページネーションパラメータ
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100

# プロンプトの状態定義
class PromptStatus:
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"
    DELETED = "deleted"

# プロンプトのカテゴリー定義
PROMPT_CATEGORIES = [
    "general",
    "creative",
    "technical",
    "business",
    "academic",
    "other"
]

# エラーメッセージの定義
ERROR_MESSAGES = {
    "not_found": "Prompt not found",
    "unauthorized": "Unauthorized access",
    "invalid_input": "Invalid input data",
    "server_error": "Internal server error"
}

# 必要なルートハンドラをインポート
from .routes import *

# APIの設定情報
api_settings = {
    "title": "Prompts API",
    "description": "API for managing and sharing prompts",
    "version": __version__,
    "prefix": API_PREFIX,
    "tags": ["prompts"]
}

def init_app():
    """
    プロンプトAPIの初期化を行う関数
    設定の読み込みやデータベース接続の確立などを行います
    """
    # 必要な初期化処理をここに実装
    pass

def get_router() -> APIRouter:
    """
    設定済みのAPIルーターを返す関数
    """
    return prompts_router

# APIの状態チェック用の関数
def health_check() -> dict:
    """
    APIの健全性チェックを行う関数
    """
    return {
        "status": "healthy",
        "version": __version__,
        "api": "prompts"
    }

# エクスポートする要素を制限
__all__ = [
    'prompts_router',
    'init_app',
    'get_router',
    'health_check',
    'PromptStatus',
    'PROMPT_CATEGORIES',
    'api_settings'
]