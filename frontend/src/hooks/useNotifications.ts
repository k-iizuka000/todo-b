import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Notification {
  id: string;
  userId: string;
  type: 'comment' | 'like' | 'mention' | 'follow' | 'system';
  content: string;
  isRead: boolean;
  createdAt: string;
  relatedItemId?: string;
  relatedItemType?: 'prompt' | 'comment' | 'profile';
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: Error | null;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // 通知データを取得する関数
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/notifications');
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.notifications.filter((n: Notification) => !n.isRead).length);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch notifications'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 特定の通知を既読にする関数
  const markAsRead = async (notificationId: string) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to mark notification as read'));
    }
  };

  // すべての通知を既読にする関数
  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to mark all notifications as read'));
    }
  };

  // コンポーネントのマウント時に通知を取得
  useEffect(() => {
    fetchNotifications();

    // WebSocket接続を設定（オプション）
    const ws = new WebSocket(process.env.REACT_APP_WS_URL || 'ws://localhost:8080');
    
    ws.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    return () => {
      ws.close();
    };
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
  };
};

export default useNotifications;
const MyComponent = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div>Unread notifications: {unreadCount}</div>
      {notifications.map(notification => (
        <div key={notification.id} onClick={() => markAsRead(notification.id)}>
          {notification.content}
        </div>
      ))}
      <button onClick={markAllAsRead}>Mark all as read</button>
    </div>
  );
};