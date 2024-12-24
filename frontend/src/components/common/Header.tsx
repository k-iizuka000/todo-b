import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  Box,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';

interface HeaderProps {
  onSearchOpen?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchOpen }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

  // プロフィールメニューの処理
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  // 通知メニューの処理
  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  // ログアウト処理
  const handleLogout = async () => {
    await logout();
    handleProfileMenuClose();
    navigate('/login');
  };

  return (
    <AppBar position="fixed" color="default" elevation={1}>
      <Toolbar>
        {/* ロゴ/サイト名 */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            flexGrow: 1,
          }}
        >
          PromptHub
        </Typography>

        {/* 検索ボタン */}
        <IconButton color="inherit" onClick={onSearchOpen}>
          <SearchIcon />
        </IconButton>

        {user ? (
          <>
            {/* 通知ボタン */}
            <IconButton color="inherit" onClick={handleNotificationMenuOpen}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* プロフィールボタン */}
            <IconButton
              edge="end"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {user.avatarUrl ? (
                <Avatar src={user.avatarUrl} sx={{ width: 32, height: 32 }} />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </>
        ) : (
          <Box>
            <Button color="inherit" component={Link} to="/login">
              ログイン
            </Button>
            <Button color="primary" variant="contained" component={Link} to="/signup">
              新規登録
            </Button>
          </Box>
        )}

        {/* プロフィールメニュー */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
        >
          <MenuItem component={Link} to="/profile">マイプロフィール</MenuItem>
          <MenuItem component={Link} to="/prompts">マイプロンプト</MenuItem>
          <MenuItem component={Link} to="/settings">設定</MenuItem>
          <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
        </Menu>

        {/* 通知メニュー */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationMenuClose}
        >
          {notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => {
                handleNotificationMenuClose();
                navigate(notification.link);
              }}
            >
              {notification.message}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;