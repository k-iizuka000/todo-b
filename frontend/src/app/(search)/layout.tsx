'use client';

import React from 'react';
import { Box, Container } from '@mui/material';
import SearchHeader from '@/components/search/SearchHeader';
import SearchSidebar from '@/components/search/SearchSidebar';
import { useSession } from 'next-auth/react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface SearchLayoutProps {
  children: React.ReactNode;
}

export default function SearchLayout({ children }: SearchLayoutProps) {
  const { status } = useSession();

  // セッションのロード中は読み込み中の表示
  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 検索ヘッダー */}
      <SearchHeader />

      {/* メインコンテンツエリア */}
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexGrow: 1,
          backgroundColor: 'background.default',
          pt: { xs: 2, sm: 3 },
          pb: { xs: 2, sm: 3 },
        }}
      >
        {/* サイドバー */}
        <SearchSidebar />

        {/* コンテンツエリア */}
        <Container
          maxWidth="lg"
          sx={{
            flexGrow: 1,
            px: { xs: 2, sm: 3 },
            ml: { xs: 0, md: '240px' }, // サイドバーの幅に合わせる
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
}

// メタデータの設定
export const metadata = {
  title: 'Search - PromptHub',
  description: 'Search and discover prompts from the PromptHub community',
};

// 静的生成の設定
export const dynamic = 'force-static';
export const revalidate = 3600; // 1時間ごとに再検証