'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Sidebar } from '@/components/admin/Sidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  // 認証とロール確認
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session?.user && !isAdmin(session.user)) {
      router.push('/')
    }
  }, [session, status, router])

  // 管理者権限チェック
  const isAdmin = (user: any) => {
    return user?.role === 'ADMIN'
  }

  // ローディング中の表示
  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // 認証済み管理者のみ表示
  if (status === 'authenticated' && session?.user && isAdmin(session.user)) {
    return (
      <div className="flex h-screen bg-gray-100">
        {/* サイドバー */}
        <Sidebar />
        
        {/* メインコンテンツエリア */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* ヘッダー */}
          <AdminHeader user={session.user} />
          
          {/* メインコンテンツ */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="container mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    )
  }

  // 未認証または非管理者の場合は何も表示しない
  return null
}