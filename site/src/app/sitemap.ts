import { MetadataRoute } from 'next';

interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority: number;
}

const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');

/**
 * Maps route paths to their corresponding source files for git-based lastmod
 */
const ROUTE_FILE_MAP: Record<string, string[]> = {
  '/': ['src/app/page.tsx', 'src/components/Hero.tsx', 'src/components/HeroCanvas.tsx'],
  '/contact': ['src/app/contact/page.tsx', 'src/components/contact/ContactForm.tsx'],
  '/portfolio': ['src/app/portfolio/page.tsx', 'src/components/portfolio/PortfolioGrid.tsx'],
  '/werkwijze': ['src/app/werkwijze/page.tsx'],
  '/over-ons': ['src/app/over-ons/page.tsx'],
  '/overzicht-site': ['src/app/overzicht-site/page.tsx'],
  '/privacy': ['src/app/privacy/page.tsx'],
  '/voorwaarden': ['src/app/voorwaarden/page.tsx'],
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL; // Already normalized

  // Define main site routes with their respective priorities and change frequencies
  // Enhanced with git-based lastModified dates and better priority distribution
  // Service and location pages are now handled by separate dedicated sitemaps
  const routes: Array<{
    path: string;
    priority: number;
    changeFreq: SitemapEntry['changeFrequency'];
    files: string[];
  }> = [
    {
      path: '/',
      priority: 1.0, // Home: highest priority
      changeFreq: 'daily', // Home page changes frequently with updates
      files: ROUTE_FILE_MAP['/'],
    },
    {
      path: '/contact',
      priority: 0.9, // Contact: critical for conversions
      changeFreq: 'monthly', // Contact info rarely changes
      files: ROUTE_FILE_MAP['/contact'],
    },
    {
      path: '/portfolio',
      priority: 0.9, // Portfolio: critical for showcasing work
      changeFreq: 'weekly', // Portfolio gets updated with new projects
      files: ROUTE_FILE_MAP['/portfolio'],
    },
    // Note: Service pages (/diensten/*) are now handled by sitemap-services.xml
    // Note: Location pages (/locaties/*) are now handled by sitemap-locations.xml
    {
      path: '/werkwijze',
      priority: 0.8, // Process: important for understanding value prop
      changeFreq: 'monthly', // Process documentation updates monthly
      files: ROUTE_FILE_MAP['/werkwijze'],
    },
    {
      path: '/over-ons',
      priority: 0.8, // About: important for trust and credibility
      changeFreq: 'monthly', // Team and company info updates monthly
      files: ROUTE_FILE_MAP['/over-ons'],
    },
    {
      path: '/overzicht-site',
      priority: 0.5, // Site overview: informational
      changeFreq: 'yearly', // Technical overview rarely changes
      files: ROUTE_FILE_MAP['/overzicht-site'],
    },
    {
      path: '/privacy',
      priority: 0.4, // Privacy: legal requirement but lower conversion priority
      changeFreq: 'yearly', // Privacy policy updates annually or when regulations change
      files: ROUTE_FILE_MAP['/privacy'],
    },
    {
      path: '/voorwaarden',
      priority: 0.4, // Terms: legal requirement but lower conversion priority
      changeFreq: 'yearly', // Terms update annually or when regulations change
      files: ROUTE_FILE_MAP['/voorwaarden'],
    },
    // Note: /speeltuin is excluded as it's marked noindex in middleware
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(), // Use current date since we can't access file system
    changeFrequency: route.changeFreq,
    priority: route.priority,
  }));
}

// Additional function to generate dynamic sitemap entries
// This could be used if you have a CMS or database with dynamic content
export async function generateDynamicSitemapEntries(): Promise<SitemapEntry[]> {
  // This is where you would fetch from your CMS, database, or API
  // For example:
  // const blogPosts = await fetchBlogPosts();
  // const portfolioItems = await fetchPortfolioItems();

  const dynamicEntries: SitemapEntry[] = [];

  // Example of how to add blog posts
  /*
  const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');
  blogPosts.forEach((post) => {
    dynamicEntries.push({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  });
  */

  // Example of how to add portfolio/case study items
  /*
  const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');
  portfolioItems.forEach((item) => {
    dynamicEntries.push({
      url: `${SITE_URL}/portfolio/${item.slug}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: 'yearly',
      priority: 0.5,
    });
  });
  */

  return dynamicEntries;
}
