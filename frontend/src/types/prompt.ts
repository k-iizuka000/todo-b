// プロンプトの基本的な型定義
export interface Prompt {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  isPublic: boolean;
  category: PromptCategory;
  tags: string[];
  likes: number;
  views: number;
  rating: number;
  language: string;
  imageUrls?: string[];
}

// プロンプトのカテゴリー
export enum PromptCategory {
  AI = 'AI',
  CREATIVE = 'CREATIVE',
  BUSINESS = 'BUSINESS',
  EDUCATION = 'EDUCATION',
  TECHNOLOGY = 'TECHNOLOGY',
  OTHER = 'OTHER',
}

// プロンプト作成時の入力データ型
export interface CreatePromptInput {
  title: string;
  content: string;
  category: PromptCategory;
  tags: string[];
  isPublic: boolean;
  language: string;
  imageUrls?: string[];
}

// プロンプト更新時の入力データ型
export interface UpdatePromptInput extends Partial<CreatePromptInput> {
  id: string;
}

// プロンプトに対するコメント
export interface PromptComment {
  id: string;
  promptId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// プロンプトの検索条件
export interface PromptSearchParams {
  keyword?: string;
  category?: PromptCategory;
  tags?: string[];
  userId?: string;
  sortBy?: 'latest' | 'popular' | 'rating';
  page?: number;
  limit?: number;
  language?: string;
}

// プロンプトの評価
export interface PromptRating {
  id: string;
  promptId: string;
  userId: string;
  rating: number;
  createdAt: Date;
}

// プロンプトのシェア情報
export interface PromptShare {
  promptId: string;
  platform: 'twitter' | 'facebook' | 'email' | 'linkedin';
  url: string;
}

// プロンプトの統計情報
export interface PromptStats {
  promptId: string;
  totalViews: number;
  totalLikes: number;
  averageRating: number;
  totalComments: number;
  totalShares: number;
}

// プロンプトの通知
export interface PromptNotification {
  id: string;
  userId: string;
  promptId: string;
  type: 'comment' | 'like' | 'rating' | 'share';
  content: string;
  isRead: boolean;
  createdAt: Date;
}

// プロンプトのエクスポートデータ
export interface PromptExportData {
  prompt: Prompt;
  comments: PromptComment[];
  ratings: PromptRating[];
  stats: PromptStats;
}

// プロンプトの応答状態
export interface PromptResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}