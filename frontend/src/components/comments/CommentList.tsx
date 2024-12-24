import React, { useState, useEffect } from 'react';
import { Box, List, Typography, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Comment } from '../../types/comment';
import CommentItem from './CommentItem';
import Pagination from '@mui/material/Pagination';
import { useAuth } from '../../hooks/useAuth';

interface CommentListProps {
  promptId: string;
  onCommentUpdate?: () => void;
}

const CommentList: React.FC<CommentListProps> = ({ promptId, onCommentUpdate }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const { user } = useAuth();
  
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchComments();
  }, [promptId, page, sortBy]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/prompts/${promptId}/comments?page=${page}&limit=${ITEMS_PER_PAGE}&sort=${sortBy}`
      );
      
      if (!response.ok) {
        throw new Error('コメントの取得に失敗しました');
      }

      const data = await response.json();
      setComments(data.comments);
      setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSortBy(event.target.value as string);
    setPage(1);
  };

  const handleCommentDelete = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (!response.ok) {
        throw new Error('コメントの削除に失敗しました');
      }

      await fetchComments();
      onCommentUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">コメント ({comments.length})</Typography>
        <FormControl size="small">
          <InputLabel>並び替え</InputLabel>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            label="並び替え"
          >
            <MenuItem value="newest">新しい順</MenuItem>
            <MenuItem value="oldest">古い順</MenuItem>
            <MenuItem value="likes">いいね順</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {comments.length === 0 ? (
        <Typography color="textSecondary" align="center" py={3}>
          まだコメントはありません
        </Typography>
      ) : (
        <List>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDelete={handleCommentDelete}
              currentUserId={user?.id}
            />
          ))}
        </List>
      )}

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default CommentList;