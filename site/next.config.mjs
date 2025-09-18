// @ts-check

import nextBundleAnalyzer from '@next/bundle-analyzer';
import { CRITICAL_ENV_VARS, PLACEHOLDER_VALUES } from './src/lib/env.required.mjs';

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// Build-time environment validation for production
function validateProductionEnv() {
  // Only validate in production builds
  if (process.env.NODE_ENV !== 'production') {
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

  const errors = [];
  
  for (const envVar of CRITICAL_ENV_VARS) {
    const value = process.env[envVar];
    
    if (!value) {
      errors.push(`${envVar} is not set`);
    } else if (isPlaceholderValue(value)) {
      errors.push(`${envVar} contains placeholder value: "${value}"`);
    }
  }

  if (errors.length > 0) {
    console.error('\n🚨 Build failed! Critical environment variables are missing or invalid:');
    errors.forEach(error => console.error(`   ❌ ${error}`));
    console.error('\n💡 Set the required environment variables in your deployment platform');
    console.error('📚 See docs/DEPLOY_CHECKLIST.md for setup instructions\n');
    throw new Error('Environment validation failed - missing or invalid critical environment variables');
  }
}

// Run validation during build
validateProductionEnv();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable powered by header for security
  poweredByHeader: false,
  
  // Enable React 18 features
  experimental: {
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'three'],
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // PWA and Service Worker: serve /public/sw.js directly as /sw.js

  // Webpack optimization
  webpack: (config, { dev, isServer }) => {
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
      {
        source: '/:path*',
        headers: [
          // Enhanced HSTS with preload
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Frame protection
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Content type protection
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Enhanced referrer policy
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Permissions policy
          { 
            key: 'Permissions-Policy', 
            value: [
              'accelerometer=()',
              'autoplay=()',
              'camera=()',
              'cross-origin-isolated=()',
              'display-capture=()',
              'encrypted-media=()',
              'fullscreen=(self)',
              'geolocation=()',
              'gyroscope=()',
              'keyboard-map=()',
              'magnetometer=()',
              'microphone=()',
              'midi=()',
              'payment=()',
              'picture-in-picture=()',
              'publickey-credentials-get=()',
              'screen-wake-lock=()',
              'sync-xhr=()',
              'usb=()',
              'xr-spatial-tracking=()'
            ].join(', ')
          },
          // DNS prefetch control
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          // Cross-domain policies
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
          // Cross-Origin policies
          { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          // Custom security headers
          { key: 'X-Security-Version', value: '2.0' },
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
      // Contact form specific headers with comprehensive CSP-Report-Only
      // 48h Monitoring Window: 2025-09-18 to 2025-09-20
      // Purpose: Collect violations before enforcing stricter CSP
      // Action Required: Review reports/security/csp-status.md after window closes
      {
        source: '/contact',
        headers: [
          { 
            key: 'Content-Security-Policy-Report-Only', 
            value: [
              "default-src 'self'",
              // Removed unsafe-eval - monitoring for violations
              // If eval violations occur, review code for nonce/hash alternatives
              "script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://js.cal.com https://plausible.io https://va.vercel-scripts.com",
              "script-src-elem 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://plausible.io https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "media-src 'self' https:",
              "frame-src 'self' https://www.google.com https://cal.com https://app.cal.com",
              "connect-src 'self' https://api.cal.com https://www.google-analytics.com https://plausible.io https://vitals.vercel-insights.com https://va.vercel-scripts.com",
              "object-src 'none'",
              "base-uri 'self'",
              "frame-ancestors 'none'",
              "form-action 'self'",
              "upgrade-insecure-requests",
              "report-uri /api/csp-report"
            ].join('; ')
          },
          { key: 'Expect-CT', value: 'max-age=86400, enforce' },
        ],
      },
      
      /* ================================================================================================
       * ENFORCED CSP FOR /CONTACT - READY TO TOGGLE AFTER MONITORING WINDOW
       * ================================================================================================
       * 
       * STATUS: READY FOR ACTIVATION (currently commented out)
       * TOGGLE: See reports/security/csp-status.md for exact switching instructions
       * 
       * ACTIVATION STEPS:
       * 1. Verify 48h monitoring window completed (check CSP violation reports)
       * 2. Uncomment this entire enforced CSP block (lines below)
       * 3. Comment out the Report-Only CSP section above
       * 4. Deploy and monitor for any functionality breaks
       * 
       * WHAT THIS ENFORCES:
       * - Blocks unsafe-eval completely (no dynamic code execution)
       * - Requires all scripts to be from allowed domains or inline with nonces
       * - Prevents data exfiltration through unauthorized connections
       * - Blocks clickjacking and code injection attacks
       * 
       * ROLLBACK: If issues occur, reverse steps 2-3 to return to report-only mode
       * 
      {
        source: '/contact',
        headers: [
          { 
            key: 'Content-Security-Policy', 
            value: [
              "default-src 'self'",
              // ENFORCED: No unsafe-eval or unsafe-inline - all scripts must be explicit
              // NOTE: If inline scripts are needed, add nonces using X-Nonce from middleware.ts
              // Example: "script-src 'self' 'nonce-{DYNAMIC_NONCE}' https://trusted-domain.com"
              "script-src 'self' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://js.cal.com https://plausible.io https://va.vercel-scripts.com",
              "script-src-elem 'self' https://www.google.com https://www.gstatic.com https://plausible.io https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // CSS inline allowed for styling
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:", // Allow all HTTPS images + data/blob URIs
              "media-src 'self' https:",
              "frame-src 'self' https://www.google.com https://cal.com https://app.cal.com", // reCAPTCHA + Cal.com embeds
              "connect-src 'self' https://api.cal.com https://www.google-analytics.com https://plausible.io https://vitals.vercel-insights.com https://va.vercel-scripts.com",
              "object-src 'none'", // Block plugins/embeds
              "base-uri 'self'", // Prevent base tag hijacking
              "frame-ancestors 'none'", // Prevent embedding this page
              "form-action 'self'", // Forms can only submit to same origin
              "upgrade-insecure-requests" // Force HTTPS for all resources
            ].join('; ')
          },
          { key: 'Expect-CT', value: 'max-age=86400, enforce' },
          // Additional security headers for contact form
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      */
    ];
  },

  // Domain redirects - Fallback for ensuring www redirects to apex domain
  // Primary redirects should be configured at platform level (Vercel)
  async redirects() {
    return [
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
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
