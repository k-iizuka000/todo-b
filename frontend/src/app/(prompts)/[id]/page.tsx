'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CommentSection } from '@/components/CommentSection';
import { LikeButton } from '@/components/LikeButton';
import { ShareButton } from '@/components/ShareButton';
import { DeletePromptDialog } from '@/components/DeletePromptDialog';

interface Prompt {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: Comment[];
}

export default function PromptPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  // プロンプトデータの取得
  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const response = await fetch(`/api/prompts/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch prompt');
        const data = await response.json();
        setPrompt(data);
        setEditedContent(data.content);
      } catch (error) {
        toast.error('Failed to load prompt');
        router.push('/');
      }
    };

    fetchPrompt();
  }, [params.id, router]);

  // プロンプトの更新処理
  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/prompts/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editedContent }),
      });

      if (!response.ok) throw new Error('Failed to update prompt');
      
      toast.success('Prompt updated successfully');
      setIsEditing(false);
      setPrompt(prev => prev ? { ...prev, content: editedContent } : null);
    } catch (error) {
      toast.error('Failed to update prompt');
    }
  };

  if (!prompt) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold">{prompt.title}</h1>
          <p className="text-sm text-gray-500">
            By {prompt.authorName} • {new Date(prompt.createdAt).toLocaleDateString()}
          </p>
        </CardHeader>

        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[200px]"
              />
              <div className="flex gap-2">
                <Button onClick={handleUpdate}>Save</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="prose max-w-none">
              {prompt.content}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <div className="flex gap-4">
            <LikeButton promptId={prompt.id} initialLikes={prompt.likes} />
            <ShareButton prompt={prompt} />
          </div>
          
          {session?.user?.id === prompt.authorId && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                Edit
              </Button>
              <DeletePromptDialog promptId={prompt.id} />
            </div>
          )}
        </CardFooter>
      </Card>

      <div className="mt-8">
        <CommentSection promptId={prompt.id} comments={prompt.comments} />
      </div>
    </div>
  );
}