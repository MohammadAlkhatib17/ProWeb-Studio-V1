import { MetadataRoute } from 'next';
import { locations } from '@/config/internal-linking.config';

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

  // Define static routes with their respective priorities and change frequencies
  // Enhanced with more specific lastModified dates and better priority distribution
  const staticRoutes: Array<{
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
      path: '/prijzen',
      priority: 0.9, // Pricing: very important for conversion
      changeFreq: 'monthly', // Pricing updates occasionally
      lastModified: new Date(),
    },
    {
      path: '/portfolio',
      priority: 0.9, // Portfolio: critical for showcasing work
      changeFreq: 'weekly', // Portfolio gets updated with new projects
      lastModified: new Date(),
    },
    // Service detail pages - High priority for SEO
    {
      path: '/diensten/website-laten-maken',
      priority: 0.8, // High priority service page
      changeFreq: 'weekly', // Service details may evolve
      lastModified: new Date('2025-09-24'),
    },
    {
      path: '/diensten/webshop-laten-maken',
      priority: 0.8, // High priority service page
      changeFreq: 'weekly', // Service details may evolve
      lastModified: new Date('2025-09-24'),
    },
    {
      path: '/diensten/seo-optimalisatie',
      priority: 0.8, // High priority service page
      changeFreq: 'weekly', // SEO knowledge evolves frequently
      lastModified: new Date('2025-09-24'),
    },
    {
      path: '/diensten/3d-website-ervaringen',
      priority: 0.7, // Specialized service page
      changeFreq: 'monthly', // 3D tech updates monthly
      lastModified: new Date('2025-09-24'),
    },
    {
      path: '/diensten/onderhoud-support',
      priority: 0.7, // Support service page
      changeFreq: 'monthly', // Support info updates monthly
      lastModified: new Date('2025-09-24'),
    },
    // Location pages - Critical for local SEO
    {
      path: '/locaties',
      priority: 0.8, // Location index: important for local SEO
      changeFreq: 'monthly', // Location info updates monthly
      lastModified: new Date('2025-09-24'),
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
    // Note: /overzicht has been permanently removed from the site
  ];

  // Generate dynamic location routes - sorted by population for priority ranking
  const top10Cities = locations
    .filter(location => location.population) // Ensure population data exists
    .sort((a, b) => (b.population || 0) - (a.population || 0))
    .slice(0, 10);

  const locationRoutes = top10Cities.map((location, index) => ({
    path: `/locaties/${location.slug}`,
    priority: index < 4 ? 0.7 : 0.6, // Top 4 cities get higher priority
    changeFreq: 'monthly' as const,
    lastModified: new Date('2025-09-24'),
  }));

  // Combine static and dynamic routes
  const allRoutes = [...staticRoutes, ...locationRoutes];

  return allRoutes.map((route) => ({
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
