'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

interface PromptStats {
  totalPrompts: number;
  totalLikes: number;
  totalComments: number;
}

interface RecentPrompt {
  id: string;
  title: string;
  createdAt: string;
  likes: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<PromptStats | null>(null);
  const [recentPrompts, setRecentPrompts] = useState<RecentPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (status === 'authenticated') {
        try {
          // APIからデータを取得する実装
          const statsResponse = await fetch('/api/stats');
          const promptsResponse = await fetch('/api/prompts/recent');
          
          const statsData = await statsResponse.json();
          const promptsData = await promptsResponse.json();

          setStats(statsData);
          setRecentPrompts(promptsData);
        } catch (error) {
          console.error('Failed to fetch dashboard data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDashboardData();
  }, [status]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-medium">Total Prompts</h3>
          <p className="text-3xl font-bold">{stats?.totalPrompts || 0}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium">Total Likes</h3>
          <p className="text-3xl font-bold">{stats?.totalLikes || 0}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium">Total Comments</h3>
          <p className="text-3xl font-bold">{stats?.totalComments || 0}</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Button>Create New Prompt</Button>
          <Button variant="outline">View My Prompts</Button>
        </div>
      </div>

      {/* Recent Prompts */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recent Prompts</h2>
        <div className="space-y-4">
          {recentPrompts.map((prompt) => (
            <Card key={prompt.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{prompt.title}</h3>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(prompt.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span>❤️ {prompt.likes}</span>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Search Prompts</h2>
        <div className="flex gap-4">
          <Input 
            placeholder="Search prompts..." 
            className="max-w-md"
          />
          <Button>Search</Button>
        </div>
      </div>
    </div>
  );
}