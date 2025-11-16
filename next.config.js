/** @type {import("next").NextConfig} */
const nextConfig = {
  // Turbopack を完全に無効化
  turbo: false,

  // Turbopack 警告を抑制（公式手法）
  turbopack: {},

  // Webpack を有効化
  webpack: (config) => {
    return config;
  },

  // ソースマップのエラー回避
  productionBrowserSourceMaps: false,

  // ★ microCMS の画像を許可
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.microcms-assets.io",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
