'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Tab } from '@headlessui/react';
import { User, Prompt } from '@/types';
import { formatDate } from '@/lib/utils';
import PromptCard from '@/components/PromptCard';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';

// プロフィールタブの定義
const tabs = ['プロンプト', '保存済み', '活動履歴'];

export default function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [savedPrompts, setSavedPrompts] = useState<Prompt[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // ユーザー情報の取得
        const userResponse = await fetch(`/api/users/${id}`);
        if (!userResponse.ok) throw new Error('ユーザー情報の取得に失敗しました');
        const userData = await userResponse.json();
        setUser(userData);

        // ユーザーのプロンプト取得
        const promptsResponse = await fetch(`/api/users/${id}/prompts`);
        if (!promptsResponse.ok) throw new Error('プロンプトの取得に失敗しました');
        const promptsData = await promptsResponse.json();
        setPrompts(promptsData);

        // 保存済みプロンプトの取得
        const savedResponse = await fetch(`/api/users/${id}/saved`);
        if (!savedResponse.ok) throw new Error('保存済みプロンプトの取得に失敗しました');
        const savedData = await savedResponse.json();
        setSavedPrompts(savedData);

        // 活動履歴の取得
        const activitiesResponse = await fetch(`/api/users/${id}/activities`);
        if (!activitiesResponse.ok) throw new Error('活動履歴の取得に失敗しました');
        const activitiesData = await activitiesResponse.json();
        setActivities(activitiesData);

      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return <ErrorMessage message="ユーザーが見つかりません" />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* プロフィールヘッダー */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="relative w-24 h-24">
          <Image
            src={user.avatar || '/default-avatar.png'}
            alt={user.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-600">{user.bio}</p>
          <p className="text-sm text-gray-500">
            登録日: {formatDate(user.createdAt)}
          </p>
        </div>
      </div>

      {/* タブナビゲーション */}
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ${selected
                  ? 'bg-white shadow text-blue-700'
                  : 'text-gray-700 hover:bg-white/[0.12] hover:text-blue-600'
                }`
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {/* プロンプトパネル */}
          <Tab.Panel>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {prompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          </Tab.Panel>

          {/* 保存済みプロンプトパネル */}
          <Tab.Panel>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedPrompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          </Tab.Panel>

          {/* 活動履歴パネル */}
          <Tab.Panel>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 bg-white rounded-lg shadow"
                >
                  <p className="text-sm text-gray-600">
                    {activity.description}
                  </p>
                  <span className="text-xs text-gray-500">
                    {formatDate(activity.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}