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

// Capture a deterministic build-time timestamp (UTC).
const BUILD_TIME_ISO = new Date().toISOString();

// Explicit allowlist with required metadata
const ALLOWLIST: Array<{
  path: string;
  priority: number;
  changeFreq: SitemapEntry['changeFrequency'];
}> = [
  { path: '/', priority: 1.0, changeFreq: 'weekly' },
  { path: '/diensten', priority: 0.9, changeFreq: 'weekly' },
  { path: '/contact', priority: 0.8, changeFreq: 'monthly' },
  { path: '/werkwijze', priority: 0.7, changeFreq: 'monthly' },
  { path: '/over-ons', priority: 0.7, changeFreq: 'monthly' },
  { path: '/speeltuin', priority: 0.6, changeFreq: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFreq: 'yearly' },
  { path: '/voorwaarden', priority: 0.3, changeFreq: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (!baseEnv) {
    // In case env is missing, still produce valid absolute URLs to avoid XML issues.
    // Prefer explicit env in real deployments.
    // eslint-disable-next-line no-console
    console.warn('NEXT_PUBLIC_SITE_URL is not set; falling back to https://prowebstudio.nl');
  }
  const baseUrl = (baseEnv || 'https://prowebstudio.nl').replace(/\/$/, '');

  const seen = new Set<string>();
  const list = ALLOWLIST.filter((r) => {
    if (seen.has(r.path)) return false;
    seen.add(r.path);
    return true;
  });

  return list.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(BUILD_TIME_ISO),
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
  const SITE_URL = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl';
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
  const SITE_URL = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl';
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
