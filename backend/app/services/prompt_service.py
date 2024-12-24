from typing import List, Optional, Dict
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.prompt import Prompt
from app.models.user import User
from app.schemas.prompt import PromptCreate, PromptUpdate
from app.core.exceptions import NotFoundException, UnauthorizedException

class PromptService:
    def __init__(self, db: Session):
        self.db = db

    async def create_prompt(self, prompt_data: PromptCreate, user_id: int) -> Prompt:
        """新しいプロンプトを作成する"""
        prompt = Prompt(
            title=prompt_data.title,
            content=prompt_data.content,
            category=prompt_data.category,
            tags=prompt_data.tags,
            user_id=user_id,
            is_public=prompt_data.is_public,
            created_at=datetime.utcnow()
        )
        self.db.add(prompt)
        await self.db.commit()
        await self.db.refresh(prompt)
        return prompt

    async def get_prompt(self, prompt_id: int) -> Optional[Prompt]:
        """指定されたIDのプロンプトを取得する"""
        prompt = await self.db.query(Prompt).filter(Prompt.id == prompt_id).first()
        if not prompt:
            raise NotFoundException("Prompt not found")
        return prompt

    async def get_prompts(
        self,
        skip: int = 0,
        limit: int = 100,
        filters: Dict = None
    ) -> List[Prompt]:
        """プロンプトの一覧を取得する（フィルタリング付き）"""
        query = self.db.query(Prompt)

        if filters:
            if filters.get("category"):
                query = query.filter(Prompt.category == filters["category"])
            if filters.get("tags"):
                query = query.filter(Prompt.tags.contains(filters["tags"]))
            if filters.get("user_id"):
                query = query.filter(Prompt.user_id == filters["user_id"])
            if "is_public" in filters:
                query = query.filter(Prompt.is_public == filters["is_public"])

        return await query.offset(skip).limit(limit).all()

    async def update_prompt(
        self,
        prompt_id: int,
        prompt_data: PromptUpdate,
        user_id: int
    ) -> Prompt:
        """プロンプトを更新する"""
        prompt = await self.get_prompt(prompt_id)
        
        if prompt.user_id != user_id:
            raise UnauthorizedException("Not authorized to update this prompt")

        for field, value in prompt_data.dict(exclude_unset=True).items():
            setattr(prompt, field, value)
        
        prompt.updated_at = datetime.utcnow()
        await self.db.commit()
        await self.db.refresh(prompt)
        return prompt

    async def delete_prompt(self, prompt_id: int, user_id: int) -> bool:
        """プロンプトを削除する"""
        prompt = await self.get_prompt(prompt_id)
        
        if prompt.user_id != user_id:
            raise UnauthorizedException("Not authorized to delete this prompt")

        await self.db.delete(prompt)
        await self.db.commit()
        return True

    async def add_like(self, prompt_id: int, user_id: int) -> bool:
        """プロンプトにいいねを追加する"""
        prompt = await self.get_prompt(prompt_id)
        if user_id not in prompt.likes:
            prompt.likes.append(user_id)
            prompt.like_count += 1
            await self.db.commit()
        return True

    async def remove_like(self, prompt_id: int, user_id: int) -> bool:
        """プロンプトのいいねを削除する"""
        prompt = await self.get_prompt(prompt_id)
        if user_id in prompt.likes:
            prompt.likes.remove(user_id)
            prompt.like_count -= 1
            await self.db.commit()
        return True

    async def search_prompts(
        self,
        query: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[Prompt]:
        """プロンプトを検索する"""
        search_query = self.db.query(Prompt).filter(
            Prompt.is_public == True
        ).filter(
            (Prompt.title.ilike(f"%{query}%")) |
            (Prompt.content.ilike(f"%{query}%")) |
            (Prompt.tags.contains([query]))
        )
        return await search_query.offset(skip).limit(limit).all()

    async def get_trending_prompts(self, limit: int = 10) -> List[Prompt]:
        """トレンドのプロンプトを取得する"""
        return await self.db.query(Prompt)\
            .filter(Prompt.is_public == True)\
            .order_by(Prompt.like_count.desc())\
            .limit(limit)\
            .all()