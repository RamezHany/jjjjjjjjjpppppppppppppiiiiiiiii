const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    domains: ['raw.githubusercontent.com', 'github.com' , 'res.cloudinary.com'], // ✅ إضافة المضيف هنا
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/RamezHany/IGCCe-tr/**',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/partners',
        destination: 'https://raw.githubusercontent.com/RamezHany/IGCCe-tr/main/partners.json',
      },
    ]
  }

}

module.exports = nextConfig
