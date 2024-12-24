import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Chip,
  Avatar,
  Button,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Share,
  Comment,
  BookmarkBorder,
  Bookmark,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

interface PromptCardProps {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  tags: string[];
  likes: number;
  comments: number;
  createdAt: Date;
  isLiked?: boolean;
  isSaved?: boolean;
  onLike?: (id: string) => void;
  onSave?: (id: string) => void;
  onComment?: (id: string) => void;
  onShare?: (id: string) => void;
  onClick?: (id: string) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({
  id,
  title,
  content,
  author,
  tags,
  likes,
  comments,
  createdAt,
  isLiked = false,
  isSaved = false,
  onLike,
  onSave,
  onComment,
  onShare,
  onClick,
}) => {
  // コンテンツを200文字に制限する
  const truncatedContent = content.length > 200
    ? `${content.substring(0, 200)}...`
    : content;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike?.(id);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave?.(id);
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onComment?.(id);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(id);
  };

  return (
    <Card 
      sx={{ 
        maxWidth: 600, 
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out',
        }
      }}
      onClick={() => onClick?.(id)}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            src={author.avatar}
            alt={author.name}
            sx={{ marginRight: 1 }}
          />
          <Box>
            <Typography variant="subtitle1">{author.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(createdAt, { addSuffix: true })}
            </Typography>
          </Box>
        </Box>

        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {truncatedContent}
        </Typography>

        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant="outlined"
              onClick={(e) => e.stopPropagation()}
            />
          ))}
        </Box>
      </CardContent>

      <CardActions disableSpacing>
        <IconButton onClick={handleLikeClick}>
          {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
          <Typography variant="caption" sx={{ ml: 1 }}>
            {likes}
          </Typography>
        </IconButton>

        <IconButton onClick={handleCommentClick}>
          <Comment />
          <Typography variant="caption" sx={{ ml: 1 }}>
            {comments}
          </Typography>
        </IconButton>

        <IconButton onClick={handleSaveClick}>
          {isSaved ? <Bookmark color="primary" /> : <BookmarkBorder />}
        </IconButton>

        <Box flexGrow={1} />

        <IconButton onClick={handleShareClick}>
          <Share />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default PromptCard;