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
      breadcrumbs.push({ name: 'Over Ons', url: abs('/over-ons') });
      break;
    
    case 'contact':
      breadcrumbs.push({ name: 'Contact', url: abs('/contact') });
      break;
    
    case 'privacy':
      breadcrumbs.push({ name: 'Privacybeleid', url: abs('/privacy') });
      break;
    
    case 'voorwaarden':
      breadcrumbs.push({ name: 'Algemene Voorwaarden', url: abs('/voorwaarden') });
      break;

    case 'speeltuin':
      breadcrumbs.push({ name: 'Speeltuin', url: abs('/speeltuin') });
      break;

    case 'overzicht-site':
      breadcrumbs.push({ name: 'Site Overzicht', url: abs('/overzicht-site') });
      break;

    case 'sitemap':
      breadcrumbs.push({ name: 'Sitemap', url: abs('/sitemap') });
      break;
    
    default:
      // For generic pages, try to extract from current path if available
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname;
        const segments = pathname.split('/').filter(Boolean);
        
        // Dutch route translations for dynamic breadcrumbs
        const routeTranslations: Record<string, string> = {
          'blog': 'Blog',
          'portfolio': 'Portfolio',
          'cases': 'Cases',
          'kennisbank': 'Kennisbank',
          'nieuws': 'Nieuws',
          'tools': 'Tools',
          'downloads': 'Downloads',
        };

        segments.forEach((segment) => {
          const segmentName = routeTranslations[segment] || 
            segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
          breadcrumbs.push({ 
            name: segmentName, 
            url: abs('/' + segments.slice(0, segments.indexOf(segment) + 1).join('/'))
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

  // Organization schema with optional address and identifiers
  const addrStreet = process.env.NEXT_PUBLIC_ADDR_STREET;
  const addrCity = process.env.NEXT_PUBLIC_ADDR_CITY;
  const addrZip = process.env.NEXT_PUBLIC_ADDR_ZIP;
  const hasAddress = Boolean(addrStreet && addrCity && addrZip);
  const kvkNumber = process.env.NEXT_PUBLIC_KVK;
  const btwNumber = process.env.NEXT_PUBLIC_BTW;

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
          name: 'KVK',
          value: kvkNumber,
        },
        ...(btwNumber ? [{
          '@type': 'PropertyValue',
          name: 'BTW',
          value: btwNumber,
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

  // Breadcrumb schema (generate from pageType or use provided breadcrumbs)
  const pageBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : generateBreadcrumbs(pageType);
  const breadcrumbSchema = pageBreadcrumbs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}#breadcrumb`,
        inLanguage: 'nl-NL',
        itemListElement: pageBreadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: {
            '@type': 'WebPage',
            '@id': crumb.url,
            name: crumb.name,
            url: crumb.url,
          },
        })),
        numberOfItems: pageBreadcrumbs.length,
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
        '@id': `${SITE_URL}#breadcrumb`,
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
        addressRegion: 'NH',
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

    return scripts;
  };

  return <>{renderSchemaScripts()}</>;
}
