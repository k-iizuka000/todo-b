'use client';

import React from 'react';
import { Card, Grid, Text, Metric, Title, BarChart, DonutChart } from '@tremor/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// ダッシュボードの統計データの型定義
interface DashboardStats {
  totalUsers: number;
  totalPrompts: number;
  totalComments: number;
  activeUsers: number;
  reportedContent: number;
  dailyStats: {
    date: string;
    users: number;
    prompts: number;
  }[];
  categoryDistribution: {
    category: string;
    count: number;
  }[];
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 管理者権限チェック
  React.useEffect(() => {
    if (status === 'unauthenticated' || (session?.user && !session.user.isAdmin)) {
      router.push('/login');
    }
  }, [session, status, router]);

  // ダッシュボードデータの取得
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (!stats) return null;

  return (
    <AdminLayout>
      <div className="p-6">
        <Title className="mb-6">管理者ダッシュボード</Title>

        {/* 主要な統計情報 */}
        <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6 mb-6">
          <Card>
            <Text>総ユーザー数</Text>
            <Metric>{stats.totalUsers}</Metric>
          </Card>
          <Card>
            <Text>総プロンプト数</Text>
            <Metric>{stats.totalPrompts}</Metric>
          </Card>
          <Card>
            <Text>総コメント数</Text>
            <Metric>{stats.totalComments}</Metric>
          </Card>
          <Card>
            <Text>要対応報告件数</Text>
            <Metric>{stats.reportedContent}</Metric>
          </Card>
        </Grid>

        {/* アクティビティチャート */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <Title>日別アクティビティ</Title>
            <BarChart
              data={stats.dailyStats}
              index="date"
              categories={['users', 'prompts']}
              colors={['blue', 'green']}
              yAxisWidth={40}
            />
          </Card>
          
          <Card>
            <Title>カテゴリー分布</Title>
            <DonutChart
              data={stats.categoryDistribution}
              category="count"
              index="category"
              colors={['slate', 'violet', 'indigo', 'rose', 'cyan', 'amber']}
            />
          </Card>
        </div>

        {/* クイックアクション */}
        <Card>
          <Title>クイックアクション</Title>
          <div className="mt-4 space-x-4">
            <button
              onClick={() => router.push('/admin/users')}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              ユーザー管理
            </button>
            <button
              onClick={() => router.push('/admin/prompts')}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              プロンプト管理
            </button>
            <button
              onClick={() => router.push('/admin/reports')}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              報告確認
            </button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}