/** @type {import('next').NextConfig} */
const backendURL = process.env.BACKEND_URL || 'http://localhost:5000'
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendURL}/:path*`,
      },
    ]
  }
}

module.exports = nextConfig
