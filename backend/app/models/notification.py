from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .base import Base

class Notification(Base):
    """
    通知モデル
    ユーザーへの各種通知（コメント、いいね、フォローなど）を管理する
    """
    __tablename__ = 'notifications'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    sender_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    type = Column(String(50), nullable=False)  # 'comment', 'like', 'follow' など
    content = Column(String(500), nullable=False)
    link = Column(String(255), nullable=True)  # 通知に関連するリンク
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # リレーションシップ
    user = relationship("User", foreign_keys=[user_id], back_populates="notifications")
    sender = relationship("User", foreign_keys=[sender_id])

    def __init__(self, user_id, type, content, sender_id=None, link=None):
        """
        通知オブジェクトの初期化
        
        Args:
            user_id (int): 通知を受け取るユーザーのID
            type (str): 通知のタイプ
            content (str): 通知の内容
            sender_id (int, optional): 通知を送信したユーザーのID
            link (str, optional): 通知に関連するリンク
        """
        self.user_id = user_id
        self.type = type
        self.content = content
        self.sender_id = sender_id
        self.link = link

    def to_dict(self):
        """
        通知オブジェクトを辞書形式に変換
        
        Returns:
            dict: 通知の情報を含む辞書
        """
        return {
            'id': self.id,
            'user_id': self.user_id,
            'sender_id': self.sender_id,
            'type': self.type,
            'content': self.content,
            'link': self.link,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

    def mark_as_read(self):
        """通知を既読にする"""
        self.is_read = True

    def mark_as_unread(self):
        """通知を未読にする"""
        self.is_read = False

    @classmethod
    def create_notification(cls, user_id, type, content, sender_id=None, link=None):
        """
        新しい通知を作成するファクトリーメソッド
        
        Args:
            user_id (int): 通知を受け取るユーザーのID
            type (str): 通知のタイプ
            content (str): 通知の内容
            sender_id (int, optional): 通知を送信したユーザーのID
            link (str, optional): 通知に関連するリンク
            
        Returns:
            Notification: 作成された通知オブジェクト
        """
        return cls(
            user_id=user_id,
            type=type,
            content=content,
            sender_id=sender_id,
            link=link
        )

    def __repr__(self):
        """デバッグ用の文字列表現"""
        return f'<Notification(id={self.id}, type={self.type}, user_id={self.user_id})>'