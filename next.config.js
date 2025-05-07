/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ['images.pexels.com', 'images.unsplash.com'],
  },
  trailingSlash: true,
};

module.exports = nextConfig;