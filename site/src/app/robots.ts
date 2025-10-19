import type { MetadataRoute } from 'next';

/**
 * Dynamic robots.txt generator
 * 
 * - Production: Allow crawling with proper directives
 * - Preview: Block all crawling
 * - Includes proper Host and Sitemap entries
 * - No duplicates, clean structure
 */
export default function robots(): MetadataRoute.Robots {
  const SITE_URL = (
    process.env.SITE_URL ?? 
    process.env.NEXT_PUBLIC_SITE_URL ?? 
    (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000')
  ).replace(/\/+$/, '');
  
  const isPreview = process.env.VERCEL_ENV === 'preview';
  
  if (isPreview) {
    // For preview deployments: block all crawlers completely
    return {
      rules: [
        {
          userAgent: '*',
          disallow: ['/'],
        }
      ],
      sitemap: [], // No sitemap for preview
    };
  }

  // Production robots.txt with optimized crawling directives for Dutch SEO
  return {
    rules: [
      // Default rule for all bots - most permissive
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [
          '/speeltuin/',      // Playground area - not for public indexing
          '/_next/',          // Next.js internal files
          '/api/',            // API routes
          '/admin/',          // Admin areas if any
          '/*.json$',         // JSON files
          '/sw.js',           // Service worker
          '/offline.html',    // Offline page
          '/overzicht-site/', // Internal site overview
          '/.well-known/',    // Hidden directories (except specific public ones)
          '/manifest.json',   // PWA manifest
        ],
        crawlDelay: 1,
      },
      // Googlebot - most important for Dutch market
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: [
          '/speeltuin/',
          '/_next/',
          '/api/',
          '/admin/',
          '/overzicht-site/',
        ],
        // No crawl delay for Googlebot
      },
      // Googlebot-Image for image indexing
      {
        userAgent: 'Googlebot-Image',
        allow: ['/'],
        disallow: [
          '/speeltuin/',
          '/_next/static/', // Allow optimized images but not internal static files
        ],
      },
      // Bingbot
      {
        userAgent: 'Bingbot',
        allow: ['/'],
        disallow: [
          '/speeltuin/',
          '/_next/',
          '/api/',
          '/admin/',
          '/overzicht-site/',
        ],
        crawlDelay: 2,
      },
      // Social media crawlers for rich previews
      {
        userAgent: 'facebookexternalhit',
        allow: ['/'],
        disallow: ['/speeltuin/', '/_next/', '/api/', '/admin/'],
      },
      {
        userAgent: 'Twitterbot',
        allow: ['/'],
        disallow: ['/speeltuin/', '/_next/', '/api/', '/admin/'],
      },
      {
        userAgent: 'LinkedInBot',
        allow: ['/'],
        disallow: ['/speeltuin/', '/_next/', '/api/', '/admin/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
