from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import QueuePool
from typing import AsyncGenerator
import os
from contextlib import asynccontextmanager

# データベース設定
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://user:password@localhost:5432/prompthub"
)

# SQLAlchemy設定
engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # 本番環境ではFalse
    future=True,
    poolclass=QueuePool,
    pool_size=5,
    max_overflow=10,
    pool_timeout=30,
    pool_pre_ping=True,
)

# セッションの設定
AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# モデルのベースクラス
Base = declarative_base()

async def init_db() -> None:
    """
    データベースの初期化を行う
    テーブルの作成やマイグレーションの実行など
    """
    async with engine.begin() as conn:
        # 開発環境でのみ使用（本番環境では適切なマイグレーション戦略を使用）
        await conn.run_sync(Base.metadata.create_all)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    データベースセッションを提供するジェネレータ
    FastAPIのDependencyとして使用
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

@asynccontextmanager
async def get_db_context():
    """
    コンテキストマネージャとしてデータベースセッションを提供
    with文で使用可能
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def close_db_connection() -> None:
    """
    データベース接続を終了する
    アプリケーション終了時に呼び出す
    """
    await engine.dispose()

# 接続テスト用の関数
async def test_db_connection() -> bool:
    """
    データベース接続をテストする
    """
    try:
        async with engine.connect() as conn:
            await conn.execute("SELECT 1")
        return True
    except Exception as e:
        print(f"Database connection test failed: {e}")
        return False
# FastAPIでの使用例
from fastapi import Depends

@app.get("/items")
async def read_items(db: AsyncSession = Depends(get_db)):
    # dbセッションを使用したクエリ処理
    pass

# コンテキストマネージャとしての使用例
async def some_function():
    async with get_db_context() as db:
        # dbセッションを使用したクエリ処理
        pass