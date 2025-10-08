import type { Metadata } from 'next';
import { siteConfig } from '@/config/site.config';

// Get canonical URL from environment with fallback
const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');

// Location-based metadata templates
export const locationMetadata = {
  amsterdam: {
    city: 'Amsterdam',
    region: 'Noord-Holland',
    coordinates: { lat: '52.3676', lng: '4.9041' },
    description: 'Website laten maken Amsterdam - Professionele webdesign in de hoofdstad',
    cta: 'Ontdek waarom Amsterdamse ondernemers voor ons kiezen. Vraag direct offerte!'
  },
  rotterdam: {
    city: 'Rotterdam',
    region: 'Zuid-Holland', 
    coordinates: { lat: '51.9225', lng: '4.4792' },
    description: 'Website laten maken Rotterdam - Innovatieve weboplossingen in de Maasstad',
    cta: 'Bouw mee aan Rotterdam\'s digitale toekomst. Neem contact op!'
  },
  'den-haag': {
    city: 'Den Haag',
    region: 'Zuid-Holland',
    coordinates: { lat: '52.0705', lng: '4.3007' },
    description: 'Website laten maken Den Haag - Webdesign voor overheid en bedrijfsleven',
    cta: 'Van regeringsstad tot jouw website. Start vandaag nog!'
  },
  utrecht: {
    city: 'Utrecht',
    region: 'Utrecht',
    coordinates: { lat: '52.0907', lng: '5.1214' },
    description: 'Website laten maken Utrecht - Centraal gelegen, breed bereik',
    cta: 'In het hart van Nederland, voor heel Nederland. Vraag offerte aan!'
  },
  eindhoven: {
    city: 'Eindhoven',
    region: 'Noord-Brabant',
    coordinates: { lat: '51.4416', lng: '5.4697' },
    description: 'Website laten maken Eindhoven - Tech-hoofdstad van Nederland',
    cta: 'Innovatie en technologie in één website. Ontdek de mogelijkheden!'
  },
  groningen: {
    city: 'Groningen',
    region: 'Groningen',
    coordinates: { lat: '53.2194', lng: '6.5665' },
    description: 'Website laten maken Groningen - Noordelijke kwaliteit, landelijke service',
    cta: 'Van student tot ondernemer - wij bouwen voor iedereen. Neem contact op!'
  }
} as const;

// Service-based metadata templates
export const serviceMetadata = {
  'website-laten-maken': {
    title: 'Website Laten Maken',
    description: 'Professionele website laten maken door Nederlandse experts',
    keywords: ['website laten maken', 'webdesign', 'responsive website', 'professionele website'],
    cta: 'Klaar voor een website die écht werkt? Vraag direct een offerte aan!'
  },
  'webshop-laten-maken': {
    title: 'Webshop Laten Maken',
    description: 'Complete webshop laten ontwikkelen met iDEAL en verzendintegratie',
    keywords: ['webshop laten maken', 'e-commerce', 'online verkopen', 'webwinkel'],
    cta: 'Start vandaag nog met online verkopen. Vraag webshop offerte aan!'
  },
  'seo-optimalisatie': {
    title: 'SEO Optimalisatie',
    description: 'Hoger scoren in Google met professionele SEO optimalisatie',
    keywords: ['seo optimalisatie', 'hoger in google', 'zoekmachine optimalisatie', 'seo specialist'],
    cta: 'Meer bezoekers via Google? Ontdek onze SEO strategieën!'
  },
  '3d-website-ervaringen': {
    title: '3D Website Ervaringen',
    description: 'Unieke 3D websites die indruk maken en converteren',
    keywords: ['3d website', 'interactieve website', 'webgl', '3d webdesign'],
    cta: 'Maak indruk met 3D. Bekijk onze unieke projecten!'
  },
  'onderhoud-support': {
    title: 'Website Onderhoud & Support',
    description: 'Betrouwbaar onderhoud en support voor jouw website',
    keywords: ['website onderhoud', 'website support', 'website beheer', 'technische support'],
    cta: 'Zorgeloos website beheer. Bekijk onze onderhoudsplannen!'
  }
} as const;

