/**
 * JSON-LD Structured Data Helpers
 * Provides functions to generate structured data for different page types
 */

import { siteConfig } from '@/config/site.config';
import { SITE_URL, dutchMetadataDefaults } from './defaults';

interface BaseSchema {
  '@context': string;
  '@type': string;
  '@id'?: string;
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema(): BaseSchema & Record<string, unknown> {
  const socialProfiles = [
    siteConfig.social.linkedin,
    siteConfig.social.github,
    siteConfig.social.twitter,
  ].filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}#organization`,
    name: siteConfig.name,
    alternateName: 'ProWeb Studio Nederland',
    description: siteConfig.description,
    inLanguage: dutchMetadataDefaults.hreflang,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}#logo`,
      url: `${SITE_URL}/assets/logo/logo-proweb-lockup.svg`,
      contentUrl: `${SITE_URL}/assets/logo/logo-proweb-lockup.svg`,
      width: 600,
      height: 60,
      caption: `${siteConfig.name} logo`,
    },
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      '@type': 'PostalAddress',
      addressCountry: dutchMetadataDefaults.country,
      addressRegion: 'Noord-Holland',
    },
    areaServed: {
      '@type': 'Place',
      name: dutchMetadataDefaults.region,
      address: {
        '@type': 'PostalAddress',
        addressCountry: dutchMetadataDefaults.country,
      },
    },
    sameAs: socialProfiles,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: siteConfig.phone,
        email: siteConfig.email,
        contactType: 'Customer Service',
        areaServed: dutchMetadataDefaults.country,
        availableLanguage: ['nl', 'en'],
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00',
        },
      },
    ],
  };
}

/**
 * Generate WebSite schema
 */
export function generateWebSiteSchema(): BaseSchema & Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}#website`,
    name: siteConfig.name,
    alternateName: ['ProWeb Studio Nederland', 'ProWeb Studio NL'],
    description: siteConfig.description,
    url: SITE_URL,
    inLanguage: dutchMetadataDefaults.hreflang,
    publisher: {
      '@id': `${SITE_URL}#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/zoeken?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate WebPage schema
 */
export function generateWebPageSchema(options: {
  title: string;
  description: string;
  url: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
}): BaseSchema & Record<string, unknown> {
  const { title, description, url, breadcrumbs = [] } = options;

  const schema: BaseSchema & Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    name: title,
    description,
    url,
    inLanguage: dutchMetadataDefaults.hreflang,
    isPartOf: {
      '@id': `${SITE_URL}#website`,
    },
    about: {
      '@id': `${SITE_URL}#organization`,
    },
    publisher: {
      '@id': `${SITE_URL}#organization`,
    },
    mainContentOfPage: {
      '@type': 'WebPageElement',
      cssSelector: 'main',
    },
  };

  if (breadcrumbs.length > 0) {
    schema.breadcrumb = {
      '@id': `${url}#breadcrumb`,
    };
  }

  return schema;
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): BaseSchema & Record<string, unknown> {
  if (items.length === 0) return {} as BaseSchema & Record<string, unknown>;

  const currentUrl = items[items.length - 1]?.url || SITE_URL;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${currentUrl}#breadcrumb`,
    inLanguage: dutchMetadataDefaults.hreflang,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: {
        '@type': 'WebPage',
        '@id': item.url,
        name: item.name,
        url: item.url,
      },
    })),
  };
}

/**
 * Generate Service schema
 */
export function generateServiceSchema(options: {
  name: string;
  description: string;
  url: string;
  serviceType: string;
  offers?: Array<{
    name: string;
    price?: string;
    priceCurrency?: string;
  }>;
}): BaseSchema & Record<string, unknown> {
  const {
    name,
    description,
    url,
    serviceType,
    offers = [],
  } = options;

  const schema: BaseSchema & Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name,
    description,
    serviceType,
    url,
    inLanguage: dutchMetadataDefaults.hreflang,
    provider: {
      '@id': `${SITE_URL}#organization`,
    },
    areaServed: {
      '@type': 'Place',
      name: dutchMetadataDefaults.region,
      address: {
        '@type': 'PostalAddress',
        addressCountry: dutchMetadataDefaults.country,
      },
    },
    availableLanguage: ['nl', 'en'],
  };

  if (offers.length > 0) {
    schema.offers = offers.map((offer) => ({
      '@type': 'Offer',
      name: offer.name,
      priceCurrency: offer.priceCurrency || 'EUR',
      price: offer.price,
      availability: 'https://schema.org/InStock',
      eligibleRegion: dutchMetadataDefaults.country,
    }));
  }

  return schema;
}

/**
 * Generate FAQPage schema
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): BaseSchema & Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/faq#faqpage`,
    inLanguage: dutchMetadataDefaults.hreflang,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate LocalBusiness schema
 */
export function generateLocalBusinessSchema(): BaseSchema & Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}#localbusiness`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: SITE_URL,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: '$$',
    openingHours: 'Mo-Fr 09:00-18:00',
    areaServed: {
      '@type': 'Place',
      name: dutchMetadataDefaults.region,
      address: {
        '@type': 'PostalAddress',
        addressCountry: dutchMetadataDefaults.country,
      },
    },
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.github,
      siteConfig.social.twitter,
    ].filter(Boolean),
  };
}

/**
 * Generate ItemList schema for services
 */
export function generateServiceListSchema(
  services: Array<{
    name: string;
    description: string;
    url: string;
  }>
): BaseSchema & Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}/diensten#services`,
    inLanguage: dutchMetadataDefaults.hreflang,
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        '@id': `${service.url}#service`,
        name: service.name,
        description: service.description,
        url: service.url,
        provider: {
          '@id': `${SITE_URL}#organization`,
        },
        areaServed: {
          '@type': 'Place',
          name: dutchMetadataDefaults.region,
          address: {
            '@type': 'PostalAddress',
            addressCountry: dutchMetadataDefaults.country,
          },
        },
      },
    })),
  };
}
