'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Input, Card, Select, Pagination } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    image: string;
  };
  likes: number;
  createdAt: string;
}

const PromptListPage: React.FC = () => {
  const { data: session } = useSession();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPrompts, setTotalPrompts] = useState(0);
  const promptsPerPage = 12;

  // カテゴリーオプション
  const categories = [
    { value: 'all', label: 'すべて' },
    { value: 'writing', label: '文章作成' },
    { value: 'coding', label: 'プログラミング' },
    { value: 'image', label: '画像生成' },
    { value: 'other', label: 'その他' },
  ];

  useEffect(() => {
    fetchPrompts();
  }, [currentPage, searchQuery, selectedCategory]);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/prompts?page=${currentPage}&search=${searchQuery}&category=${selectedCategory}`
      );
      const data = await response.json();
      setPrompts(data.prompts);
      setTotalPrompts(data.total);
    } catch (error) {
      console.error('プロンプトの取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (promptId: string) => {
    if (!session) return;
    try {
      await fetch(`/api/prompts/${promptId}/like`, {
        method: 'POST',
      });
      fetchPrompts();
    } catch (error) {
      console.error('いいねの処理に失敗しました:', error);
    }
  };

  const handleShare = (promptId: string) => {
    const url = `${window.location.origin}/prompts/${promptId}`;
    navigator.clipboard.writeText(url);
    // TODO: Add toast notification
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">プロンプト一覧</h1>
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="プロンプトを検索"
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          <Select
            defaultValue="all"
            style={{ width: 200 }}
            onChange={setSelectedCategory}
            options={categories}
            prefix={<FilterOutlined />}
          />
        </div>
      </div>

      {loading ? (
        <div>読み込み中...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <Card key={prompt.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{prompt.title}</h2>
                    <p className="text-gray-600 mb-4">{prompt.description}</p>
                    <div className="flex gap-2 mb-4">
                      {prompt.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 px-2 py-1 rounded text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={prompt.author.image}
                      alt={prompt.author.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm">{prompt.author.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleLike(prompt.id)}>
                      👍 {prompt.likes}
                    </Button>
                    <Button onClick={() => handleShare(prompt.id)}>共有</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Pagination
              current={currentPage}
              total={totalPrompts}
              pageSize={promptsPerPage}
              onChange={setCurrentPage}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PromptListPage;