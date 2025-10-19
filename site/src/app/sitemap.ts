import { MetadataRoute } from 'next';
import { generateCompleteSitemap } from '@/lib/sitemap-advanced';

// Edge runtime configuration for better performance and region distribution
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
// Primary EU regions matching Vercel Function Regions configuration: Paris, London, Frankfurt
export const preferredRegion = ['cdg1', 'lhr1', 'fra1'];

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
