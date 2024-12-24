import axios, { AxiosInstance, AxiosResponse } from 'axios';

// APIクライアントの基本設定
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター：認証トークンの追加
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// APIエラーの型定義
export interface ApiError {
  message: string;
  status: number;
}

// API関連の型定義
export interface Prompt {
  id: string;
  title: string;
  content: string;
  userId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
}

export interface Comment {
  id: string;
  promptId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

// API関数群
export const api = {
  // 認証関連
  auth: {
    login: async (email: string, password: string) => {
      return apiClient.post<{ token: string; user: User }>('/auth/login', { email, password });
    },
    register: async (username: string, email: string, password: string) => {
      return apiClient.post<{ token: string; user: User }>('/auth/register', {
        username,
        email,
        password,
      });
    },
    logout: async () => {
      localStorage.removeItem('auth_token');
    },
  },

  // プロンプト関連
  prompts: {
    getAll: async (params?: { page?: number; limit?: number; search?: string; tags?: string[] }) => {
      return apiClient.get<{ prompts: Prompt[]; total: number }>('/prompts', { params });
    },
    getById: async (id: string) => {
      return apiClient.get<Prompt>(`/prompts/${id}`);
    },
    create: async (data: Omit<Prompt, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'likes'>) => {
      return apiClient.post<Prompt>('/prompts', data);
    },
    update: async (id: string, data: Partial<Prompt>) => {
      return apiClient.put<Prompt>(`/prompts/${id}`, data);
    },
    delete: async (id: string) => {
      return apiClient.delete(`/prompts/${id}`);
    },
    like: async (id: string) => {
      return apiClient.post<{ likes: number }>(`/prompts/${id}/like`);
    },
  },

  // コメント関連
  comments: {
    getByPromptId: async (promptId: string) => {
      return apiClient.get<Comment[]>(`/prompts/${promptId}/comments`);
    },
    create: async (promptId: string, content: string) => {
      return apiClient.post<Comment>(`/prompts/${promptId}/comments`, { content });
    },
    delete: async (promptId: string, commentId: string) => {
      return apiClient.delete(`/prompts/${promptId}/comments/${commentId}`);
    },
  },

  // ユーザー関連
  users: {
    getProfile: async (userId: string) => {
      return apiClient.get<User>(`/users/${userId}`);
    },
    updateProfile: async (data: Partial<User>) => {
      return apiClient.put<User>('/users/profile', data);
    },
    getNotifications: async () => {
      return apiClient.get('/users/notifications');
    },
  },
};

// エラーハンドリングユーティリティ
export const handleApiError = (error: any): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
    };
  }
  return {
    message: 'An unexpected error occurred',
    status: 500,
  };
};

export default api;