import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  // Vercel 배포 최적화
  output: 'standalone',
  trailingSlash: false,
};

export default nextConfig;
