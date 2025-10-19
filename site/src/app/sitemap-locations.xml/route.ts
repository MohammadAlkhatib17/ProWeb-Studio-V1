/**
 * Segmented sitemap: Locations (Locaties)
 * 
 * Serves only location pages
 * Accessible at /sitemap-locations.xml
 */

import { generateLocationsSegment } from '@/lib/sitemap-advanced';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  const locations = generateLocationsSegment();

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${locations
  .map(
    (entry) => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>${
      entry.alternates?.languages
        ? Object.entries(entry.alternates.languages)
            .map(
              ([lang, url]) =>
                `\n    <xhtml:link rel="alternate" hreflang="${lang}" href="${url}" />`
            )
            .join('')
        : ''
    }
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
}