// Page type metadata
export const pageTypeMetadata = {
  homepage: {
    type: 'website',
    structuredDataType: 'Organization'
  },
  service: {
    type: 'website',
    structuredDataType: 'Service'
  },
  location: {
    type: 'website', 
    structuredDataType: 'LocalBusiness'
  },
  portfolio: {
    type: 'website',
    structuredDataType: 'CreativeWork'
  },
  contact: {
    type: 'website',
    structuredDataType: 'ContactPage'
  },
  about: {
    type: 'website',
    structuredDataType: 'AboutPage'
  },
  article: {
    type: 'article',
    structuredDataType: 'Article'
  }
} as const;

export type LocationKey = keyof typeof locationMetadata;
export type ServiceKey = keyof typeof serviceMetadata;
export type PageType = keyof typeof pageTypeMetadata;

// Interface for metadata generation options
export interface MetadataOptions {
  title?: string;
  description?: string;
  canonical?: string;
  location?: LocationKey;
  service?: ServiceKey;
  pageType?: PageType;
  lastModified?: string | Date;
  pagination?: {
    current: number;
    total: number;
    prevUrl?: string;
    nextUrl?: string;
  };
  image?: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  };
  noIndex?: boolean;
  schema?: Record<string, any>;
}

// Generate dynamic title with location and service variables
export function generateTitle(options: MetadataOptions): string {
  const { title, location, service } = options;
  
  if (title) return title;
  
  let generatedTitle = siteConfig.name;
  
  if (service && serviceMetadata[service]) {
    generatedTitle = serviceMetadata[service].title;
  }
  
  if (location && locationMetadata[location]) {
    const locationData = locationMetadata[location];
    generatedTitle += ` ${locationData.city}`;
  }
  
  return `${generatedTitle} | ${siteConfig.name}`;
}

// Generate optimized meta description (150-160 chars with Dutch CTA)
export function generateDescription(options: MetadataOptions): string {
  const { description, location, service } = options;
  
  if (description && description.length >= 150 && description.length <= 160) {
    return description;
  }
  
  let baseDescription = siteConfig.description;
  let cta = 'Neem contact op voor een gratis adviesgesprek!';
  
  if (service && serviceMetadata[service]) {
    baseDescription = serviceMetadata[service].description;
    cta = serviceMetadata[service].cta;
  }
  
  if (location && locationMetadata[location]) {
    const locationData = locationMetadata[location];
    baseDescription = locationData.description;
    cta = locationData.cta;
  }
  
  // Ensure total length is between 150-160 characters
  const targetLength = 155;
  const totalAvailable = targetLength - cta.length - 3; // -3 for " - "
  
  if (baseDescription.length > totalAvailable) {
    baseDescription = baseDescription.substring(0, totalAvailable - 3) + '...';
  }
  
  return `${baseDescription} - ${cta}`;
}

// Generate canonical URL
export function generateCanonical(path: string, options?: MetadataOptions): string {
  if (options?.canonical) return options.canonical;
  
  const cleanPath = path.replace(/\/+$/, '') || '/';
  return `${SITE_URL}${cleanPath}`;
}

// Generate Open Graph metadata for Dutch social media
export function generateOpenGraph(options: MetadataOptions, path: string): Metadata['openGraph'] {
  const title = generateTitle(options);
  const description = generateDescription(options);
  const canonical = generateCanonical(path, options);
  
  const images = options.image ? [
    {
      url: options.image.url,
      width: options.image.width || 1200,
      height: options.image.height || 630,
      alt: options.image.alt,
      type: 'image/png',
    }
  ] : [
    {
      url: `${SITE_URL}/og`,
      width: 1200,
      height: 630,
      alt: `${siteConfig.name} - ${siteConfig.tagline}`,
      type: 'image/png',
    }
  ];

  return {
    title,
    description,
    url: canonical,
    siteName: siteConfig.name,
    images,
    locale: 'nl_NL',
    alternateLocale: ['en_US', 'de_DE', 'fr_FR'],
    type: options.pageType ? pageTypeMetadata[options.pageType].type as any : 'website',
    countryName: 'Netherlands',
    emails: [siteConfig.email],
    phoneNumbers: [siteConfig.phone],
    ...(options.lastModified && {
      modifiedTime: typeof options.lastModified === 'string' 
        ? options.lastModified 
        : options.lastModified.toISOString()
    })
  };
}

