import Script from 'next/script';
import { 
  generateFAQStructuredData,
  generateHowToStructuredData,
  generateProductStructuredData,
  generateLocalBusinessStructuredData,
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
  generateServiceStructuredData,
  generateOrganizationStructuredData,
  generateJsonLd
} from '@/lib/metadata/structured-data';
import { siteConfig } from '@/config/site.config';

interface StructuredDataProps {
  type: 'FAQ' | 'HowTo' | 'Product' | 'Service' | 'Organization' | 'LocalBusiness' | 'Article' | 'BreadcrumbList';
  data: any;
  nonce?: string;
}

export default function StructuredData({ type, data, nonce }: StructuredDataProps) {
  let structuredData;

  switch (type) {
    case 'FAQ':
      structuredData = generateFAQStructuredData(data);
      break;
    case 'HowTo':
      structuredData = generateHowToStructuredData(data);
      break;
    case 'Product':
      structuredData = generateProductStructuredData(data);
      break;
    case 'Service':
      structuredData = generateServiceStructuredData(data);
      break;
    case 'Organization':
      structuredData = generateOrganizationStructuredData(data);
      break;
    case 'LocalBusiness':
      structuredData = generateLocalBusinessStructuredData(data);
      break;
    case 'Article':
      structuredData = generateArticleStructuredData(data);
      break;
    case 'BreadcrumbList':
      structuredData = generateBreadcrumbStructuredData(data);
      break;
    default:
      structuredData = data;
  }

  return (
    <Script
      id={`structured-data-${type.toLowerCase()}`}
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{
        __html: generateJsonLd(structuredData),
      }}
    />
  );
}

// Common organization structured data for ProWeb Studio
export function ProWebStudioOrganization({ nonce }: { nonce?: string }) {
  const organizationData = {
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icons/icon-512.png`,
    description: siteConfig.description,
    address: {
      streetAddress: 'Fictiestraat 123',
      addressLocality: 'Amsterdam',
      addressRegion: 'Noord-Holland',
      postalCode: '1000 AB',
      addressCountry: 'NL'
    },
    contactPoint: {
      telephone: siteConfig.phone,
      email: siteConfig.email
    },
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.twitter,
      siteConfig.social.github
    ]
  };

  return <StructuredData type="Organization" data={organizationData} nonce={nonce} />;
}

// Website service structured data
export function WebsiteServiceStructuredData({ nonce }: { nonce?: string }) {
  const serviceData = {
    name: 'Website Laten Maken',
    description: 'Professionele website ontwikkeling en webdesign diensten',
    provider: siteConfig.name,
    areaServed: [
      'Amsterdam', 'Rotterdam', 'Den Haag', 'Utrecht', 'Eindhoven', 
      'Groningen', 'Tilburg', 'Almere', 'Breda', 'Nijmegen', 'Nederland'
    ],
    serviceType: 'Website Development',
    offers: {
      price: '2500',
      priceCurrency: 'EUR',
      description: 'Complete website ontwikkeling vanaf €2500'
    }
  };

  return <StructuredData type="Service" data={serviceData} nonce={nonce} />;
}

// Local business structured data for location pages
export function LocationBusinessStructuredData({ 
  location, 
  nonce 
}: { 
  location: {
    name: string;
    coordinates: { lat: string; lng: string };
    address: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
    };
  };
  nonce?: string;
}) {
  const businessData = {
    name: `${siteConfig.name} - ${location.name}`,
    description: `Professionele website laten maken in ${location.name}`,
    address: {
      ...location.address,
      addressCountry: 'NL'
    },
    geo: {
      latitude: location.coordinates.lat,
      longitude: location.coordinates.lng
    },
    contactPoint: {
      telephone: siteConfig.phone,
      email: siteConfig.email
    },
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.twitter
    ],
    openingHours: [
      'Mo-Fr 09:00-17:00'
    ]
  };

  return <StructuredData type="LocalBusiness" data={businessData} nonce={nonce} />;
}

// FAQ structured data component
export function FAQStructuredData({ 
  faqs, 
  nonce 
}: { 
  faqs: Array<{ question: string; answer: string }>;
  nonce?: string;
}) {
  return <StructuredData type="FAQ" data={faqs} nonce={nonce} />;
}

// Breadcrumb structured data component
export function BreadcrumbStructuredData({ 
  breadcrumbs, 
  nonce 
}: { 
  breadcrumbs: Array<{ name: string; url: string }>;
  nonce?: string;
}) {
  return <StructuredData type="BreadcrumbList" data={breadcrumbs} nonce={nonce} />;
}

// How-to structured data component
export function HowToStructuredData({ 
  steps, 
  nonce 
}: { 
  steps: Array<{ name: string; text: string; image?: string }>;
  nonce?: string;
}) {
  return <StructuredData type="HowTo" data={steps} nonce={nonce} />;
}

// Article structured data component
export function ArticleStructuredData({ 
  article, 
  nonce 
}: { 
  article: {
    headline: string;
    description: string;
    author: string;
    publisher: string;
    datePublished: string;
    dateModified: string;
    image: string;
    mainEntityOfPage: string;
  };
  nonce?: string;
}) {
  return <StructuredData type="Article" data={article} nonce={nonce} />;
}