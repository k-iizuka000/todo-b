'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Container } from '@mui/material'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import LoadingSpinner from '@/components/common/LoadingSpinner'

interface ProfileLayoutProps {
  children: React.ReactNode
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  // セッションのローディング中はローディングスピナーを表示
  if (status === 'loading') {
    return <LoadingSpinner />
  }

  // 未認証ユーザーはログインページにリダイレクト
  if (status === 'unauthenticated') {
    router.push('/auth/login')
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ナビゲーションバー */}
      <Navbar />

      {/* メインコンテンツ */}
      <main className="flex-grow py-8">
        <Container maxWidth="lg">
          {/* プロフィール関連の共通コンポーネントをここに配置可能 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {children}
          </div>
        </Container>
      </main>

      {/* フッター */}
      <Footer />
    </div>
  )
}