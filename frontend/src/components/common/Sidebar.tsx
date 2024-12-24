import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  SearchIcon, 
  PlusCircleIcon, 
  UserIcon, 
  BellIcon, 
  CogIcon, 
  LogoutIcon 
} from '@heroicons/react/outline';
import { useAuth } from '../../hooks/useAuth';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  // ナビゲーションアイテムの定義
  const navigationItems: NavItem[] = [
    {
      name: 'ホーム',
      path: '/',
      icon: HomeIcon,
    },
    {
      name: '検索',
      path: '/search',
      icon: SearchIcon,
    },
    {
      name: '新規プロンプト',
      path: '/create',
      icon: PlusCircleIcon,
    },
    {
      name: 'プロフィール',
      path: `/profile/${user?.id}`,
      icon: UserIcon,
    },
    {
      name: '通知',
      path: '/notifications',
      icon: BellIcon,
    },
    {
      name: '設定',
      path: '/settings',
      icon: CogIcon,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="h-screen w-64 bg-white shadow-lg fixed left-0 top-0">
      <div className="px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">PromptHub</h1>
        </div>

        <div className="space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.name}</span>
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <LogoutIcon className="w-5 h-5 mr-3" />
            <span>ログアウト</span>
          </button>
        </div>
      </div>

      {/* ユーザープロフィール情報 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
        <div className="flex items-center">
          <img
            src={user?.avatarUrl || '/default-avatar.png'}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;