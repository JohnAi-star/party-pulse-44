 /** @type {import('next').NextConfig} */ const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    unoptimized: true,
    domains: ['images.pexels.com'],
  },
};
module.exports = nextConfig;