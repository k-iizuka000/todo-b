from typing import List, Optional
from datetime import datetime
from app.models.notification import Notification
from app.models.user import User
from app.database import db
from sqlalchemy.exc import SQLAlchemyError
from app.utils.logger import get_logger

logger = get_logger(__name__)

class NotificationService:
    """通知関連のサービスを提供するクラス"""

    @staticmethod
    async def create_notification(
        user_id: int,
        notification_type: str,
        content: str,
        related_id: Optional[int] = None
    ) -> Optional[Notification]:
        """
        新しい通知を作成する

        Args:
            user_id (int): 通知を受け取るユーザーのID
            notification_type (str): 通知のタイプ（comment, like, follow など）
            content (str): 通知の内容
            related_id (Optional[int]): 関連するコンテンツのID（プロンプトIDなど）

        Returns:
            Optional[Notification]: 作成された通知オブジェクト、失敗時はNone
        """
        try:
            notification = Notification(
                user_id=user_id,
                type=notification_type,
                content=content,
                related_id=related_id,
                created_at=datetime.utcnow(),
                is_read=False
            )
            db.session.add(notification)
            await db.session.commit()
            return notification
        except SQLAlchemyError as e:
            logger.error(f"Failed to create notification: {str(e)}")
            await db.session.rollback()
            return None

    @staticmethod
    async def get_user_notifications(
        user_id: int,
        limit: int = 20,
        offset: int = 0
    ) -> List[Notification]:
        """
        ユーザーの通知一覧を取得する

        Args:
            user_id (int): ユーザーID
            limit (int): 取得する通知の最大数
            offset (int): ページネーションのオフセット

        Returns:
            List[Notification]: 通知のリスト
        """
        try:
            notifications = await Notification.query\
                .filter(Notification.user_id == user_id)\
                .order_by(Notification.created_at.desc())\
                .offset(offset)\
                .limit(limit)\
                .all()
            return notifications
        except SQLAlchemyError as e:
            logger.error(f"Failed to get notifications: {str(e)}")
            return []

    @staticmethod
    async def mark_as_read(notification_id: int) -> bool:
        """
        通知を既読にマークする

        Args:
            notification_id (int): 通知ID

        Returns:
            bool: 成功した場合はTrue、失敗した場合はFalse
        """
        try:
            notification = await Notification.query.get(notification_id)
            if notification:
                notification.is_read = True
                notification.read_at = datetime.utcnow()
                await db.session.commit()
                return True
            return False
        except SQLAlchemyError as e:
            logger.error(f"Failed to mark notification as read: {str(e)}")
            await db.session.rollback()
            return False

    @staticmethod
    async def mark_all_as_read(user_id: int) -> bool:
        """
        ユーザーの全ての通知を既読にマークする

        Args:
            user_id (int): ユーザーID

        Returns:
            bool: 成功した場合はTrue、失敗した場合はFalse
        """
        try:
            await Notification.query\
                .filter(Notification.user_id == user_id)\
                .filter(Notification.is_read == False)\
                .update({
                    Notification.is_read: True,
                    Notification.read_at: datetime.utcnow()
                })
            await db.session.commit()
            return True
        except SQLAlchemyError as e:
            logger.error(f"Failed to mark all notifications as read: {str(e)}")
            await db.session.rollback()
            return False

    @staticmethod
    async def delete_notification(notification_id: int) -> bool:
        """
        通知を削除する

        Args:
            notification_id (int): 通知ID

        Returns:
            bool: 成功した場合はTrue、失敗した場合はFalse
        """
        try:
            notification = await Notification.query.get(notification_id)
            if notification:
                await db.session.delete(notification)
                await db.session.commit()
                return True
            return False
        except SQLAlchemyError as e:
            logger.error(f"Failed to delete notification: {str(e)}")
            await db.session.rollback()
            return False

    @staticmethod
    async def get_unread_count(user_id: int) -> int:
        """
        未読通知の数を取得する

        Args:
            user_id (int): ユーザーID

        Returns:
            int: 未読通知の数
        """
        try:
            count = await Notification.query\
                .filter(Notification.user_id == user_id)\
                .filter(Notification.is_read == False)\
                .count()
            return count
        except SQLAlchemyError as e:
            logger.error(f"Failed to get unread notification count: {str(e)}")
            return 0