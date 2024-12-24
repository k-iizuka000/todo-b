from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Any
from datetime import timedelta

from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    verify_password,
    get_password_hash
)
from app.crud import crud_user
from app.schemas import user as user_schema
from app.schemas import token as token_schema
from app.api import deps
from app.core import security

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="v1/auth/login")

@router.post("/register", response_model=user_schema.User)
def register_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: user_schema.UserCreate,
) -> Any:
    """
    新規ユーザー登録エンドポイント
    """
    # メールアドレスの重複チェック
    user = crud_user.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="このメールアドレスは既に登録されています。"
        )
    
    # ユーザーの作成
    user = crud_user.create_user(db, obj_in=user_in)
    return user

@router.post("/login", response_model=token_schema.Token)
def login(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    ログインエンドポイント
    """
    # ユーザー認証
    user = crud_user.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="メールアドレスまたはパスワードが正しくありません。"
        )
    
    # アクセストークンとリフレッシュトークンの生成
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    
    access_token = create_access_token(
        user.id, expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(
        user.id, expires_delta=refresh_token_expires
    )
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=token_schema.Token)
def refresh_token(
    db: Session = Depends(deps.get_db),
    current_token: str = Depends(oauth2_scheme)
) -> Any:
    """
    リフレッシュトークンを使用して新しいアクセストークンを取得
    """
    try:
        payload = security.decode_token(current_token)
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="無効なトークンです。"
            )
            
        user = crud_user.get_user(db, id=user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="ユーザーが見つかりません。"
            )
            
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            user.id, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "refresh_token": current_token,
            "token_type": "bearer"
        }
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="無効なトークンです。"
        )

@router.post("/logout")
def logout(
    current_user: user_schema.User = Depends(deps.get_current_user)
) -> Any:
    """
    ログアウトエンドポイント
    """
    # 必要に応じてトークンの無効化やセッションのクリアを実装
    return {"message": "ログアウトしました。"}

@router.get("/me", response_model=user_schema.User)
def get_current_user_info(
    current_user: user_schema.User = Depends(deps.get_current_user)
) -> Any:
    """
    現在ログインしているユーザーの情報を取得
    """
    return current_user