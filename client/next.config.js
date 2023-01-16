/** @type {import('next').NextConfig} */
const backendURL = process.env.BACKEND_URL || 'http://localhost:5000';
const securityHeaders = [
	{
		key: 'X-DNS-Prefetch-Control',
		value: 'on',
	},
	{
		key: 'Strict Transport Security',
		value: 'max-age=31536000; includeSubDomains; preload',
	},
	{
		key: 'X-Frame-Options',
		value: 'SAMEORIGIN',
	},
	{
		key: 'X-Content-Type-Options',
		value: 'nosniff',
	},
	{
		key: 'X-XSS-Protection',
		value: '1; mode=block',
	},
	{
		key: 'Referrer-Policy',
		value: 'same-origin',
	},
];
const nextConfig = {
	reactStrictMode: true,
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: `${backendURL}/:path*`,
			}
		];
	},
	async headers() {
		return process.env.production
			? [
					{
						source: '/:path*',
						headers: securityHeaders,
					},
			  ]
			: [];
	},
};

module.exports = nextConfig;
