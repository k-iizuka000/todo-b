import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// プロンプトの型定義
interface Prompt {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  tags: string[];
  category: string;
  isPublic: boolean;
}

// フィルター条件の型定義
interface FilterOptions {
  search?: string;
  category?: string;
  tags?: string[];
  sortBy?: 'latest' | 'popular';
}

// カスタムフックの戻り値の型定義
interface UsePromptsReturn {
  prompts: Prompt[];
  loading: boolean;
  error: string | null;
  fetchPrompts: (options?: FilterOptions) => Promise<void>;
  createPrompt: (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePrompt: (id: string, promptData: Partial<Prompt>) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
  likePrompt: (id: string) => Promise<void>;
  refreshPrompts: () => Promise<void>;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

export const usePrompts = (): UsePromptsReturn => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // プロンプト一覧を取得する関数
  const fetchPrompts = useCallback(async (options?: FilterOptions) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (options?.search) params.append('search', options.search);
      if (options?.category) params.append('category', options.category);
      if (options?.tags) options.tags.forEach(tag => params.append('tags', tag));
      if (options?.sortBy) params.append('sortBy', options.sortBy);

      const response = await axios.get(`${API_BASE_URL}/prompts`, { params });
      setPrompts(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prompts');
    } finally {
      setLoading(false);
    }
  }, []);

  // 新規プロンプトを作成する関数
  const createPrompt = async (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      await axios.post(`${API_BASE_URL}/prompts`, promptData);
      await fetchPrompts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create prompt');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // プロンプトを更新する関数
  const updatePrompt = async (id: string, promptData: Partial<Prompt>) => {
    try {
      setLoading(true);
      setError(null);
      await axios.put(`${API_BASE_URL}/prompts/${id}`, promptData);
      await fetchPrompts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update prompt');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // プロンプトを削除する関数
  const deletePrompt = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`${API_BASE_URL}/prompts/${id}`);
      await fetchPrompts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete prompt');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // プロンプトにいいねをする関数
  const likePrompt = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await axios.post(`${API_BASE_URL}/prompts/${id}/like`);
      await fetchPrompts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to like prompt');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // プロンプト一覧を更新する関数
  const refreshPrompts = async () => {
    await fetchPrompts();
  };

  // 初回マウント時にプロンプト一覧を取得
  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  return {
    prompts,
    loading,
    error,
    fetchPrompts,
    createPrompt,
    updatePrompt,
    deletePrompt,
    likePrompt,
    refreshPrompts,
  };
};

export default usePrompts;