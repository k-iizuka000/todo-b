from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.security import get_current_active_user, get_password_hash, verify_password
from app.core.database import get_db
from app.schemas.user import UserCreate, UserUpdate, UserResponse, UserInDB
from app.models.user import User
from app.crud.user import (
    create_user,
    get_user_by_email,
    get_user_by_id,
    get_users,
    update_user,
    delete_user,
    get_user_prompts
)

router = APIRouter()

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_in: UserCreate,
    db: Session = Depends(get_db)
):
    """新規ユーザーを登録する"""
    # メールアドレスの重複チェック
    db_user = get_user_by_email(db, email=user_in.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="このメールアドレスは既に登録されています"
        )
    
    return create_user(db=db, user=user_in)

@router.get("/me", response_model=UserResponse)
async def read_current_user(
    current_user: User = Depends(get_current_active_user)
):
    """現在ログインしているユーザーの情報を取得する"""
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """現在のユーザー情報を更新する"""
    return update_user(db=db, user_id=current_user.id, user=user_in)

@router.get("/{user_id}", response_model=UserResponse)
async def read_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    """指定されたIDのユーザー情報を取得する"""
    user = get_user_by_id(db, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ユーザーが見つかりません"
        )
    return user

@router.get("/", response_model=List[UserResponse])
async def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """ユーザー一覧を取得する（管理者のみ）"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="この操作には管理者権限が必要です"
        )
    return get_users(db, skip=skip, limit=limit)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """指定されたユーザーを削除する（管理者のみ）"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="この操作には管理者権限が必要です"
        )
    
    user = get_user_by_id(db, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ユーザーが見つかりません"
        )
    
    delete_user(db=db, user_id=user_id)

@router.get("/{user_id}/prompts", response_model=List[UserResponse])
async def read_user_prompts(
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """指定されたユーザーのプロンプト一覧を取得する"""
    user = get_user_by_id(db, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ユーザーが見つかりません"
        )
    return get_user_prompts(db=db, user_id=user_id, skip=skip, limit=limit)