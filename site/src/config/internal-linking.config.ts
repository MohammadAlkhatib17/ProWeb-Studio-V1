// Internal linking configuration for strategic link distribution
export interface LinkGroup {
  title: string;
  links: Array<{
    title: string;
    href: string;
    description?: string;
    priority?: 'high' | 'medium' | 'low';
  }>;
}

export interface ServiceLink {
  title: string;
  href: string;
  description: string;
  relatedServices: string[];
  targetLocation?: string[];
}

export interface LocationPage {
  name: string;
  slug: string;
  region: string;
  population?: number;
  description: string;
  relatedServices: string[];
  nearbyLocations: string[];
}

// Main services with internal linking opportunities
export const services: ServiceLink[] = [
  {
    title: 'Website Laten Maken',
    href: '/diensten/website-laten-maken',
    description: 'Professionele website ontwikkeling met moderne technologieën',
    relatedServices: ['webshop-laten-maken', 'seo-optimalisatie', '3d-website-ervaringen'],
    targetLocation: ['amsterdam', 'rotterdam', 'utrecht', 'den-haag']
  },
  {
    title: 'Webshop Laten Maken',
    href: '/diensten/webshop-laten-maken',
    description: 'E-commerce platformen met iDEAL integratie en Nederlandse wetgeving',
    relatedServices: ['website-laten-maken', 'seo-optimalisatie', 'onderhoud-support'],
    targetLocation: ['amsterdam', 'rotterdam', 'utrecht', 'eindhoven']
  },
  {
    title: 'SEO Optimalisatie',
    href: '/diensten/seo-optimalisatie',
    description: 'Lokale en nationale SEO voor meer vindbaarheid in Google',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', '3d-website-ervaringen'],
    targetLocation: ['amsterdam', 'rotterdam', 'utrecht', 'den-haag', 'eindhoven']
  },
  {
    title: '3D Website Ervaringen',
    href: '/diensten/3d-website-ervaringen',
    description: 'Interactieve 3D visualisaties en product configurators',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],
    targetLocation: ['amsterdam', 'rotterdam', 'utrecht']
  },
  {
    title: 'Website Onderhoud & Support',
    href: '/diensten/onderhoud-support',
    description: 'Doorlopend onderhoud, updates en technische support',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],
    targetLocation: ['amsterdam', 'rotterdam', 'utrecht', 'den-haag', 'eindhoven']
  }
];

// Dutch locations for local SEO and internal linking
// locations data removed - replaced by steden.config.ts

// Strategic footer link groups for better organization
export const footerLinkGroups: LinkGroup[] = [
  {
    title: 'Diensten',
    links: [
      { title: 'Website Laten Maken', href: '/diensten/website-laten-maken', priority: 'high' },
      { title: 'Webshop Laten Maken', href: '/diensten/webshop-laten-maken', priority: 'high' },
      { title: 'SEO Optimalisatie', href: '/diensten/seo-optimalisatie', priority: 'high' },
      { title: '3D Website Ervaringen', href: '/diensten/3d-website-ervaringen', priority: 'medium' },
      { title: 'Onderhoud & Support', href: '/diensten/onderhoud-support', priority: 'medium' },
      { title: 'Alle Diensten', href: '/diensten', priority: 'medium' }
    ]
  },
  {
    title: 'Locaties',
    links: [
      { title: 'Website Laten Maken Amsterdam', href: '/steden/amsterdam', priority: 'high' },
      { title: 'Webdesign Rotterdam', href: '/steden/rotterdam', priority: 'high' },
      { title: 'Website Ontwikkeling Utrecht', href: '/steden/utrecht', priority: 'high' },
      { title: 'Webdesign Den Haag', href: '/steden/den-haag', priority: 'medium' },
      { title: 'Website Laten Maken Eindhoven', href: '/steden/eindhoven', priority: 'medium' },
      { title: 'Alle Locaties', href: '/steden', priority: 'low' }
    ]
  },
  {
    title: 'Ontdek ProWeb',
    links: [
      { title: 'Nederlandse Webdesign Experts', href: '/over-ons', priority: 'medium' },
      { title: 'Website Ontwikkeling Proces', href: '/werkwijze', priority: 'medium' },
      { title: 'Onze Webdesign Case Studies', href: '/portfolio', priority: 'medium' },
      { title: 'Website Project Starten', href: '/contact', priority: 'high' }
    ]
  },
  {
    title: 'Juridisch',
    links: [
      { title: 'Privacybeleid', href: '/privacy', priority: 'medium' },
      { title: 'Cookiebeleid', href: '/cookiebeleid', priority: 'medium' },
      { title: 'Algemene Voorwaarden', href: '/voorwaarden', priority: 'medium' },
      { title: 'Contact', href: '/contact', priority: 'high' },
      { title: 'Site Overzicht', href: '/overzicht-site', priority: 'low' }
    ]
  }
];

// Content suggestions based on current page
export const contentSuggestions: Record<string, Array<{ title: string; href: string; description: string }>> = {
  '/diensten': [
    { title: 'Bekijk Ons Portfolio', href: '/portfolio', description: 'Ontdek voorbeelden van onze professionele websites' },
    { title: 'Onze Werkwijze', href: '/werkwijze', description: 'Leer meer over ons transparante ontwikkelproces' },
    { title: 'Neem Contact Op', href: '/contact', description: 'Start vandaag nog met uw nieuwe website project' }
  ],
  '/portfolio': [
    { title: 'Onze Diensten', href: '/diensten', description: 'Ontdek wat wij voor u kunnen betekenen' },
    { title: 'Plan Een Gesprek', href: '/contact', description: 'Bespreek uw project ideeën met ons team' }
  ],
  '/over-ons': [
    { title: 'Onze Werkwijze', href: '/werkwijze', description: 'Zo werken wij samen aan uw succes' },
    { title: 'Portfolio Bekijken', href: '/portfolio', description: 'Zie wat wij hebben gerealiseerd voor andere klanten' },
    { title: 'Contact Opnemen', href: '/contact', description: 'Laten we kennismaken en uw visie bespreken' }
  ],
  '/werkwijze': [
    { title: 'Bekijk Ons Werk', href: '/portfolio', description: 'Resultaten van onze bewezen werkwijze' },
    { title: 'Start Uw Project', href: '/contact', description: 'Begin met een vrijblijvend gesprek' },
    { title: 'Onze Diensten', href: '/diensten', description: 'Complete overzicht van onze mogelijkheden' }
  ],
  '/contact': [
    { title: 'Onze Diensten', href: '/diensten', description: 'Wat kunnen wij voor u betekenen?' },
    { title: 'Portfolio Inzien', href: '/portfolio', description: 'Inspiratie voor uw eigen project' },
    { title: 'Werkwijze Begrijpen', href: '/werkwijze', description: 'Hoe wij samen tot resultaat komen' }
  ]
};

// Get related services for a specific service
export function getRelatedServices(currentService: string): ServiceLink[] {
  const current = services.find(s => s.href.includes(currentService));
  if (!current) return [];

  return services.filter(s =>
    current.relatedServices.some(related => s.href.includes(related)) &&
    s.href !== current.href
  ).slice(0, 3);
}

// getNearbyLocations removed - use steden.config.ts functions

// Get content suggestions for current page
export function getContentSuggestions(pathname: string): Array<{ title: string; href: string; description: string }> {
  return contentSuggestions[pathname] || [];
}