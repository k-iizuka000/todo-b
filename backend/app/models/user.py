from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash, check_password_hash
from app.database import Base
import uuid

class User(Base):
    """
    ユーザーモデル
    システムのユーザー情報を管理するためのモデルクラス
    """
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    uuid = Column(String(36), unique=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(120), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    display_name = Column(String(100))
    bio = Column(Text)
    avatar_url = Column(String(255))
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    language_preference = Column(String(10), default='en')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime)

    # リレーションシップ
    prompts = relationship("Prompt", back_populates="user", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

    def __init__(self, username, email, password, display_name=None):
        self.username = username
        self.email = email
        self.set_password(password)
        self.display_name = display_name or username

    def set_password(self, password):
        """パスワードをハッシュ化して保存"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """パスワードが正しいかチェック"""
        return check_password_hash(self.password_hash, password)

    def update_last_login(self):
        """最終ログイン時間を更新"""
        self.last_login = datetime.utcnow()

    def to_dict(self):
        """ユーザー情報を辞書形式で返す"""
        return {
            'id': self.id,
            'uuid': self.uuid,
            'username': self.username,
            'email': self.email,
            'display_name': self.display_name,
            'bio': self.bio,
            'avatar_url': self.avatar_url,
            'is_active': self.is_active,
            'is_admin': self.is_admin,
            'language_preference': self.language_preference,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }

    def __repr__(self):
        return f'<User {self.username}>'

    @property
    def is_authenticated(self):
        """認証済みかどうかを返す"""
        return True

    @property
    def is_anonymous(self):
        """匿名ユーザーかどうかを返す"""
        return False

    def get_id(self):
        """ユーザーIDを文字列で返す"""
        return str(self.id)

    def deactivate(self):
        """アカウントを無効化"""
        self.is_active = False

    def activate(self):
        """アカウントを有効化"""
        self.is_active = True

    def make_admin(self):
        """管理者権限を付与"""
        self.is_admin = True

    def revoke_admin(self):
        """管理者権限を削除"""
        self.is_admin = False