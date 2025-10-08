import { MetadataRoute } from 'next';
import { getRouteLastModified } from '@/lib/sitemap-utils';

// Remove edge runtime due to Node.js API requirements in sitemap-utils
export const dynamic = 'force-dynamic';

const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');

function servicesSitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  // Service pages with enhanced priorities and hreflang support
  const serviceRoutes = [
    {
      path: '/diensten',
      priority: 0.95, // Services overview - critical landing page
      changeFreq: 'weekly' as const,
      lastModified: getRouteLastModified('/diensten', new Date('2025-10-08')),
    },
    {
      path: '/diensten/website-laten-maken',
      priority: 0.95, // Primary service - highest conversion potential
      changeFreq: 'weekly' as const,
      lastModified: getRouteLastModified('/diensten/website-laten-maken', new Date('2025-10-08')),
    },
    {
      path: '/diensten/webshop-laten-maken',
      priority: 0.95, // High-value e-commerce service
      changeFreq: 'weekly' as const,
      lastModified: getRouteLastModified('/diensten/webshop-laten-maken', new Date('2025-10-08')),
    },
    {
      path: '/diensten/seo-optimalisatie',
      priority: 0.9, // Essential digital marketing service
      changeFreq: 'weekly' as const,
      lastModified: getRouteLastModified('/diensten/seo-optimalisatie', new Date('2025-10-08')),
    },
    {
      path: '/diensten/3d-website-ervaringen',
      priority: 0.9, // Unique differentiator service
      changeFreq: 'weekly' as const,
      lastModified: getRouteLastModified('/diensten/3d-website-ervaringen', new Date('2025-10-08')),
    },
    {
      path: '/diensten/onderhoud-support',
      priority: 0.9, // Client retention service
      changeFreq: 'monthly' as const,
      lastModified: getRouteLastModified('/diensten/onderhoud-support', new Date('2025-10-08')),
    },
  ];

  return serviceRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFreq,
    priority: route.priority,
    // Add hreflang for Dutch targeting
    alternates: {
      languages: {
        'nl-NL': `${baseUrl}${route.path}`,
        'nl': `${baseUrl}${route.path}`,
      }
    }
  }));
}

export async function GET() {
  const sitemap = servicesSitemap();
  
  // Generate XML manually to include hreflang tags
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemap.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified instanceof Date ? entry.lastModified.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
    <xhtml:link rel="alternate" hreflang="nl-NL" href="${entry.url}" />
    <xhtml:link rel="alternate" hreflang="nl" href="${entry.url}" />
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}