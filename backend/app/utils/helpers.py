import re
import uuid
import hashlib
from datetime import datetime
from typing import Optional, Any, Dict, List
import jwt
from slugify import slugify
import bleach

def generate_unique_id() -> str:
    """
    ユニークなIDを生成する
    
    Returns:
        str: ユニークなID
    """
    return str(uuid.uuid4())

def sanitize_html(content: str) -> str:
    """
    HTMLコンテンツをサニタイズする
    
    Args:
        content (str): サニタイズする HTML コンテンツ
        
    Returns:
        str: サニタイズされた HTML コンテンツ
    """
    allowed_tags = ['p', 'b', 'i', 'u', 'em', 'strong', 'a', 'br', 'ul', 'li']
    allowed_attributes = {'a': ['href', 'title']}
    return bleach.clean(content, tags=allowed_tags, attributes=allowed_attributes)

def create_slug(title: str) -> str:
    """
    タイトルからスラグを生成する
    
    Args:
        title (str): 元のタイトル
        
    Returns:
        str: 生成されたスラグ
    """
    return slugify(title)

def validate_email(email: str) -> bool:
    """
    メールアドレスの形式を検証する
    
    Args:
        email (str): 検証するメールアドレス
        
    Returns:
        bool: 有効なメールアドレスの場合True
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def hash_password(password: str) -> str:
    """
    パスワードをハッシュ化する
    
    Args:
        password (str): 元のパスワード
        
    Returns:
        str: ハッシュ化されたパスワード
    """
    return hashlib.sha256(password.encode()).hexdigest()

def format_datetime(dt: datetime, format_str: str = "%Y-%m-%d %H:%M:%S") -> str:
    """
    datetime オブジェクトを文字列にフォーマットする
    
    Args:
        dt (datetime): フォーマットする datetime オブジェクト
        format_str (str): 日時フォーマット
        
    Returns:
        str: フォーマットされた日時文字列
    """
    return dt.strftime(format_str)

def generate_jwt_token(payload: Dict[str, Any], secret_key: str, expires_in: int = 3600) -> str:
    """
    JWTトークンを生成する
    
    Args:
        payload (Dict[str, Any]): トークンに含めるデータ
        secret_key (str): 秘密鍵
        expires_in (int): 有効期限（秒）
        
    Returns:
        str: 生成されたJWTトークン
    """
    payload['exp'] = datetime.utcnow().timestamp() + expires_in
    return jwt.encode(payload, secret_key, algorithm='HS256')

def verify_jwt_token(token: str, secret_key: str) -> Optional[Dict[str, Any]]:
    """
    JWTトークンを検証する
    
    Args:
        token (str): 検証するトークン
        secret_key (str): 秘密鍵
        
    Returns:
        Optional[Dict[str, Any]]: デコードされたペイロード、無効な場合はNone
    """
    try:
        return jwt.decode(token, secret_key, algorithms=['HS256'])
    except jwt.InvalidTokenError:
        return None

def truncate_text(text: str, max_length: int = 100) -> str:
    """
    テキストを指定された長さに切り詰める
    
    Args:
        text (str): 元のテキスト
        max_length (int): 最大長
        
    Returns:
        str: 切り詰められたテキスト
    """
    if len(text) <= max_length:
        return text
    return text[:max_length-3] + "..."

def extract_tags(content: str) -> List[str]:
    """
    テキストからハッシュタグを抽出する
    
    Args:
        content (str): 元のテキスト
        
    Returns:
        List[str]: 抽出されたタグのリスト
    """
    pattern = r'#(\w+)'
    return list(set(re.findall(pattern, content)))

def is_valid_username(username: str) -> bool:
    """
    ユーザー名が有効か検証する
    
    Args:
        username (str): 検証するユーザー名
        
    Returns:
        bool: 有効な場合True
    """
    pattern = r'^[a-zA-Z0-9_]{3,20}$'
    return bool(re.match(pattern, username))