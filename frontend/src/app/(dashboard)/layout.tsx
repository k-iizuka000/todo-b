import { ReactNode } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Navbar } from '@/components/dashboard/Navbar';
import { AuthCheck } from '@/components/auth/AuthCheck';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        {/* ナビゲーションバー */}
        <Navbar />
        
        <div className="flex">
          {/* サイドバー */}
          <Sidebar />
          
          {/* メインコンテンツ */}
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="container mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthCheck>
  );
}

// メタデータの設定
export const metadata = {
  title: 'PromptHub Dashboard',
  description: 'プロンプトの管理と共有のためのダッシュボード',
};

// ローディング状態の表示
export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );
}

// エラー状態の表示
export function Error({ error }: { error: Error }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600">エラーが発生しました</h2>
        <p className="mt-2 text-gray-600">{error.message}</p>
      </div>
    </div>
  );
}