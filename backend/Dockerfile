# ビルドステージ
FROM python:3.11-slim as builder

# ビルド時の依存関係をインストール
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリの設定
WORKDIR /build

# 仮想環境の作成と有効化
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# 依存関係ファイルのコピーとインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 本番ステージ
FROM python:3.11-slim

# セキュリティ更新とタイムゾーンの設定
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y --no-install-recommends \
        tzdata \
    && rm -rf /var/lib/apt/lists/* \
    && cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

# 仮想環境のコピー
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# 作業ディレクトリの設定
WORKDIR /app

# アプリケーションコードのコピー
COPY . .

# 非rootユーザーの作成と権限設定
RUN useradd -m -s /bin/bash appuser \
    && chown -R appuser:appuser /app
USER appuser

# 環境変数の設定
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# ヘルスチェックの設定
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# アプリケーションの起動
EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "main:app"]