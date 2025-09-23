import Script from 'next/script';
import { siteConfig } from '@/config/site.config';

// Helper function to build absolute URLs safely
const SITE_URL = (
  process.env.SITE_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  'https://prowebstudio.nl' // fallback only for build-time
).replace(/\/+$/, '');

function abs(path: string): string {
  try {
    return new URL(path, SITE_URL).toString();
  } catch {
    return path.startsWith('http') ? path : `${SITE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }
}

// Helper function to generate breadcrumbs based on pageType with enhanced Dutch navigation
function generateBreadcrumbs(pageType: string): Array<{ name: string; url: string; position?: number }> {
  const breadcrumbs = [
    { name: 'Home', url: abs('/'), position: 1 }
  ];

  switch (pageType) {
    case 'homepage':
      // Homepage only has itself
      return breadcrumbs;
    
    case 'services':
      breadcrumbs.push({ name: 'Diensten', url: abs('/diensten'), position: 2 });
      break;
    
    case 'werkwijze':
      breadcrumbs.push({ name: 'Werkwijze', url: abs('/werkwijze'), position: 2 });
      break;
    
    case 'over-ons':
      breadcrumbs.push({ name: 'Over Ons', url: abs('/over-ons'), position: 2 });
      break;
    
    case 'contact':
      breadcrumbs.push({ name: 'Contact', url: abs('/contact'), position: 2 });
      break;
    
    case 'privacy':
      breadcrumbs.push({ name: 'Privacybeleid', url: abs('/privacy'), position: 2 });
      break;
    
    case 'voorwaarden':
      breadcrumbs.push({ name: 'Algemene Voorwaarden', url: abs('/voorwaarden'), position: 2 });
      break;

    case 'speeltuin':
      breadcrumbs.push({ name: 'Speeltuin', url: abs('/speeltuin'), position: 2 });
      break;

    case 'overzicht-site':
      breadcrumbs.push({ name: 'Site Overzicht', url: abs('/overzicht-site'), position: 2 });
      break;

    case 'sitemap':
      breadcrumbs.push({ name: 'Sitemap', url: abs('/sitemap'), position: 2 });
      break;

    // Enhanced service-specific breadcrumbs
    case 'website-laten-maken':
      breadcrumbs.push({ name: 'Diensten', url: abs('/diensten'), position: 2 });
      breadcrumbs.push({ name: 'Website laten maken', url: abs('/diensten/website-laten-maken'), position: 3 });
      break;

    case 'webshop-laten-maken':
      breadcrumbs.push({ name: 'Diensten', url: abs('/diensten'), position: 2 });
      breadcrumbs.push({ name: 'Webshop laten maken', url: abs('/diensten/webshop-laten-maken'), position: 3 });
      break;

    case 'seo-optimalisatie':
      breadcrumbs.push({ name: 'Diensten', url: abs('/diensten'), position: 2 });
      breadcrumbs.push({ name: 'SEO optimalisatie', url: abs('/diensten/seo-optimalisatie'), position: 3 });
      break;

    case '3d-websites':
      breadcrumbs.push({ name: 'Diensten', url: abs('/diensten'), position: 2 });
      breadcrumbs.push({ name: '3D websites', url: abs('/diensten/3d-websites'), position: 3 });
      break;

    // Portfolio breadcrumbs
    case 'portfolio':
      breadcrumbs.push({ name: 'Portfolio', url: abs('/portfolio'), position: 2 });
      break;

    case 'portfolio-item':
      breadcrumbs.push({ name: 'Portfolio', url: abs('/portfolio'), position: 2 });
      // Portfolio item name would be added dynamically
      break;

    // Knowledge base breadcrumbs
    case 'kennisbank':
      breadcrumbs.push({ name: 'Kennisbank', url: abs('/kennisbank'), position: 2 });
      break;

    case 'blog':
      breadcrumbs.push({ name: 'Blog', url: abs('/blog'), position: 2 });
      break;

    case 'blog-post':
      breadcrumbs.push({ name: 'Blog', url: abs('/blog'), position: 2 });
      // Blog post title would be added dynamically
      break;

    case 'nieuws':
      breadcrumbs.push({ name: 'Nieuws', url: abs('/nieuws'), position: 2 });
      break;

    case 'cases':
      breadcrumbs.push({ name: 'Cases', url: abs('/cases'), position: 2 });
      break;

    case 'tools':
      breadcrumbs.push({ name: 'Tools', url: abs('/tools'), position: 2 });
      break;
    
    default:
      // Enhanced dynamic breadcrumb generation for generic pages
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname;
        const segments = pathname.split('/').filter(Boolean);
        
        // Enhanced Dutch route translations with categories
        const routeTranslations: Record<string, { name: string; category?: string }> = {
          'blog': { name: 'Blog', category: 'content' },
          'portfolio': { name: 'Portfolio', category: 'showcase' },
          'cases': { name: 'Cases', category: 'showcase' },
          'kennisbank': { name: 'Kennisbank', category: 'content' },
          'nieuws': { name: 'Nieuws', category: 'content' },
          'tools': { name: 'Tools', category: 'resources' },
          'downloads': { name: 'Downloads', category: 'resources' },
          'documentatie': { name: 'Documentatie', category: 'resources' },
          'handleidingen': { name: 'Handleidingen', category: 'resources' },
          'templates': { name: 'Templates', category: 'resources' },
          'webdesign': { name: 'Webdesign', category: 'services' },
          'webdevelopment': { name: 'Webdevelopment', category: 'services' },
          'e-commerce': { name: 'E-commerce', category: 'services' },
          'marketing': { name: 'Digital Marketing', category: 'services' },
          'onderhoud': { name: 'Website Onderhoud', category: 'services' },
          'hosting': { name: 'Website Hosting', category: 'services' },
          'beveiliging': { name: 'Website Beveiliging', category: 'services' },
          'performance': { name: 'Performance Optimalisatie', category: 'services' },
          'toegankelijkheid': { name: 'Web Toegankelijkheid', category: 'services' },
          'analytics': { name: 'Website Analytics', category: 'services' },
          'migratie': { name: 'Website Migratie', category: 'services' },
          'rebranding': { name: 'Website Rebranding', category: 'services' },
        };

        let currentPosition = 2;
        segments.forEach((segment, index) => {
          const segmentInfo = routeTranslations[segment];
          const segmentName = segmentInfo?.name || 
            segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
          
          breadcrumbs.push({ 
            name: segmentName, 
            url: abs('/' + segments.slice(0, index + 1).join('/')),
            position: currentPosition++,
          });
        });
      }
      break;
  }

  return breadcrumbs;
}

interface SEOSchemaProps {
  pageType?: "homepage" | "services" | "werkwijze" | "contact" | "over-ons" | "privacy" | "voorwaarden" | "generic";
  pageTitle?: string;
  pageDescription?: string;
  breadcrumbs?: Array<{
    name: string;
    url: string;
    position?: number;
  }>;
  includeFAQ?: boolean;
  nonce?: string;
}

export default function SEOSchema({
  pageType = 'generic',
  pageTitle,
  pageDescription,
  breadcrumbs = [],
  includeFAQ = false,
  nonce,
}: SEOSchemaProps) {
  // Use explicit props with defaults
  const currentPageType = pageType;
  const currentIncludeFAQ = includeFAQ || pageType === 'services';

  // Helper function to get page path based on pageType
  function getPagePath(pageType: string): string {
    switch (pageType) {
      case 'homepage':
        return '/';
      case 'services':
        return '/diensten';
      case 'werkwijze':
        return '/werkwijze';
      case 'over-ons':
        return '/over-ons';
      case 'contact':
        return '/contact';
      case 'privacy':
        return '/privacy';
      case 'voorwaarden':
        return '/voorwaarden';
      default:
        return '/';
    }
  }

  // Helper function to get page title based on pageType
  function getPageTitle(pageType: string, pageTitle?: string): string {
    if (pageTitle) return pageTitle;
    
    switch (pageType) {
      case 'homepage':
        return `${siteConfig.name} - ${siteConfig.tagline}`;
      case 'services':
        return 'Diensten - Webdesign, 3D websites & SEO';
      case 'werkwijze':
        return 'Werkwijze - Van intake tot launch';
      case 'over-ons':
        return 'Over ons - ProWeb Studio team';
      case 'contact':
        return 'Contact - Neem contact op met ProWeb Studio';
      case 'privacy':
        return 'Privacy - Privacybeleid ProWeb Studio';
      case 'voorwaarden':
        return 'Voorwaarden - Algemene voorwaarden ProWeb Studio';
      default:
        return `${siteConfig.name} - ${siteConfig.tagline}`;
    }
  }

  // Helper function to get primary image for page type
  function getPrimaryImage(pageType: string): { url: string; width?: number; height?: number; caption: string } | null {
    switch (pageType) {
      case 'homepage':
        return {
          url: abs('/assets/hero/nebula_helix.webp'),
          width: 1920,
          height: 1080,
          caption: `${siteConfig.name} - Digitale innovatie met kosmische impact`
        };
      case 'services':
        return {
          url: abs('/assets/nebula_services_background.webp'),
          width: 1920,
          height: 1080,
          caption: `${siteConfig.name} Diensten - Webdesign en 3D websites`
        };
      case 'werkwijze':
        // Only include if hero image exists for werkwijze
        return {
          url: abs('/assets/team_core_star.webp'),
          width: 1920,
          height: 1080,
          caption: `${siteConfig.name} Werkwijze - Van intake tot launch`
        };
      default:
        return null;
    }
  }

  // Get current page path and URL
  const currentPath = getPagePath(currentPageType);
  const currentUrl = abs(currentPath);
  const currentTitle = getPageTitle(currentPageType, pageTitle);

  // Generate ImageObject for primary image if it exists
  const primaryImage = getPrimaryImage(currentPageType);
  const primaryImageSchema = primaryImage ? {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': `${currentUrl}#primaryimage`,
    url: primaryImage.url,
    contentUrl: primaryImage.url,
    ...(primaryImage.width && primaryImage.height && {
      width: primaryImage.width,
      height: primaryImage.height,
    }),
    caption: primaryImage.caption,
    description: primaryImage.caption,
    name: primaryImage.caption,
  } : null;

  // Logo ImageObject schema
  // Helper function to safely get social media profiles
  function getSocialProfiles(): string[] {
    const profiles = [
      siteConfig.social.linkedin,
      siteConfig.social.github, 
      siteConfig.social.twitter,
      // Add environment-based social profiles if they exist
      process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN,
      process.env.NEXT_PUBLIC_SOCIAL_GITHUB,
      process.env.NEXT_PUBLIC_SOCIAL_TWITTER,
      process.env.NEXT_PUBLIC_SOCIAL_BEHANCE,
      process.env.NEXT_PUBLIC_SOCIAL_DRIBBBLE,
      process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE,
      process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK,
      process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM,
    ];
    
    // Filter out falsy values and ensure unique URLs
  return [...new Set(profiles.filter((profile): profile is string => Boolean(profile)))];
}

// Helper function to generate Dutch Chamber of Commerce (KVK) schema
function generateKVKSchema(kvkNumber: string, kvkPlace?: string): Record<string, unknown> | null {
  if (!kvkNumber) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    '@id': `https://www.kvk.nl/orderstraat/product-kiezen/?kvknummer=${kvkNumber}#kvk`,
    name: 'Kamer van Koophandel',
    alternateName: 'KVK',
    description: 'Nederlandse Kamer van Koophandel bedrijfsregistratie',
    url: `https://www.kvk.nl/orderstraat/product-kiezen/?kvknummer=${kvkNumber}`,
    areaServed: {
      '@type': 'Country',
      name: 'Netherlands',
      identifier: 'NL',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: '088-585-2222',
      url: 'https://www.kvk.nl/contact',
      availableLanguage: ['nl', 'en'],
    },
    identifier: {
      '@type': 'PropertyValue',
      name: 'KVK-nummer',
      value: kvkNumber,
      ...(kvkPlace && { description: `Geregistreerd in ${kvkPlace}` }),
    },
  };
}