// Generate Twitter Card metadata
export function generateTwitterCard(options: MetadataOptions): Metadata['twitter'] {
  const title = generateTitle(options);
  const description = generateDescription(options);
  
  const images = options.image ? [
    {
      url: options.image.url,
      width: options.image.width || 1200,
      height: options.image.height || 630,
      alt: options.image.alt,
    }
  ] : [
    {
      url: `${SITE_URL}/og`,
      width: 1200,
      height: 630,
      alt: `${siteConfig.name} - ${siteConfig.tagline}`,
    }
  ];

  return {
    card: 'summary_large_image',
    site: '@prowebstudio_nl',
    creator: '@prowebstudio_nl',
    title,
    description,
    images,
  };
}

// Generate complete metadata object
export function generateMetadata(path: string, options: MetadataOptions = {}): Metadata {
  const title = generateTitle(options);
  const description = generateDescription(options);
  const canonical = generateCanonical(path, options);
  
  // Keywords generation
  let keywords: string[] = [
    'website laten maken nederland',
    'webdesign nederland',
    'professionele website',
    'responsive webdesign',
    'nederlandse webdesign',
  ];
  
  if (options.service && serviceMetadata[options.service]) {
    keywords = [...keywords, ...serviceMetadata[options.service].keywords];
  }
  
  if (options.location && locationMetadata[options.location]) {
    const locationData = locationMetadata[options.location];
    keywords.push(
      `website laten maken ${locationData.city.toLowerCase()}`,
      `webdesign ${locationData.city.toLowerCase()}`,
      `website ${locationData.city.toLowerCase()}`
    );
  }

  // Generate other metadata
  const otherMeta: Record<string, string> = {
    'revisit-after': '7 days',
    'distribution': 'web',
    'rating': 'general',
    'language': 'Dutch',
    'geo.region': 'NL',
    'geo.placename': 'Netherlands',
    ...(options.location && locationMetadata[options.location] && {
      'geo.position': `${locationMetadata[options.location].coordinates.lat};${locationMetadata[options.location].coordinates.lng}`,
      'ICBM': `${locationMetadata[options.location].coordinates.lat}, ${locationMetadata[options.location].coordinates.lng}`,
    })
  };

  // Add pagination meta tags if applicable
  if (options.pagination) {
    if (options.pagination.prevUrl) {
      otherMeta.prev = options.pagination.prevUrl;
    }
    if (options.pagination.nextUrl) {
      otherMeta.next = options.pagination.nextUrl;
    }
  }

  // Add article:modified_time for content freshness
  if (options.lastModified) {
    const modifiedTime = typeof options.lastModified === 'string' 
      ? options.lastModified 
      : options.lastModified.toISOString();
    
    otherMeta['article:modified_time'] = modifiedTime;
    otherMeta['article:published_time'] = modifiedTime;
  }

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords,
    alternates: {
      canonical
    },
    openGraph: generateOpenGraph(options, path),
    twitter: generateTwitterCard(options),
    robots: options.noIndex ? 'noindex,nofollow' : 'index,follow',
    other: {
      ...otherMeta,
      // Add robots directives to other meta for more control
      'robots': options.noIndex 
        ? 'noindex,nofollow,nocache,noimageindex,max-video-preview:0,max-image-preview:none,max-snippet:0'
        : 'index,follow,max-video-preview:-1,max-image-preview:large,max-snippet:-1',
      'googlebot': options.noIndex
        ? 'noindex,nofollow,nocache,noimageindex,max-video-preview:0,max-image-preview:none,max-snippet:0'
        : 'index,follow,max-video-preview:-1,max-image-preview:large,max-snippet:-1',
    },
  };
}