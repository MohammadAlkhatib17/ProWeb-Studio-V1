/**
 * SEO metadata utilities for cities (steden) and services (diensten) pages
 * Ensures consistent metadata with proper canonical, hreflang, and og:locale
 */

import type { Dienst } from '@/config/diensten.config';
import type { Stad } from '@/config/steden.config';
import { siteConfig } from '@/config/site.config';

import type { Metadata } from 'next';

// Site URL from config
const SITE_URL = siteConfig.url;

// Dutch metadata defaults
const dutchMetadataDefaults = {
  locale: 'nl_NL',
  language: 'nl-NL',
};

export interface StadMetadataOptions {
  stad: Stad;
  dienst?: Dienst;
}

/**
 * Generate metadata for /steden/[stad] pages
 */
export function generateStadMetadata({ stad }: { stad: Stad }): Metadata {
  const canonicalUrl = `${SITE_URL}/steden/${stad.slug}`;
  const title = `Website Laten Maken ${stad.name} | Webdesign ${stad.name} | ProWeb Studio`;
  const description = stad.description;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: stad.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'nl-NL': canonicalUrl,
        'nl': canonicalUrl,
        'x-default': canonicalUrl,
      },
    },
    openGraph: {
      title,
      description: stad.shortDescription,
      url: canonicalUrl,
      siteName: 'ProWeb Studio',
      locale: dutchMetadataDefaults.locale,
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/og`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: stad.shortDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'geo.region': stad.province,
      'geo.placename': stad.name,
      ...(stad.coordinates && {
        'geo.position': `${stad.coordinates.lat};${stad.coordinates.lng}`,
        'ICBM': `${stad.coordinates.lat}, ${stad.coordinates.lng}`,
      }),
    },
  };
}

/**
 * Generate metadata for /steden/[stad]/[dienst] pages
 */
export function generateStadDienstMetadata({ stad, dienst }: { stad: Stad; dienst: Dienst }): Metadata {
  const canonicalUrl = `${SITE_URL}/steden/${stad.slug}/${dienst.slug}`;
  const title = `${dienst.name} ${stad.name} | ${dienst.title} | ProWeb Studio`;
  const description = `${dienst.name} in ${stad.name}. ${dienst.shortDescription} Professionele webdesign diensten voor ondernemers in ${stad.name} en omgeving.`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: [
      ...dienst.keywords.map(kw => `${kw} ${stad.name.toLowerCase()}`),
      ...stad.keywords,
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'nl-NL': canonicalUrl,
        'nl': canonicalUrl,
        'x-default': canonicalUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'ProWeb Studio',
      locale: dutchMetadataDefaults.locale,
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/og`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'geo.region': stad.province,
      'geo.placename': stad.name,
      ...(stad.coordinates && {
        'geo.position': `${stad.coordinates.lat};${stad.coordinates.lng}`,
        'ICBM': `${stad.coordinates.lat}, ${stad.coordinates.lng}`,
      }),
    },
  };
}

/**
 * Generate LocalBusiness JSON-LD schema for city pages
 */
export function generateStadSchema(stad: Stad) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/steden/${stad.slug}#business`,
    name: `ProWeb Studio ${stad.name}`,
    description: stad.description,
    url: `${SITE_URL}/steden/${stad.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: stad.name,
      addressRegion: stad.province,
      addressCountry: 'NL',
    },
    areaServed: {
      '@type': 'City',
      name: stad.name,
      containedInPlace: {
        '@type': 'State',
        name: stad.province,
        containedInPlace: {
          '@type': 'Country',
          name: 'Netherlands',
        },
      },
    },
    ...(stad.coordinates && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: stad.coordinates.lat,
        longitude: stad.coordinates.lng,
      },
    }),
    parentOrganization: {
      '@id': `${SITE_URL}#organization`,
    },
  };
}

/**
 * Generate Service JSON-LD schema for city+service pages
 */
export function generateStadDienstSchema(stad: Stad, dienst: Dienst) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/steden/${stad.slug}/${dienst.slug}#service`,
    name: `${dienst.name} ${stad.name}`,
    description: `${dienst.description} Beschikbaar in ${stad.name} en omgeving.`,
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/steden/${stad.slug}#business`,
      name: `ProWeb Studio ${stad.name}`,
    },
    areaServed: {
      '@type': 'City',
      name: stad.name,
      addressRegion: stad.province,
      addressCountry: 'NL',
    },
    offers: {
      '@type': 'Offer',
      price: dienst.pricing.from.replace(/[^\d]/g, ''),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: dienst.pricing.from.replace(/[^\d]/g, ''),
        priceCurrency: 'EUR',
      },
    },
    serviceType: dienst.name,
    category: dienst.slug,
  };
}

/**
 * Generate BreadcrumbList JSON-LD schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    inLanguage: 'nl-NL',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: {
        '@type': 'WebPage',
        '@id': item.url,
      },
    })),
  };
}