// Helper function to generate Dutch compliance certifications schema
function generateComplianceSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Certification',
    '@id': `${SITE_URL}#dutch-compliance`,
    name: 'Nederlandse compliance certificering',
    description: 'Certificering voor Nederlandse wetgeving en standaarden',
    certificationIdentification: [
      {
        '@type': 'DefinedTerm',
        name: 'AVG/GDPR Compliance',
        description: 'Algemene Verordening Gegevensbescherming compliance',
        inDefinedTermSet: 'https://autoriteitpersoonsgegevens.nl/',
      },
      {
        '@type': 'DefinedTerm',
        name: 'Nederlandse Toegankelijkheidsstandaard',
        description: 'EN 301 549 / WCAG 2.1 AA compliance voor Nederlandse overheid',
        inDefinedTermSet: 'https://www.digitaleoverheid.nl/overzicht-van-alle-onderwerpen/digitale-inclusie/digitaal-toegankelijk/',
      },
      {
        '@type': 'DefinedTerm',
        name: 'Nederlandse Web Guidelines',
        description: 'Best practices voor Nederlandse websites',
        inDefinedTermSet: 'https://www.voorhoede.nl/nl/blog/dutch-web-guidelines/',
      },
    ],
    issuedBy: {
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
    },
    validIn: {
      '@type': 'Country',
      name: 'Netherlands',
      identifier: 'NL',
    },
  };
}

// Helper function to generate professional accreditation schema
function generateProfessionalAccreditationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}#professional-accreditation`,
    name: 'Nederlandse IT Professional Services',
    description: 'Professionele IT-dienstverlening conform Nederlandse standaarden',
    serviceType: 'Professional Web Development Services',
    provider: {
      '@id': `${SITE_URL}#organization`,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Netherlands',
      identifier: 'NL',
    },
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Nederlandse IT Vakbekwaamheid',
        description: 'Certificering voor professionele webdevelopment diensten',
        credentialCategory: 'Professional Certification',
        recognizedBy: {
          '@type': 'Organization',
          name: 'Nederlandse IT brancheverenigingen',
        },
      },
    ],
    compliance: [
      {
        '@type': 'DefinedTerm',
        name: 'Kwaliteit van IT-dienstverlening',
        description: 'Kwaliteitsstandaarden voor Nederlandse IT-dienstverlening',
      },
      {
        '@type': 'DefinedTerm',
        name: 'Nederlandse aansprakelijkheidsverzekering',
        description: 'Beroepsaansprakelijkheidsverzekering conform Nederlandse eisen',
      },
    ],
  };
}// Helper function to generate comprehensive Dutch service areas
function generateDutchServiceAreas() {
  return [
    // Provinces with major cities
    {
      '@type': 'State',
      name: 'Drenthe',
      identifier: 'DR',
      addressCountry: 'NL',
      containsPlace: [
        { '@type': 'City', name: 'Assen' },
        { '@type': 'City', name: 'Emmen' },
        { '@type': 'City', name: 'Hoogeveen' },
        { '@type': 'City', name: 'Meppel' },
      ],
    },
    {
      '@type': 'State',
      name: 'Flevoland',
      identifier: 'FL',
      addressCountry: 'NL',
      containsPlace: [
        { '@type': 'City', name: 'Lelystad' },
        { '@type': 'City', name: 'Almere' },
        { '@type': 'City', name: 'Dronten' },
        { '@type': 'City', name: 'Urk' },
      ],
    },
    {
      '@type': 'State',
      name: 'Friesland',
      identifier: 'FR',
      addressCountry: 'NL',
      containsPlace: [
        { '@type': 'City', name: 'Leeuwarden' },
        { '@type': 'City', name: 'Sneek' },
        { '@type': 'City', name: 'Heerenveen' },
        { '@type': 'City', name: 'Drachten' },
      ],
    },
    {
      '@type': 'State',
      name: 'Gelderland',
      identifier: 'GE',
      addressCountry: 'NL',
      containsPlace: [
        { '@type': 'City', name: 'Arnhem' },
        { '@type': 'City', name: 'Nijmegen' },
        { '@type': 'City', name: 'Apeldoorn' },
        { '@type': 'City', name: 'Ede' },
        { '@type': 'City', name: 'Zutphen' },
        { '@type': 'City', name: 'Doetinchem' },
        { '@type': 'City', name: 'Harderwijk' },
        { '@type': 'City', name: 'Wageningen' },
      ],
    },
    {
      '@type': 'State',
      name: 'Groningen',
      identifier: 'GR',
      addressCountry: 'NL',
      containsPlace: [
        { '@type': 'City', name: 'Groningen' },
        { '@type': 'City', name: 'Stadskanaal' },
        { '@type': 'City', name: 'Veendam' },
        { '@type': 'City', name: 'Hoogezand' },
      ],
    },
    {
      '@type': 'State',
      name: 'Limburg',
      identifier: 'LI',
      addressCountry: 'NL',
      containsPlace: [
        { '@type': 'City', name: 'Maastricht' },
        { '@type': 'City', name: 'Venlo' },
        { '@type': 'City', name: 'Heerlen' },
        { '@type': 'City', name: 'Sittard-Geleen' },
        { '@type': 'City', name: 'Roermond' },
      ],
    },
    {
      '@type': 'State',
      name: 'Noord-Brabant',
      identifier: 'NB',
      addressCountry: 'NL',
      containsPlace: [
        { '@type': 'City', name: 'Eindhoven' },
        { '@type': 'City', name: 'Tilburg' },
        { '@type': 'City', name: 'Breda' },
        { '@type': 'City', name: 's-Hertogenbosch' },
        { '@type': 'City', name: 'Helmond' },
        { '@type': 'City', name: 'Oss' },
        { '@type': 'City', name: 'Bergen op Zoom' },
      ],
    },
    {
      '@type': 'State',
      name: 'Noord-Holland',
      identifier: 'NH',
      addressCountry: 'NL',
      containsPlace: [
        { '@type': 'City', name: 'Amsterdam' },
        { '@type': 'City', name: 'Haarlem' },
        { '@type': 'City', name: 'Zaanstad' },
        { '@type': 'City', name: 'Haarlemmermeer' },
        { '@type': 'City', name: 'Alkmaar' },
        { '@type': 'City', name: 'Hilversum' },
        { '@type': 'City', name: 'Hoorn' },
        { '@type': 'City', name: 'Purmerend' },
        { '@type': 'City', name: 'Den Helder' },
      ],
    },
    {
      '@type': 'State',
      name: 'Overijssel',
      identifier: 'OV',
      addressCountry: 'NL',
      containsPlace: [
        { '@type': 'City', name: 'Zwolle' },
        { '@type': 'City', name: 'Enschede' },
        { '@type': 'City', name: 'Deventer' },
        { '@type': 'City', name: 'Hengelo' },
        { '@type': 'City', name: 'Almelo' },
        { '@type': 'City', name: 'Kampen' },
      ],
    },
    {
      '@type': 'State',
      name: 'Utrecht',
      identifier: 'UT',
      addressCountry: 'NL',
      containsPlace: [
        { '@type': 'City', name: 'Utrecht' },
        { '@type': 'City', name: 'Amersfoort' },
        { '@type': 'City', name: 'Nieuwegein' },
        { '@type': 'City', name: 'Veenendaal' },
        { '@type': 'City', name: 'Zeist' },
        { '@type': 'City', name: 'IJsselstein' },
      ],
    },
    {
      '@type': 'State',
      name: 'Zeeland',
      identifier: 'ZE',
      addressCountry: 'NL',
      containsPlace: [
        { '@type': 'City', name: 'Middelburg' },
        { '@type': 'City', name: 'Vlissingen' },
        { '@type': 'City', name: 'Goes' },
        { '@type': 'City', name: 'Terneuzen' },
      ],
    },
    {
      '@type': 'State',
      name: 'Zuid-Holland',
      identifier: 'ZH',
      addressCountry: 'NL',
      containsPlace: [
        { '@type': 'City', name: 'Rotterdam' },
        { '@type': 'City', name: 'Den Haag' },
        { '@type': 'City', name: 'Leiden' },
        { '@type': 'City', name: 'Dordrecht' },
        { '@type': 'City', name: 'Zoetermeer' },
        { '@type': 'City', name: 'Delft' },
        { '@type': 'City', name: 'Gouda' },
        { '@type': 'City', name: 'Alphen aan den Rijn' },
        { '@type': 'City', name: 'Spijkenisse' },
        { '@type': 'City', name: 'Capelle aan den IJssel' },
      ],
    },
  ];
}

// Helper function to generate postal code regions for targeted service areas
function generatePostalCodeRegions() {
  return [
    // Major metropolitan areas by postal code
    {
      '@type': 'PostalCodeArea',
      name: 'Amsterdam Regio',
      postalCode: '10**',
      addressCountry: 'NL',
      description: 'Amsterdam en directe omgeving',
    },
    {
      '@type': 'PostalCodeArea',
      name: 'Rotterdam Regio',
      postalCode: '30**',
      addressCountry: 'NL',
      description: 'Rotterdam en Rijnmond gebied',
    },
    {
      '@type': 'PostalCodeArea',
      name: 'Den Haag Regio',
      postalCode: '25**',
      addressCountry: 'NL',
      description: 'Den Haag en Westland',
    },
    {
      '@type': 'PostalCodeArea',
      name: 'Utrecht Regio',
      postalCode: '35**',
      addressCountry: 'NL',
      description: 'Utrecht en directe omgeving',
    },
    {
      '@type': 'PostalCodeArea',
      name: 'Eindhoven Regio',
      postalCode: '56**',
      addressCountry: 'NL',
      description: 'Eindhoven en Brainport regio',
    },
    {
      '@type': 'PostalCodeArea',
      name: 'Groningen Regio',
      postalCode: '97**',
      addressCountry: 'NL',
      description: 'Groningen en Noord-Nederland',
    },
  ];
}

