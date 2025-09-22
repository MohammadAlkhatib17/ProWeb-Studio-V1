import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');
  const base = SITE_URL; // Already normalized
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

  // Production robots.txt with optimized crawling directives
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/diensten/',
          '/contact/',
          '/werkwijze/',
          '/portfolio/',
          '/over-ons/',
          '/privacy/',
          '/voorwaarden/',
          '/sitemap.xml',
          '/robots.txt',
        ],
        disallow: [
          '/speeltuin/',     // Playground area - not for public indexing
          '/_next/',         // Next.js internal files
          '/api/',           // API routes
          '/admin/',         // Admin areas if any
          '*.json$',         // JSON files
          '*.xml$',          // XML files except sitemap
          '/sw.js',          // Service worker
          '/offline.html',   // Offline page
          '/overzicht/',     // Internal overview pages
          '/overzicht-site/', // Internal site overview
          '/.well-known/',   // Hidden directories
          '/manifest.json',  // PWA manifest
        ],
        crawlDelay: 1, // Be respectful to servers
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/diensten/',
          '/contact/',
          '/werkwijze/',
          '/portfolio/',
          '/over-ons/',
          '/privacy/',
          '/voorwaarden/',
          '/sitemap.xml',
          '/robots.txt',
        ],
        disallow: [
          '/speeltuin/',
          '/_next/',
          '/api/',
          '/admin/',
          '/overzicht/',
          '/overzicht-site/',
        ],
        // No crawl delay for Googlebot as it's well-behaved
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/diensten/',
          '/contact/',
          '/werkwijze/',
          '/portfolio/',
          '/over-ons/',
          '/privacy/',
          '/voorwaarden/',
        ],
        disallow: [
          '/speeltuin/',
          '/_next/',
          '/api/',
          '/admin/',
          '/overzicht/',
          '/overzicht-site/',
        ],
        crawlDelay: 2, // Slightly more conservative for Bing
      },
      {
        userAgent: 'facebookexternalhit',
        allow: ['/'], // Allow Facebook for social sharing
        disallow: [
          '/speeltuin/',
          '/_next/',
          '/api/',
          '/admin/',
        ],
      },
      {
        userAgent: 'Twitterbot',
        allow: ['/'], // Allow Twitter for social sharing
        disallow: [
          '/speeltuin/',
          '/_next/',
          '/api/',
          '/admin/',
        ],
      },
      {
        userAgent: 'LinkedInBot',
        allow: ['/'], // Allow LinkedIn for professional sharing
        disallow: [
          '/speeltuin/',
          '/_next/',
          '/api/',
          '/admin/',
        ],
      }
    ],
    sitemap: [
      `${base}/sitemap.xml`,
      `${base}/sitemap-images.xml`, // We'll create this image sitemap
    ],
    host: 'prowebstudio.nl',
  };
}
