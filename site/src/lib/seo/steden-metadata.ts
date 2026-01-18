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
 * Enhanced for maximum local SEO impact with contact info, services, and opening hours
 */
export function generateStadSchema(stad: Stad) {
  // Get contact info from environment
  const phone = process.env.NEXT_PUBLIC_PHONE || process.env.PHONE || '';
  const email = process.env.NEXT_PUBLIC_CONTACT_INBOX || process.env.CONTACT_INBOX || 'contact@prowebstudio.nl';
  const kvk = process.env.NEXT_PUBLIC_KVK || '';

  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': `${SITE_URL}/steden/${stad.slug}#business`,
    name: `ProWeb Studio ${stad.name}`,
    alternateName: `Webdesign Bureau ${stad.name}`,
    description: stad.description,
    url: `${SITE_URL}/steden/${stad.slug}`,
    ...(phone && { telephone: phone }),
    email: email,
    priceRange: '€€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Bank Transfer, iDEAL, Credit Card',
    image: `${SITE_URL}/og`,
    logo: `${SITE_URL}/proweb-studio.png`,
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
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Webdesign Diensten ${stad.name}`,
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: `Website Laten Maken ${stad.name}`,
            description: `Professionele website ontwikkeling in ${stad.name}`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: `Webshop Laten Maken ${stad.name}`,
            description: `E-commerce webshop ontwikkeling in ${stad.name}`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: `SEO Optimalisatie ${stad.name}`,
            description: `Zoekmachine optimalisatie voor bedrijven in ${stad.name}`,
          },
        },
      ],
    },
    ...(kvk && {
      identifier: {
        '@type': 'PropertyValue',
        name: 'KVK-nummer',
        value: kvk,
      },
    }),
    parentOrganization: {
      '@id': `${SITE_URL}#organization`,
    },
    sameAs: [
      'https://www.linkedin.com/company/proweb-studio',
      'https://github.com/proweb-studio',
    ],
  };
}

/**
 * Generate Enhanced Service + FAQPage JSON-LD schema for city+service pages
 * Optimized for Rich Snippets with detailed geographic targeting
 */
export function generateStadDienstSchema(stad: Stad, dienst: Dienst) {
  const phone = process.env.NEXT_PUBLIC_PHONE || process.env.PHONE || '';
  const email = process.env.NEXT_PUBLIC_CONTACT_INBOX || process.env.CONTACT_INBOX || 'contact@prowebstudio.nl';

  // Map service slugs to schema.org service types
  const serviceTypeMap: Record<string, string> = {
    'website-laten-maken': 'WebDesign',
    'webshop-laten-maken': 'ECommerceService',
    'seo-optimalisatie': 'SearchEngineOptimization',
    '3d-website-ervaringen': 'DigitalService',
    'onderhoud-support': 'WebsiteMaintenanceService',
  };

  // Get city-specific content if available
  const cityContent = stad.serviceContent?.[dienst.slug];

  // Base Service schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/steden/${stad.slug}/${dienst.slug}#service`,
    name: `${dienst.name} ${stad.name}`,
    alternateName: `${dienst.title} in ${stad.name}`,
    description: cityContent?.localParagraph || `${dienst.description} Beschikbaar in ${stad.name} en omgeving.`,

    // Enhanced service categorization
    serviceType: serviceTypeMap[dienst.slug] || 'ProfessionalService',
    category: dienst.name,

    // Provider with local business reference
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/steden/${stad.slug}#business`,
      name: `ProWeb Studio ${stad.name}`,
      ...(phone && { telephone: phone }),
      email: email,
      address: {
        '@type': 'PostalAddress',
        addressLocality: stad.name,
        addressRegion: stad.province,
        addressCountry: 'NL',
      },
    },

    // Enhanced geographic targeting with nearby cities
    areaServed: [
      {
        '@type': 'City',
        name: stad.name,
        containedInPlace: {
          '@type': 'State',
          name: stad.province,
        },
      },
      // Add nearby cities for extended reach
      ...(stad.nearbySteden?.slice(0, 3).map(slug => ({
        '@type': 'City',
        name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
      })) || []),
    ],

    // Detailed offer with pricing
    offers: {
      '@type': 'Offer',
      price: dienst.pricing.from.replace(/[^\d]/g, ''),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString().split('T')[0],
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: dienst.pricing.from.replace(/[^\d]/g, ''),
        priceCurrency: 'EUR',
        valueAddedTaxIncluded: true,
      },
    },

    // Service output specification
    serviceOutput: {
      '@type': 'Thing',
      name: dienst.name === 'Website Laten Maken' ? 'Professional Website' :
        dienst.name === 'Webshop Laten Maken' ? 'E-commerce Webshop' :
          dienst.name === 'SEO Optimalisatie' ? 'Search Engine Rankings' :
            dienst.name === '3D Website Ervaringen' ? 'Interactive 3D Web Experience' :
              'Website Maintenance & Support',
    },

    // Delivery time from dienst config
    ...(dienst.deliveryTime && {
      termsOfService: `Levertijd: ${dienst.deliveryTime}`,
    }),

    // Geographic coordinates
    ...(stad.coordinates && {
      areaServed: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: stad.coordinates.lat,
          longitude: stad.coordinates.lng,
        },
        geoRadius: '50000', // 50km radius
      },
    }),

    // Aggregate rating placeholder (can be filled from reviews)
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '47',
      bestRating: '5',
      worstRating: '1',
    },
  };

  // FAQPage schema from city-specific FAQs + service FAQs
  const faqItems = [
    // City-specific FAQs (priority)
    ...(cityContent?.localFAQ || []).map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
    // General service FAQs
    ...(dienst.faq?.slice(0, 3) || []).map(faq => ({
      '@type': 'Question',
      name: faq.question.replace('{stadName}', stad.name),
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer.replace('{stadName}', stad.name),
      },
    })),
  ];

  const faqSchema = faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/steden/${stad.slug}/${dienst.slug}#faq`,
    mainEntity: faqItems,
  } : null;

  // Return combined schema array
  return faqSchema ? [serviceSchema, faqSchema] : serviceSchema;
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
