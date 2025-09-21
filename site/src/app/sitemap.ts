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
const BUILD_TIME = new Date(process.env.BUILD_TIME ?? new Date().toISOString());

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL; // Already normalized

  // Define routes with their respective priorities and change frequencies
  const routes: Array<{
    path: string;
    priority: number;
    changeFreq: SitemapEntry['changeFrequency'];
    fallbackDate?: Date; // Optional fallback if mtime is unavailable
  }> = [
    {
      path: '/',
      priority: 1.0, // Home: highest priority
      changeFreq: 'weekly', // Core page: weekly
      fallbackDate: BUILD_TIME,
    },
    {
      path: '/diensten',
      priority: 0.9,
      changeFreq: 'weekly', // Core page: weekly
      fallbackDate: new Date('2025-09-01'),
    },
    {
      path: '/werkwijze',
      priority: 0.8,
      changeFreq: 'weekly', // Core page: weekly
      fallbackDate: new Date('2025-08-15'),
    },
    {
      path: '/contact',
      priority: 0.9,
      changeFreq: 'weekly', // Core page: weekly
      fallbackDate: new Date('2025-08-01'),
    },
    {
      path: '/over-ons',
      priority: 0.8,
      changeFreq: 'weekly', // Core page: weekly
      fallbackDate: new Date('2025-09-01'),
    },
    {
      path: '/overzicht',
      priority: 0.4,
      changeFreq: 'yearly',
      fallbackDate: new Date(),
    },
    {
      path: '/privacy',
      priority: 0.3,
      changeFreq: 'monthly', // Legal page: monthly
      fallbackDate: new Date('2025-05-25'),
    },
    {
      path: '/voorwaarden',
      priority: 0.3,
      changeFreq: 'monthly', // Legal page: monthly
      fallbackDate: new Date('2025-05-25'),
    },
  ];

  // Combine all routes (just the main routes for now)
  const allRoutes = [...routes];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: BUILD_TIME,
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
