import { MetadataRoute } from 'next';
import { dutchCities } from '@/config/local-seo.config';

// Edge runtime configuration for better performance and region distribution
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
// Primary EU regions matching Vercel Function Regions configuration: Paris, London, Frankfurt
export const preferredRegion = ['cdg1', 'lhr1', 'fra1'];

const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');

function locationsSitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  // Location overview page
  const locationRoutes = [
    {
      path: '/locaties',
      priority: 0.8, // Location overview - important for local SEO discovery
      changeFreq: 'monthly' as const,
      lastModified: new Date('2025-10-08'),
    }
  ];

  // Generate location pages for all Dutch cities
  const cityRoutes = dutchCities.map(city => {
    // Priority based on population and business potential
    let priority = 0.6; // Default for smaller cities
    
    if (city.population > 500000) {
      priority = 0.8; // Major cities (Amsterdam, Rotterdam, Den Haag, Utrecht)
    } else if (city.population > 200000) {
      priority = 0.7; // Large cities (Eindhoven, Groningen, Tilburg, etc.)
    } else if (city.population > 150000) {
      priority = 0.65; // Medium cities
    }

    return {
      path: `/locatie/${city.slug}`,
      priority,
      changeFreq: 'monthly' as const,
      lastModified: new Date('2025-10-08'),
    };
  });

  // Add service-specific pages for major cities (top 10 by population)
  const majorCities = dutchCities
    .sort((a, b) => b.population - a.population)
    .slice(0, 10);

  const serviceRoutes = majorCities.flatMap(city => [
    {
      path: `/locatie/${city.slug}/webdesign`,
      priority: 0.6,
      changeFreq: 'monthly' as const,
      lastModified: new Date('2025-10-08'),
    },
    {
      path: `/locatie/${city.slug}/webontwikkeling`,
      priority: 0.6,
      changeFreq: 'monthly' as const,
      lastModified: new Date('2025-10-08'),
    },
    {
      path: `/locatie/${city.slug}/ecommerce`,
      priority: 0.6,
      changeFreq: 'monthly' as const,
      lastModified: new Date('2025-10-08'),
    },
    {
      path: `/locatie/${city.slug}/seo`,
      priority: 0.6,
      changeFreq: 'monthly' as const,
      lastModified: new Date('2025-10-08'),
    }
  ]);

  const allRoutes = [...locationRoutes, ...cityRoutes, ...serviceRoutes];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFreq,
    priority: route.priority,
    // Add hreflang for Dutch targeting - especially important for local pages
    alternates: {
      languages: {
        'nl-NL': `${baseUrl}${route.path}`,
        'nl': `${baseUrl}${route.path}`,
      }
    }
  }));
}

export async function GET() {
  const sitemap = locationsSitemap();
  
  // Generate XML manually to include hreflang tags for local SEO
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
      'Cache-Control': 'public, max-age=7200, s-maxage=7200', // 2 hours - locations change less frequently
    },
  });
}