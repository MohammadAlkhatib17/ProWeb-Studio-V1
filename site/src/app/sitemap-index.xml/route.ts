import { 
  generateSitemapIndexXML,
  getLastModifiedDate,
  getLatestModificationDate
} from '@/lib/sitemap-advanced';

// Remove edge runtime due to Node.js API requirements in sitemap-advanced
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');

export async function GET() {
  const baseUrl = SITE_URL;
  
  // Define all sitemaps with their metadata and file dependencies
  const sitemaps = [
    {
      loc: `${baseUrl}/sitemap.xml`,
      lastmod: getLatestModificationDate([
        'src/app/sitemap.ts',
        'src/app/page.tsx',
        'src/app/contact/page.tsx',
        'src/app/portfolio/page.tsx',
      ]),
    },
    {
      loc: `${baseUrl}/sitemap-services.xml`,
      lastmod: getLatestModificationDate([
        'src/app/sitemap-services.xml/route.ts',
        'src/app/diensten/page.tsx',
        'src/app/diensten/website-laten-maken/page.tsx',
        'src/app/diensten/webshop-laten-maken/page.tsx',
        'src/app/diensten/seo-optimalisatie/page.tsx',
        'src/app/diensten/3d-website-ervaringen/page.tsx',
        'src/app/diensten/onderhoud-support/page.tsx',
      ]),
    },
    {
      loc: `${baseUrl}/sitemap-locations.xml`,
      lastmod: getLatestModificationDate([
        'src/app/sitemap-locations.xml/route.ts',
        'src/app/locaties/page.tsx',
      ]),
    },
    {
      loc: `${baseUrl}/sitemap-images.xml`,
      lastmod: getLastModifiedDate('src/app/sitemap-images.xml/route.ts'),
    },
    {
      loc: `${baseUrl}/sitemap-news.xml`,
      lastmod: getLastModifiedDate('src/app/sitemap-news.xml/route.ts'),
    },
    {
      loc: `${baseUrl}/sitemap-videos.xml`,
      lastmod: getLastModifiedDate('src/app/sitemap-videos.xml/route.ts'),
    },
  ];

  // Future: If we ever exceed 50k URLs in any sitemap, we would split them here
  // Example for main sitemap splitting:
  /*
  const mainSitemapChunks = await getMainSitemapChunks();
  for (let i = 0; i < mainSitemapChunks.length; i++) {
    sitemaps.push({
      loc: `${baseUrl}/sitemap-${i}.xml`,
      lastmod: new Date(),
    });
  }
  */

  // Generate XML using the advanced system
  const xml = generateSitemapIndexXML(sitemaps);

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

// Removed unused getMainSitemapChunks function - not needed for current sitemap size

// Removed getTotalUrlCount function - not a valid Next.js route export
// URL counting can be done internally within the GET handler if needed