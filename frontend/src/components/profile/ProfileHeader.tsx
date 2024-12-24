import React from 'react';
import { Avatar, Button, Box, Typography, IconButton } from '@mui/material';
import { Edit as EditIcon, Share as ShareIcon } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types/user';

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  onEditProfile?: () => void;
  onShare?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isOwnProfile,
  onEditProfile,
  onShare,
}) => {
  const { user: currentUser } = useAuth();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        padding: 3,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        gap: 3,
      }}
    >
      {/* プロフィール画像 */}
      <Avatar
        src={user.avatarUrl}
        alt={user.username}
        sx={{
          width: 120,
          height: 120,
          border: '3px solid',
          borderColor: 'primary.main',
        }}
      />

      {/* ユーザー情報 */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h4" component="h1">
            {user.username}
          </Typography>

          {/* アクションボタン */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isOwnProfile && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={onEditProfile}
              >
                プロフィールを編集
              </Button>
            )}
            <IconButton onClick={onShare} color="primary">
              <ShareIcon />
            </IconButton>
          </Box>
        </Box>

        {/* ユーザーの基本情報 */}
        <Typography variant="body1" color="text.secondary">
          {user.bio || 'プロフィールはまだ設定されていません'}
        </Typography>

        {/* 統計情報 */}
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            mt: 2,
          }}
        >
          <Typography variant="body2">
            投稿プロンプト: <strong>{user.promptCount || 0}</strong>
          </Typography>
          <Typography variant="body2">
            フォロワー: <strong>{user.followerCount || 0}</strong>
          </Typography>
          <Typography variant="body2">
            フォロー中: <strong>{user.followingCount || 0}</strong>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileHeader;