/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false }
    return config
  },
  env: {
    JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
  },
}

module.exports = nextConfig

