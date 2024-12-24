'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaSearch, FaPlus, FaTrophy } from 'react-icons/fa';

// トップページのメインコンポーネント
export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  // トレンドのプロンプト（サンプルデータ）
  const trendingPrompts = [
    { id: 1, title: "効果的なビジネス文書作成", likes: 234, author: "business_pro" },
    { id: 2, title: "創造的な物語展開のガイド", likes: 189, author: "story_master" },
    { id: 3, title: "AIアートの最適化テクニック", likes: 156, author: "ai_artist" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ヒーローセクション */}
      <section className="px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-6">
            Prompt Hub
            <span className="text-blue-600">AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AIプロンプトの共有・発見プラットフォーム
          </p>
        </motion.div>

        {/* 検索バー */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center bg-white rounded-lg shadow-md p-2">
            <input
              type="text"
              placeholder="プロンプトを検索..."
              className="flex-1 px-4 py-2 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
              <FaSearch className="inline mr-2" />
              検索
            </button>
          </div>
        </div>

        {/* クイックアクションボタン */}
        <div className="flex justify-center gap-4 mb-16">
          <Link href="/prompts/create" className="flex items-center bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition">
            <FaPlus className="mr-2" />
            新規プロンプト作成
          </Link>
          <Link href="/prompts/trending" className="flex items-center bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition">
            <FaTrophy className="mr-2" />
            トレンド確認
          </Link>
        </div>
      </section>

      {/* トレンドセクション */}
      <section className="px-4 py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">人気のプロンプト</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingPrompts.map((prompt) => (
              <motion.div
                key={prompt.id}
                whileHover={{ scale: 1.03 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold mb-2">{prompt.title}</h3>
                <p className="text-gray-600 mb-4">by @{prompt.author}</p>
                <div className="flex items-center text-blue-600">
                  <span>♥ {prompt.likes}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* フィーチャーセクション */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">主な機能</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">プロンプト共有</h3>
              <p className="text-gray-600">あなたの効果的なプロンプトを共有し、コミュニティに貢献しましょう</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">フィードバック</h3>
              <p className="text-gray-600">他のユーザーからのフィードバックで、プロンプトを改善できます</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">コミュニティ</h3>
              <p className="text-gray-600">プロンプトエンジニアリングのコミュニティで知識を共有</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}