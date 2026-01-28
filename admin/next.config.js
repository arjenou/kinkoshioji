/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:8787',
    ADMIN_TOKEN: process.env.ADMIN_TOKEN || '',
  },
}

module.exports = nextConfig
