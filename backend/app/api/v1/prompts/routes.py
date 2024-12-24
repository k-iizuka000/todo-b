from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from sqlalchemy.orm import Session
from app.core.deps import get_current_user, get_db
from app.schemas.prompt import (
    PromptCreate,
    PromptUpdate,
    PromptResponse,
    PromptListResponse
)
from app.crud.prompt import prompt_crud
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=PromptResponse)
async def create_prompt(
    *,
    db: Session = Depends(get_db),
    prompt_in: PromptCreate,
    current_user: User = Depends(get_current_user)
):
    """新しいプロンプトを作成する"""
    prompt = prompt_crud.create_with_owner(
        db=db, obj_in=prompt_in, owner_id=current_user.id
    )
    return prompt

@router.get("/", response_model=List[PromptListResponse])
async def list_prompts(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 10,
    search: Optional[str] = None,
    category: Optional[str] = None,
    tags: Optional[List[str]] = Query(None),
    current_user: Optional[User] = Depends(get_current_user)
):
    """プロンプトの一覧を取得する"""
    prompts = prompt_crud.get_multi(
        db=db,
        skip=skip,
        limit=limit,
        search=search,
        category=category,
        tags=tags
    )
    return prompts

@router.get("/{prompt_id}", response_model=PromptResponse)
async def get_prompt(
    prompt_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """特定のプロンプトを取得する"""
    prompt = prompt_crud.get(db=db, id=prompt_id)
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return prompt

@router.put("/{prompt_id}", response_model=PromptResponse)
async def update_prompt(
    *,
    db: Session = Depends(get_db),
    prompt_id: int,
    prompt_in: PromptUpdate,
    current_user: User = Depends(get_current_user)
):
    """プロンプトを更新する"""
    prompt = prompt_crud.get(db=db, id=prompt_id)
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    if prompt.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    prompt = prompt_crud.update(db=db, db_obj=prompt, obj_in=prompt_in)
    return prompt

@router.delete("/{prompt_id}")
async def delete_prompt(
    *,
    db: Session = Depends(get_db),
    prompt_id: int,
    current_user: User = Depends(get_current_user)
):
    """プロンプトを削除する"""
    prompt = prompt_crud.get(db=db, id=prompt_id)
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    if prompt.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    prompt = prompt_crud.remove(db=db, id=prompt_id)
    return {"message": "Prompt deleted successfully"}

@router.post("/{prompt_id}/like")
async def like_prompt(
    *,
    db: Session = Depends(get_db),
    prompt_id: int,
    current_user: User = Depends(get_current_user)
):
    """プロンプトにいいねをする"""
    prompt = prompt_crud.like(db=db, prompt_id=prompt_id, user_id=current_user.id)
    return {"message": "Prompt liked successfully"}

@router.post("/{prompt_id}/share")
async def share_prompt(
    *,
    db: Session = Depends(get_db),
    prompt_id: int,
    current_user: User = Depends(get_current_user)
):
    """プロンプトを共有する"""
    prompt = prompt_crud.get(db=db, id=prompt_id)
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    # 共有処理を実装（例：共有カウントの増加）
    return {"message": "Prompt shared successfully"}