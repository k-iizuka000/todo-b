import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Comment {
  id: string;
  promptId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userAvatar?: string;
  userName: string;
}

interface UseCommentsReturn {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  addComment: (promptId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  updateComment: (commentId: string, content: string) => Promise<void>;
  refreshComments: (promptId: string) => Promise<void>;
}

const useComments = (initialPromptId?: string): UseCommentsReturn => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // コメントを取得する関数
  const fetchComments = useCallback(async (promptId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/prompts/${promptId}/comments`);
      setComments(response.data);
      setError(null);
    } catch (err) {
      setError('コメントの取得に失敗しました');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // コメントを追加する関数
  const addComment = async (promptId: string, content: string) => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/prompts/${promptId}/comments`, {
        content
      });
      setComments(prev => [...prev, response.data]);
      setError(null);
    } catch (err) {
      setError('コメントの投稿に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // コメントを削除する関数
  const deleteComment = async (commentId: string) => {
    try {
      setLoading(true);
      await axios.delete(`/api/comments/${commentId}`);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      setError(null);
    } catch (err) {
      setError('コメントの削除に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // コメントを更新する関数
  const updateComment = async (commentId: string, content: string) => {
    try {
      setLoading(true);
      const response = await axios.put(`/api/comments/${commentId}`, {
        content
      });
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId ? response.data : comment
        )
      );
      setError(null);
    } catch (err) {
      setError('コメントの更新に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // コメントを再取得する関数
  const refreshComments = async (promptId: string) => {
    await fetchComments(promptId);
  };

  // 初期プロンプトIDが提供された場合、コメントを自動的に取得
  useEffect(() => {
    if (initialPromptId) {
      fetchComments(initialPromptId);
    }
  }, [initialPromptId, fetchComments]);

  return {
    comments,
    loading,
    error,
    addComment,
    deleteComment,
    updateComment,
    refreshComments
  };
};

export default useComments;
const { 
  comments, 
  loading, 
  error, 
  addComment 
} = useComments('prompt-123');

// コメントを追加
await addComment('prompt-123', 'This is a new comment');