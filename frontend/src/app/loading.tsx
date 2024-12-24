'use client';

import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        {/* ローディングスピナー */}
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        
        {/* ローディングテキスト */}
        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;