import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'

// フォントの設定
const inter = Inter({ subsets: ['latin'] })

// メタデータの設定
export const metadata: Metadata = {
  title: 'PromptHub - Share and Discover AI Prompts',
  description: 'A platform for creating, sharing, and discovering AI prompts',
  keywords: 'AI, prompts, sharing, community, artificial intelligence',
}

// ルートレイアウトコンポーネント
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {/* 通知トースターコンポーネント */}
          <Toaster position="top-center" />
          
          {/* メインレイアウト構造 */}
          <div className="min-h-screen flex flex-col">
            {/* ナビゲーションバー */}
            <Navbar />
            
            {/* メインコンテンツ */}
            <main className="flex-grow">
              {children}
            </main>
            
            {/* フッター */}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}

// レイアウトの再検証設定
export const revalidate = 0