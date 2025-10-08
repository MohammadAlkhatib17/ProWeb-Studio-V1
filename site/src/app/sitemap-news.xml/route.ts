import { 
  generateNewsSitemapXML,
  getLastModifiedDate,
  type NewsSitemapEntry 
} from '@/lib/sitemap-advanced';

// Remove edge runtime due to Node.js API requirements in sitemap-advanced
export const dynamic = 'force-dynamic';

const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');

export async function GET() {
  const baseUrl = SITE_URL;
  
  // Define news/blog entries - this can be expanded with CMS integration
  const newsEntries: NewsSitemapEntry[] = [
    // Example blog posts - replace with actual blog content when available
    {
      url: `${baseUrl}/blog/core-web-vitals-optimalisatie-2025`,
      news: {
        publicationDate: new Date('2025-01-15'),
        title: 'Core Web Vitals Optimalisatie: Complete Gids voor 2025',
        keywords: 'Core Web Vitals, website optimalisatie, performance, SEO, Google ranking',
      },
      lastModified: getLastModifiedDate('docs/CORE_WEB_VITALS_OPTIMIZATION_GUIDE.md'),
    },
    {
      url: `${baseUrl}/blog/3d-websites-toekomst-webdesign`,
      news: {
        publicationDate: new Date('2025-01-10'),
        title: '3D Websites: De Toekomst van Webdesign in Nederland',
        keywords: '3D websites, webdesign trends, Three.js, immersive experiences, web development',
      },
      lastModified: new Date('2025-01-10'),
    },
    {
      url: `${baseUrl}/blog/seo-strategie-nederlandse-bedrijven`,
      news: {
        publicationDate: new Date('2025-01-05'),
        title: 'SEO Strategie voor Nederlandse Bedrijven: Lokale Optimalisatie',
        keywords: 'SEO Nederland, lokale SEO, Nederlandse markt, zoekmachine optimalisatie',
      },
      lastModified: getLastModifiedDate('DUTCH_SEO_IMPLEMENTATION_SUMMARY.md'),
    },
    {
      url: `${baseUrl}/blog/security-headers-website-beveiliging`,
      news: {
        publicationDate: new Date('2024-12-20'),
        title: 'Website Beveiliging: Complete Gids Security Headers 2025',
        keywords: 'website beveiliging, security headers, CSP, HTTPS, web security',
      },
      lastModified: getLastModifiedDate('docs/SECURITY_IMPLEMENTATION_SUMMARY.md'),
    },
    {
      url: `${baseUrl}/blog/performance-optimalisatie-vercel`,
      news: {
        publicationDate: new Date('2024-12-15'),
        title: 'Performance Optimalisatie op Vercel: Best Practices',
        keywords: 'Vercel optimalisatie, website performance, CDN, edge computing',
      },
      lastModified: getLastModifiedDate('VERCEL_PERFORMANCE_OPTIMIZATION.md'),
    },
    {
      url: `${baseUrl}/updates/nieuwe-diensten-2025`,
      news: {
        publicationDate: new Date('2025-01-01'),
        title: 'ProWeb Studio Nieuwe Diensten 2025: 3D Web Experiences',
        keywords: 'ProWeb Studio, nieuwe diensten, 3D websites, web development Nederland',
      },
      lastModified: new Date('2025-01-01'),
    },
    {
      url: `${baseUrl}/updates/portfolio-update-december-2024`,
      news: {
        publicationDate: new Date('2024-12-31'),
        title: 'Portfolio Update: Nieuwe Projecten en Case Studies',
        keywords: 'portfolio update, nieuwe projecten, case studies, web development',
      },
      lastModified: new Date('2024-12-31'),
    },
  ];

  // Filter entries to only include those from the last 2 days (news sitemap requirement)
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  
  const recentNewsEntries = newsEntries.filter(
    entry => entry.news.publicationDate >= twoDaysAgo
  );

  // If no recent news, include a few recent entries for indexing purposes
  const entriesToInclude = recentNewsEntries.length > 0 
    ? recentNewsEntries 
    : newsEntries.slice(0, 5); // Include 5 most recent for demo

  // Generate XML using the advanced system
  const xml = generateNewsSitemapXML(entriesToInclude);

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour (news changes frequently)
    },
  });
}

// Function removed - can be implemented when blog functionality is added

// Removed unused fetchCompanyUpdates function - can be implemented when needed