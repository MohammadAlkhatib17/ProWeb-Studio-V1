/**
 * SSR-Safe Metadata Component
 * Optimized for Dutch market with fail-safe URL construction
 */

import type { Metadata } from 'next';
import { siteConfig } from '@/config/site.config';

// Robust URL construction with multiple fallbacks
function getSafeBaseURL(): string {
  const envUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  
  if (envUrl) {
    try {
      return new URL(envUrl).toString().replace(/\/+$/, '');
    } catch {
      // Fallback if URL is malformed
    }
  }

  // Environment-based fallbacks
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.NODE_ENV === 'production') {
    return 'https://prowebstudio.nl'; // Production fallback
  }

  return 'http://localhost:3000'; // Development fallback
}

const SAFE_SITE_URL = getSafeBaseURL();

// Enhanced OpenGraph for Dutch market
export function generateDutchMetadata(options: {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const { title, description, path = '/', noIndex = false } = options;
  
  const pageUrl = `${SAFE_SITE_URL}${path}`;
  const pageTitle = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} - ${siteConfig.tagline}`;
  const pageDescription = description || siteConfig.description;

  return {
    metadataBase: new URL(SAFE_SITE_URL),
    title: pageTitle,
    description: pageDescription,
    
    // Enhanced Dutch market keywords
    keywords: [
      'website laten maken nederland',
      'webdesign nederland',
      'webshop laten maken',
      'seo optimalisatie nederland',
      '3d websites nederland',
      'responsive webdesign',
      'mkb website',
      'nederlandse webdevelopment',
    ],
    
    // Optimized OpenGraph for Dutch market
    openGraph: {
      type: 'website',
      locale: 'nl_NL',
      alternateLocale: ['en_US'],
      url: pageUrl,
      siteName: siteConfig.name,
      title: pageTitle,
      description: pageDescription,
      countryName: 'Netherlands',
      images: [
        {
          url: `${SAFE_SITE_URL}/og-image-nl.png`,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - Nederlandse webdevelopment specialist`,
          type: 'image/png',
        },
      ],
    },

    // Enhanced Twitter for Dutch market
    twitter: {
      card: 'summary_large_image',
      site: '@prowebstudio_nl',
      creator: '@prowebstudio_nl',
      title: pageTitle,
      description: pageDescription,
    },

    // Optimized robots directive
    robots: noIndex ? {
      index: false,
      follow: false,
      nocache: true,
    } : {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Streamlined other properties
    other: {
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'theme-color': '#6366f1',
      'format-detection': 'telephone=no',
      'target-market': 'netherlands',
      'business-sector': 'webdevelopment',
      'service-area': 'nederland',
      'geo.region': 'NL',
      'geo.placename': 'Netherlands',
    },

    // Dutch hreflang
    alternates: {
      canonical: pageUrl,
      languages: {
        'nl-NL': pageUrl,
        'x-default': pageUrl,
      },
    },
  };
}

export default generateDutchMetadata;