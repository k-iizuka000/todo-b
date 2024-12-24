'use client'

import React from 'react'
import { Box, Container } from '@mui/material'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// プロンプトページの共通レイアウトを定義するコンポーネント
export default function PromptsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      {/* グローバルナビゲーション */}
      <Navbar />

      {/* メインコンテンツ */}
      <Container 
        component="main" 
        maxWidth="lg" 
        sx={{ 
          flex: 1,
          py: 4,
          px: { xs: 2, sm: 3 },
        }}
      >
        {children}
      </Container>

      {/* トースト通知のコンテナ */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* フッター */}
      <Footer />
    </Box>
  )
}

// レイアウトのメタデータを定義
export const metadata = {
  title: 'PromptHub - Share and Discover AI Prompts',
  description: 'A platform for sharing and discovering AI prompts, enabling users to collaborate and exchange knowledge.',
  keywords: 'AI prompts, prompt sharing, prompt engineering, AI, machine learning',
}