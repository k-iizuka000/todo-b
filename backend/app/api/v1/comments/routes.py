from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from sqlalchemy.orm import Session
from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.comment import Comment
from app.schemas.comment import CommentCreate, CommentResponse, CommentUpdate
from app.crud import comment as comment_crud

router = APIRouter(
    prefix="/comments",
    tags=["comments"]
)

@router.post("/", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(
    comment: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    新しいコメントを作成する
    """
    return comment_crud.create_comment(db=db, comment=comment, user_id=current_user.id)

@router.get("/{prompt_id}", response_model=List[CommentResponse])
async def get_comments_by_prompt(
    prompt_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    特定のプロンプトに対するコメントを取得する
    """
    return comment_crud.get_comments_by_prompt(
        db=db,
        prompt_id=prompt_id,
        skip=skip,
        limit=limit
    )

@router.put("/{comment_id}", response_model=CommentResponse)
async def update_comment(
    comment_id: int,
    comment_update: CommentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    コメントを更新する
    """
    existing_comment = comment_crud.get_comment(db=db, comment_id=comment_id)
    if not existing_comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    if existing_comment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this comment"
        )
    
    return comment_crud.update_comment(
        db=db,
        comment_id=comment_id,
        comment_update=comment_update
    )

@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    コメントを削除する
    """
    existing_comment = comment_crud.get_comment(db=db, comment_id=comment_id)
    if not existing_comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    # 管理者またはコメント作成者のみが削除可能
    if not current_user.is_admin and existing_comment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this comment"
        )
    
    comment_crud.delete_comment(db=db, comment_id=comment_id)
    return None

@router.get("/user/{user_id}", response_model=List[CommentResponse])
async def get_user_comments(
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    特定のユーザーのコメントを取得する
    """
    return comment_crud.get_comments_by_user(
        db=db,
        user_id=user_id,
        skip=skip,
        limit=limit
    )

@router.get("/report/{comment_id}")
async def report_comment(
    comment_id: int,
    reason: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    不適切なコメントを報告する
    """
    comment = comment_crud.get_comment(db=db, comment_id=comment_id)
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    return comment_crud.report_comment(
        db=db,
        comment_id=comment_id,
        reporter_id=current_user.id,
        reason=reason
    )