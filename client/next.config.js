/** @type {import('next').NextConfig} */
const backendURL = process.env.BACKEND_URL || 'http://localhost:5000'
console.log('backendURL:', backendURL)
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
