import { MetadataRoute } from 'next';

// Edge runtime configuration for better performance and region distribution
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
// Primary EU regions matching Vercel Function Regions configuration: Paris, London, Frankfurt
export const preferredRegion = ['cdg1', 'lhr1', 'fra1'];

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

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL; // Already normalized

  // Define routes with their respective priorities and change frequencies
  // Enhanced with more specific lastModified dates and better priority distribution
  const routes: Array<{
    path: string;
    priority: number;
    changeFreq: SitemapEntry['changeFrequency'];
    lastModified: Date;
  }> = [
    {
      path: '/',
      priority: 1.0, // Home: highest priority
      changeFreq: 'daily', // Home page changes frequently with updates
      lastModified: new Date(), // Current date for fresh indexing
    },
    {
      path: '/diensten',
      priority: 0.9, // Services: very important for business
      changeFreq: 'weekly', // Services evolve regularly
      lastModified: new Date('2025-09-20'),
    },
    {
      path: '/contact',
      priority: 0.9, // Contact: critical for conversions
      changeFreq: 'monthly', // Contact info rarely changes
      lastModified: new Date('2025-09-15'),
    },
    {
      path: '/portfolio',
      priority: 0.9, // Portfolio: critical for showcasing work
      changeFreq: 'weekly', // Portfolio gets updated with new projects
      lastModified: new Date(),
    },
    {
      path: '/werkwijze',
      priority: 0.8, // Process: important for understanding value prop
      changeFreq: 'monthly', // Process documentation updates monthly
      lastModified: new Date('2025-09-10'),
    },
    {
      path: '/over-ons',
      priority: 0.8, // About: important for trust and credibility
      changeFreq: 'monthly', // Team and company info updates monthly
      lastModified: new Date('2025-09-05'),
    },
    {
      path: '/overzicht',
      priority: 0.6, // Overview: moderate importance
      changeFreq: 'monthly', // Site overview changes occasionally
      lastModified: new Date('2025-09-01'),
    },
    {
      path: '/overzicht-site',
      priority: 0.5, // Site overview: informational
      changeFreq: 'yearly', // Technical overview rarely changes
      lastModified: new Date('2025-08-15'),
    },
    {
      path: '/privacy',
      priority: 0.4, // Privacy: legal requirement but lower conversion priority
      changeFreq: 'yearly', // Privacy policy updates annually or when regulations change
      lastModified: new Date('2025-08-01'),
    },
    {
      path: '/voorwaarden',
      priority: 0.4, // Terms: legal requirement but lower conversion priority
      changeFreq: 'yearly', // Terms update annually or when regulations change
      lastModified: new Date('2025-08-01'),
    },
    // Note: /speeltuin is excluded as it's marked noindex in middleware
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: route.lastModified,
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
