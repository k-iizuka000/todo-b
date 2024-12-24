// 通知の種類を定義
export enum NotificationType {
  COMMENT = 'COMMENT',           // コメント通知
  LIKE = 'LIKE',                // いいね通知
  FOLLOW = 'FOLLOW',            // フォロー通知
  MENTION = 'MENTION',          // メンション通知
  PROMPT_SHARE = 'PROMPT_SHARE', // プロンプト共有通知
  SYSTEM = 'SYSTEM',            // システム通知
}

// 通知の重要度を定義
export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

// 通知の状態を定義
export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
  ARCHIVED = 'ARCHIVED',
}

// 通知のリンク情報の型定義
export interface NotificationLink {
  url: string;
  type: 'prompt' | 'user' | 'comment' | 'external';
}

// 通知の基本情報の型定義
export interface BaseNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: Date;
  status: NotificationStatus;
  priority: NotificationPriority;
  link?: NotificationLink;
}

// コメント通知の型定義
export interface CommentNotification extends BaseNotification {
  type: NotificationType.COMMENT;
  promptId: string;
  commentId: string;
  commentAuthorId: string;
}

// いいね通知の型定義
export interface LikeNotification extends BaseNotification {
  type: NotificationType.LIKE;
  promptId: string;
  likedByUserId: string;
}

// フォロー通知の型定義
export interface FollowNotification extends BaseNotification {
  type: NotificationType.FOLLOW;
  followerUserId: string;
}

// システム通知の型定義
export interface SystemNotification extends BaseNotification {
  type: NotificationType.SYSTEM;
  category: 'maintenance' | 'update' | 'security' | 'other';
}

// 通知設定の型定義
export interface NotificationSettings {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  inAppNotifications: boolean;
  notificationPreferences: {
    [key in NotificationType]: {
      enabled: boolean;
      priority: NotificationPriority;
    };
  };
}

// 通知の集約型
export type Notification =
  | CommentNotification
  | LikeNotification
  | FollowNotification
  | SystemNotification;

// 通知フィルターの型定義
export interface NotificationFilter {
  type?: NotificationType[];
  status?: NotificationStatus[];
  priority?: NotificationPriority[];
  startDate?: Date;
  endDate?: Date;
}

// 通知ペイロードの型定義
export interface NotificationPayload {
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  data?: Record<string, any>;
}