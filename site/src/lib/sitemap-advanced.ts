/**
 * Advanced Sitemap Generation with Segmentation
 * 
 * Segments sitemaps into:
 * - pages (static pages)
 * - services (diensten routes)
 * - locations (locaties routes)
 * 
 * Performance target: < 500ms cold start
 * Dutch-focused with nl-NL priorities
 */

import { MetadataRoute } from 'next';
import { services, locations } from '@/config/internal-linking.config';

// Performance: Edge runtime for faster cold starts
export const runtime = 'edge';

/**
 * Base site URL normalized
 */
export function getSiteUrl(): string {
  return (
    process.env.SITE_URL ?? 
    process.env.NEXT_PUBLIC_SITE_URL ?? 
    'https://prowebstudio.nl'
  ).replace(/\/+$/, '');
}

/**
 * Sitemap entry interface for type safety
 */
export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  alternates?: {
    languages?: {
      [locale: string]: string;
    };
  };
}

/**
 * Static pages sitemap segment
 * High priority pages focused on conversions and information
 */
export function generatePagesSegment(): SitemapEntry[] {
  const baseUrl = getSiteUrl();
  const now = new Date();

  return [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          'nl-NL': `${baseUrl}/`,
        },
      },
    },
    {
      url: `${baseUrl}/diensten`,
      lastModified: new Date('2025-09-20'),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          'nl-NL': `${baseUrl}/diensten`,
        },
      },
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2025-09-15'),
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: {
        languages: {
          'nl-NL': `${baseUrl}/contact`,
        },
      },
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          'nl-NL': `${baseUrl}/portfolio`,
        },
      },
    },
    {
      url: `${baseUrl}/werkwijze`,
      lastModified: new Date('2025-09-10'),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          'nl-NL': `${baseUrl}/werkwijze`,
        },
      },
    },
    {
      url: `${baseUrl}/over-ons`,
      lastModified: new Date('2025-09-05'),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          'nl-NL': `${baseUrl}/over-ons`,
        },
      },
    },
    {
      url: `${baseUrl}/overzicht-site`,
      lastModified: new Date('2025-08-15'),
      changeFrequency: 'yearly',
      priority: 0.5,
      alternates: {
        languages: {
          'nl-NL': `${baseUrl}/overzicht-site`,
        },
      },
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date('2025-08-01'),
      changeFrequency: 'yearly',
      priority: 0.4,
      alternates: {
        languages: {
          'nl-NL': `${baseUrl}/privacy`,
        },
      },
    },
    {
      url: `${baseUrl}/voorwaarden`,
      lastModified: new Date('2025-08-01'),
      changeFrequency: 'yearly',
      priority: 0.4,
      alternates: {
        languages: {
          'nl-NL': `${baseUrl}/voorwaarden`,
        },
      },
    },
  ];
}

/**
 * Services sitemap segment
 * Generated from internal-linking.config services
 * High priority for Dutch business services
 */
export function generateServicesSegment(): SitemapEntry[] {
  const baseUrl = getSiteUrl();
  const serviceUpdateDate = new Date('2025-09-24');

  // Map services from config to sitemap entries
  return services.map((service) => {
    // Extract slug from href (e.g., '/diensten/website-laten-maken' -> 'website-laten-maken')
    const slug = service.href.split('/').pop() || '';
    
    // Determine priority based on service importance
    let priority = 0.8;
    if (slug === 'website-laten-maken' || slug === 'webshop-laten-maken' || slug === 'seo-optimalisatie') {
      priority = 0.8; // Core services
    } else {
      priority = 0.7; // Specialized services
    }

    return {
      url: `${baseUrl}${service.href}`,
      lastModified: serviceUpdateDate,
      changeFrequency: 'weekly' as const,
      priority,
      alternates: {
        languages: {
          'nl-NL': `${baseUrl}${service.href}`,
        },
      },
    };
  });
}

/**
 * Locations sitemap segment
 * Generated from internal-linking.config locations
 * Critical for local Dutch SEO
 */
export function generateLocationsSegment(): SitemapEntry[] {
  const baseUrl = getSiteUrl();
  const locationUpdateDate = new Date('2025-09-24');

  // Add main locations index page
  const locationsIndex: SitemapEntry = {
    url: `${baseUrl}/locaties`,
    lastModified: locationUpdateDate,
    changeFrequency: 'monthly',
    priority: 0.8,
    alternates: {
      languages: {
        'nl-NL': `${baseUrl}/locaties`,
      },
    },
  };

  // Map locations from config to sitemap entries
  const locationPages = locations.map((location) => {
    // Determine priority based on population/importance
    let priority = 0.6;
    if (location.population && location.population > 500000) {
      priority = 0.7; // Major cities (Amsterdam, Rotterdam, Den Haag)
    }

    return {
      url: `${baseUrl}/locaties/${location.slug}`,
      lastModified: locationUpdateDate,
      changeFrequency: 'monthly' as const,
      priority,
      alternates: {
        languages: {
          'nl-NL': `${baseUrl}/locaties/${location.slug}`,
        },
      },
    };
  });

  return [locationsIndex, ...locationPages];
}

/**
 * Generate complete sitemap with all segments
 * Used by app/sitemap.ts
 */
export function generateCompleteSitemap(): MetadataRoute.Sitemap {
  const pages = generatePagesSegment();
  const services = generateServicesSegment();
  const locations = generateLocationsSegment();

  return [...pages, ...services, ...locations];
}

/**
 * Generate sitemap index pointing to segmented sitemaps
 * This is used when you want to expose multiple sitemap files
 */
export function generateSitemapIndex(): Array<{ url: string; lastModified: Date }> {
  const baseUrl = getSiteUrl();
  const now = new Date();

  return [
    {
      url: `${baseUrl}/sitemap-pages.xml`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/sitemap-services.xml`,
      lastModified: new Date('2025-09-24'),
    },
    {
      url: `${baseUrl}/sitemap-locations.xml`,
      lastModified: new Date('2025-09-24'),
    },
  ];
}

/**
 * Utility: Count total sitemap entries
 * Useful for monitoring and performance tracking
 */
export function getSitemapStats(): {
  total: number;
  pages: number;
  services: number;
  locations: number;
} {
  const pages = generatePagesSegment();
  const services = generateServicesSegment();
  const locations = generateLocationsSegment();

  return {
    total: pages.length + services.length + locations.length,
    pages: pages.length,
    services: services.length,
    locations: locations.length,
  };
}

/**
 * Utility: Validate sitemap entries
 * Ensures all URLs are properly formatted and accessible
 */
export function validateSitemapEntries(entries: SitemapEntry[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  for (const entry of entries) {
    // Check URL format
    try {
      new URL(entry.url);
    } catch {
      errors.push(`Invalid URL format: ${entry.url}`);
    }

    // Check priority range
    if (entry.priority < 0 || entry.priority > 1) {
      errors.push(`Invalid priority for ${entry.url}: ${entry.priority}`);
    }

    // Check date is valid
    if (isNaN(entry.lastModified.getTime())) {
      errors.push(`Invalid lastModified date for ${entry.url}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
