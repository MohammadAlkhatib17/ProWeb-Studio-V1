export interface OpeningHours {
  dayOfWeek: string[];
  opens: string;
  closes: string;
}

export interface ServiceArea {
  name: string;
  postalCode?: string;
  addressRegion?: string;
}

// Major Dutch cities for service areas
export const dutchServiceAreas: ServiceArea[] = [
  { name: 'Amsterdam', postalCode: '1000-1109', addressRegion: 'Noord-Holland' },
  { name: 'Rotterdam', postalCode: '3000-3099', addressRegion: 'Zuid-Holland' },
  { name: 'Den Haag', postalCode: '2500-2599', addressRegion: 'Zuid-Holland' },
  { name: 'Utrecht', postalCode: '3500-3599', addressRegion: 'Utrecht' },
  { name: 'Eindhoven', postalCode: '5600-5699', addressRegion: 'Noord-Brabant' },
  { name: 'Groningen', postalCode: '9700-9799', addressRegion: 'Groningen' },
  { name: 'Tilburg', postalCode: '5000-5099', addressRegion: 'Noord-Brabant' },
  { name: 'Almere', postalCode: '1300-1399', addressRegion: 'Flevoland' },
  { name: 'Breda', postalCode: '4800-4899', addressRegion: 'Noord-Brabant' },
  { name: 'Nijmegen', postalCode: '6500-6599', addressRegion: 'Gelderland' },
];

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://prowebstudio.nl/#organization',
    name: 'ProWeb Studio',
    alternateName: 'ProWeb Digital Agency',
    description: 'Professional web development and digital solutions agency specializing in custom websites, web applications, and digital marketing in the Netherlands.',
    url: 'https://prowebstudio.nl',
    telephone: '+31-20-123-4567',
    email: 'info@prowebstudio.nl',
    priceRange: '€€-€€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer, PayPal',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Keizersgracht 123',
      addressLocality: 'Amsterdam',
      addressRegion: 'Noord-Holland',
      postalCode: '1015 CJ',
      addressCountry: 'NL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 52.3702,
      longitude: 4.8952,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
    areaServed: dutchServiceAreas.map(area => ({
      '@type': 'City',
      name: area.name,
      addressRegion: area.addressRegion,
      addressCountry: 'NL',
    })),
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 52.3702,
        longitude: 4.8952,
      },
      geoRadius: '200km',
    },
    image: [
      'https://prowebstudio.nl/images/office-1x1.jpg',
      'https://prowebstudio.nl/images/office-4x3.jpg',
      'https://prowebstudio.nl/images/office-16x9.jpg',
    ],
    logo: {
      '@type': 'ImageObject',
      url: 'https://prowebstudio.nl/logo.png',
      width: '600',
      height: '60',
    },
    sameAs: [
      'https://www.linkedin.com/company/prowebstudio',
      'https://twitter.com/prowebstudio',
      'https://github.com/prowebstudio',
      'https://www.facebook.com/prowebstudio',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Web Development Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Custom Website Development',
            description: 'Professional custom website development with modern technologies',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'E-commerce Solutions',
            description: 'Complete e-commerce platform development and integration',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Web Application Development',
            description: 'Scalable web applications with React and Next.js',
          },
        },
      ],
    },
  };
}

export function generateAggregateRating(rating: number, reviewCount: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue: rating.toFixed(1),
    bestRating: '5',
    worstRating: '1',
    reviewCount: reviewCount,
    itemReviewed: {
      '@type': 'LocalBusiness',
      name: 'ProWeb Studio',
      '@id': 'https://prowebstudio.nl/#organization',
    },
  };
}

export function generateBreadcrumbList(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateSpeakableSchema(selector: string[] = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: selector.length > 0 ? selector : [
        '.hero-headline',
        '.service-description',
        '.company-summary',
        '[data-speakable]',
        'h1',
        'h2',
        '.lead-text',
      ],
      xpath: [
        '/html/head/title',
        '/html/head/meta[@name="description"]/@content',
      ],
    },
  };
}

export function generateReviewSchema(review: {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'LocalBusiness',
      name: 'ProWeb Studio',
      '@id': 'https://prowebstudio.nl/#organization',
    },
    author: {
      '@type': 'Person',
      name: review.author,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: '5',
      worstRating: '1',
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished,
  };
}

export function generateServiceSchema(service: {
  name: string;
  description: string;
  provider?: string;
  serviceType?: string;
  areaServed?: string[];
  hasOfferCatalog?: boolean;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'LocalBusiness',
      name: service.provider || 'ProWeb Studio',
      '@id': 'https://prowebstudio.nl/#organization',
    },
    serviceType: service.serviceType,
    areaServed: service.areaServed?.map(area => ({
      '@type': 'City',
      name: area,
    })),
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceLocation: {
        '@type': 'Place',
        name: 'ProWeb Studio Office',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Amsterdam',
          addressCountry: 'NL',
        },
      },
      servicePhone: '+31-20-123-4567',
      serviceUrl: 'https://prowebstudio.nl/contact',
    },
  };
}
