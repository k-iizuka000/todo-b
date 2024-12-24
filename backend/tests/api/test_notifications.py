import pytest
from datetime import datetime
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.notification import Notification
from app.models.user import User
from app.core.config import settings

def test_get_user_notifications(client: TestClient, db: Session, test_user: User):
    """ユーザーの通知一覧取得テスト"""
    # テスト用の通知データを作成
    notification = Notification(
        user_id=test_user.id,
        type="comment",
        content="新しいコメントが追加されました",
        is_read=False,
        created_at=datetime.utcnow()
    )
    db.add(notification)
    db.commit()

    # 認証ヘッダーを設定
    headers = {"Authorization": f"Bearer {test_user.create_access_token()}"}
    
    # 通知一覧を取得
    response = client.get("/api/notifications/", headers=headers)
    
    assert response.status_code == 200
    notifications = response.json()
    assert len(notifications) >= 1
    assert notifications[0]["type"] == "comment"
    assert notifications[0]["content"] == "新しいコメントが追加されました"
    assert not notifications[0]["is_read"]

def test_mark_notification_as_read(client: TestClient, db: Session, test_user: User):
    """通知を既読にするテスト"""
    # テスト用の通知データを作成
    notification = Notification(
        user_id=test_user.id,
        type="like",
        content="あなたのプロンプトがいいねされました",
        is_read=False,
        created_at=datetime.utcnow()
    )
    db.add(notification)
    db.commit()

    headers = {"Authorization": f"Bearer {test_user.create_access_token()}"}
    
    # 通知を既読にする
    response = client.put(
        f"/api/notifications/{notification.id}/read",
        headers=headers
    )
    
    assert response.status_code == 200
    updated_notification = response.json()
    assert updated_notification["is_read"]

def test_delete_notification(client: TestClient, db: Session, test_user: User):
    """通知削除テスト"""
    # テスト用の通知データを作成
    notification = Notification(
        user_id=test_user.id,
        type="system",
        content="システム通知",
        is_read=False,
        created_at=datetime.utcnow()
    )
    db.add(notification)
    db.commit()

    headers = {"Authorization": f"Bearer {test_user.create_access_token()}"}
    
    # 通知を削除
    response = client.delete(
        f"/api/notifications/{notification.id}",
        headers=headers
    )
    
    assert response.status_code == 204
    
    # 削除された通知が取得できないことを確認
    deleted_notification = db.query(Notification).filter(
        Notification.id == notification.id
    ).first()
    assert deleted_notification is None

def test_get_unread_notification_count(client: TestClient, db: Session, test_user: User):
    """未読通知数取得テスト"""
    # テスト用の未読通知を複数作成
    notifications = [
        Notification(
            user_id=test_user.id,
            type="comment",
            content=f"テスト通知 {i}",
            is_read=False,
            created_at=datetime.utcnow()
        )
        for i in range(3)
    ]
    db.add_all(notifications)
    db.commit()

    headers = {"Authorization": f"Bearer {test_user.create_access_token()}"}
    
    # 未読通知数を取得
    response = client.get("/api/notifications/unread/count", headers=headers)
    
    assert response.status_code == 200
    count = response.json()["count"]
    assert count >= 3

def test_mark_all_notifications_as_read(client: TestClient, db: Session, test_user: User):
    """全通知を既読にするテスト"""
    # テスト用の未読通知を複数作成
    notifications = [
        Notification(
            user_id=test_user.id,
            type="comment",
            content=f"テスト通知 {i}",
            is_read=False,
            created_at=datetime.utcnow()
        )
        for i in range(3)
    ]
    db.add_all(notifications)
    db.commit()

    headers = {"Authorization": f"Bearer {test_user.create_access_token()}"}
    
    # 全通知を既読にする
    response = client.put("/api/notifications/read/all", headers=headers)
    
    assert response.status_code == 200
    
    # すべての通知が既読になっていることを確認
    unread_count = db.query(Notification).filter(
        Notification.user_id == test_user.id,
        Notification.is_read == False
    ).count()
    assert unread_count == 0