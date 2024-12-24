from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Float
from sqlalchemy.orm import relationship
from app.database import Base
from app.utils.slugify import slugify

class Prompt(Base):
    """
    プロンプトモデルクラス
    ユーザーが作成・共有するプロンプトの情報を管理します
    """
    __tablename__ = 'prompts'

    # 基本情報
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, index=True)
    content = Column(Text, nullable=False)
    description = Column(Text)
    
    # メタデータ
    category = Column(String(100), index=True)
    tags = Column(String(500))  # カンマ区切りで保存
    language = Column(String(50), default='en')
    
    # 統計情報
    view_count = Column(Integer, default=0)
    like_count = Column(Integer, default=0)
    average_rating = Column(Float, default=0.0)
    
    # ステータスと公開設定
    is_published = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    is_approved = Column(Boolean, default=True)
    
    # タイムスタンプ
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # リレーション
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    user = relationship('User', back_populates='prompts')
    comments = relationship('Comment', back_populates='prompt', cascade='all, delete-orphan')
    ratings = relationship('Rating', back_populates='prompt', cascade='all, delete-orphan')
    
    def __init__(self, **kwargs):
        """
        プロンプトオブジェクトの初期化
        """
        super(Prompt, self).__init__(**kwargs)
        if self.title:
            self.generate_slug()

    def generate_slug(self):
        """
        タイトルからスラグを生成
        """
        base_slug = slugify(self.title)
        self.slug = base_slug

    def to_dict(self):
        """
        プロンプトオブジェクトを辞書形式に変換
        """
        return {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'content': self.content,
            'description': self.description,
            'category': self.category,
            'tags': self.tags.split(',') if self.tags else [],
            'language': self.language,
            'view_count': self.view_count,
            'like_count': self.like_count,
            'average_rating': self.average_rating,
            'is_published': self.is_published,
            'is_featured': self.is_featured,
            'is_approved': self.is_approved,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'user_id': self.user_id
        }

    def increment_view_count(self):
        """
        閲覧数をインクリメント
        """
        self.view_count += 1

    def update_average_rating(self):
        """
        平均評価を更新
        """
        if self.ratings:
            total_rating = sum(rating.value for rating in self.ratings)
            self.average_rating = total_rating / len(self.ratings)
        else:
            self.average_rating = 0.0

    def __repr__(self):
        """
        オブジェクトの文字列表現
        """
        return f'<Prompt {self.title}>'