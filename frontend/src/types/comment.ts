// コメントの基本的な型定義
export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  promptId: string;
  parentCommentId?: string; // 返信コメントの場合の親コメントID
  isEdited: boolean;
  isDeleted: boolean;
}

// コメント作成時に必要なデータの型定義
export interface CreateCommentDto {
  content: string;
  promptId: string;
  parentCommentId?: string;
}

// コメント更新時に必要なデータの型定義
export interface UpdateCommentDto {
  content: string;
}

// コメントの表示用データの型定義（追加情報を含む）
export interface CommentWithAuthor extends Comment {
  author: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  replyCount: number;
  likeCount: number;
  hasUserLiked: boolean;
}

// コメントのページネーション用レスポンスの型定義
export interface CommentPaginationResponse {
  comments: CommentWithAuthor[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

// コメントのソート方法を定義
export enum CommentSortType {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  MOST_LIKED = 'most_liked'
}

// コメントの取得オプションの型定義
export interface GetCommentsOptions {
  promptId: string;
  page?: number;
  limit?: number;
  sortBy?: CommentSortType;
  parentCommentId?: string;
}

// コメントの状態を管理するための型定義
export interface CommentState {
  isLoading: boolean;
  error: string | null;
  data: CommentWithAuthor[] | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// コメントに対するアクション結果の型定義
export interface CommentActionResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: CommentWithAuthor;
}