import React, { useState } from 'react';
import { Box, Button, TextField, Alert } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { createComment } from '../../services/commentService';

interface CommentFormProps {
  promptId: string;
  onCommentSubmitted: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ promptId, onCommentSubmitted }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  // コメント投稿処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('コメントを投稿するにはログインが必要です');
      return;
    }

    if (!content.trim()) {
      setError('コメント内容を入力してください');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await createComment({
        promptId,
        content: content.trim(),
        userId: user.id,
      });

      // フォームをリセット
      setContent('');
      // 親コンポーネントに投稿完了を通知
      onCommentSubmitted();
    } catch (err) {
      setError('コメントの投稿に失敗しました。後でもう一度お試しください。');
      console.error('Comment submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, mb: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <TextField
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        placeholder="コメントを入力してください"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSubmitting}
        sx={{ mb: 2 }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting || !content.trim()}
        sx={{ float: 'right' }}
      >
        {isSubmitting ? '投稿中...' : 'コメントを投稿'}
      </Button>
    </Box>
  );
};

export default CommentForm;