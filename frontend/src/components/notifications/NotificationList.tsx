import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography, IconButton, Badge } from '@mui/material';
import { Delete as DeleteIcon, Check as CheckIcon } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'comment' | 'like' | 'mention' | 'follow';
  message: string;
  isRead: boolean;
  createdAt: string;
  link: string;
}

interface NotificationListProps {
  onMarkAsRead?: (notificationId: string) => void;
  onDelete?: (notificationId: string) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  onMarkAsRead,
  onDelete,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/notifications');
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
      });
      onMarkAsRead?.(notificationId);
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });
      onDelete?.(notificationId);
      setNotifications(prevNotifications =>
        prevNotifications.filter(notification => notification.id !== notificationId)
      );
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    // TODO: Add appropriate icons for different notification types
    switch (type) {
      case 'comment':
        return '💬';
      case 'like':
        return '❤️';
      case 'mention':
        return '@';
      case 'follow':
        return '👤';
      default:
        return '📢';
    }
  };

  if (loading) {
    return <Typography>Loading notifications...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (notifications.length === 0) {
    return <Typography>No notifications</Typography>;
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto' }}>
      <List>
        {notifications.map((notification) => (
          <ListItem
            key={notification.id}
            sx={{
              bgcolor: notification.isRead ? 'transparent' : 'action.hover',
              borderRadius: 1,
              mb: 1,
            }}
            secondaryAction={
              <Box>
                <IconButton
                  edge="end"
                  aria-label="mark as read"
                  onClick={() => handleMarkAsRead(notification.id)}
                  disabled={notification.isRead}
                >
                  <CheckIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(notification.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
          >
            <Badge
              color="primary"
              variant="dot"
              invisible={notification.isRead}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{getNotificationIcon(notification.type)}</span>
                    <Typography component="span">{notification.message}</Typography>
                  </Box>
                }
                secondary={formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              />
            </Badge>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default NotificationList;