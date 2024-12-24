from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from sqlalchemy.orm import Session
from app.core.auth import get_current_admin_user
from app.core.database import get_db
from app.schemas import (
    UserResponse, 
    PromptResponse, 
    CommentResponse, 
    AdminStats,
    UserUpdate,
    ContentModeration
)
from app.crud import (
    user_crud,
    prompt_crud,
    comment_crud,
    stats_crud
)

router = APIRouter(prefix="/admin", tags=["admin"])

# 管理者認証のミドルウェア
admin_auth = Depends(get_current_admin_user)

@router.get("/stats", response_model=AdminStats)
async def get_admin_stats(
    db: Session = Depends(get_db),
    current_admin = admin_auth
):
    """
    システム全体の統計情報を取得
    """
    return stats_crud.get_system_stats(db)

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin = admin_auth
):
    """
    全ユーザー情報の取得（ページネーション付き）
    """
    return user_crud.get_users(db, skip=skip, limit=limit, search=search)

@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user_status(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_admin = admin_auth
):
    """
    ユーザーステータスの更新（アクティブ/非アクティブ、権限変更など）
    """
    return user_crud.update_user(db, user_id, user_update)

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin = admin_auth
):
    """
    ユーザーの削除
    """
    user_crud.delete_user(db, user_id)
    return {"message": "User deleted successfully"}

@router.get("/prompts/reported", response_model=List[PromptResponse])
async def get_reported_prompts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin = admin_auth
):
    """
    報告されたプロンプトの一覧を取得
    """
    return prompt_crud.get_reported_prompts(db, skip=skip, limit=limit)

@router.post("/prompts/{prompt_id}/moderate")
async def moderate_prompt(
    prompt_id: int,
    moderation: ContentModeration,
    db: Session = Depends(get_db),
    current_admin = admin_auth
):
    """
    プロンプトのモデレーション（承認/拒否/削除）
    """
    return prompt_crud.moderate_prompt(db, prompt_id, moderation)

@router.get("/comments/reported", response_model=List[CommentResponse])
async def get_reported_comments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin = admin_auth
):
    """
    報告されたコメントの一覧を取得
    """
    return comment_crud.get_reported_comments(db, skip=skip, limit=limit)

@router.delete("/comments/{comment_id}")
async def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_admin = admin_auth
):
    """
    コメントの削除
    """
    comment_crud.delete_comment(db, comment_id)
    return {"message": "Comment deleted successfully"}

@router.post("/system/maintenance")
async def toggle_maintenance_mode(
    enable: bool,
    db: Session = Depends(get_db),
    current_admin = admin_auth
):
    """
    システムのメンテナンスモードを切り替え
    """
    # メンテナンスモードの設定を更新
    return {"message": f"Maintenance mode {'enabled' if enable else 'disabled'}"}

@router.get("/audit-logs")
async def get_audit_logs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin = admin_auth
):
    """
    管理操作の監査ログを取得
    """
    return stats_crud.get_audit_logs(db, skip=skip, limit=limit)