'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  createdAt: string;
  promptsCount: number;
  followersCount: number;
  followingCount: number;
}

interface Prompt {
  id: string;
  title: string;
  content: string;
  likes: number;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
  });

  useEffect(() => {
    if (session?.user) {
      fetchUserProfile();
      fetchUserPrompts();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/users/${session?.user?.id}/profile`);
      const data = await response.json();
      setProfile(data);
      setEditForm({
        name: data.name,
        bio: data.bio,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch profile data',
        variant: 'destructive',
      });
    }
  };

  const fetchUserPrompts = async () => {
    try {
      const response = await fetch(`/api/users/${session?.user?.id}/prompts`);
      const data = await response.json();
      setPrompts(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch prompts',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/${session?.user?.id}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
        });
        fetchUserProfile();
        setIsEditing(false);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  if (!session) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden">
              <Image
                src={profile?.avatar || '/default-avatar.png'}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <form onSubmit={handleUpdateProfile}>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="mb-2"
                    placeholder="Name"
                  />
                  <Textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="mb-2"
                    placeholder="Bio"
                  />
                  <div className="flex gap-2">
                    <Button type="submit">Save</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <h1 className="text-2xl font-bold">{profile?.name}</h1>
                  <p className="text-gray-600">{profile?.bio}</p>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="mt-2"
                  >
                    Edit Profile
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="prompts">
        <TabsList>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="prompts">
          <div className="grid gap-4">
            {prompts.map((prompt) => (
              <Card key={prompt.id}>
                <CardContent className="p-4">
                  <h3 className="font-bold">{prompt.title}</h3>
                  <p className="text-gray-600">{prompt.content}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>❤️ {prompt.likes}</span>
                    <span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="likes">
          <div className="text-center text-gray-500 py-8">
            Liked prompts will appear here
          </div>
        </TabsContent>
        
        <TabsContent value="activity">
          <div className="text-center text-gray-500 py-8">
            Recent activity will appear here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}