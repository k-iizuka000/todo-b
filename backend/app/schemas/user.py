from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, constr, validator

class UserBase(BaseModel):
    """ユーザーの基本情報を定義するベーススキーマ"""
    email: EmailStr
    username: constr(min_length=3, max_length=50)
    display_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    """ユーザー作成時に使用するスキーマ"""
    password: constr(min_length=8)

    @validator('password')
    def password_strength(cls, v):
        """パスワードの強度を検証"""
        if not any(char.isupper() for char in v):
            raise ValueError('パスワードは少なくとも1つの大文字を含む必要があります')
        if not any(char.islower() for char in v):
            raise ValueError('パスワードは少なくとも1つの小文字を含む必要があります')
        if not any(char.isdigit() for char in v):
            raise ValueError('パスワードは少なくとも1つの数字を含む必要があります')
        return v

class UserUpdate(BaseModel):
    """ユーザー情報更新時に使用するスキーマ"""
    display_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    email: Optional[EmailStr] = None

class UserInDB(UserBase):
    """データベースに保存されるユーザー情報のスキーマ"""
    id: int
    is_active: bool = True
    is_admin: bool = False
    hashed_password: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class UserResponse(UserBase):
    """APIレスポンスとして返すユーザー情報のスキーマ"""
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    prompt_count: Optional[int] = 0
    follower_count: Optional[int] = 0
    following_count: Optional[int] = 0

    class Config:
        orm_mode = True

class UserAuth(BaseModel):
    """認証時に使用するスキーマ"""
    email: EmailStr
    password: str

class UserWithToken(UserResponse):
    """ログイン時にトークンと共に返すユーザー情報のスキーマ"""
    access_token: str
    token_type: str = "bearer"

class UserPreferences(BaseModel):
    """ユーザー設定のスキーマ"""
    email_notifications: bool = True
    language: str = "ja"
    theme: str = "light"
    newsletter_subscription: bool = False

    class Config:
        orm_mode = True