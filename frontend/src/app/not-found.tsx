'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // 404ページへのアクセスを分析するために、必要に応じてアナリティクスを追加
    console.log('404 page accessed');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            ページが見つかりません
          </h2>
          <p className="text-gray-600 mb-8">
            お探しのページは移動または削除された可能性があります。
          </p>

          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg 
                hover:bg-blue-700 transition-colors duration-200 mx-2"
            >
              ホームに戻る
            </Link>

            <button
              onClick={() => router.back()}
              className="inline-block bg-gray-200 text-gray-700 px-6 py-3 rounded-lg 
                hover:bg-gray-300 transition-colors duration-200 mx-2"
            >
              前のページに戻る
            </button>
          </div>

          <div className="mt-8 text-gray-500">
            <p>お困りの場合は以下をお試しください：</p>
            <ul className="mt-4 list-disc list-inside">
              <li>URLが正しく入力されているか確認する</li>
              <li>ブラウザの更新ボタンを押す</li>
              <li>検索機能を使用して目的のコンテンツを探す</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}