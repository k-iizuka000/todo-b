/**
 * ユーザー関連の型定義
 */

// ユーザーの役割を定義
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

// ユーザーのステータスを定義
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

// 基本的なユーザープロフィール情報
export interface UserProfile {
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  website?: string;
  location?: string;
  languages?: string[];
}

// ユーザーの通知設定
export interface UserNotificationSettings {
  emailNotifications: boolean;
  promptComments: boolean;
  promptLikes: boolean;
  newFollowers: boolean;
  systemUpdates: boolean;
}

// ユーザーの統計情報
export interface UserStats {
  totalPrompts: number;
  totalLikes: number;
  totalComments: number;
  followers: number;
  following: number;
}

// メインのユーザーインターフェース
export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  profile: UserProfile;
  notificationSettings: UserNotificationSettings;
  stats: UserStats;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

// ユーザー作成時に必要な情報
export interface CreateUserInput {
  email: string;
  username: string;
  password: string;
  profile: Partial<UserProfile>;
}

// ユーザー更新時に使用する型
export interface UpdateUserInput {
  email?: string;
  profile?: Partial<UserProfile>;
  notificationSettings?: Partial<UserNotificationSettings>;
}

// ユーザー認証関連の型
export interface UserAuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// ユーザーログイン情報
export interface UserLoginInput {
  email: string;
  password: string;
}

// パスワードリセット用の型
export interface PasswordResetInput {
  email: string;
  resetToken: string;
  newPassword: string;
}

// ユーザー検索用のフィルター
export interface UserSearchFilters {
  query?: string;
  role?: UserRole;
  status?: UserStatus;
  sortBy?: 'createdAt' | 'username' | 'totalPrompts';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}