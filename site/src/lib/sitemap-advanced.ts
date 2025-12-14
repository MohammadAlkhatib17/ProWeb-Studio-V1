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

import { diensten } from '@/config/diensten.config';
import { steden } from '@/config/steden.config';

// Update runtime to Node.js to support FS operations for MDX
export const runtime = 'nodejs';

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
      url: `${baseUrl}/engineering`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: {
        languages: {
          'nl-NL': `${baseUrl}/engineering`,
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
 * Locations sitemap segment
 * Generated from steden.config.ts
 * Critical for local Dutch SEO
 */
export function generateLocationsSegment(): SitemapEntry[] {
  const baseUrl = getSiteUrl();
  const locationUpdateDate = new Date(); // Use current date or file mtime if available

  // Add main locations index page
  const locationsIndex: SitemapEntry = {
    url: `${baseUrl}/steden`, // Updated to /steden
    lastModified: locationUpdateDate,
    changeFrequency: 'monthly',
    priority: 0.8,
    alternates: {
      languages: {
        'nl-NL': `${baseUrl}/steden`,
      },
    },
  };

  // Map locations from steden.config to sitemap entries
  const locationPages = steden.map((stad) => {
    // Determine priority based on population
    let priority = 0.6;
    if (stad.population > 200000) {
      priority = 0.8; // Major cities
    } else if (stad.population > 100000) {
      priority = 0.7; // Medium cities
    }

    return {
      url: `${baseUrl}/steden/${stad.slug}`, // Updated to /steden
      lastModified: locationUpdateDate,
      changeFrequency: 'weekly' as const, // City pages are dynamic now
      priority,
      alternates: {
        languages: {
          'nl-NL': `${baseUrl}/steden/${stad.slug}`,
        },
      },
    };
  });

  // Feature: Generate City + Service combination pages
  // e.g., /steden/amsterdam/website-laten-maken
  const locationServicePages: SitemapEntry[] = [];

  steden.forEach((stad) => {
    diensten.forEach((dienst) => {
      // Basic priority logic
      let priority = 0.6;
      if (stad.population > 200000) priority += 0.1;
      if (['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'].includes(dienst.slug)) priority += 0.1;

      locationServicePages.push({
        url: `${baseUrl}/steden/${stad.slug}/${dienst.slug}`,
        lastModified: locationUpdateDate,
        changeFrequency: 'weekly',
        priority: Math.min(priority, 1.0), // Cap at 1.0
        alternates: {
          languages: {
            'nl-NL': `${baseUrl}/steden/${stad.slug}/${dienst.slug}`,
          }
        }
      });
    });
  });

  return [locationsIndex, ...locationPages, ...locationServicePages];
}

/**
 * Services sitemap segment
 * Generated from diensten.config.ts
 * High priority for Dutch business services
 */
export function generateServicesSegment(): SitemapEntry[] {
  const baseUrl = getSiteUrl();
  const serviceUpdateDate = new Date();

  // Map services from config to sitemap entries
  return diensten.map((dienst) => {
    // Determine priority based on business value
    let priority = 0.8;
    if (['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'].includes(dienst.slug)) {
      priority = 0.9; // Core services
    }

    return {
      url: `${baseUrl}/diensten/${dienst.slug}`,
      lastModified: serviceUpdateDate,
      changeFrequency: 'weekly' as const,
      priority,
      alternates: {
        languages: {
          'nl-NL': `${baseUrl}/diensten/${dienst.slug}`,
        },
      },
    };
  });
}

import { getAllArticles } from '@/lib/mdx';

/**
 * Engineering Blog Segment
 */
export function generateEngineeringSegment(): SitemapEntry[] {
  try {
    const baseUrl = getSiteUrl();
    const now = new Date();

    const articles = getAllArticles();

    return articles.map(article => ({
      url: `${baseUrl}/engineering/${article.slug}`,
      lastModified: new Date(article.publishedAt || now),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: {
          'nl-NL': `${baseUrl}/engineering/${article.slug}`,
        }
      }
    }));
  } catch (error) {
    console.error('Error generating engineering sitemap segment:', error);
    // Return empty array instead of crashing the entire sitemap
    return [];
  }
}

/**
 * Generate complete sitemap with all segments
 * Used by app/sitemap.ts
 */
export function generateCompleteSitemap(): MetadataRoute.Sitemap {
  const pages = generatePagesSegment();
  const services = generateServicesSegment();
  const locations = generateLocationsSegment();
  const engineering = generateEngineeringSegment();

  return [...pages, ...services, ...locations, ...engineering];
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
