// @ts-check

import nextBundleAnalyzer from '@next/bundle-analyzer';
import { CRITICAL_ENV_VARS, PLACEHOLDER_VALUES, ENV_VAR_GROUPS } from './src/lib/env.required.mjs';

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// Validate environment variables before build (skip on Vercel or when explicitly disabled)
if (process.env.NODE_ENV === 'production' && process.env.VERCEL !== '1' && process.env.SKIP_ENV_VALIDATION !== 'true') {
  const { execSync } = await import('child_process');
  try {
    execSync('node ../scripts/validate-production-env.js', { stdio: 'inherit' });
  } catch (error) {
    process.exit(1);
  }
}

// Build-time environment validation for production
function validateProductionEnv() {
  // Only validate in production builds
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  // Skip validation on Vercel - platform manages env vars
  if (process.env.VERCEL === '1') {
    console.log('✅ Running on Vercel - skipping build-time env validation (platform-managed)');
    return;
  }

  // Skip validation if explicitly disabled
  if (process.env.SKIP_ENV_VALIDATION === 'true') {
    console.log('⚠️  Build-time environment validation skipped (SKIP_ENV_VALIDATION=true)');
    return;
  }

  /**
   * @param {string} value
   * @returns {boolean}
   */
  function isPlaceholderValue(value) {
    if (!value || typeof value !== 'string') return true;

    const normalizedValue = value.toLowerCase().trim();

    return PLACEHOLDER_VALUES.some(placeholder =>
      normalizedValue === placeholder.toLowerCase() ||
      normalizedValue.includes('placeholder') ||
      normalizedValue.includes('example') ||
      normalizedValue.includes('your_') ||
      normalizedValue.includes('changeme') ||
      normalizedValue === 'localhost:3000' ||
      normalizedValue === 'http://localhost:3000'
    );
  }

  // Group errors by category
  /** @type {Record<string, {name: string, description: string, variables: string[], guidance: string, errors: string[]}>} */
  const errorsByGroup = {};
  let hasErrors = false;

  // Check each environment variable and group by category
  for (const envVar of CRITICAL_ENV_VARS) {
    const value = process.env[envVar];
    let error = null;

    if (!value) {
      error = `${envVar} is not set`;
    } else if (isPlaceholderValue(value)) {
      error = `${envVar} contains placeholder value: "${value}"`;
    }

    if (error) {
      hasErrors = true;
      // Find which group this variable belongs to
      for (const [groupKey, groupConfig] of Object.entries(ENV_VAR_GROUPS)) {
        if (groupConfig.variables.includes(envVar)) {
          if (!errorsByGroup[groupKey]) {
            errorsByGroup[groupKey] = {
              ...groupConfig,
              errors: []
            };
          }
          errorsByGroup[groupKey].errors.push(error);
          break;
        }
      }
    }
  }

  if (hasErrors) {
    console.error('\n🚨 Build failed! Critical environment variables are missing or invalid:\n');

    // Display errors grouped by category
    for (const [groupKey, groupData] of Object.entries(errorsByGroup)) {
      console.error(`📁 ${groupData.name} (${groupData.description})`);
      groupData.errors.forEach(/** @param {string} error */ error => console.error(`   ❌ ${error}`));
      console.error(`   💡 ${groupData.guidance}`);
      console.error(''); // Empty line for spacing
    }

    console.error('📚 For complete setup instructions, see docs/DEPLOY_CHECKLIST.md');
    console.error('🔧 Set these variables in your deployment platform (Vercel, Netlify, etc.)\n');
    throw new Error('Environment validation failed - missing or invalid critical environment variables');
  }
}

