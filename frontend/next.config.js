/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Strict Modeを有効化
  reactStrictMode: true,

  // 画像最適化の設定
  images: {
    domains: [
      'localhost',
      'storage.googleapis.com', // Cloud Storageを使用する場合
      'res.cloudinary.com',    // Cloudinaryを使用する場合
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // 国際化の設定
  i18n: {
    locales: ['en', 'ja', 'es'],
    defaultLocale: 'en',
  },

  // 環境変数の公開設定
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },

  // パフォーマンス最適化
  swcMinify: true,

  // プログレッシブウェブアプリ（PWA）の設定
  // PWAを実装する場合はnext-pwaパッケージを追加する必要があります
  // pwa: {
  //   dest: 'public',
  //   register: true,
  //   skipWaiting: true,
  // },

  // APIリクエストのリライト設定
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },

  // セキュリティヘッダーの設定
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // ウェブパックの設定（必要に応じてカスタマイズ）
  webpack: (config, { isServer }) => {
    // カスタムウェブパック設定をここに追加
    return config;
  },
};

module.exports = nextConfig;