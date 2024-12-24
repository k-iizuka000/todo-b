from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.models.notification import Notification
from app.schemas.notification import (
    NotificationCreate,
    NotificationResponse,
    NotificationUpdate
)
from app.crud.notification import (
    create_notification,
    get_notifications,
    get_notification_by_id,
    update_notification,
    delete_notification,
    mark_notification_as_read
)

router = APIRouter()

@router.get("/", response_model=List[NotificationResponse])
async def list_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    unread_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ユーザーの通知一覧を取得します。
    - skip: ページネーションのオフセット
    - limit: 1ページあたりの最大件数
    - unread_only: 未読の通知のみを取得するかどうか
    """
    notifications = get_notifications(
        db=db,
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        unread_only=unread_only
    )
    return notifications

@router.get("/{notification_id}", response_model=NotificationResponse)
async def get_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    指定されたIDの通知を取得します。
    """
    notification = get_notification_by_id(db, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    if notification.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this notification")
    return notification

@router.post("/", response_model=NotificationResponse)
async def create_new_notification(
    notification: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    新しい通知を作成します。
    主に内部システムから呼び出されることを想定しています。
    """
    return create_notification(db=db, notification=notification, user_id=current_user.id)

@router.patch("/{notification_id}/read", response_model=NotificationResponse)
async def mark_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    通知を既読状態にマークします。
    """
    notification = get_notification_by_id(db, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    if notification.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this notification")
    
    return mark_notification_as_read(db=db, notification_id=notification_id)

@router.delete("/{notification_id}")
async def remove_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    指定された通知を削除します。
    """
    notification = get_notification_by_id(db, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    if notification.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this notification")
    
    delete_notification(db=db, notification_id=notification_id)
    return {"message": "Notification successfully deleted"}

@router.patch("/read-all")
async def mark_all_as_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ユーザーの全ての未読通知を既読状態にマークします。
    """
    notifications = get_notifications(
        db=db,
        user_id=current_user.id,
        unread_only=True
    )
    for notification in notifications:
        mark_notification_as_read(db=db, notification_id=notification.id)
    
    return {"message": "All notifications marked as read"}