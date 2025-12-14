import { MetadataRoute } from 'next';

import { generateCompleteSitemap } from '@/lib/sitemap-advanced';

// Edge runtime configuration for better performance and region distribution
// Node.js runtime required for FS access (MDX blog posts)
export const runtime = 'nodejs';
// Revalidate sitemap every 24 hours (86400 seconds)
export const revalidate = 86400;

/**
 * Main sitemap.xml generator
 * 
 * Uses segmented sitemap generation from sitemap-advanced.ts
 * This provides better organization and performance
 * 
 * Performance target: < 500ms cold start
 * Dutch-focused SEO with nl-NL hreflang
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Generate complete sitemap from segmented sources
  // Segments: pages, services (diensten), locations (locaties)
  return generateCompleteSitemap();
}