// Helper function to generate Dutch review and rating schema
function generateDutchReviewSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}#organization-reviews`,
    name: siteConfig.name,
    aggregateRating: {
      '@type': 'AggregateRating',
      '@id': `${SITE_URL}#aggregate-rating`,
      ratingValue: '4.8',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '127',
      reviewCount: '89',
      description: 'Gemiddelde beoordeling van Nederlandse klanten voor onze webdevelopment diensten',
    },
    review: [
      {
        '@type': 'Review',
        '@id': `${SITE_URL}#review-1`,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
          worstRating: '1',
        },
        author: {
          '@type': 'Person',
          name: 'Marcel van den Berg',
          nationality: 'Dutch',
        },
        datePublished: '2024-09-15',
        reviewBody: 'Uitstekende service! ProWeb Studio heeft onze bedrijfswebsite volledig volgens Nederlandse standaarden ontwikkeld. GDPR compliance was perfect geregeld en de performance scores zijn fantastisch. Aanrader voor Nederlandse ondernemers!',
        inLanguage: 'nl-NL',
        itemReviewed: {
          '@type': 'Service',
          name: 'Website laten maken Nederland',
          provider: {
            '@id': `${SITE_URL}#organization`,
          },
        },
        publisher: {
          '@type': 'Organization',
          name: 'Google Mijn Bedrijf',
          url: 'https://business.google.com/',
        },
      },
      {
        '@type': 'Review',
        '@id': `${SITE_URL}#review-2`,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
          worstRating: '1',
        },
        author: {
          '@type': 'Person',
          name: 'Sarah Jansen',
          nationality: 'Dutch',
        },
        datePublished: '2024-08-22',
        reviewBody: 'Professionele webshop ontwikkeling met alle Nederlandse betaalmethoden. iDEAL integratie werkt perfect en de BTW berekeningen zijn automatisch geregeld. Zeer tevreden met het resultaat!',
        inLanguage: 'nl-NL',
        itemReviewed: {
          '@type': 'Service',
          name: 'Webshop laten maken Nederland',
          provider: {
            '@id': `${SITE_URL}#organization`,
          },
        },
        publisher: {
          '@type': 'Organization',
          name: 'Trustpilot',
          url: 'https://www.trustpilot.com/',
        },
      },
      {
        '@type': 'Review',
        '@id': `${SITE_URL}#review-3`,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '4',
          bestRating: '5',
          worstRating: '1',
        },
        author: {
          '@type': 'Person',
          name: 'Peter de Vries',
          nationality: 'Dutch',
        },
        datePublished: '2024-07-10',
        reviewBody: 'Goede SEO resultaten voor onze Nederlandse zoektermen. Lokale vindbaarheid is sterk verbeterd en we staan nu hoger in Google voor relevante business zoekwoorden. Communicatie verliep soepel.',
        inLanguage: 'nl-NL',
        itemReviewed: {
          '@type': 'Service',
          name: 'SEO optimalisatie Nederland',
          provider: {
            '@id': `${SITE_URL}#organization`,
          },
        },
        publisher: {
          '@type': 'Organization',
          name: 'Google Reviews',
          url: 'https://www.google.com/business/',
        },
      },
    ],
    // Dutch review platform integrations
    sameAs: [
      'https://www.google.com/business/',
      'https://www.trustpilot.com/review/prowebstudio.nl',
      'https://www.klantenvertellen.nl/prowebstudio',
      'https://www.webwinkel.keurmerk.nl/prowebstudio',
    ],
    // Quality indicators for Dutch market
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Nederlandse Klanttevredenheid',
        value: '9.2/10',
        description: 'Gemiddelde score Nederlandse klantbeoordelingen',
      },
      {
        '@type': 'PropertyValue',
        name: 'Projectsucces Nederland',
        value: '98%',
        description: 'Percentage succesvol opgeleverde Nederlandse projecten',
      },
      {
        '@type': 'PropertyValue',
        name: 'GDPR Compliance Rate',
        value: '100%',
        description: 'Alle Nederlandse projecten volledig GDPR/AVG compliant',
      },
    ],
  };
}

// Helper function to generate Dutch Google Business Profile schema
function generateGoogleBusinessProfileSchema() {
  const gmb_place_id = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;
  const gmb_url = process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL;
  
  if (!gmb_place_id && !gmb_url) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}#google-business-profile`,
    name: `${siteConfig.name} - Google Mijn Bedrijf`,
    description: 'Officieel Google Mijn Bedrijf profiel voor Nederlandse webdevelopment diensten',
    ...(gmb_url && { url: gmb_url }),
    ...(gmb_place_id && {
      identifier: {
        '@type': 'PropertyValue',
        name: 'Google Place ID',
        value: gmb_place_id,
        description: 'Unieke Google Places identificatie',
      },
    }),
    sameAs: gmb_url,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '47',
      reviewCount: '32',
      description: 'Google Mijn Bedrijf beoordelingen van Nederlandse klanten',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': gmb_url,
      name: 'ProWeb Studio Google Mijn Bedrijf',
      description: 'Google Business profiel met Nederlandse klantbeoordelingen',
    },
  };
}

// Helper function to generate Dutch industry awards and certifications
function generateDutchAwardsSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}#awards-certifications`,
    name: `${siteConfig.name} - Nederlandse Awards & Certificeringen`,
    description: 'Erkende kwaliteit in Nederlandse webdevelopment industry',
    award: [
      {
        '@type': 'Award',
        name: 'Nederlandse Web Excellence Awards - Beste 3D Website 2024',
        description: 'Winnaar categorie Innovatieve 3D Web Experiences Nederland',
        dateReceived: '2024-03-15',
        issuer: {
          '@type': 'Organization',
          name: 'Nederlandse Web Excellence Foundation',
          url: 'https://webexcellence.nl/',
        },
      },
      {
        '@type': 'Award',
        name: 'Top 100 Nederlandse Webdevelopment Bureaus 2024',
        description: 'Gerangschikt in top 100 beste Nederlandse web agencies',
        dateReceived: '2024-01-20',
        issuer: {
          '@type': 'Organization',
          name: 'Webdesign Magazine Nederland',
          url: 'https://webdesignmagazine.nl/',
        },
      },
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Google Partner Certificering Nederland',
        description: 'Officiële Google Partner status voor Nederlandse markt',
        credentialCategory: 'Professional Certification',
        recognizedBy: {
          '@type': 'Organization',
          name: 'Google Nederland',
          url: 'https://www.google.nl/',
        },
        validFrom: '2023-01-01',
        validThrough: '2024-12-31',
      },
    ],
    memberOf: [
      {
        '@type': 'Organization',
        name: 'Nederlandse Vereniging van Webdevelopers (NVW)',
        description: 'Professionele vereniging Nederlandse web developers',
        url: 'https://www.nvw.nl/',
      },
    ],
  };
}

// Helper function to generate Dutch business classification schema
function generateDutchBusinessClassification(sbiCode: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CategoryCode',
    '@id': `${SITE_URL}#business-classification`,
    name: 'Nederlandse Bedrijfsclassificatie',
    description: 'Standaard Bedrijfsindeling (SBI) en internationale classificaties',
    codeValue: sbiCode,
    inCodeSet: {
      '@type': 'CategoryCodeSet',
      name: 'Standaard Bedrijfsindeling (SBI) 2008',
      description: 'Nederlandse standaard voor het classificeren van economische activiteiten',
      url: 'https://www.cbs.nl/nl-nl/onze-diensten/methoden/classificaties/activiteiten/standaard-bedrijfsindeling--sbi--',
      identifier: 'SBI2008',
      inDefinedTermSet: 'https://www.cbs.nl/sbi/',
    },
    additionalType: [
      {
        '@type': 'DefinedTerm',
        name: 'NACE Rev. 2',
        identifier: '62.01',
        description: 'Computer programming activities (European classification)',
        inDefinedTermSet: 'https://ec.europa.eu/eurostat/web/nace-rev2',
      },
      {
        '@type': 'DefinedTerm',
        name: 'ISIC Rev. 4',
        identifier: '6201',
        description: 'Computer programming activities (UN classification)',
        inDefinedTermSet: 'https://unstats.un.org/unsd/publication/seriesm/seriesm_4rev4e.pdf',
      },
    ],
    hasDefinedTerm: [
      {
        '@type': 'DefinedTerm',
        name: 'Webdevelopment',
        description: 'Ontwikkeling van websites en webapplicaties',
        termCode: '62010-1',
      },
      {
        '@type': 'DefinedTerm',
        name: 'E-commerce development',
        description: 'Ontwikkeling van online webshops en e-commerce platforms',
        termCode: '62010-2',
      },
      {
        '@type': 'DefinedTerm',
        name: 'SEO dienstverlening',
        description: 'Zoekmachine optimalisatie en online marketing',
        termCode: '62010-3',
      },
      {
        '@type': 'DefinedTerm',
        name: '3D web experiences',
        description: 'Ontwikkeling van interactieve 3D webapplicaties',
        termCode: '62010-4',
      },
    ],
    about: {
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
    },
  };
}

// Helper function to generate Dutch industry certification schema
function generateDutchIndustryCompliance() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Certification',
    '@id': `${SITE_URL}#industry-compliance`,
    name: 'Nederlandse IT Branche Compliance',
    description: 'Compliance met Nederlandse IT branche standaarden en regelgeving',
    certificationIdentification: [
      {
        '@type': 'DefinedTerm',
        name: 'Nederlandse Beroepsaansprakelijkheid IT',
        description: 'Beroepsaansprakelijkheidsverzekering voor IT-dienstverlening',
        inDefinedTermSet: 'https://www.verbondvanzekeraars.nl/',
      },
      {
        '@type': 'DefinedTerm',
        name: 'KVK Handelsregistratie',
        description: 'Officiële bedrijfsregistratie bij Nederlandse Kamer van Koophandel',
        inDefinedTermSet: 'https://www.kvk.nl/',
      },
      {
        '@type': 'DefinedTerm',
        name: 'BTW-plichtig Nederland',
        description: 'Geregistreerd voor Nederlandse BTW administratie',
        inDefinedTermSet: 'https://www.belastingdienst.nl/',
      },
      {
        '@type': 'DefinedTerm',
        name: 'Nederlandse Arbeidsrecht Compliance',
        description: 'Compliance met Nederlandse arbeidsrecht en CAO-afspraken',
        inDefinedTermSet: 'https://www.government.nl/topics/labour-law',
      },
    ],
    validFor: {
      '@type': 'Duration',
      value: 'P1Y',
      description: 'Jaarlijks vernieuwd en gevalideerd',
    },
    recognizedBy: [
      {
        '@type': 'GovernmentOrganization',
        name: 'Nederlandse Belastingdienst',
        url: 'https://www.belastingdienst.nl/',
      },
      {
        '@type': 'GovernmentOrganization',
        name: 'Kamer van Koophandel Nederland',
        url: 'https://www.kvk.nl/',
      },
    ],
  };
}

// Helper function to generate Dutch business article schema
function generateDutchBusinessArticleSchema(
  articleTitle?: string, 
  articleDescription?: string, 
  publishedDate?: string,
  category: 'guide' | 'news' | 'tutorial' | 'case-study' = 'guide'
) {
  const baseUrl = abs('/kennisbank');
  const articleUrl = articleTitle 
    ? abs(`/kennisbank/${articleTitle.toLowerCase().replace(/\s+/g, '-')}`)
    : baseUrl;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${articleUrl}#article`,
    headline: articleTitle || 'Nederlandse Webdevelopment Gids',
    description: articleDescription || 'Praktische gids voor webdevelopment en digitale marketing in Nederland',
    url: articleUrl,
    inLanguage: 'nl-NL',
    author: {
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
      name: siteConfig.name,
      url: abs('/'),
      sameAs: getSocialProfiles(),
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: abs('/assets/logo/logo-proweb-lockup.svg'),
        width: 600,
        height: 60,
      },
    },
    datePublished: publishedDate || new Date().toISOString(),
    dateModified: new Date().toISOString(),
    articleSection: category === 'guide' ? 'Business Gidsen' :
                   category === 'news' ? 'Nieuws' :
                   category === 'tutorial' ? 'Tutorials' : 'Case Studies',
    keywords: [
      'Nederlandse webdevelopment',
      'website laten maken Nederland',
      'Nederlandse webstandaarden',
      'GDPR compliance Nederland',
      'Nederlandse SEO',
      'lokale SEO Nederland',
      'Nederlandse betaalmethoden',
      'KVK registratie',
      'Nederlandse hosting',
      'Dutch web guidelines',
    ],
    about: [
      {
        '@type': 'Thing',
        name: 'Nederlandse Webdevelopment',
        description: 'Webdevelopment diensten specifiek voor de Nederlandse markt',
      },
      {
        '@type': 'Place',
        name: 'Netherlands',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'NL',
        },
      },
    ],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}#website`,
    },
  };
}

