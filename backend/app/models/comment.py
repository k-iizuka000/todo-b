from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Comment(Base):
    """
    コメントモデル
    プロンプトに対するユーザーのコメントを管理するモデル
    """
    __tablename__ = 'comments'

    # 主キー
    id = Column(Integer, primary_key=True, index=True)
    
    # コメント内容
    content = Column(Text, nullable=False)
    
    # 外部キー
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    prompt_id = Column(Integer, ForeignKey('prompts.id', ondelete='CASCADE'), nullable=False)
    parent_id = Column(Integer, ForeignKey('comments.id', ondelete='CASCADE'), nullable=True)
    
    # タイムスタンプ
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # 削除フラグ（論理削除用）
    is_deleted = Column(Boolean, default=False, nullable=False)
    
    # リレーションシップ
    user = relationship("User", back_populates="comments")
    prompt = relationship("Prompt", back_populates="comments")
    replies = relationship("Comment", 
                         backref=relationship("Comment", remote_side=[id]),
                         cascade="all, delete-orphan")
    
    # いいね関連
    likes = relationship("CommentLike", back_populates="comment", cascade="all, delete-orphan")
    
    def to_dict(self):
        """
        コメントオブジェクトを辞書形式に変換するメソッド
        """
        return {
            'id': self.id,
            'content': self.content,
            'user_id': self.user_id,
            'prompt_id': self.prompt_id,
            'parent_id': self.parent_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'is_deleted': self.is_deleted,
            'user': self.user.to_dict() if self.user else None,
            'likes_count': len(self.likes)
        }

    @property
    def likes_count(self):
        """
        コメントに対するいいねの数を返すプロパティ
        """
        return len([like for like in self.likes if not like.is_deleted])

    def soft_delete(self):
        """
        コメントを論理削除するメソッド
        """
        self.is_deleted = True
        self.content = "[削除されたコメント]"

    def can_edit(self, user_id):
        """
        指定されたユーザーがコメントを編集できるか確認するメソッド
        """
        return self.user_id == user_id and not self.is_deleted