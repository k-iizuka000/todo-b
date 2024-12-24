from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import JSONResponse
from starlette.middleware.sessions import SessionMiddleware
from prometheus_client import Counter, Histogram
import time
import logging
import ssl
from typing import Dict, Any

from app.core.config import Settings
from app.core.security import setup_security
from app.api.v1.api import api_router
from app.middleware.logging import LoggingMiddleware
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.error_handler import ErrorHandlerMiddleware
from app.core.events import create_start_app_handler, create_stop_app_handler
from app.core.logging import setup_logging

# メトリクス定義
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests')
REQUEST_LATENCY = Histogram('http_request_duration_seconds', 'HTTP request duration')

# ロギング設定
logger = logging.getLogger(__name__)

def create_application() -> FastAPI:
    """
    FastAPIアプリケーションの初期化と設定
    """
    settings = Settings()
    
    # FastAPIインスタンスの作成
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description=settings.PROJECT_DESCRIPTION,
        version=settings.VERSION,
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json"
    )

    # セキュリティ設定
    setup_security(app)
    
    # ミドルウェアの設定
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(HTTPSRedirectMiddleware)
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.ALLOWED_HOSTS)
    app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)
    app.add_middleware(LoggingMiddleware)
    app.add_middleware(RateLimitMiddleware)
    app.add_middleware(ErrorHandlerMiddleware)

    # パフォーマンスモニタリング
    @app.middleware("http")
    async def monitor_requests(request: Request, call_next):
        REQUEST_COUNT.inc()
        start_time = time.time()
        response = await call_next(request)
        REQUEST_LATENCY.observe(time.time() - start_time)
        return response

    # グローバルエラーハンドラー
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
        )

    # ルーターの登録
    app.include_router(
        api_router,
        prefix="/api/v1"
    )

    # アプリケーションイベントハンドラーの設定
    app.add_event_handler("startup", create_start_app_handler(app))
    app.add_event_handler("shutdown", create_stop_app_handler(app))

    return app

# アプリケーションインスタンスの作成
app = create_application()

if __name__ == "__main__":
    import uvicorn
    
    # SSL/TLS設定
    ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
    ssl_context.load_cert_chain(
        certfile=Settings().SSL_CERTFILE,
        keyfile=Settings().SSL_KEYFILE
    )
    
    # サーバー起動
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        ssl=ssl_context,
        reload=Settings().DEBUG,
        workers=Settings().WORKERS_COUNT,
        log_level="info"
    )