"""
Pytest configuration and fixtures for the PromptHub AI SaaS platform.
Contains common test fixtures and configurations used across test files.
"""

import asyncio
import pytest
from typing import AsyncGenerator, Dict, Any
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from databases import Database
from cryptography.fernet import Fernet

from app.core.config import settings
from app.core.security import create_access_token
from app.db.base import Base
from app.main import app
from app.models.user import User
from app.api.deps import get_db

# Test database URL
TEST_DATABASE_URL = "postgresql+asyncpg://test:test@localhost:5432/test_db"

# Create async engine for tests
engine = create_async_engine(
    TEST_DATABASE_URL,
    echo=True,
    future=True
)

# Create async session factory
TestingSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Encryption key for testing
test_encryption_key = Fernet.generate_key()
test_fernet = Fernet(test_encryption_key)

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
async def test_app() -> FastAPI:
    """Create a test instance of the FastAPI application."""
    return app

@pytest.fixture(scope="session")
async def test_client(test_app: FastAPI) -> TestClient:
    """Create a test client for the FastAPI application."""
    async with TestClient(test_app) as client:
        yield client

@pytest.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Create a clean database session for each test."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with TestingSessionLocal() as session:
        yield session
        await session.rollback()
        await session.close()

@pytest.fixture(scope="function")
async def test_db(test_app: FastAPI, db_session: AsyncSession):
    """Override the get_db dependency for testing."""
    async def override_get_db():
        yield db_session

    test_app.dependency_overrides[get_db] = override_get_db
    return db_session

@pytest.fixture
async def test_user(db_session: AsyncSession) -> Dict[str, Any]:
    """Create a test user and return user data with access token."""
    user = User(
        email="test@example.com",
        hashed_password="$2b$12$test_hash",
        full_name="Test User",
        is_active=True,
        is_superuser=False
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    access_token = create_access_token(
        data={"sub": user.email}
    )

    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "access_token": access_token,
        "token_type": "bearer"
    }

@pytest.fixture
async def test_superuser(db_session: AsyncSession) -> Dict[str, Any]:
    """Create a test superuser and return user data with access token."""
    user = User(
        email="admin@example.com",
        hashed_password="$2b$12$test_hash",
        full_name="Admin User",
        is_active=True,
        is_superuser=True
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    access_token = create_access_token(
        data={"sub": user.email}
    )

    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "access_token": access_token,
        "token_type": "bearer"
    }

@pytest.fixture(autouse=True)
async def cleanup_test_data(db_session: AsyncSession):
    """Cleanup test data after each test."""
    yield
    await db_session.rollback()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)