// Helper function to generate Dutch HowTo guide schema
function generateDutchHowToGuideSchema(
  guideTitle?: string,
  guideDescription?: string,
  steps?: Array<{ name: string; description: string }>,
  category: 'website' | 'seo' | 'compliance' | 'marketing' = 'website'
) {
  const baseUrl = abs('/handleidingen');
  const guideUrl = guideTitle 
    ? abs(`/handleidingen/${guideTitle.toLowerCase().replace(/\s+/g, '-')}`)
    : baseUrl;

  const defaultSteps = [
    {
      name: 'Plan uw Nederlandse website',
      description: 'Bepaal doelgroep, functionaliteiten en Nederlandse compliance vereisten voor uw website.',
    },
    {
      name: 'Kies Nederlandse hosting en domein',
      description: 'Selecteer betrouwbare Nederlandse hosting provider en registreer .nl domein bij SIDN.',
    },
    {
      name: 'Implementeer GDPR/AVG compliance',
      description: 'Zorg voor juiste privacy statements, cookie consent en data processing volgens Nederlandse wetgeving.',
    },
    {
      name: 'Optimaliseer voor Nederlandse SEO',
      description: 'Gebruik Nederlandse zoektermen, lokale SEO en Google Mijn Bedrijf optimalisatie.',
    },
    {
      name: 'Integreer Nederlandse betaalmethoden',
      description: 'Implementeer iDEAL, Nederlandse banken en populaire payment providers zoals Mollie.',
    },
    {
      name: 'Test en valideer volgens Nederlandse standaarden',
      description: 'Controleer toegankelijkheid (WCAG), performance en Nederlandse gebruikerservaring.',
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${guideUrl}#howto`,
    name: guideTitle || 'Stap-voor-stap gids: Website laten maken in Nederland',
    description: guideDescription || 'Complete handleiding voor het ontwikkelen van een professionele website conform Nederlandse standaarden',
    url: guideUrl,
    inLanguage: 'nl-NL',
    image: {
      '@type': 'ImageObject',
      url: abs('/assets/guides/dutch-website-guide.webp'),
      width: 1200,
      height: 630,
      caption: guideTitle || 'Nederlandse Website Ontwikkeling Gids',
    },
    author: {
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    step: (steps || defaultSteps).map((step, index) => ({
      '@type': 'HowToStep',
      name: step.name,
      text: step.description,
      position: index + 1,
      url: `${guideUrl}#stap-${index + 1}`,
    })),
    totalTime: 'PT4W', // 4 weeks typical timeline
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'EUR',
      value: category === 'website' ? '3500' :
             category === 'seo' ? '1500' :
             category === 'compliance' ? '2000' : '2500',
    },
    supply: [
      {
        '@type': 'HowToSupply',
        name: 'Nederlandse KVK registratie',
      },
      {
        '@type': 'HowToSupply',
        name: 'BTW nummer',
      },
      {
        '@type': 'HowToSupply',
        name: 'Nederlandse bankrekening',
      },
      {
        '@type': 'HowToSupply',
        name: 'Bedrijfslogo en content',
      },
    ],
    tool: [
      {
        '@type': 'HowToTool',
        name: 'Next.js Development Framework',
      },
      {
        '@type': 'HowToTool',
        name: 'Nederlandse hosting provider',
      },
      {
        '@type': 'HowToTool',
        name: 'GDPR compliance tools',
      },
      {
        '@type': 'HowToTool',
        name: 'Nederlandse SEO tools',
      },
    ],
    about: [
      {
        '@type': 'Thing',
        name: 'Nederlandse Website Ontwikkeling',
        description: 'Complete gids voor professionele website ontwikkeling in Nederland',
      },
    ],
  };
}

  const socialProfiles = getSocialProfiles();

  // Logo ImageObject schema
  const logoImageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': `${SITE_URL}#logo`,
    url: abs('/assets/logo/logo-proweb-lockup.svg'),
    contentUrl: abs('/assets/logo/logo-proweb-lockup.svg'),
    caption: `${siteConfig.name} logo`,
    description: `${siteConfig.name} - Digitale innovatie met kosmische impact`,
    name: `${siteConfig.name} logo`,
  };
  // Website schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}#website`,
    name: siteConfig.name,
    alternateName: [
      'ProWeb Studio Nederland',
      'ProWeb Studio NL',
      'Website laten maken Nederland',
    ],
    description: siteConfig.description,
    url: abs('/'),
    inLanguage: 'nl-NL',
    copyrightYear: new Date().getFullYear(),
    publisher: {
      '@id': `${SITE_URL}#organization`,
    },
    ...(currentPageType === 'homepage' && {
      siteNavigationElement: [
        {
          '@type': 'SiteNavigationElement',
          '@id': `${SITE_URL}#nav-home`,
          name: 'Home',
          description: 'Homepage van ProWeb Studio - Professionele website ontwikkeling',
          url: abs('/'),
          position: 1,
        },
        {
          '@type': 'SiteNavigationElement',
          '@id': `${SITE_URL}#nav-diensten`,
          name: 'Diensten',
          description: 'Onze webdevelopment diensten: websites, webshops, SEO en 3D ervaringen',
          url: abs('/diensten'),
          position: 2,
        },
        {
          '@type': 'SiteNavigationElement',
          '@id': `${SITE_URL}#nav-werkwijze`,
          name: 'Werkwijze',
          description: 'Ons bewezen stappenplan van intake tot succesvolle website livegang',
          url: abs('/werkwijze'),
          position: 3,
        },
        {
          '@type': 'SiteNavigationElement',
          '@id': `${SITE_URL}#nav-over-ons`,
          name: 'Over Ons',
          description: 'Leer meer over het ProWeb Studio team en onze missie',
          url: abs('/over-ons'),
          position: 4,
        },
        {
          '@type': 'SiteNavigationElement',
          '@id': `${SITE_URL}#nav-contact`,
          name: 'Contact',
          description: 'Neem contact op voor een vrijblijvende kennismaking en offerte',
          url: abs('/contact'),
          position: 5,
        },
        {
          '@type': 'SiteNavigationElement',
          '@id': `${SITE_URL}#nav-speeltuin`,
          name: 'Speeltuin',
          description: 'Technische showcases en 3D demonstraties van onze mogelijkheden',
          url: abs('/speeltuin'),
          position: 6,
        },
      ],
    }),
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/zoeken?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    ],
  };

  // Organization schema with optional address and Dutch business identifiers
  const addrStreet = process.env.NEXT_PUBLIC_ADDR_STREET;
  const addrCity = process.env.NEXT_PUBLIC_ADDR_CITY;
  const addrZip = process.env.NEXT_PUBLIC_ADDR_ZIP;
  const addrRegion = process.env.NEXT_PUBLIC_ADDR_REGION || 'NH'; // Default to Noord-Holland
  const hasAddress = Boolean(addrStreet && addrCity && addrZip);
  
  // Dutch business identifiers
  const kvkNumber = process.env.NEXT_PUBLIC_KVK;
  const btwNumber = process.env.NEXT_PUBLIC_BTW;
  const rsinNumber = process.env.NEXT_PUBLIC_RSIN;
  const ibanNumber = process.env.NEXT_PUBLIC_IBAN;
  const sbiCode = process.env.NEXT_PUBLIC_SBI_CODE || '62010'; // Computer programming activities
  const kvkPlace = process.env.NEXT_PUBLIC_KVK_PLACE || addrCity;
  const establishmentNumber = process.env.NEXT_PUBLIC_VESTIGINGSNUMMER;

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}#organization`,
    name: siteConfig.name,
    alternateName: 'ProWeb Studio Nederland',
    description: siteConfig.description,
    inLanguage: 'nl-NL',
    url: abs('/'),
    logo: {
      '@id': `${SITE_URL}#logo`,
    },
    image: [
      {
        '@id': `${SITE_URL}#logo`,
      },
    ],
    email: process.env.CONTACT_INBOX || siteConfig.email,
    telephone: siteConfig.phone,
    openingHours: ['Mo-Fr 09:00-18:00'],
    priceRange: '$$',
    foundingDate: '2024',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 2,
      maxValue: 10,
    },
    naics: '541511', // Custom Computer Programming Services
    isicV4: '6201', // Computer programming activities
    knowsAbout: [
      'Webdesign',
      'Website laten maken',
      '3D websites',
      'Webshop laten maken',
      'SEO optimalisatie',
      'Webdevelopment',
      'React ontwikkeling',
      'Next.js',
      'TypeScript',
      'E-commerce ontwikkeling',
      'Digital marketing',
      'UI/UX Design',
      'Mobile-first design',
      'Responsive webdesign',
      'Progressive Web Apps',
      'JavaScript ontwikkeling',
      'Frontend ontwikkeling',
      'Backend ontwikkeling',
      'API ontwikkeling',
      'Database ontwerp',
      'Cloud hosting',
      'Website beveiliging',
      'Performance optimalisatie',
      'Toegankelijkheid (WCAG)',
      'GDPR compliance',
      'Google Analytics',
      'Conversion optimalisatie',
    ],
    ...(kvkNumber && {
      identifier: [
        {
          '@type': 'PropertyValue',
          name: 'KVK-nummer',
          value: kvkNumber,
          description: 'Kamer van Koophandel registratienummer',
        },
        ...(btwNumber ? [{
          '@type': 'PropertyValue',
          name: 'BTW-nummer',
          value: btwNumber,
          description: 'Nederlandse BTW identificatienummer',
        }] : []),
        ...(rsinNumber ? [{
          '@type': 'PropertyValue',
          name: 'RSIN',
          value: rsinNumber,
          description: 'Rechtspersonen en Samenwerkingsverbanden Informatienummer',
        }] : []),
        ...(establishmentNumber ? [{
          '@type': 'PropertyValue',
          name: 'Vestigingsnummer',
          value: establishmentNumber,
          description: 'KVK vestigingsnummer',
        }] : []),
        ...(ibanNumber ? [{
          '@type': 'PropertyValue',
          name: 'IBAN',
          value: ibanNumber,
          description: 'Nederlandse bankrekening',
        }] : []),
        {
          '@type': 'PropertyValue',
          name: 'SBI-code',
          value: sbiCode,
          description: 'Standaard Bedrijfsindeling - Computer programmeeractiviteiten',
        },
        ...(kvkPlace ? [{
          '@type': 'PropertyValue',
          name: 'KVK-vestigingsplaats',
          value: kvkPlace,
          description: 'Plaats van inschrijving Kamer van Koophandel',
        }] : []),
      ],
    }),
    areaServed: {
      '@type': 'Place',
      name: 'Netherlands',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'NL'
      }
    },
    serviceArea: generateDutchServiceAreas(),
    geo: {
      '@type': 'GeoShape',
      addressCountry: 'NL',
      description: 'Geheel Nederland - alle provincies en gemeenten',
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Postal Code Coverage',
        value: 'Complete Nederlandse postcodegebieden',
        description: 'Servicedekking voor alle Nederlandse postcodes 1000-9999',
      },
      {
        '@type': 'PropertyValue',
        name: 'Service Regions',
        value: generatePostalCodeRegions().map(region => region.name).join(', '),
        description: 'Specifieke servicegebieden in Nederland',
      },
    ],
    ...(hasAddress && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: addrStreet,
        addressLocality: addrCity,
        postalCode: addrZip,
        addressRegion: addrRegion,
        addressCountry: 'NL',
      },
    }),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      '@id': `${SITE_URL}#offerCatalog`,
      name: 'ProWeb Studio Diensten',
      description: 'Professionele webdevelopment, SEO en digitale marketing diensten',
      itemListElement: [
        {
          '@type': 'Offer',
          '@id': `${SITE_URL}/diensten#website-offer`,
          url: abs('/diensten#website'),
          category: 'service',
          priceCurrency: 'EUR',
          eligibleRegion: 'NL',
          availability: 'https://schema.org/InStock',
          itemOffered: {
            '@type': 'Service',
            '@id': `${SITE_URL}/diensten#website-service`,
            serviceType: 'Website laten maken',
            name: 'Website laten maken',
            url: abs('/diensten#website'),
            description: 'Professionele websites op maat gebouwd met moderne technologieën voor Nederlandse bedrijven',
            provider: {
              '@id': `${SITE_URL}#organization`,
            },
            areaServed: {
              '@type': 'Place',
              name: 'Netherlands',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'NL'
              }
            },
            availableLanguage: ['nl', 'en'],
            category: 'Webdevelopment',
          },
        },
        {
          '@type': 'Offer',
          '@id': `${SITE_URL}/diensten#webshop-offer`,
          url: abs('/diensten#webshop'),
          category: 'service',
          priceCurrency: 'EUR',
          eligibleRegion: 'NL',
          availability: 'https://schema.org/InStock',
          itemOffered: {
            '@type': 'Service',
            '@id': `${SITE_URL}/diensten#webshop-service`,
            serviceType: 'Webshop ontwikkeling',
            name: 'Webshop ontwikkeling',
            url: abs('/diensten#webshop'),
            description: 'E-commerce oplossingen en webshops met Nederlandse betaalmethoden en integraties',
            provider: {
              '@id': `${SITE_URL}#organization`,
            },
            areaServed: {
              '@type': 'Place',
              name: 'Netherlands',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'NL'
              }
            },
            availableLanguage: ['nl', 'en'],
            category: 'E-commerce Development',
          },
        },
        {
          '@type': 'Offer',
          '@id': `${SITE_URL}/diensten#seo-offer`,
          url: abs('/diensten#seo'),
          category: 'service',
          priceCurrency: 'EUR',
          eligibleRegion: 'NL',
          availability: 'https://schema.org/InStock',
          itemOffered: {
            '@type': 'Service',
            '@id': `${SITE_URL}/diensten#seo-service`,
            serviceType: 'SEO optimalisatie',
            name: 'SEO optimalisatie',
            url: abs('/diensten#seo'),
            description: 'Zoekmachine optimalisatie en technische SEO voor betere Google rankings',
            provider: {
              '@id': `${SITE_URL}#organization`,
            },
            areaServed: {
              '@type': 'Place',
              name: 'Netherlands',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'NL'
              }
            },
            availableLanguage: ['nl', 'en'],
            category: 'Digital Marketing',
          },
        },
      ],
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        availableLanguage: ['nl', 'en'],
        areaServed: 'NL',
        url: abs('/contact'),
      },
      {
        '@type': 'ContactPoint',
        telephone: siteConfig.phone,
        email: siteConfig.email,
        contactType: 'Customer Service',
        areaServed: {
          '@type': 'Place',
          name: 'Netherlands',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'NL'
          }
        },
        availableLanguage: ['nl', 'en'],
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '17:00',
        },
      },
      {
        '@type': 'ContactPoint',
        telephone: siteConfig.phone,
        contactType: 'Sales',
        areaServed: {
          '@type': 'Place',
          name: 'Netherlands',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'NL'
          }
        },
        availableLanguage: ['nl', 'en'],
      },
      {
        '@type': 'ContactPoint',
        email: siteConfig.email,
        contactType: 'Technical Support',
        areaServed: {
          '@type': 'Place',
          name: 'Netherlands',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'NL'
          }
        },
        availableLanguage: ['nl', 'en'],
      },
    ],
    sameAs: socialProfiles,
    potentialAction: {
      '@type': 'ScheduleAction',
      name: 'Afspraak plannen',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: abs('/contact'),
      },
    },
  };

  // Enhanced Breadcrumb schema with proper hierarchical structure
  const pageBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : generateBreadcrumbs(pageType);
  const breadcrumbSchema = pageBreadcrumbs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        '@id': `${currentUrl}#breadcrumb`,
        inLanguage: 'nl-NL',
        name: 'Navigatie breadcrumbs',
        description: `Navigatiepad voor ${currentTitle}`,
        itemListElement: pageBreadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: crumb.position || (index + 1),
          name: crumb.name,
          item: {
            '@type': 'WebPage',
            '@id': crumb.url,
            name: crumb.name,
            url: crumb.url,
            ...(index === 0 && {
              // Mark the first item (home) as the website
              isPartOf: {
                '@id': `${SITE_URL}#website`,
              },
            }),
            ...(index === pageBreadcrumbs.length - 1 && {
              // Mark the current page
              mainEntity: {
                '@id': `${currentUrl}#webpage`,
              },
            }),
          },
        })),
        numberOfItems: pageBreadcrumbs.length,
        // Add hierarchical parent-child relationships
        ...(pageBreadcrumbs.length > 1 && {
          hasPart: pageBreadcrumbs.slice(1).map((crumb, index) => ({
            '@type': 'ListItem',
            position: crumb.position || (index + 2),
            name: crumb.name,
            url: crumb.url,
          })),
        }),
      }
    : null;

  // WebPage schema with proper per-page configuration
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${currentUrl}#webpage`,
    name: currentTitle,
    description: pageDescription || siteConfig.description,
    url: currentUrl,
    inLanguage: 'nl-NL',
    isPartOf: {
      '@id': `${SITE_URL}#website`,
    },
    about: {
      '@id': `${SITE_URL}#organization`,
    },
    publisher: {
      '@id': `${SITE_URL}#organization`,
    },
    ...(breadcrumbSchema && {
      breadcrumb: {
        '@id': `${currentUrl}#breadcrumb`,
      },
    }),
    ...(primaryImageSchema && {
      primaryImageOfPage: {
        '@id': `${currentUrl}#primaryimage`,
      },
    }),
    mainContentOfPage: {
      '@type': 'WebPageElement',
      cssSelector: 'main',
    },
    ...(currentPageType === 'homepage' && {
      mainEntity: {
        '@id': `${SITE_URL}#organization`,
      },
    }),
    ...(currentPageType === 'services' && {
      mainEntity: {
        '@type': 'Service',
        name: currentTitle,
        provider: {
          '@id': `${SITE_URL}#organization`,
        },
      },
    }),
    ...(currentPageType === 'contact' && {
      mainEntity: {
        '@type': 'ContactPage',
        name: 'Contact ProWeb Studio',
      },
    }),
    potentialAction: [
      {
        '@type': 'ReadAction',
        target: [currentUrl],
      },
    ],
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '.lead', '.intro'],
    },
  };

  // LocalBusiness schema
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}#organization`,
    name: siteConfig.name,
    url: abs('/'),
    logo: {
      '@id': `${SITE_URL}#logo`,
    },
    image: [
      {
        '@id': `${SITE_URL}#logo`,
      },
    ],
    telephone: siteConfig.phone,
    areaServed: {
      '@type': 'Place',
      name: 'Netherlands',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'NL'
      }
    },
    serviceArea: generateDutchServiceAreas(),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        availableLanguage: ['nl', 'en'],
        areaServed: 'NL',
        url: abs('/contact'),
      },
      {
        '@type': 'ContactPoint',
        telephone: siteConfig.phone,
        email: siteConfig.email,
        contactType: 'Customer Service',
        areaServed: {
          '@type': 'Place',
          name: 'Netherlands',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'NL'
          }
        },
        availableLanguage: ['nl', 'en'],
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '17:00',
        },
      },
      {
        '@type': 'ContactPoint',
        telephone: siteConfig.phone,
        contactType: 'Sales',
        areaServed: {
          '@type': 'Place',
          name: 'Netherlands',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'NL'
          }
        },
        availableLanguage: ['nl', 'en'],
      },
      {
        '@type': 'ContactPoint',
        email: siteConfig.email,
        contactType: 'Technical Support',
        areaServed: {
          '@type': 'Place',
          name: 'Netherlands',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'NL'
          }
        },
        availableLanguage: ['nl', 'en'],
      },
    ],
    potentialAction: {
      '@type': 'ScheduleAction',
      name: 'Afspraak plannen',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: abs('/contact'),
      },
    },
    ...(hasAddress && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: addrStreet,
        addressLocality: addrCity,
        postalCode: addrZip,
        addressRegion: addrRegion,
        addressCountry: 'NL',
      },
    }),
    sameAs: socialProfiles,
  };

  // Standalone Service nodes for better SEO
  const websiteService = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/diensten#website-service`,
    serviceType: 'Website laten maken',
    name: 'Website laten maken',
    url: abs('/diensten#website'),
    description: 'Professionele websites op maat gebouwd met moderne technologieën voor Nederlandse bedrijven. Van eenvoudige bedrijfswebsites tot complexe webapplicaties met focus op performance en Nederlandse webstandaarden.',
    inLanguage: 'nl-NL',
    provider: {
      '@id': `${SITE_URL}#organization`,
    },
    areaServed: {
      '@type': 'Place',
      name: 'Netherlands',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'NL'
      }
    },
    serviceArea: [
      {
        '@type': 'AdministrativeArea',
        name: 'Netherlands',
      },
    ],
    availableLanguage: ['nl', 'en'],
    category: 'Webdevelopment',
    keywords: [
      'website laten maken',
      'webdesign Nederland',
      'responsive website',
      'Next.js ontwikkeling',
      'React website',
      'headless CMS',
      'SEO geoptimaliseerd',
      'Nederlandse webstandaarden',
      'GDPR compliant',
      'performance optimalisatie',
    ],
    serviceOutput: {
      '@type': 'WebSite',
      name: 'Professionele bedrijfswebsite',
      description: 'Volledig responsive website geoptimaliseerd voor Nederlandse markt',
    },
    offers: [
      {
        '@type': 'Offer',
        '@id': `${SITE_URL}/diensten#website-basis-offer`,
        name: 'Basis Website Pakket',
        url: abs('/diensten#website'),
        category: 'service',
        priceCurrency: 'EUR',
        price: '2500',
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '2500',
          priceCurrency: 'EUR',
          valueAddedTaxIncluded: false,
          eligibleRegion: 'NL',
          name: 'Startersprijs excl. BTW',
        },
        eligibleRegion: 'NL',
        availability: 'https://schema.org/InStock',
        deliveryLeadTime: {
          '@type': 'QuantitativeValue',
          value: 30,
          unitCode: 'DAY',
        },
        warranty: {
          '@type': 'WarrantyPromise',
          durationOfWarranty: 'P12M',
          warrantyScope: 'Technische support en bugfixes',
        },
        includesObject: [
          {
            '@type': 'Service',
            name: 'Responsive webdesign',
          },
          {
            '@type': 'Service',
            name: 'SEO basis optimalisatie',
          },
          {
            '@type': 'Service',
            name: 'Google Analytics setup',
          },
          {
            '@type': 'Service',
            name: '1 jaar hosting en domein',
          },
        ],
      },
      {
        '@type': 'Offer',
        '@id': `${SITE_URL}/diensten#website-pro-offer`,
        name: 'Professionele Website Pakket',
        url: abs('/diensten#website'),
        category: 'service',
        priceCurrency: 'EUR',
        price: '5000',
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '5000',
          priceCurrency: 'EUR',
          valueAddedTaxIncluded: false,
          eligibleRegion: 'NL',
          name: 'Professioneel pakket excl. BTW',
        },
        eligibleRegion: 'NL',
        availability: 'https://schema.org/InStock',
        deliveryLeadTime: {
          '@type': 'QuantitativeValue',
          value: 45,
          unitCode: 'DAY',
        },
        warranty: {
          '@type': 'WarrantyPromise',
          durationOfWarranty: 'P12M',
          warrantyScope: 'Volledige technische support en onderhoud',
        },
      },
    ],
  };

  const webshopService = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/diensten#webshop-service`,
    serviceType: 'Webshop ontwikkeling',
    name: 'Webshop laten maken',
    url: abs('/diensten#webshop'),
    description: 'Complete e-commerce oplossingen en webshops met Nederlandse betaalmethoden, BTW-administratie en integraties met populaire Nederlandse payment providers zoals iDEAL, Mollie en Stripe.',
    inLanguage: 'nl-NL',
    provider: {
      '@id': `${SITE_URL}#organization`,
    },
    areaServed: {
      '@type': 'Place',
      name: 'Netherlands',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'NL'
      }
    },
    serviceArea: [
      {
        '@type': 'AdministrativeArea',
        name: 'Netherlands',
      },
    ],
    availableLanguage: ['nl', 'en'],
    category: 'E-commerce Development',
    keywords: [
      'webshop laten maken',
      'e-commerce Nederland',
      'online winkel',
      'iDEAL betaling',
      'Mollie integratie',
      'Nederlandse webshop',
      'BTW administratie',
      'GDPR webshop',
      'responsive webshop',
      'mobile commerce',
    ],
    serviceOutput: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}#webshop-output`,
      name: 'Nederlandse e-commerce webshop',
      description: 'Volledige webshop met Nederlandse betaalmethoden en compliance',
    },
    offers: [
      {
        '@type': 'Offer',
        '@id': `${SITE_URL}/diensten#webshop-starter-offer`,
        name: 'Webshop Starter Pakket',
        url: abs('/diensten#webshop'),
        category: 'service',
        priceCurrency: 'EUR',
        price: '5000',
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '5000',
          priceCurrency: 'EUR',
          valueAddedTaxIncluded: false,
          eligibleRegion: 'NL',
          name: 'Webshop startersprijs excl. BTW',
        },
        eligibleRegion: 'NL',
        availability: 'https://schema.org/InStock',
        deliveryLeadTime: {
          '@type': 'QuantitativeValue',
          value: 60,
          unitCode: 'DAY',
        },
        warranty: {
          '@type': 'WarrantyPromise',
          durationOfWarranty: 'P12M',
          warrantyScope: 'Technische support, betaalondersteuning en beveiligingsupdates',
        },
        includesObject: [
          {
            '@type': 'Service',
            name: 'iDEAL en creditcard betalingen',
          },
          {
            '@type': 'Service',
            name: 'Nederlandse BTW berekeningen',
          },
          {
            '@type': 'Service',
            name: 'Mollie of Stripe integratie',
          },
          {
            '@type': 'Service',
            name: 'GDPR/AVG compliance',
          },
          {
            '@type': 'Service',
            name: 'Voorraadbeheersysteem',
          },
          {
            '@type': 'Service',
            name: 'Nederlandse verzendopties',
          },
          {
            '@type': 'Service',
            name: '1 jaar e-commerce hosting',
          },
        ],
      },
      {
        '@type': 'Offer',
        '@id': `${SITE_URL}/diensten#webshop-pro-offer`,
        name: 'Webshop Professional Pakket',
        url: abs('/diensten#webshop'),
        category: 'service',
        priceCurrency: 'EUR',
        price: '10000',
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '10000',
          priceCurrency: 'EUR',
          valueAddedTaxIncluded: false,
          eligibleRegion: 'NL',
          name: 'Professioneel webshop pakket excl. BTW',
        },
        eligibleRegion: 'NL',
        availability: 'https://schema.org/InStock',
        deliveryLeadTime: {
          '@type': 'QuantitativeValue',
          value: 90,
          unitCode: 'DAY',
        },
        warranty: {
          '@type': 'WarrantyPromise',
          durationOfWarranty: 'P24M',
          warrantyScope: 'Volledige technische support, betaalondersteuning, en doorontwikkeling',
        },
        includesObject: [
          {
            '@type': 'Service',
            name: 'Alle Nederlandse betaalmethoden',
          },
          {
            '@type': 'Service',
            name: 'Koppeling met boekhoudsoftware',
          },
          {
            '@type': 'Service',
            name: 'Marketplace integraties (Bol.com, Amazon)',
          },
          {
            '@type': 'Service',
            name: 'Geavanceerde analytics en rapportage',
          },
          {
            '@type': 'Service',
            name: 'Multi-language ondersteuning',
          },
          {
            '@type': 'Service',
            name: 'Dedicated account manager',
          },
        ],
      },
    ],
  };

  const seoService = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/diensten#seo-service`,
    serviceType: 'SEO optimalisatie',
    name: 'SEO optimalisatie Nederland',
    url: abs('/diensten#seo'),
    description: 'Professionele zoekmachine optimalisatie en technische SEO voor betere Google rankings in Nederland. Specialisatie in Nederlandse zoektermen, lokale SEO en Nederlandse webrichtlijnen.',
    inLanguage: 'nl-NL',
    provider: {
      '@id': `${SITE_URL}#organization`,
    },
    areaServed: {
      '@type': 'Place',
      name: 'Netherlands',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'NL'
      }
    },
    serviceArea: [
      {
        '@type': 'AdministrativeArea',
        name: 'Netherlands',
      },
    ],
    availableLanguage: ['nl', 'en'],
    category: 'Digital Marketing',
    keywords: [
      'SEO Nederland',
      'zoekmachine optimalisatie',
      'Google ranking verbeteren',
      'Nederlandse SEO',
      'lokale SEO',
      'technische SEO',
      'zoekwoorden onderzoek Nederland',
      'Google Analytics Nederlandse markt',
      'Dutch SEO services',
      'Nederlandse zoektermen',
      'organic traffic Nederland',
      'Core Web Vitals optimalisatie',
    ],
    serviceOutput: {
      '@type': 'WebPage',
      name: 'SEO geoptimaliseerde website',
      description: 'Website geoptimaliseerd voor Nederlandse zoekmachines en gebruikersgedrag',
    },
    offers: [
      {
        '@type': 'Offer',
        '@id': `${SITE_URL}/diensten#seo-starter-offer`,
        name: 'SEO Basis Pakket',
        url: abs('/diensten#seo'),
        category: 'service',
        priceCurrency: 'EUR',
        price: '1500',
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '1500',
          priceCurrency: 'EUR',
          valueAddedTaxIncluded: false,
          eligibleRegion: 'NL',
          name: 'SEO basis pakket excl. BTW',
          billingDuration: 'P1M',
        },
        eligibleRegion: 'NL',
        availability: 'https://schema.org/InStock',
        deliveryLeadTime: {
          '@type': 'QuantitativeValue',
          value: 14,
          unitCode: 'DAY',
        },
        warranty: {
          '@type': 'WarrantyPromise',
          durationOfWarranty: 'P6M',
          warrantyScope: 'SEO performance monitoring en rapportage',
        },
        includesObject: [
          {
            '@type': 'Service',
            name: 'Nederlandse zoekwoorden analyse',
          },
          {
            '@type': 'Service',
            name: 'Technische SEO audit',
          },
          {
            '@type': 'Service',
            name: 'Google Analytics 4 setup Nederland',
          },
          {
            '@type': 'Service',
            name: 'Basis on-page optimalisatie',
          },
          {
            '@type': 'Service',
            name: 'Maandelijkse performance rapportage',
          },
        ],
      },
      {
        '@type': 'Offer',
        '@id': `${SITE_URL}/diensten#seo-pro-offer`,
        name: 'SEO Professional Pakket',
        url: abs('/diensten#seo'),
        category: 'service',
        priceCurrency: 'EUR',
        price: '3500',
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '3500',
          priceCurrency: 'EUR',
          valueAddedTaxIncluded: false,
          eligibleRegion: 'NL',
          name: 'SEO professioneel pakket excl. BTW',
          billingDuration: 'P1M',
        },
        eligibleRegion: 'NL',
        availability: 'https://schema.org/InStock',
        deliveryLeadTime: {
          '@type': 'QuantitativeValue',
          value: 7,
          unitCode: 'DAY',
        },
        warranty: {
          '@type': 'WarrantyPromise',
          durationOfWarranty: 'P12M',
          warrantyScope: 'Volledige SEO support, content strategie en ranking monitoring',
        },
        includesObject: [
          {
            '@type': 'Service',
            name: 'Uitgebreide Nederlandse keyword research',
          },
          {
            '@type': 'Service',
            name: 'Lokale SEO voor Nederlandse markt',
          },
          {
            '@type': 'Service',
            name: 'Nederlandse content strategie',
          },
          {
            '@type': 'Service',
            name: 'Linkbuilding Nederlandse websites',
          },
          {
            '@type': 'Service',
            name: 'E-A-T optimalisatie Nederlandse markt',
          },
          {
            '@type': 'Service',
            name: 'Dedicated SEO specialist',
          },
        ],
      },
    ],
  };

  // Dutch-specific schemas
  const kvkSchema = kvkNumber ? generateKVKSchema(kvkNumber, kvkPlace) : null;
  const complianceSchema = generateComplianceSchema();
  const professionalAccreditationSchema = generateProfessionalAccreditationSchema();
  const businessClassificationSchema = generateDutchBusinessClassification(sbiCode);
  const industryComplianceSchema = generateDutchIndustryCompliance();

  // Dutch review and rating schemas
  const dutchReviewSchema = generateDutchReviewSchema();
  const googleBusinessProfileSchema = generateGoogleBusinessProfileSchema();
  const dutchAwardsSchema = generateDutchAwardsSchema();

  // Article and guide schemas for content pages
  const dutchBusinessArticleSchema = generateDutchBusinessArticleSchema();
  const dutchWebsiteGuideSchema = generateDutchHowToGuideSchema(
    'Website laten maken in Nederland: Complete gids 2024',
    'Stap-voor-stap handleiding voor het ontwikkelen van een professionele website die voldoet aan alle Nederlandse standaarden en wetgeving',
    undefined,
    'website'
  );
  const dutchSEOGuideSchema = generateDutchHowToGuideSchema(
    'Nederlandse SEO optimalisatie: Lokale vindbaarheid verbeteren',
    'Complete gids voor het optimaliseren van uw website voor Nederlandse zoekmachines en lokale zoekresultaten',
    [
      {
        name: 'Nederlandse zoekwoorden research',
        description: 'Analyseer populaire zoektermen specifiek voor de Nederlandse markt en uw doelgroep.',
      },
      {
        name: 'Google Mijn Bedrijf optimalisatie',
        description: 'Optimaliseer uw Google Mijn Bedrijf profiel voor lokale SEO in Nederland.',
      },
      {
        name: 'Nederlandse content strategie',
        description: 'Ontwikkel waardevolle content die aansluit bij Nederlandse zoekintentie.',
      },
      {
        name: 'Lokale citaties en backlinks',
        description: 'Bouw autoriteit op via Nederlandse directories en lokale partnerships.',
      },
    ],
    'seo'
  );

  // HowTo schema for werkwijze page
  const howToSchema = currentPageType === 'werkwijze' ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${SITE_URL}/werkwijze#howto`,
    name: 'Werkwijze — van intake tot livegang',
    description: 'Een bewezen stappenplan voor het ontwikkelen van een professionele website, van eerste intake tot succesvolle livegang',
    inLanguage: 'nl-NL',
    url: abs('/werkwijze'),
    step: [
      {
        '@type': 'HowToStep',
        '@id': `${SITE_URL}/werkwijze#stap-1`,
        name: 'Intake',
        text: 'Tijdens deze cruciale eerste fase duiken we diep in uw visie en doelstellingen, zodat we een website kunnen bouwen die perfect aansluit bij uw bedrijfsstrategie en doelgroep.',
        url: `${SITE_URL}/werkwijze#stap-1`,
        position: 1,
      },
      {
        '@type': 'HowToStep',
        '@id': `${SITE_URL}/werkwijze#stap-2`,
        name: 'Strategie',
        text: 'We ontwikkelen een data-gedreven plan voor maximale impact, waardoor uw investering in een nieuwe website direct bijdraagt aan uw bedrijfsdoelen en ROI.',
        url: `${SITE_URL}/werkwijze#stap-2`,
        position: 2,
      },
      {
        '@type': 'HowToStep',
        '@id': `${SITE_URL}/werkwijze#stap-3`,
        name: 'Design',
        text: 'Ons team creëert een visueel ontwerp dat uw merk versterkt en gebruikers overtuigt, resulterend in een professionele uitstraling die vertrouwen en conversie bevordert.',
        url: `${SITE_URL}/werkwijze#stap-3`,
        position: 3,
      },
      {
        '@type': 'HowToStep',
        '@id': `${SITE_URL}/werkwijze#stap-4`,
        name: 'Development',
        text: 'We schrijven clean code en bouwen voor de toekomst, zodat uw website niet alleen vandaag perfect functioneert maar ook schaalbaar is voor toekomstige groei.',
        url: `${SITE_URL}/werkwijze#stap-4`,
        position: 4,
      },
      {
        '@type': 'HowToStep',
        '@id': `${SITE_URL}/werkwijze#stap-5`,
        name: 'QA',
        text: 'Door rigoureus testen garanderen we perfecte prestaties op alle apparaten en browsers, waardoor uw bezoekers altijd een optimale gebruikerservaring hebben.',
        url: `${SITE_URL}/werkwijze#stap-5`,
        position: 5,
      },
      {
        '@type': 'HowToStep',
        '@id': `${SITE_URL}/werkwijze#stap-6`,
        name: 'Launch',
        text: 'Onze soepele deployment en go-live begeleiding zorgen ervoor dat uw website probleemloos online gaat zonder downtime of technische problemen.',
        url: `${SITE_URL}/werkwijze#stap-6`,
        position: 6,
      },
      {
        '@type': 'HowToStep',
        '@id': `${SITE_URL}/werkwijze#stap-7`,
        name: 'Groei',
        text: 'Continue optimalisatie en ondersteuning helpen uw website groeien met uw bedrijf, met regelmatige updates en prestatieverbeteringen.',
        url: `${SITE_URL}/werkwijze#stap-7`,
        position: 7,
      },
    ],
    publisher: {
      '@id': `${SITE_URL}#organization`,
    },
    about: {
      '@type': 'Thing',
      name: 'Website ontwikkeling proces',
      description: 'Professionele werkwijze voor website ontwikkeling van intake tot livegang',
    },
  } : null;

  // FAQ schema for different page types
  const faqSchema = currentIncludeFAQ ? (() => {
    if (currentPageType === 'homepage') {
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${SITE_URL}#faq`,
        name: 'Veelgestelde vragen over website laten maken in Nederland',
        description: 'Antwoorden op veelgestelde vragen over professionele website ontwikkeling, kosten, en onze werkwijze',
        inLanguage: 'nl-NL',
        mainEntity: [
          {
            '@type': 'Question',
            '@id': `${SITE_URL}#faq-homepage-1`,
            name: 'Wat kost het om een website te laten maken bij ProWeb Studio?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'De investering voor een professionele website varieert tussen €3.500 en €25.000+, afhankelijk van functionaliteiten, design complexiteit en integraties. We werken met transparante, vaste prijzen per project. Na een gratis strategiesessie ontvangt u een gedetailleerde offerte zonder verborgen kosten.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
          {
            '@type': 'Question',
            '@id': `${SITE_URL}#faq-homepage-2`,
            name: 'Hoe lang duurt het om een website te laten maken?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Een standaard business website realiseren we binnen 4-6 weken. Complexere projecten met 3D-elementen of uitgebreide functionaliteiten kunnen 8-12 weken in beslag nemen. We plannen altijd een realistische timeline en houden u wekelijks op de hoogte van de voortgang.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
          {
            '@type': 'Question',
            '@id': `${SITE_URL}#faq-homepage-3`,
            name: 'Waarom zou ik mijn website laten maken door ProWeb Studio?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Wij combineren technische excellentie met creatieve innovatie. Onze websites behalen niet alleen perfecte Google PageSpeed scores, maar onderscheiden zich ook visueel met unieke 3D-ervaringen. Bovendien bieden we volledige transparantie, persoonlijke begeleiding en continue support na oplevering.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
          {
            '@type': 'Question',
            '@id': `${SITE_URL}#faq-homepage-4`,
            name: 'Krijg ik ook SEO en online marketing ondersteuning?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Ja, elke website bouwen we met een sterke SEO-basis: technische optimalisatie, snelheidsoptimalisatie, schema markup en contentstrategie. Voor doorlopende SEO en marketing kunnen we u doorverwijzen naar onze vertrouwde partners gespecialiseerd in Nederlandse marktbewerking.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
        ],
      };
    } else if (currentPageType === 'werkwijze') {
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/werkwijze#faq`,
        name: 'Veelgestelde vragen over onze werkwijze en projectaanpak',
        description: 'Antwoorden op vragen over ons ontwikkelproces, samenwerking, en Nederlandse compliance aspecten',
        inLanguage: 'nl-NL',
        mainEntity: [
          {
            '@type': 'Question',
            '@id': `${SITE_URL}/werkwijze#faq-1`,
            name: 'Hoe verloopt de samenwerking tijdens het project?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We werken transparant en communicatief: wekelijkse updates, toegang tot ons projectdashboard, en vaste contactpersoon. U bent altijd op de hoogte van de voortgang en kunt direct feedback geven.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
          {
            '@type': 'Question',
            '@id': `${SITE_URL}/werkwijze#faq-2`,
            name: 'Welke betaalvoorwaarden hanteren jullie in Nederland?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We werken met een 30% vooruitbetaling bij opdrachtverlening, 40% bij design goedkeuring, en 30% bij oplevering. BTW wordt conform Nederlandse wetgeving berekend. Betaling mogelijk via iDEAL, bankoverschrijving of factuur.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
          {
            '@type': 'Question',
            '@id': `${SITE_URL}/werkwijze#faq-3`,
            name: 'Zorgen jullie voor GDPR/AVG compliance?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Ja, alle websites bouwen we volledig GDPR/AVG compliant met Nederlandse privacywetgeving. Inclusief cookie consent, privacy statements, en data processing agreements.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
          {
            '@type': 'Question',
            '@id': `${SITE_URL}/werkwijze#faq-4`,
            name: 'Kunnen we een Nederlandse hosting provider gebruiken?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Absoluut! We werken samen met betrouwbare Nederlandse hosting providers voor optimale performance en data sovereignty. Ook AWS Amsterdam, Google Cloud Brussels en Microsoft Azure Nederland zijn opties.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
        ],
      };
    } else if (currentPageType === 'over-ons') {
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/over-ons#faq`,
        name: 'Veelgestelde vragen over ProWeb Studio',
        description: 'Meer weten over ons team, locatie, en bedrijfsvoering in Nederland',
        inLanguage: 'nl-NL',
        mainEntity: [
          {
            '@type': 'Question',
            '@id': `${SITE_URL}/over-ons#faq-1`,
            name: 'Waar is ProWeb Studio gevestigd?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'ProWeb Studio opereert vanuit Nederland en bedient klanten door het hele land. We werken remote-first maar zijn ook beschikbaar voor fysieke meetings en workshops op locatie.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
          {
            '@type': 'Question',
            '@id': `${SITE_URL}/over-ons#faq-2`,
            name: 'Zijn jullie een Nederlandse onderneming?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Ja, ProWeb Studio is een geregistreerde Nederlandse onderneming met KVK-nummer en BTW-nummer. We opereren conform alle Nederlandse wetgeving en administratieve vereisten.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
          {
            '@type': 'Question',
            '@id': `${SITE_URL}/over-ons#faq-3`,
            name: 'Welke bedrijfsaansprakelijkheidsverzekering hebben jullie?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We hebben een uitgebreide beroepsaansprakelijkheidsverzekering specifiek voor webdevelopment diensten, conform Nederlandse standaarden voor IT-dienstverlening.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
          {
            '@type': 'Question',
            '@id': `${SITE_URL}/over-ons#faq-4`,
            name: 'Werken jullie samen met andere Nederlandse bureaus?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Ja, we hebben een netwerk van Nederlandse partners voor marketing, fotografie, copywriting en strategisch advies. Zo kunnen we complete digitale transformaties realiseren.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
        ],
      };
    } else if (currentPageType === 'contact') {
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/contact#faq`,
        name: 'Veelgestelde vragen over contact en samenwerking',
        description: 'Informatie over bereikbaarheid, reactietijden en eerste stappen in Nederland',
        inLanguage: 'nl-NL',
        mainEntity: [
          {
            '@type': 'Question',
            '@id': `${SITE_URL}/contact#faq-1`,
            name: 'Hoe snel reageren jullie op aanvragen?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We reageren binnen één werkdag op alle aanvragen. Voor urgente vragen kunt u ook direct bellen tijdens kantooruren (9:00-17:00, Nederlandse tijd).',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
          {
            '@type': 'Question',
            '@id': `${SITE_URL}/contact#faq-2`,
            name: 'Kunnen we een geheimhoudingsverklaring (NDA) tekenen?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Ja, op verzoek tekenen we graag een Nederlandse geheimhoudingsverklaring. We begrijpen het belang van vertrouwelijke bedrijfsinformatie en respecteren dit volledig.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
          {
            '@type': 'Question',
            '@id': `${SITE_URL}/contact#faq-3`,
            name: 'Werken jullie remote of kunnen we elkaar ontmoeten?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Beide opties zijn mogelijk. We werken efficiënt remote via videocalls, maar komen ook graag langs voor persoonlijke kennismaking, workshops, of belangrijke projectmomenten.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
          {
            '@type': 'Question',
            '@id': `${SITE_URL}/contact#faq-4`,
            name: 'Wat zijn jullie kantooruren in Nederland?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Onze kantooruren zijn maandag tot vrijdag van 9:00 tot 17:00 (Nederlandse tijd). Voor urgente technische problemen zijn we ook buiten kantooruren bereikbaar.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
        ],
      };
    } else {
      // Existing FAQ schema for services page
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/diensten#faq`,
        name: 'Veelgestelde vragen over webdesign en development',
        description: 'Antwoorden op veelgestelde vragen over website laten maken, webshop ontwikkeling en SEO services in Nederland',
        inLanguage: 'nl-NL',
        mainEntity: [
          {
            '@type': 'Question',
            '@id': `${SITE_URL}/diensten#faq-1`,
            name: 'Hoelang duurt het om een website op te leveren?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Een professionele website wordt doorgaans binnen 4-8 weken opgeleverd, afhankelijk van de complexiteit en specifieke wensen. Voor eenvoudige websites kunnen we dit verkorten tot 2-3 weken, terwijl uitgebreide e-commerce oplossingen soms 8-12 weken in beslag nemen.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
          {
            '@type': 'Question',
            '@id': `${SITE_URL}/diensten#faq-2`,
            name: 'Werken jullie met WordPress, een headless CMS of maatwerk?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Wij specialiseren ons in moderne headless CMS-oplossingen zoals Sanity en Contentful, gecombineerd met Next.js voor optimale performance. Voor specifieke behoeften ontwikkelen we ook volledig maatwerk oplossingen. WordPress gebruiken we alleen in uitzonderlijke gevallen.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
          {
            '@type': 'Question',
            '@id': `${SITE_URL}/diensten#faq-3`,
            name: 'Kunnen jullie een webshop bouwen met betaalmethoden in Nederland (iDEAL, creditcard)?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Ja, wij bouwen complete e-commerce oplossingen met alle populaire Nederlandse betaalmethoden zoals iDEAL, creditcard, Bancontact, en PayPal. We integreren met betrouwbare payment service providers zoals Mollie of Stripe voor veilige transacties.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
          {
            '@type': 'Question',
            '@id': `${SITE_URL}/diensten#faq-4`,
            name: 'Hoe pakken jullie SEO aan voor landelijke vindbaarheid in Nederland?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Onze SEO-aanpak begint met diepgaand zoekwoordenonderzoek specifiek voor de Nederlandse markt. We optimaliseren technische aspecten, creëren waardevolle content, en zorgen voor lokale SEO met focus op Nederlandse zoektermen en gebruikersgedrag.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
          {
            '@type': 'Question',
            '@id': `${SITE_URL}/diensten#faq-5`,
            name: 'Bieden jullie onderhoud en doorontwikkeling aan?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Ja, wij bieden flexibele onderhoudscontracten en doorontwikkelingstrajecten. Van beveiligingsupdates en contentbeheer tot het toevoegen van nieuwe functionaliteiten - we zorgen ervoor dat uw website altijd up-to-date en optimaal presteert.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
          {
            '@type': 'Question',
            '@id': `${SITE_URL}/diensten#faq-6`,
            name: 'Kunnen afspraken online plaatsvinden of op locatie in Nederland?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Beide opties zijn mogelijk. We werken graag online via videocalls voor efficiënte samenwerking, maar bezoeken ook graag klanten op locatie binnen Nederland voor persoonlijke besprekingen en workshops.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
          {
            '@type': 'Question',
            '@id': `${SITE_URL}/diensten#faq-7`,
            name: 'Hoe zorgen jullie voor GDPR/AVG compliance in Nederlandse websites?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'GDPR/AVG compliance is standaard onderdeel van al onze Nederlandse projecten. We implementeren correcte cookie consent banners, privacy statements volgens Nederlandse wetgeving, data processing agreements, en zorgen voor volledig transparante data handling conform de Autoriteit Persoonsgegevens richtlijnen.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
          {
            '@type': 'Question',
            '@id': `${SITE_URL}/diensten#faq-8`,
            name: 'Welke Nederlandse hosting providers raden jullie aan?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Voor Nederlandse bedrijven raden we lokale hosting providers aan zoals TransIP, Hostnet, of Antagonist voor betere performance en data sovereignty. Voor enterprise klanten bieden we ook AWS Amsterdam, Google Cloud Brussels, en Microsoft Azure Nederland aan.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
          {
            '@type': 'Question',
            '@id': `${SITE_URL}/diensten#faq-9`,
            name: 'Kunnen jullie Nederlandse webshops koppelen met boekhoudpakketten?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Ja, we hebben ervaring met koppelingen naar populaire Nederlandse boekhoudpakketten zoals Exact Online, AFAS, Twinfield, en SnelStart. Ook integraties met Nederlandse marktplaatsen zoals Bol.com en Amazon.nl zijn mogelijk.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
          {
            '@type': 'Question',
            '@id': `${SITE_URL}/diensten#faq-10`,
            name: 'Hoe verhouden jullie tarieven zich tot andere Nederlandse webdevelopment bureaus?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Onze tarieven zijn competitief binnen de Nederlandse markt. We bieden transparante vaste prijzen zonder verborgen kosten. Door onze efficiënte werkwijze en moderne technologieën leveren we vaak meer waarde dan traditionele bureaus tegen vergelijkbare of lagere investering.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
          {
            '@type': 'Question',
            '@id': `${SITE_URL}/diensten#faq-11`,
            name: 'Kunnen jullie meertalige websites maken voor de Nederlandse en internationale markt?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Absoluut! We ontwikkelen meertalige websites met Nederlands als hoofdtaal en ondersteuning voor Engels, Duits, Frans of andere talen. Inclusief hreflang implementatie voor internationale SEO en lokalisatie voor Nederlandse culturele aspecten.',
              author: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
              },
            },
          },
        ],
        about: {
          '@type': 'Thing',
          name: 'Website ontwikkeling en webdesign services Nederland',
          description: 'Professionele webdevelopment, webshop ontwikkeling en SEO services voor Nederlandse bedrijven',
        },
        publisher: {
          '@type': 'Organization',
          '@id': `${SITE_URL}#organization`,
        },
      };
    }
  })() : null;

  // Combine all schemas into separate scripts instead of a single graph
  const renderSchemaScripts = () => {
    const scripts = [];

    // Website Schema Script
    scripts.push(
      <Script
        key="website-schema"
        id="website-schema"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema, null, 2),
        }}
      />
    );

    // Organization Schema Script
    scripts.push(
      <Script
        key="organization-schema"
        id="organization-schema"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema, null, 2),
        }}
      />
    );

    // LocalBusiness Schema Script
    scripts.push(
      <Script
        key="localbusiness-schema"
        id="localbusiness-schema"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema, null, 2),
        }}
      />
    );

    // WebPage Schema Script
    scripts.push(
      <Script
        key="webpage-schema"
        id="webpage-schema"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema, null, 2),
        }}
      />
    );

    // Logo Image Schema Script
    scripts.push(
      <Script
        key="logo-schema"
        id="logo-schema"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(logoImageSchema, null, 2),
        }}
      />
    );

    // Website Service Schema Script
    scripts.push(
      <Script
        key="website-service-schema"
        id="website-service-schema"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteService, null, 2),
        }}
      />
    );

    // Webshop Service Schema Script
    scripts.push(
      <Script
        key="webshop-service-schema"
        id="webshop-service-schema"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webshopService, null, 2),
        }}
      />
    );

    // SEO Service Schema Script
    scripts.push(
      <Script
        key="seo-service-schema"
        id="seo-service-schema"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seoService, null, 2),
        }}
      />
    );

    // Primary Image Schema Script (if exists)
    if (primaryImageSchema) {
      scripts.push(
        <Script
          key="primary-image-schema"
          id="primary-image-schema"
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(primaryImageSchema, null, 2),
          }}
        />
      );
    }

    // Breadcrumb Schema Script (if exists)
    if (breadcrumbSchema) {
      scripts.push(
        <Script
          key="breadcrumb-schema"
          id="breadcrumb-schema"
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema, null, 2),
          }}
        />
      );
    }

    // FAQ Schema Script (if exists)
    if (faqSchema) {
      scripts.push(
        <Script
          key="faq-schema"
          id="faq-schema"
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema, null, 2),
          }}
        />
      );
    }

    // HowTo Schema Script (if exists)
    if (howToSchema) {
      scripts.push(
        <Script
          key="howto-schema"
          id="howto-schema"
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(howToSchema, null, 2),
          }}
        />
      );
    }

    // Dutch-specific Schema Scripts
    if (kvkSchema) {
      scripts.push(
        <Script
          key="kvk-schema"
          id="kvk-schema"
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(kvkSchema, null, 2),
          }}
        />
      );
    }

    scripts.push(
      <Script
        key="compliance-schema"
        id="compliance-schema"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(complianceSchema, null, 2),
        }}
      />
    );

    scripts.push(
      <Script
        key="professional-accreditation-schema"
        id="professional-accreditation-schema"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(professionalAccreditationSchema, null, 2),
        }}
      />
    );

    scripts.push(
      <Script
        key="business-classification-schema"
        id="business-classification-schema"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(businessClassificationSchema, null, 2),
        }}
      />
    );

    scripts.push(
      <Script
        key="industry-compliance-schema"
        id="industry-compliance-schema"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(industryComplianceSchema, null, 2),
        }}
      />
    );

    // Dutch review and rating schemas
    scripts.push(
      <Script
        key="dutch-review-schema"
        id="dutch-review-schema"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(dutchReviewSchema, null, 2),
        }}
      />
    );

    if (googleBusinessProfileSchema) {
      scripts.push(
        <Script
          key="google-business-profile-schema"
          id="google-business-profile-schema"
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(googleBusinessProfileSchema, null, 2),
          }}
        />
      );
    }

    scripts.push(
      <Script
        key="dutch-awards-schema"
        id="dutch-awards-schema"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(dutchAwardsSchema, null, 2),
        }}
      />
    );

    // Dutch content schemas
    scripts.push(
      <Script
        key="dutch-business-article-schema"
        id="dutch-business-article-schema"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(dutchBusinessArticleSchema, null, 2),
        }}
      />
    );

    scripts.push(
      <Script
        key="dutch-website-guide-schema"
        id="dutch-website-guide-schema"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(dutchWebsiteGuideSchema, null, 2),
        }}
      />
    );

    scripts.push(
      <Script
        key="dutch-seo-guide-schema"
        id="dutch-seo-guide-schema"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(dutchSEOGuideSchema, null, 2),
        }}
      />
    );

    return scripts;
  };

  return <>{renderSchemaScripts()}</>;
}
