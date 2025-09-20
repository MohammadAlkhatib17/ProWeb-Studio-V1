import Script from 'next/script';
import { siteConfig } from '@/config/site.config';

// Helper function to build absolute URLs safely
const SITE_URL =
  process.env.SITE_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  'https://prowebstudio.nl'; // fallback only for build-time

function abs(path: string): string {
  try {
    return new URL(path, SITE_URL).toString();
  } catch {
    return path.startsWith('http') ? path : `${SITE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }
}

// Helper function to generate breadcrumbs based on pageType
function generateBreadcrumbs(pageType: string): Array<{ name: string; url: string }> {
  const breadcrumbs = [
    { name: 'Home', url: abs('/') }
  ];

  switch (pageType) {
    case 'homepage':
      // Homepage only has itself
      return breadcrumbs;
    
    case 'services':
      breadcrumbs.push({ name: 'Diensten', url: abs('/diensten') });
      break;
    
    case 'werkwijze':
      breadcrumbs.push({ name: 'Werkwijze', url: abs('/werkwijze') });
      break;
    
    case 'over-ons':
      breadcrumbs.push({ name: 'Over ons', url: abs('/over-ons') });
      break;
    
    case 'contact':
      breadcrumbs.push({ name: 'Contact', url: abs('/contact') });
      break;
    
    case 'privacy':
      breadcrumbs.push({ name: 'Privacy', url: abs('/privacy') });
      break;
    
    case 'voorwaarden':
      breadcrumbs.push({ name: 'Voorwaarden', url: abs('/voorwaarden') });
      break;
    
    default:
      // For generic pages, just return Home
      return breadcrumbs;
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
  }>;
  includeFAQ?: boolean;
}

export default function SEOSchema({
  pageType = 'generic',
  pageTitle,
  pageDescription,
  breadcrumbs = [],
  includeFAQ = false,
}: SEOSchemaProps) {
  // Use explicit props with defaults
  const currentPageType = pageType;
  const currentIncludeFAQ = includeFAQ || pageType === 'services';
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

  // Organization schema with optional address
  const addrStreet = process.env.NEXT_PUBLIC_ADDR_STREET;
  const addrCity = process.env.NEXT_PUBLIC_ADDR_CITY;
  const addrZip = process.env.NEXT_PUBLIC_ADDR_ZIP;
  const hasAddress = Boolean(addrStreet && addrCity && addrZip);

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}#organization`,
    name: siteConfig.name,
    alternateName: 'ProWeb Studio Nederland',
    description: siteConfig.description,
    inLanguage: 'nl-NL',
    url: abs('/'),
    logo: abs('/assets/logo/logo-proweb-lockup.svg'),
    image: abs('/assets/logo/logo-proweb-lockup.svg'),
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
      'Website ontwikkeling',
      'Webdesign',
      'SEO optimalisatie',
      '3D websites',
      'React ontwikkeling',
      'Next.js',
      'TypeScript',
      'E-commerce ontwikkeling',
      'Webshop laten maken',
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
        '@type': 'DefinedRegion',
        addressCountry: 'NL',
        addressRegion: 'Drenthe',
      },
      {
        '@type': 'DefinedRegion',
        addressCountry: 'NL',
        addressRegion: 'Flevoland',
      },
      {
        '@type': 'DefinedRegion',
        addressCountry: 'NL',
        addressRegion: 'Friesland',
      },
      {
        '@type': 'DefinedRegion',
        addressCountry: 'NL',
        addressRegion: 'Gelderland',
      },
      {
        '@type': 'DefinedRegion',
        addressCountry: 'NL',
        addressRegion: 'Groningen',
      },
      {
        '@type': 'DefinedRegion',
        addressCountry: 'NL',
        addressRegion: 'Limburg',
      },
      {
        '@type': 'DefinedRegion',
        addressCountry: 'NL',
        addressRegion: 'Noord-Brabant',
      },
      {
        '@type': 'DefinedRegion',
        addressCountry: 'NL',
        addressRegion: 'Noord-Holland',
      },
      {
        '@type': 'DefinedRegion',
        addressCountry: 'NL',
        addressRegion: 'Overijssel',
      },
      {
        '@type': 'DefinedRegion',
        addressCountry: 'NL',
        addressRegion: 'Utrecht',
      },
      {
        '@type': 'DefinedRegion',
        addressCountry: 'NL',
        addressRegion: 'Zeeland',
      },
      {
        '@type': 'DefinedRegion',
        addressCountry: 'NL',
        addressRegion: 'Zuid-Holland',
      },
    ],
    ...(hasAddress && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: addrStreet,
        addressLocality: addrCity,
        postalCode: addrZip,
        addressRegion: 'NH',
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
        availableLanguage: ['Dutch', 'English'],
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
        availableLanguage: ['Dutch', 'English'],
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
        availableLanguage: ['Dutch', 'English'],
      },
    ],
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.github,
      siteConfig.social.twitter,
    ].filter(Boolean),
    potentialAction: {
      '@type': 'ScheduleAction',
      name: 'Afspraak plannen',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: abs('/contact'),
      },
    },
  };

  // Breadcrumb schema (generate from pageType or use provided breadcrumbs)
  const pageBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : generateBreadcrumbs(pageType);
  const breadcrumbSchema = pageBreadcrumbs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}#breadcrumb`,
        itemListElement: pageBreadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.url,
        })),
      }
    : null;

  // WebPage schema
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE_URL}#webpage`,
    name: pageTitle || `${siteConfig.name} - ${siteConfig.tagline}`,
    description: pageDescription || siteConfig.description,
    url: abs('/'),
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
    mainContentOfPage: {
      '@type': 'WebPageElement',
      cssSelector: 'main',
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: abs('/assets/logo/logo-proweb-lockup.svg'),
    },
    ...(currentPageType === 'homepage' && {
      mainEntity: {
        '@id': `${SITE_URL}#organization`,
      },
    }),
    ...(currentPageType === 'services' && {
      mainEntity: {
        '@type': 'Service',
        name: pageTitle || 'Website Development Services',
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
        target: [abs('/')],
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
    telephone: siteConfig.phone,
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
        '@type': 'DefinedRegion',
        addressCountry: 'NL',
        addressRegion: 'Drenthe',
      },
      {
        '@type': 'DefinedRegion',
        addressCountry: 'NL',
        addressRegion: 'Flevoland',
      },
      {
        '@type': 'DefinedRegion',
        addressCountry: 'NL',
        addressRegion: 'Friesland',
      },
      {
        '@type': 'DefinedRegion',
        addressCountry: 'NL',
        addressRegion: 'Gelderland',
      },
      {
        '@type': 'DefinedRegion',
        addressCountry: 'NL',
        addressRegion: 'Groningen',
      },
      {
        '@type': 'DefinedRegion',
        addressCountry: 'NL',
        addressRegion: 'Limburg',
      },
      {
        '@type': 'DefinedRegion',
        addressCountry: 'NL',
        addressRegion: 'Noord-Brabant',
      },
      {
        '@type': 'DefinedRegion',
        addressCountry: 'NL',
        addressRegion: 'Noord-Holland',
      },
      {
        '@type': 'DefinedRegion',
        addressCountry: 'NL',
        addressRegion: 'Overijssel',
      },
      {
        '@type': 'DefinedRegion',
        addressCountry: 'NL',
        addressRegion: 'Utrecht',
      },
      {
        '@type': 'DefinedRegion',
        addressCountry: 'NL',
        addressRegion: 'Zeeland',
      },
      {
        '@type': 'DefinedRegion',
        addressCountry: 'NL',
        addressRegion: 'Zuid-Holland',
      },
    ],
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
        availableLanguage: ['Dutch', 'English'],
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
        availableLanguage: ['Dutch', 'English'],
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
        availableLanguage: ['Dutch', 'English'],
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
        addressRegion: 'NH',
        addressCountry: 'NL',
      },
    }),
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.github,
      siteConfig.social.twitter,
    ].filter(Boolean),
  };

  // Standalone Service nodes for better SEO
  const websiteService = {
    '@context': 'https://schema.org',
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
    offers: {
      '@type': 'Offer',
      '@id': `${SITE_URL}/diensten#website-offer`,
      url: abs('/diensten#website'),
      category: 'service',
      priceCurrency: 'EUR',
      eligibleRegion: 'NL',
      availability: 'https://schema.org/InStock',
    },
  };

  const webshopService = {
    '@context': 'https://schema.org',
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
    offers: {
      '@type': 'Offer',
      '@id': `${SITE_URL}/diensten#webshop-offer`,
      url: abs('/diensten#webshop'),
      category: 'service',
      priceCurrency: 'EUR',
      eligibleRegion: 'NL',
      availability: 'https://schema.org/InStock',
    },
  };

  const seoService = {
    '@context': 'https://schema.org',
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
    offers: {
      '@type': 'Offer',
      '@id': `${SITE_URL}/diensten#seo-offer`,
      url: abs('/diensten#seo'),
      category: 'service',
      priceCurrency: 'EUR',
      eligibleRegion: 'NL',
      availability: 'https://schema.org/InStock',
    },
  };

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

  // FAQ schema for diensten page
  const faqSchema = currentIncludeFAQ ? {
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
  } : null;

  // Combine all schemas into a graph
  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      websiteSchema,
      organizationSchema,
      localBusinessSchema,
      webPageSchema,
      websiteService,
      webshopService,
      seoService,
      ...(breadcrumbSchema ? [breadcrumbSchema] : []),
      ...(faqSchema ? [faqSchema] : []),
      ...(howToSchema ? [howToSchema] : []),
    ],
  };

  return (
    <Script
      id="comprehensive-seo-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaGraph, null, 2),
      }}
    />
  );
}
