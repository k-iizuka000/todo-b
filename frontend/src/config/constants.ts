/**
 * アプリケーション全体で使用する定数を定義
 */

// API関連の設定
export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH_TOKEN: '/auth/refresh',
    },
    PROMPTS: {
      BASE: '/prompts',
      SEARCH: '/prompts/search',
      COMMENTS: '/prompts/comments',
      LIKES: '/prompts/likes',
    },
    USERS: {
      PROFILE: '/users/profile',
      SETTINGS: '/users/settings',
      NOTIFICATIONS: '/users/notifications',
    },
  },
}

// ページネーション設定
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
}

// プロンプトカテゴリー
export const PROMPT_CATEGORIES = [
  'AI会話',
  '画像生成',
  'コード生成',
  '文章作成',
  'データ分析',
  'その他',
] as const

// プロンプト評価
export const RATING = {
  MIN: 1,
  MAX: 5,
}

// ファイルアップロード制限
export const UPLOAD_LIMITS = {
  IMAGE_SIZE_MB: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
}

// 通知タイプ
export const NOTIFICATION_TYPES = {
  COMMENT: 'comment',
  LIKE: 'like',
  FOLLOW: 'follow',
  SYSTEM: 'system',
} as const

// ローカルストレージキー
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_SETTINGS: 'user_settings',
  THEME: 'theme',
  LANGUAGE: 'language',
}

// バリデーション制約
export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 100,
  },
  PROMPT: {
    TITLE_MAX_LENGTH: 100,
    CONTENT_MAX_LENGTH: 5000,
  },
  COMMENT: {
    MAX_LENGTH: 1000,
  },
}

// 言語設定
export const LANGUAGES = {
  JA: 'ja',
  EN: 'en',
} as const

// テーマ設定
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const

// シェアオプション
export const SHARE_PLATFORMS = {
  TWITTER: 'twitter',
  FACEBOOK: 'facebook',
  LINE: 'line',
  EMAIL: 'email',
} as const

// エラーメッセージ
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNAUTHORIZED: '認証が必要です',
  FORBIDDEN: 'アクセスが拒否されました',
  NOT_FOUND: 'リソースが見つかりません',
  SERVER_ERROR: 'サーバーエラーが発生しました',
} as const