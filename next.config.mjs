/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_URL: process.env.API_URL,
        API_KEY: process.env.API_KEY,
        WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
        WEB3_FORM_API_KEY: process.env.WEB3_FORM_ACCESS_KEY,
        GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY,
        RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
        RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    },
    images: {
        formats: ['image/webp'],
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.jagadhatrionline.co.in',
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    },
                    {
                        key: 'Permissions-Policy',
                        value: [
                            'camera=()',
                            'microphone=()',
                            'geolocation=(self)',
                            'payment=(self "https://checkout.razorpay.com")',
                            'usb=()',
                            'fullscreen=(self)',
                            'display-capture=(self)'
                        ].join(', ')
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "frame-ancestors 'self';"
                    },
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
                    },
                ]
            },
            {
                source: '/api/:path*',
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, POST, PUT, DELETE, OPTIONS",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding, X-Webhook-Secret",
                    },
                    {
                        key: "Access-Control-Max-Age",
                        value: "1000",
                    }
                ]
            }
        ]
    },
    async redirects() {
        return [
            {
                source: '/jagadhatri-puja-:year',
                destination: '/jagadhatri-puja/:year',
                permanent: true,
            },
            {
                source: '/digital-media-partnership/:path*',
                destination: '/cinematics/:path*',
                permanent: true,
            },
        ]
    },
}
export default nextConfig;
