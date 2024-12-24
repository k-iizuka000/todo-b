import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

/**
 * ローディング中に表示するスピナーコンポーネント
 * @param size - スピナーのサイズ（small, medium, large）
 * @param color - スピナーの色（デフォルト: #4B5563）
 * @param className - 追加のCSSクラス
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#4B5563',
  className = '',
}) => {
  // サイズに応じた寸法を設定
  const dimensions = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${dimensions[size]} animate-spin rounded-full border-4 border-t-transparent`}
        style={{
          borderColor: `${color}20`, // 薄い色
          borderTopColor: color, // メインの色
        }}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;

// 使用例:
/*
import LoadingSpinner from './components/common/LoadingSpinner';

// 基本的な使用方法
<LoadingSpinner />

// カスタマイズ例
<LoadingSpinner 
  size="large"
  color="#1E40AF"
  className="mt-4"
/>
*/