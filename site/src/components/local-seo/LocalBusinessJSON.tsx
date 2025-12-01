/**
 * LocalBusinessJSON Component
 * 
 * Provides LocalBusiness JSON-LD structured data with NAP consistency
 * (Name, Address, Phone). This ensures the same data is used across
 * visual components and structured data.
 * 
 * Size: ~1.5 KB gzipped
 * 
 * IMPORTANT:
 * - All data comes from centralized companyInfo config
 * - No hardcoded placeholder addresses or fake data
 * - When address is missing, models business as online-only with serviceArea
 * - Address is only emitted when ALL address env vars are present
 */

import Script from 'next/script';

import { companyInfo } from '@/config/company.config';
import { siteConfig } from '@/config/site.config';

export interface LocalBusinessJSONProps {
  /**
   * Override default address (for location-specific pages)
   * Only used if base address exists in env vars
   */
  address?: {
    streetAddress?: string;
    postalCode?: string;
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
  
  /**
   * Override geo coordinates (for location-specific pages)
   * Only used if base address exists
   */
  geo?: {
    latitude: string;
    longitude: string;
  };
  
  /**
   * Service area/cities served (for online businesses without physical address)
   */
  areaServed?: string[];
  
  /**
   * Additional schema properties
   */
  additionalProperties?: Record<string, unknown>;
  
  /**
   * CSP nonce for inline scripts
   */
  nonce?: string;
}

export default function LocalBusinessJSON({
  address,
  geo,
  areaServed,
  additionalProperties = {},
  nonce,
}: LocalBusinessJSONProps) {
  // Check if we have a base address from env vars
  const hasBaseAddress = !!companyInfo.address;

  // Build the base structured data
  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteConfig.url}#localbusiness`,
    name: companyInfo.name,
    legalName: companyInfo.legalName,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: companyInfo.phone,
    email: companyInfo.email,
    inLanguage: 'nl-NL',
  };

  // Add address and geo if we have complete address data
  if (hasBaseAddress && companyInfo.address) {
    // Use override address if provided, otherwise use company address
    const baseAddr = companyInfo.address;
    
    structuredData.address = {
      '@type': 'PostalAddress',
      streetAddress: address?.streetAddress || baseAddr.street,
      postalCode: address?.postalCode || baseAddr.zip,
      addressLocality: address?.addressLocality || baseAddr.city,
      addressRegion: address?.addressRegion || baseAddr.region,
      addressCountry: address?.addressCountry || 'NL',
    };

    // Only add geo coordinates if we have an address
    // Default to Netherlands center if no specific geo provided
    structuredData.geo = {
      '@type': 'GeoCoordinates',
      latitude: geo?.latitude || '52.1326',
      longitude: geo?.longitude || '5.2913',
    };
  } else {
    // Online-only business: use serviceArea instead of address
    // Model as serving the entire Netherlands
    structuredData.areaServed = areaServed?.map(area => ({
      '@type': 'City',
      name: area,
      containedInPlace: {
        '@type': 'Country',
        name: 'Nederland',
      },
    })) || [
      {
        '@type': 'Country',
        name: 'Nederland',
        sameAs: 'https://en.wikipedia.org/wiki/Netherlands',
      },
    ];

    // Alternative format for broader service area
    structuredData.serviceArea = {
      '@type': 'Country',
      name: 'Nederland',
      sameAs: 'https://en.wikipedia.org/wiki/Netherlands',
    };
  }

  // Add opening hours
  structuredData.openingHoursSpecification = [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
      ],
      opens: '09:00',
      closes: '17:00',
    },
  ];

  // Add business identifiers (only if present)
  if (companyInfo.kvk) {
    structuredData.identifier = {
      '@type': 'PropertyValue',
      propertyID: 'KVK',
      value: companyInfo.kvk,
    };
  }

  if (companyInfo.vat) {
    structuredData.vatID = companyInfo.vat;
  }

  // Currency and payment info
  structuredData.currenciesAccepted = 'EUR';
  structuredData.paymentAccepted = 'Cash, Credit Card, Bank Transfer, iDEAL, Bancontact';
  structuredData.priceRange = '$$';

  // Services offered
  structuredData.hasOfferCatalog = {
    '@type': 'OfferCatalog',
    name: 'Webdevelopment Diensten',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Website laten maken',
          description: 'Professionele website ontwikkeling',
          serviceType: 'Web Development',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Webshop laten maken',
          description: 'E-commerce oplossingen',
          serviceType: 'E-commerce Development',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'SEO Optimalisatie',
          description: 'Zoekmachine optimalisatie',
          serviceType: 'Digital Marketing',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '3D Website Ervaringen',
          description: 'Interactieve 3D web experiences',
          serviceType: 'Web Development',
        },
      },
    ],
  };

  // Social media
  structuredData.sameAs = [
    siteConfig.social.linkedin,
    siteConfig.social.github,
    siteConfig.social.twitter,
  ];

  // Merge any additional properties
  Object.assign(structuredData, additionalProperties);

  return (
    <Script
      id="local-business-json-ld"
      type="application/ld+json"
      strategy="afterInteractive"
      nonce={nonce}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}
