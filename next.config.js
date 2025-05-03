/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { 
    unoptimized: true,
    domains: ['images.pexels.com']
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export',
  trailingSlash: true,
  // Add static routes that don't need dynamic params
  exportPathMap: async function() {
    return {
      '/': { page: '/' },
      '/activities': { page: '/activities' },
      '/about': { page: '/about' },
      '/blog': { page: '/blog' },
      '/contact': { page: '/contact' },
      '/locations': { page: '/locations' },
      '/sign-in': { page: '/sign-in/[[...sign-in]]' },
      '/sign-up': { page: '/sign-up/[[...sign-up]]' },
    };
  },
};

module.exports = nextConfig;