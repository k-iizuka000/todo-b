from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from enum import Enum

class NotificationType(str, Enum):
    """通知タイプを定義する列挙型"""
    COMMENT = "comment"  # プロンプトへのコメント
    LIKE = "like"  # プロンプトへのいいね
    FOLLOW = "follow"  # フォロー
    MENTION = "mention"  # メンション
    SYSTEM = "system"  # システム通知
    PROMPT_SHARE = "prompt_share"  # プロンプト共有

class NotificationBase(BaseModel):
    """通知の基本スキーマ"""
    type: NotificationType
    title: str = Field(..., max_length=200)
    message: str = Field(..., max_length=500)
    is_read: bool = False
    link: Optional[str] = Field(None, max_length=500)

class NotificationCreate(NotificationBase):
    """通知作成用スキーマ"""
    recipient_id: int
    sender_id: Optional[int] = None
    related_object_id: Optional[int] = None
    related_object_type: Optional[str] = None

class NotificationUpdate(BaseModel):
    """通知更新用スキーマ"""
    is_read: Optional[bool] = None

class NotificationInDB(NotificationBase):
    """データベースに保存される通知スキーマ"""
    id: int
    recipient_id: int
    sender_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    related_object_id: Optional[int]
    related_object_type: Optional[str]

    class Config:
        orm_mode = True

class NotificationResponse(NotificationInDB):
    """API応答用の通知スキーマ"""
    sender_name: Optional[str] = None
    sender_avatar: Optional[str] = None

    class Config:
        orm_mode = True

class NotificationCount(BaseModel):
    """未読通知カウント用スキーマ"""
    unread_count: int

class NotificationBulkUpdate(BaseModel):
    """複数通知の一括更新用スキーマ"""
    notification_ids: list[int]
    is_read: bool = True