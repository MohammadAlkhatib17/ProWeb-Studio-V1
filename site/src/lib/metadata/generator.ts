/**
 * Centralized metadata generator for consistent Dutch metadata across all pages
 */

import type { Metadata } from 'next';
import { siteConfig } from '@/config/site.config';
import {
  SITE_URL,
  dutchMetadataDefaults,
  mergeWithDefaultKeywords,
  getPageMetadata,
  dutchPageMetadata,
} from './defaults';

export interface MetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  path?: string;
  ogImage?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  noIndex?: boolean;
  alternateLanguages?: Record<string, string>;
}

/**
 * Generate complete metadata with Dutch defaults
 * Automatically applies noindex for preview deployments
 * CRITICAL: Always includes canonical URL and nl-NL hreflang tags
 */
export function generateMetadata(options: MetadataOptions = {}): Metadata {
  const {
    title,
    description = siteConfig.description,
    keywords = [],
    path = '/',
    ogImage,
    noIndex = false,
    alternateLanguages = {},
  } = options;

  const fullTitle = title || `${siteConfig.name} - ${siteConfig.tagline}`;
  // Ensure path starts with / and canonical URL is properly formatted
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = `${SITE_URL}${normalizedPath}`;
  const mergedKeywords = mergeWithDefaultKeywords(keywords);

  // Enforce noindex for preview deployments
  const isPreview = process.env.VERCEL_ENV === 'preview';
  const shouldNoIndex = noIndex || isPreview;

  // Default OG image
  const defaultOgImage = {
    url: `${SITE_URL}/og`,
    width: 1200,
    height: 630,
    alt: fullTitle,
    type: 'image/png',
  };

  const finalOgImage = ogImage
    ? {
        url: ogImage.url.startsWith('http')
          ? ogImage.url
          : `${SITE_URL}${ogImage.url}`,
        width: ogImage.width || 1200,
        height: ogImage.height || 630,
        alt: ogImage.alt || fullTitle,
        type: 'image/png',
      }
    : defaultOgImage;

  // Build time validation - fail fast if SITE_URL is not configured
  if (!SITE_URL && process.env.NODE_ENV === 'production') {
    throw new Error(
      'CRITICAL: SITE_URL or NEXT_PUBLIC_SITE_URL must be configured in production. ' +
      'Canonical URLs cannot be generated without a valid base URL.'
    );
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: fullTitle,
    description,
    keywords: mergedKeywords,
    authors: [
      { name: siteConfig.name, url: siteConfig.url },
      { name: `${siteConfig.name} Team` },
    ],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    // CRITICAL: These fields are required for SEO compliance
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'nl-NL': canonicalUrl,
        nl: canonicalUrl,
        'x-default': canonicalUrl,
        ...alternateLanguages,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      images: [finalOgImage],
      locale: dutchMetadataDefaults.locale,
      alternateLocale: ['en_US', 'de_DE', 'fr_FR'],
      type: 'website',
      countryName: dutchMetadataDefaults.region,
      emails: [siteConfig.email],
      phoneNumbers: [siteConfig.phone],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@prowebstudio_nl',
      creator: '@prowebstudio_nl',
      title: fullTitle,
      description,
      images: [finalOgImage.url],
    },
    robots: shouldNoIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
            'max-video-preview': 0,
            'max-image-preview': 'none',
            'max-snippet': 0,
          },
        }
      : {
          index: true,
          follow: true,
          nocache: false,
          googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    other: {
      'google-site-verification':
        process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
        process.env.GOOGLE_SITE_VERIFICATION ||
        '',
      'revisit-after': '3 days',
      distribution: 'web',
      rating: 'general',
      language: 'Dutch',
      'geo.region': dutchMetadataDefaults.country,
      'geo.placename': dutchMetadataDefaults.region,
      'geo.position': '52.3676;4.9041',
      ICBM: '52.3676, 4.9041',
      'dc.language': dutchMetadataDefaults.hreflang,
    },
  };
}

/**
 * Generate metadata for specific page types using predefined Dutch content
 */
export function generatePageMetadata(
  pageKey: keyof typeof dutchPageMetadata,
  overrides: Partial<MetadataOptions> = {}
): Metadata {
  const pageData = getPageMetadata(pageKey);

  return generateMetadata({
    title: pageData.title,
    description: pageData.description,
    keywords: [...pageData.keywords],
    path: `/${pageKey === 'home' ? '' : pageKey}`,
    ...overrides,
  });
}

/**
 * Generate hreflang links for inclusion in <head>
 */
export function generateHreflangLinks(path: string = '/') {
  const canonicalUrl = `${SITE_URL}${path}`;

  return [
    { rel: 'alternate', hrefLang: 'nl', href: canonicalUrl },
    { rel: 'alternate', hrefLang: 'nl-NL', href: canonicalUrl },
    { rel: 'alternate', hrefLang: 'x-default', href: canonicalUrl },
  ];
}
