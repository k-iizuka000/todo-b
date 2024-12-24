import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, CircularProgress, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import PromptCard from './PromptCard';
import { useAuth } from '../../hooks/useAuth';
import { Prompt } from '../../types/prompt';
import { fetchPrompts } from '../../services/promptService';

interface PromptListProps {
  category?: string;
  searchQuery?: string;
}

const PromptList: React.FC<PromptListProps> = ({ category, searchQuery }) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('all');
  const { user } = useAuth();

  // プロンプト一覧を取得する
  useEffect(() => {
    const loadPrompts = async () => {
      try {
        setLoading(true);
        const response = await fetchPrompts({
          category: filterCategory === 'all' ? undefined : filterCategory,
          searchQuery,
          sortBy
        });
        setPrompts(response);
        setError(null);
      } catch (err) {
        setError('プロンプトの読み込み中にエラーが発生しました。');
        console.error('Error loading prompts:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPrompts();
  }, [category, searchQuery, sortBy, filterCategory]);

  // プロンプトをフィルタリングする
  const filteredPrompts = prompts.filter(prompt => {
    if (searchQuery) {
      return prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             prompt.description.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', py: 3 }}>
      {/* フィルターとソートのコントロール */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>カテゴリー</InputLabel>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            label="カテゴリー"
          >
            <MenuItem value="all">すべて</MenuItem>
            <MenuItem value="writing">文章作成</MenuItem>
            <MenuItem value="coding">プログラミング</MenuItem>
            <MenuItem value="image">画像生成</MenuItem>
            <MenuItem value="other">その他</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>並び替え</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label="並び替え"
          >
            <MenuItem value="newest">新着順</MenuItem>
            <MenuItem value="popular">人気順</MenuItem>
            <MenuItem value="rating">評価順</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* プロンプト一覧 */}
      {filteredPrompts.length === 0 ? (
        <Typography variant="h6" textAlign="center">
          プロンプトが見つかりませんでした。
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredPrompts.map((prompt) => (
            <Grid item xs={12} sm={6} md={4} key={prompt.id}>
              <PromptCard
                prompt={prompt}
                isOwner={user?.id === prompt.userId}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PromptList;