from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.comment import Comment
from app.models.user import User
from app.models.prompt import Prompt
from app.schemas.comment import CommentCreate, CommentUpdate
from app.services.notification_service import NotificationService

class CommentService:
    def __init__(self, db: Session):
        self.db = db
        self.notification_service = NotificationService(db)

    async def create_comment(
        self, 
        prompt_id: int, 
        user_id: int, 
        comment_data: CommentCreate
    ) -> Comment:
        """
        新しいコメントを作成する
        
        Args:
            prompt_id: プロンプトID
            user_id: コメント投稿者のユーザーID
            comment_data: コメントのデータ
            
        Returns:
            作成されたコメントオブジェクト
        """
        comment = Comment(
            content=comment_data.content,
            prompt_id=prompt_id,
            user_id=user_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        self.db.add(comment)
        self.db.commit()
        self.db.refresh(comment)
        
        # プロンプト作成者に通知を送信
        prompt = self.db.query(Prompt).filter(Prompt.id == prompt_id).first()
        if prompt and prompt.user_id != user_id:
            await self.notification_service.create_comment_notification(
                prompt.user_id,
                user_id,
                prompt_id,
                comment.id
            )
        
        return comment

    def get_comment(self, comment_id: int) -> Optional[Comment]:
        """
        指定されたIDのコメントを取得する
        
        Args:
            comment_id: コメントID
            
        Returns:
            コメントオブジェクト。存在しない場合はNone
        """
        return self.db.query(Comment).filter(Comment.id == comment_id).first()

    def get_comments_by_prompt(self, prompt_id: int) -> List[Comment]:
        """
        指定されたプロンプトに対するすべてのコメントを取得する
        
        Args:
            prompt_id: プロンプトID
            
        Returns:
            コメントオブジェクトのリスト
        """
        return (
            self.db.query(Comment)
            .filter(Comment.prompt_id == prompt_id)
            .order_by(Comment.created_at.desc())
            .all()
        )

    def update_comment(
        self, 
        comment_id: int, 
        user_id: int, 
        comment_data: CommentUpdate
    ) -> Optional[Comment]:
        """
        コメントを更新する
        
        Args:
            comment_id: 更新対象のコメントID
            user_id: 更新を要求したユーザーID
            comment_data: 更新するコメントデータ
            
        Returns:
            更新されたコメントオブジェクト。更新権限がない場合はNone
        """
        comment = self.get_comment(comment_id)
        if not comment or comment.user_id != user_id:
            return None

        comment.content = comment_data.content
        comment.updated_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(comment)
        return comment

    def delete_comment(self, comment_id: int, user_id: int) -> bool:
        """
        コメントを削除する
        
        Args:
            comment_id: 削除対象のコメントID
            user_id: 削除を要求したユーザーID
            
        Returns:
            削除が成功した場合はTrue、失敗した場合はFalse
        """
        comment = self.get_comment(comment_id)
        if not comment or comment.user_id != user_id:
            return False

        self.db.delete(comment)
        self.db.commit()
        return True

    def is_comment_owner(self, comment_id: int, user_id: int) -> bool:
        """
        指定されたユーザーがコメントの所有者かどうかを確認する
        
        Args:
            comment_id: コメントID
            user_id: 確認対象のユーザーID
            
        Returns:
            所有者である場合はTrue、そうでない場合はFalse
        """
        comment = self.get_comment(comment_id)
        return comment is not None and comment.user_id == user_id