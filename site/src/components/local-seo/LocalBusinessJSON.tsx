/**
 * LocalBusinessJSON Component
 * 
 * Provides LocalBusiness JSON-LD structured data with NAP consistency
 * (Name, Address, Phone). This ensures the same data is used across
 * visual components and structured data.
 * 
 * Size: ~1.5 KB gzipped
 */

import Script from 'next/script';
import { siteConfig } from '@/config/site.config';

/**
 * Centralized NAP data - MUST match DutchBusinessInfo component
 * This ensures consistency between visual display and structured data
 */
export const NAP_DATA = {
  name: 'ProWeb Studio',
  legalName: 'ProWeb Studio',
  // Placeholders - replace with actual registered values
  kvk: process.env.NEXT_PUBLIC_KVK || undefined,
  vat: process.env.NEXT_PUBLIC_BTW || undefined,
  address: {
    streetAddress: 'Voorbeeldstraat 123',
    postalCode: '1234 AB',
    addressLocality: 'Amsterdam',
    addressRegion: 'Noord-Holland',
    addressCountry: 'NL',
  },
  phone: siteConfig.phone,
  email: siteConfig.email,
  // Coordinates for Amsterdam (placeholder - update with actual location)
  geo: {
    latitude: '52.3676',
    longitude: '4.9041',
  },
  openingHours: ['Mo-Fr 09:00-17:00'],
} as const;

export interface LocalBusinessJSONProps {
  /**
   * Override default address (for location-specific pages)
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
   */
  geo?: {
    latitude: string;
    longitude: string;
  };
  
  /**
   * Service area/cities served
   */
  areaServed?: string[];
  
  /**
   * Additional schema properties
   */
  additionalProperties?: Record<string, unknown>;
}

export default function LocalBusinessJSON({
  address,
  geo,
  areaServed,
  additionalProperties = {},
}: LocalBusinessJSONProps) {
  // Merge address data
  const finalAddress = address 
    ? { ...NAP_DATA.address, ...address }
    : NAP_DATA.address;

  // Build structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteConfig.url}#localbusiness`,
    name: NAP_DATA.name,
    legalName: NAP_DATA.legalName,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: NAP_DATA.phone,
    email: NAP_DATA.email,
    
    // Address
    address: {
      '@type': 'PostalAddress',
      streetAddress: finalAddress.streetAddress,
      postalCode: finalAddress.postalCode,
      addressLocality: finalAddress.addressLocality,
      addressRegion: finalAddress.addressRegion,
      addressCountry: finalAddress.addressCountry,
    },
    
    // Geo coordinates
    geo: {
      '@type': 'GeoCoordinates',
      latitude: geo?.latitude || NAP_DATA.geo.latitude,
      longitude: geo?.longitude || NAP_DATA.geo.longitude,
    },
    
    // Opening hours
    openingHoursSpecification: [
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
    ],
    
    // Service area
    ...(areaServed && {
      areaServed: areaServed.map(area => ({
        '@type': 'City',
        name: area,
        containedInPlace: {
          '@type': 'Country',
          name: 'Nederland',
        },
      })),
    }),
    
    // Business identifiers
    ...(NAP_DATA.kvk && {
      identifier: {
        '@type': 'PropertyValue',
        propertyID: 'KVK',
        value: NAP_DATA.kvk,
      },
    }),
    ...(NAP_DATA.vat && {
      vatID: NAP_DATA.vat,
    }),
    
    // Language
    inLanguage: 'nl-NL',
    
    // Currency
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer, iDEAL, Bancontact',
    
    // Price range
    priceRange: '$$',
    
    // Services offered
    hasOfferCatalog: {
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
    },
    
    // Social media
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.github,
      siteConfig.social.twitter,
    ],
    
    // Additional properties
    ...additionalProperties,
  };

  return (
    <Script
      id="local-business-json-ld"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}
