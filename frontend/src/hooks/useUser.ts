import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  isAdmin: boolean;
}

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: Error | null;
  updateUser: (userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

/**
 * ユーザー情報を管理するカスタムフック
 * @returns {UseUserReturn} ユーザー情報と関連する操作メソッド
 */
export const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 初期ユーザー情報の取得
   */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  /**
   * ユーザー情報の更新
   * @param userData 更新するユーザー情報
   */
  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');

      const response = await axios.patch(
        `${API_BASE_URL}/api/users/me`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update user'));
      throw err;
    }
  };

  /**
   * ログアウト処理
   */
  const logout = async (): Promise<void> => {
    try {
      localStorage.removeItem('authToken');
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to logout'));
      throw err;
    }
  };

  /**
   * ユーザー情報の再取得
   */
  const refreshUser = async (): Promise<void> => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');

      const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh user'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    updateUser,
    logout,
    refreshUser,
  };
};

export default useUser;