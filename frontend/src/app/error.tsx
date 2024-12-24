'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // エラーをログに記録
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            申し訳ありません
          </h1>
          <div className="mb-6">
            <p className="text-gray-600 mb-2">
              予期せぬエラーが発生しました。
            </p>
            <p className="text-sm text-gray-500">
              エラー: {error.message || 'Unknown error occurred'}
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={reset}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              もう一度試す
            </button>
            
            <Link
              href="/"
              className="block w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              ホームに戻る
            </Link>
          </div>
          
          <p className="mt-6 text-sm text-gray-500">
            問題が解決しない場合は、サポートまでお問い合わせください。
          </p>
        </div>
      </div>
    </div>
  );
}