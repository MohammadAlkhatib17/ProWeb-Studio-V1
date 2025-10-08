/**
 * ISR (Incremental Static Regeneration) configuration for optimal Core Web Vitals
 * Balances performance with content freshness
 */

/**
 * ISR revalidation times based on content type and update frequency
 */
export const ISR_CONFIG = {
  // Static content that rarely changes (high performance)
  STATIC: {
    revalidate: 86400, // 24 hours
    description: 'Static pages like About, Privacy, Terms'
  },
  
  // Marketing content that changes occasionally (balanced)
  MARKETING: {
    revalidate: 3600, // 1 hour
    description: 'Services, Portfolio, Landing pages'
  },
  
  // Dynamic content that changes frequently (fresh content)
  DYNAMIC: {
    revalidate: 900, // 15 minutes
    description: 'Blog posts, News, Testimonials'
  },
  
  // Location-based content (moderate freshness)
  LOCATION: {
    revalidate: 1800, // 30 minutes
    description: 'Location-specific pages'
  },
  
  // Contact and form pages (moderate freshness)
  CONTACT: {
    revalidate: 1800, // 30 minutes
    description: 'Contact forms, business info'
  }
} as const;

/**
 * Generate metadata for ISR pages with optimal SEO
 */
export function generateISRMetadata(
  title: string,
  description: string,
  route: string,
  revalidateTime?: number
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prowebstudio.nl';
  
  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}${route}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${route}`,
      siteName: 'ProWeb Studio',
      type: 'website',
      locale: 'nl_NL',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'cache-control': revalidateTime 
        ? `s-maxage=${revalidateTime}, stale-while-revalidate=${revalidateTime * 2}`
        : undefined,
    },
  };
}

/**
 * Page configuration for different route types
 */
export const PAGE_CONFIGS = {
  // Homepage - high traffic, moderate updates
  '/': {
    revalidate: ISR_CONFIG.MARKETING.revalidate,
    metadata: generateISRMetadata(
      'ProWeb Studio - Professionele Websites & 3D Web Ervaringen',
      'Ontdek innovatieve webdesign en 3D web ervaringen bij ProWeb Studio. Wij maken professionele websites die opvallen en converteren.',
      '/',
      ISR_CONFIG.MARKETING.revalidate
    ),
  },
  
  // Services pages - marketing content
  '/diensten': {
    revalidate: ISR_CONFIG.MARKETING.revalidate,
    metadata: generateISRMetadata(
      'Onze Diensten - Webdesign & Ontwikkeling | ProWeb Studio',
      'Professionele webdesign, 3D web ervaringen, SEO optimalisatie en meer. Ontdek onze volledige dienstverlening.',
      '/diensten',
      ISR_CONFIG.MARKETING.revalidate
    ),
  },
  
  // Process page - static content
  '/werkwijze': {
    revalidate: ISR_CONFIG.STATIC.revalidate,
    metadata: generateISRMetadata(
      'Onze Werkwijze - Transparant Proces | ProWeb Studio',
      'Ontdek onze stap-voor-stap werkwijze voor het ontwikkelen van jouw perfecte website. Transparant, efficiënt en resultaatgericht.',
      '/werkwijze',
      ISR_CONFIG.STATIC.revalidate
    ),
  },
  
  // Contact page - moderate updates
  '/contact': {
    revalidate: ISR_CONFIG.CONTACT.revalidate,
    metadata: generateISRMetadata(
      'Contact - Neem Contact Op | ProWeb Studio',
      'Neem contact op met ProWeb Studio voor een vrijblijvend gesprek over jouw website project. Bel, mail of plan een afspraak.',
      '/contact',
      ISR_CONFIG.CONTACT.revalidate
    ),
  },
  
  // Portfolio - marketing content
  '/portfolio': {
    revalidate: ISR_CONFIG.MARKETING.revalidate,
    metadata: generateISRMetadata(
      'Portfolio - Onze Mooiste Projecten | ProWeb Studio',
      'Bekijk onze portfolio met professionele websites en 3D web ervaringen. Laat je inspireren door onze gerealiseerde projecten.',
      '/portfolio',
      ISR_CONFIG.MARKETING.revalidate
    ),
  },
  
  // Static pages
  '/privacy': {
    revalidate: ISR_CONFIG.STATIC.revalidate,
    metadata: generateISRMetadata(
      'Privacybeleid | ProWeb Studio',
      'Lees ons privacybeleid en ontdek hoe wij omgaan met jouw persoonlijke gegevens.',
      '/privacy',
      ISR_CONFIG.STATIC.revalidate
    ),
  },
  
  '/voorwaarden': {
    revalidate: ISR_CONFIG.STATIC.revalidate,
    metadata: generateISRMetadata(
      'Algemene Voorwaarden | ProWeb Studio',
      'Lees onze algemene voorwaarden voor het gebruik van onze diensten.',
      '/voorwaarden',
      ISR_CONFIG.STATIC.revalidate
    ),
  },
} as const;

/**
 * Get ISR config for a specific route
 */
export function getISRConfig(route: string) {
  return PAGE_CONFIGS[route as keyof typeof PAGE_CONFIGS] || {
    revalidate: ISR_CONFIG.MARKETING.revalidate,
    metadata: generateISRMetadata(
      'ProWeb Studio',
      'Professionele websites en 3D web ervaringen',
      route,
      ISR_CONFIG.MARKETING.revalidate
    ),
  };
}

/**
 * Generate static params for dynamic routes with ISR
 */
export async function generateStaticParams() {
  // This would be used for dynamic routes like [slug] pages
  // For now, returning empty array as we'll implement per page
  return [];
}

export default ISR_CONFIG;