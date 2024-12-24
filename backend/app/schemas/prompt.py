from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, HttpUrl

class PromptBase(BaseModel):
    """プロンプトの基本スキーマ"""
    title: str = Field(..., min_length=1, max_length=200, description="プロンプトのタイトル")
    content: str = Field(..., min_length=1, max_length=10000, description="プロンプトの本文")
    category: str = Field(..., description="プロンプトのカテゴリー")
    tags: List[str] = Field(default=[], description="プロンプトに関連するタグのリスト")
    language: str = Field(default="ja", description="プロンプトの言語")
    is_public: bool = Field(default=True, description="プロンプトの公開状態")

class PromptCreate(PromptBase):
    """プロンプト作成用スキーマ"""
    pass

class PromptUpdate(BaseModel):
    """プロンプト更新用スキーマ"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = Field(None, min_length=1, max_length=10000)
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    language: Optional[str] = None
    is_public: Optional[bool] = None

class PromptInDB(PromptBase):
    """データベースに保存されるプロンプトスキーマ"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    view_count: int = Field(default=0, description="閲覧回数")
    like_count: int = Field(default=0, description="いいね数")
    comment_count: int = Field(default=0, description="コメント数")
    share_count: int = Field(default=0, description="シェア数")

    class Config:
        orm_mode = True

class PromptResponse(PromptInDB):
    """APIレスポンス用プロンプトスキーマ"""
    author_name: str
    author_avatar: Optional[HttpUrl] = None
    is_liked_by_current_user: bool = False
    share_url: Optional[HttpUrl] = None

class PromptSearch(BaseModel):
    """プロンプト検索用スキーマ"""
    keyword: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    language: Optional[str] = None
    author_id: Optional[int] = None
    sort_by: str = Field(default="created_at", description="ソート基準")
    order: str = Field(default="desc", description="ソート順序")
    page: int = Field(default=1, ge=1, description="ページ番号")
    per_page: int = Field(default=20, ge=1, le=100, description="1ページあたりの件数")

class PromptStats(BaseModel):
    """プロンプト統計情報スキーマ"""
    total_views: int
    total_likes: int
    total_comments: int
    total_shares: int
    created_at: datetime
    last_viewed_at: Optional[datetime] = None

    class Config:
        orm_mode = True