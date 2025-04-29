// /** @type {import('next').NextConfig} */
// const nextConfig = {
//  eslint: {
  //  ignoreDuringBuilds: true,
//  },
 // images: { unoptimized: true },
//};

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { 
    unoptimized: true,
    domains: ['images.pexels.com']
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;