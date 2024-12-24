import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider } from '@mui/material';
import { format } from 'date-fns';
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CreateIcon from '@mui/icons-material/Create';

interface Activity {
  id: string;
  type: 'comment' | 'like' | 'share' | 'prompt';
  content: string;
  timestamp: Date;
  relatedPromptId?: string;
  relatedPromptTitle?: string;
}

interface ActivityFeedProps {
  userId: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ userId }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // API呼び出しを想定
        const response = await fetch(`/api/users/${userId}/activities`);
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        const data = await response.json();
        setActivities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [userId]);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'comment':
        return <CommentIcon color="primary" />;
      case 'like':
        return <FavoriteIcon color="error" />;
      case 'share':
        return <ShareIcon color="action" />;
      case 'prompt':
        return <CreateIcon color="secondary" />;
      default:
        return null;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'comment':
        return `Commented on prompt "${activity.relatedPromptTitle}"`;
      case 'like':
        return `Liked prompt "${activity.relatedPromptTitle}"`;
      case 'share':
        return `Shared prompt "${activity.relatedPromptTitle}"`;
      case 'prompt':
        return `Created a new prompt "${activity.content}"`;
      default:
        return activity.content;
    }
  };

  if (loading) {
    return <Typography>Loading activities...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom>
        Activity Feed
      </Typography>
      <List>
        {activities.map((activity, index) => (
          <React.Fragment key={activity.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar>{getActivityIcon(activity.type)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={getActivityText(activity)}
                secondary={
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {format(new Date(activity.timestamp), 'PPP')}
                  </Typography>
                }
              />
            </ListItem>
            {index < activities.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default ActivityFeed;