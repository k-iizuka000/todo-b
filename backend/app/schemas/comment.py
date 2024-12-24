from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class CommentBase(BaseModel):
    """コメントの基本スキーマ"""
    content: str = Field(..., min_length=1, max_length=1000, description="コメントの内容")
    prompt_id: int = Field(..., description="コメントが属するプロンプトのID")

class CommentCreate(CommentBase):
    """コメント作成用スキーマ"""
    pass

class CommentUpdate(BaseModel):
    """コメント更新用スキーマ"""
    content: Optional[str] = Field(None, min_length=1, max_length=1000, description="更新するコメントの内容")

class CommentInDB(CommentBase):
    """データベースに保存されるコメントスキーマ"""
    id: int = Field(..., description="コメントの一意識別子")
    user_id: int = Field(..., description="コメントを投稿したユーザーのID")
    created_at: datetime = Field(..., description="コメントの作成日時")
    updated_at: datetime = Field(..., description="コメントの最終更新日時")
    is_deleted: bool = Field(default=False, description="コメントの削除フラグ")

    class Config:
        orm_mode = True

class CommentResponse(CommentInDB):
    """APIレスポンス用のコメントスキーマ"""
    user_name: str = Field(..., description="コメントを投稿したユーザーの名前")
    user_avatar: Optional[str] = Field(None, description="コメントを投稿したユーザーのアバター画像URL")
    likes_count: int = Field(default=0, description="コメントに対するいいねの数")
    is_liked_by_current_user: Optional[bool] = Field(
        default=False, 
        description="現在のユーザーがこのコメントにいいねしているかどうか"
    )

    class Config:
        orm_mode = True

class CommentWithReplies(CommentResponse):
    """返信を含むコメントスキーマ"""
    replies: list["CommentResponse"] = Field(default_list, description="コメントへの返信一覧")
    parent_id: Optional[int] = Field(None, description="親コメントのID（返信の場合）")

    class Config:
        orm_mode = True