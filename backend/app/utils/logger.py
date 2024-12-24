import logging
import logging.handlers
import os
from datetime import datetime
import json
from typing import Dict, Any

class CustomJsonFormatter(logging.Formatter):
    """
    JSONフォーマットでログを出力するためのカスタムフォーマッタ
    """
    def format(self, record: logging.LogRecord) -> str:
        log_data: Dict[str, Any] = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': record.levelname,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName,
            'line': record.lineno
        }
        
        # 例外情報がある場合は追加
        if record.exc_info:
            log_data['exception'] = self.formatException(record.exc_info)

        # extra引数で渡された追加情報があれば追加
        if hasattr(record, 'extra'):
            log_data.update(record.extra)

        return json.dumps(log_data)

def setup_logger(name: str = 'prompthub') -> logging.Logger:
    """
    アプリケーション用のロガーをセットアップする

    Args:
        name (str): ロガーの名前

    Returns:
        logging.Logger: 設定済みのロガーインスタンス
    """
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    # ログファイルの保存先ディレクトリを作成
    log_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'logs')
    os.makedirs(log_dir, exist_ok=True)

    # ファイルハンドラの設定
    log_file = os.path.join(log_dir, f'{name}.log')
    file_handler = logging.handlers.RotatingFileHandler(
        log_file,
        maxBytes=10 * 1024 * 1024,  # 10MB
        backupCount=5,
        encoding='utf-8'
    )
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(CustomJsonFormatter())

    # コンソールハンドラの設定
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(CustomJsonFormatter())

    # ハンドラの追加（既存のハンドラを削除してから）
    logger.handlers.clear()
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)

    # 親ロガーへの伝播を防止
    logger.propagate = False

    return logger

# デフォルトロガーのインスタンスを作成
default_logger = setup_logger()

def get_logger(name: str = None) -> logging.Logger:
    """
    指定された名前のロガーを取得する
    名前が指定されていない場合はデフォルトロガーを返す

    Args:
        name (str, optional): ロガーの名前

    Returns:
        logging.Logger: ロガーインスタンス
    """
    if name:
        return setup_logger(name)
    return default_logger

# 使用例:
# from utils.logger import get_logger
# logger = get_logger()
# logger.info("Information message")
# logger.error("Error message", extra={'user_id': '123', 'action': 'login'})