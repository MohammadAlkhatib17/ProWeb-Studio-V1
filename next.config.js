const redirectsData = require('./config/redirects.json');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
    isrMemoryCacheSize: 0, // Disable in-memory cache to use Vercel's edge cache
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },

  compress: true,
  poweredByHeader: false,
  i18n: {
    locales: ['nl', 'en'],
    defaultLocale: 'nl',
    localeDetection: false,
    domains: [
      {
        domain: 'prowebstudio.nl',
        defaultLocale: 'nl',
      },
      {
        domain: 'prowebstudio.com',
        defaultLocale: 'en',
      },
    ],
  },
  async redirects() {
    return [
      ...redirectsData.permanent,
      // Redirect www to non-www
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.prowebstudio.nl',
          },
        ],
        destination: 'https://prowebstudio.nl/:path*',
        permanent: true,
      },
      // Remove trailing slashes
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
    ];
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
          }
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig