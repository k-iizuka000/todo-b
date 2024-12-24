from logging.config import fileConfig
from typing import Optional, Dict, Any

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
from sqlalchemy.engine import Engine
from sqlalchemy.ext.asyncio import AsyncEngine
from sqlalchemy.ext.asyncio import create_async_engine

# モデルのメタデータをインポート
from app.models.base import Base
from app.core.config import settings
from app.core.security import get_encryption_key

# このファイルはalembicによって使用され、マイグレーションの環境を設定します
config = context.config

# loggingセクションが存在する場合、logging.configをセットアップ
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# メタデータターゲットの追加
target_metadata = Base.metadata

# 暗号化キーの取得
encryption_key = get_encryption_key()

def get_url() -> str:
    """
    データベースURLを取得する関数
    
    Returns:
        str: データベースURL
    """
    # 環境変数からデータベースURLを取得し、必要に応じて暗号化
    return settings.SQLALCHEMY_DATABASE_URI

def run_migrations_offline() -> None:
    """
    オフラインでマイグレーションを実行する関数
    
    この関数は、実際のデータベース接続なしでSQLを生成します。
    """
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online() -> None:
    """
    オンラインでマイグレーションを実行する非同期関数
    
    この関数は、実際のデータベース接続を使用してマイグレーションを実行します。
    """
    configuration: Dict[str, Any] = config.get_section(config.config_ini_section)
    configuration["sqlalchemy.url"] = get_url()
    
    # SSL/TLS設定の追加
    configuration["sqlalchemy.connect_args"] = {
        "ssl": True,
        "ssl_cert_reqs": "CERT_REQUIRED",
        "ssl_ca": "/path/to/ca-certificate.pem"
    }

    # 非同期エンジンの作成
    connectable = create_async_engine(
        configuration["sqlalchemy.url"],
        poolclass=pool.NullPool,
        connect_args=configuration["sqlalchemy.connect_args"]
    )

    async with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            transaction_per_migration=True,
            render_as_batch=True
        )

        async with context.begin_transaction():
            await context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    import asyncio
    asyncio.run(run_migrations_online())