// Run validation during build
validateProductionEnv();

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Runtime & Region Configuration: See docs/ADR-runtime.md
  // Individual routes configure runtime (edge/nodejs) and preferredRegion at route level
  // No global runtime override - App Router handles optimization automatically

  // Disable powered by header for security
  poweredByHeader: false,

  // Enable React 19 features
  experimental: {
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'three'],
  },

  // Turbopack configuration
  turbopack: {
    // Set root to current directory (absolute path) to silence workspace lockfile warning
    root: import.meta.dirname,
  },

  // Remove console.log in production (keep error, warn, info)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn', 'info'],
    } : false,
  },

  // Note: i18n is handled via middleware for App Router
  // Default locale nl-NL is enforced through metadata and middleware

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Enable responsive images with optimized settings
    unoptimized: false,
    // Remote patterns for external images (if needed)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'plausible.io',
        port: '',
        pathname: '/**',
      },
      // Add more remote patterns as needed for external images
    ],
    // Enable loader for better performance
    loader: 'default',
    // Domains for external images (legacy - prefer remotePatterns)
    domains: [],
  },

  // PWA and Service Worker: serve /public/sw.js directly as /sw.js

  // Webpack optimization (skipped when using Turbopack)
  // Turbopack has its own optimized chunk splitting strategy
  webpack: process.env.TURBOPACK ? undefined : (config, { dev, isServer }) => {
    // Optimize chunk splitting
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -10,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -5,
            reuseExistingChunk: true,
          },
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: 'three',
            priority: 10,
            chunks: 'async',
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },

  // Compression
  compress: true,

  // Output optimization
  output: 'standalone',

  async headers() {
    return [
      {
        // Immutable caching for static assets by extension
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|css|js|mjs|woff|woff2|ttf|eot)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // /api/csp-report - no CSP enforcement for reporting endpoint
      {
        source: '/api/csp-report',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate, private' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          // Enhanced HSTS with preload
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Frame protection - DENY for maximum security
          { key: 'X-Frame-Options', value: 'DENY' },
          // Content type protection
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Enhanced referrer policy
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Permissions policy
          {
            key: 'Permissions-Policy',
            value: [
              'accelerometer=()',
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'gyroscope=()',
              'magnetometer=()',
              'payment=()',
              'usb=()',
              'fullscreen=(self)',
              'browsing-topics=()'
            ].join(', ')
          },
          // DNS prefetch control
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          // Cross-domain policies
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
          // Cross-Origin policies
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          // Custom security headers
          { key: 'X-Security-Version', value: '3.0' },
          { key: 'X-Download-Options', value: 'noopen' },
          // Cache control for general pages
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400' },
        ],
      },
      // Static assets - long cache with immutable
      {
        source: '/assets/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      // API routes - no cache, enhanced security
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate, private' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-API-Version', value: '2.0' },
          { key: 'Vary', value: 'Origin, Accept-Encoding' },
        ],
      },
      // Next.js static files - long cache
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      // Security-sensitive files
      {
        source: '/.well-known/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
      // PWA files
      {
        source: '/manifest.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      // CSP FOR /CONTACT - NOW HANDLED IN MIDDLEWARE.TS WITH DYNAMIC NONCES
      // The CSP headers for /contact are now set in middleware.ts to support
      // dynamic nonce generation. This allows for secure inline scripts
      // without using 'unsafe-inline' directive.
      //
      // Report-only and enforced CSP configurations have been moved to
      // middleware.ts where nonces can be dynamically injected.
    ];
  },

  // Domain redirects - Fallback for ensuring www redirects to apex domain
  // Primary redirects should be configured at platform level (Vercel)
  async redirects() {
    const siteUrl = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/+$/, '');

    // Only apply redirects if site URL is configured
    if (!siteUrl) {
      return [];
    }

    // Extract domain from site URL
    const siteDomain = siteUrl.replace(/^https?:\/\//, '');

    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: `www.${siteDomain}`,
          },
        ],
        destination: `${siteUrl}/:path*`,
        permanent: true,
      },
      // Fix for legacy 404s in GSC
      {
        source: '/diensten/3d-websites',
        destination: '/diensten/3d-website-ervaringen',
        permanent: true,
      },
      {
        source: '/overzicht',
        destination: '/overzicht-site',
        permanent: true,
      },
      {
        source: '/kennisbank',
        destination: '/engineering', // Closest match
        permanent: true,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
