import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const nextConfig = {
  reactStrictMode: true,

  env: {
    NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN:
      process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN,
    NEXT_PUBLIC_MICROCMS_API_KEY: process.env.NEXT_PUBLIC_MICROCMS_API_KEY,
  },

  // Turbopack の sourceMap エラー回避（Next.js 16 で有効）
  experimental: {
    serverSourceMaps: false,
  },
};

export default nextConfig;
