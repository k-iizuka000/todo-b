'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { toast } from '@/components/ui/toast';

interface PromptFormData {
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPublic: boolean;
}

export default function NewPromptPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PromptFormData>({
    title: '',
    content: '',
    category: '',
    tags: [],
    isPublic: true,
  });

  // フォーム入力の処理
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // タグの処理
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }
      e.currentTarget.value = '';
    }
  };

  // フォーム送信の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('プロンプトの作成に失敗しました');
      }

      toast({
        title: '成功',
        description: 'プロンプトが作成されました',
        type: 'success',
      });

      router.push('/prompts');
    } catch (error) {
      toast({
        title: 'エラー',
        description: error instanceof Error ? error.message : '予期せぬエラーが発生しました',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">新規プロンプトの作成</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">
            タイトル
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              maxLength={100}
              className="mt-1"
              placeholder="プロンプトのタイトルを入力"
            />
          </label>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            内容
            <Textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={10}
              className="mt-1"
              placeholder="プロンプトの内容を入力"
            />
          </label>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            カテゴリー
            <Select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="mt-1"
            >
              <option value="">カテゴリーを選択</option>
              <option value="writing">文章作成</option>
              <option value="coding">プログラミング</option>
              <option value="business">ビジネス</option>
              <option value="creative">クリエイティブ</option>
              <option value="other">その他</option>
            </Select>
          </label>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            タグ
            <Input
              type="text"
              onKeyDown={handleTagInput}
              className="mt-1"
              placeholder="タグを入力してEnterを押す"
            />
          </label>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-200 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isPublic"
            checked={formData.isPublic}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, isPublic: e.target.checked }))
            }
            id="isPublic"
          />
          <label htmlFor="isPublic">公開する</label>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '作成中...' : 'プロンプトを作成'}
          </Button>
        </div>
      </form>
    </div>
  );
}