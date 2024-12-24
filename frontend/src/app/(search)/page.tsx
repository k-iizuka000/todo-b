'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PromptCard } from '@/components/PromptCard';
import { useDebounce } from '@/hooks/useDebounce';
import { Prompt } from '@/types/prompt';

export default function SearchPage() {
  // 状態管理
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 検索クエリのデバウンス処理
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // プロンプトの検索処理
  const searchPrompts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/prompts/search?q=${debouncedSearchQuery}&category=${category}&sort=${sortBy}`
      );
      const data = await response.json();
      setPrompts(data);
    } catch (error) {
      console.error('Failed to search prompts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 検索条件が変更されたら検索を実行
  useEffect(() => {
    searchPrompts();
  }, [debouncedSearchQuery, category, sortBy]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">プロンプトを探す</h1>

      {/* 検索フィルター */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          type="text"
          placeholder="キーワードで検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="カテゴリー" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="writing">文章作成</SelectItem>
            <SelectItem value="programming">プログラミング</SelectItem>
            <SelectItem value="design">デザイン</SelectItem>
            <SelectItem value="business">ビジネス</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="並び替え" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">新着順</SelectItem>
            <SelectItem value="popular">人気順</SelectItem>
            <SelectItem value="rating">評価順</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 検索結果 */}
      {isLoading ? (
        <div className="text-center py-8">読み込み中...</div>
      ) : prompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            検索結果が見つかりませんでした。
            <br />
            別のキーワードで試してみてください。
          </p>
        </div>
      )}
    </div>
  );
}