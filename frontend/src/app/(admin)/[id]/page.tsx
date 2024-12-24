'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Alert, Button, Card, Tabs, Tab } from '@mui/material';
import UserManagement from '@/components/admin/UserManagement';
import PromptManagement from '@/components/admin/PromptManagement';
import ReportsManagement from '@/components/admin/ReportsManagement';
import SystemSettings from '@/components/admin/SystemSettings';
import { useAuth } from '@/hooks/useAuth';
import { fetchAdminData } from '@/services/adminService';

interface AdminPageProps {
  params: {
    id: string;
  }
}

enum TabValue {
  USERS = 'users',
  PROMPTS = 'prompts',
  REPORTS = 'reports',
  SETTINGS = 'settings',
}

export default function AdminPage({ params }: AdminPageProps) {
  const { id } = useParams();
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabValue>(TabValue.USERS);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState<any>(null);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        if (!user?.isAdmin) {
          setError('アクセス権限がありません');
          return;
        }

        const data = await fetchAdminData(id as string);
        setAdminData(data);
      } catch (err) {
        setError('データの読み込み中にエラーが発生しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadAdminData();
    }
  }, [id, user, authLoading]);

  if (authLoading || loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!user?.isAdmin) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        このページにアクセスする権限がありません
      </Alert>
    );
  }

  const handleTabChange = (_: React.SyntheticEvent, newValue: TabValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="container mx-auto p-4">
      <Card sx={{ p: 2 }}>
        <h1 className="text-2xl font-bold mb-4">管理者ダッシュボード</h1>
        
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="ユーザー管理" value={TabValue.USERS} />
          <Tab label="プロンプト管理" value={TabValue.PROMPTS} />
          <Tab label="報告管理" value={TabValue.REPORTS} />
          <Tab label="システム設定" value={TabValue.SETTINGS} />
        </Tabs>

        {activeTab === TabValue.USERS && (
          <UserManagement adminData={adminData} />
        )}
        {activeTab === TabValue.PROMPTS && (
          <PromptManagement adminData={adminData} />
        )}
        {activeTab === TabValue.REPORTS && (
          <ReportsManagement adminData={adminData} />
        )}
        {activeTab === TabValue.SETTINGS && (
          <SystemSettings adminData={adminData} />
        )}

        <div className="mt-4 flex justify-end">
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
          >
            更新
          </Button>
        </div>
      </Card>
    </div>
  );
}