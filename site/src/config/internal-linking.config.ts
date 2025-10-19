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
export const locations: LocationPage[] = [
  {
    name: 'Amsterdam',
    slug: 'amsterdam',
    region: 'Noord-Holland',
    population: 872680,
    description: 'Professionele webdesign en ontwikkeling in Amsterdam. Lokale expertise voor Nederlandse bedrijven.',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie', '3d-website-ervaringen'],
    nearbyLocations: ['haarlem', 'almere', 'utrecht']
  },
  {
    name: 'Rotterdam',
    slug: 'rotterdam',
    region: 'Zuid-Holland',
    population: 651446,
    description: 'Webdesign Rotterdam - moderne websites voor bedrijven in de havenstad.',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],
    nearbyLocations: ['den-haag', 'dordrecht', 'breda']
  },
  {
    name: 'Utrecht',
    slug: 'utrecht',
    region: 'Utrecht',
    population: 361924,
    description: 'Website laten maken Utrecht - centraal gelegen webdesign expertise.',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie', '3d-website-ervaringen'],
    nearbyLocations: ['amsterdam', 'hilversum', 'amersfoort']
  },
  {
    name: 'Den Haag',
    slug: 'den-haag',
    region: 'Zuid-Holland',
    population: 548320,
    description: 'Webdesign Den Haag - professionele websites voor overheid en bedrijfsleven.',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],
    nearbyLocations: ['rotterdam', 'leiden', 'delft']
  },
  {
    name: 'Eindhoven',
    slug: 'eindhoven',
    region: 'Noord-Brabant',
    population: 238326,
    description: 'Website ontwikkeling Eindhoven - innovatieve weboplossingen in Brainport.',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],
    nearbyLocations: ['tilburg', 'breda', 'helmond']
  },
  {
    name: 'Tilburg',
    slug: 'tilburg',
    region: 'Noord-Brabant',
    population: 223578,
    description: 'Webdesign Tilburg - kwaliteitswebsites voor bedrijven in Noord-Brabant.',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],
    nearbyLocations: ['eindhoven', 'breda', 'den-bosch']
  },
  {
    name: 'Groningen',
    slug: 'groningen',
    region: 'Groningen',
    population: 235287,
    description: 'Website laten maken Groningen - noordelijke expertise in webdesign.',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],
    nearbyLocations: ['assen', 'leeuwarden', 'emmen']
  },
  {
    name: 'Almere',
    slug: 'almere',
    region: 'Flevoland',
    population: 218096,
    description: 'Webdesign Almere - moderne websites voor de snelstgroeiende stad.',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],
    nearbyLocations: ['amsterdam', 'lelystad', 'hilversum']
  },
  {
    name: 'Breda',
    slug: 'breda',
    region: 'Noord-Brabant',
    population: 184403,
    description: 'Website ontwikkeling Breda - professionele weboplossingen in West-Brabant.',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],
    nearbyLocations: ['tilburg', 'rotterdam', 'bergen-op-zoom']
  },
  {
    name: 'Nijmegen',
    slug: 'nijmegen',
    region: 'Gelderland',
    population: 179073,
    description: 'Webdesign Nijmegen - historische stad, moderne websites.',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],
    nearbyLocations: ['arnhem', 'den-bosch', 'venlo']
  }
];

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
      { title: 'Website Laten Maken Amsterdam', href: '/locaties/amsterdam', priority: 'high' },
      { title: 'Webdesign Rotterdam', href: '/locaties/rotterdam', priority: 'high' },
      { title: 'Website Ontwikkeling Utrecht', href: '/locaties/utrecht', priority: 'high' },
      { title: 'Webdesign Den Haag', href: '/locaties/den-haag', priority: 'medium' },
      { title: 'Website Laten Maken Eindhoven', href: '/locaties/eindhoven', priority: 'medium' },
      { title: 'Alle Locaties', href: '/locaties', priority: 'low' }
    ]
  },
  {
    title: 'Ontdek ProWeb',
    links: [
      { title: 'Nederlandse Webdesign Experts', href: '/over-ons', priority: 'medium' },
      { title: 'Website Ontwikkeling Proces', href: '/werkwijze', priority: 'medium' },
      { title: 'Onze Webdesign Case Studies', href: '/portfolio', priority: 'medium' },
      { title: '3D Website Innovaties', href: '/speeltuin', priority: 'low' },
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
export const contentSuggestions: Record<string, Array<{title: string; href: string; description: string}>> = {
  '/diensten': [
    { title: 'Bekijk Ons Portfolio', href: '/portfolio', description: 'Ontdek voorbeelden van onze professionele websites' },
    { title: 'Onze Werkwijze', href: '/werkwijze', description: 'Leer meer over ons transparante ontwikkelproces' },
    { title: 'Neem Contact Op', href: '/contact', description: 'Start vandaag nog met uw nieuwe website project' }
  ],
  '/portfolio': [
    { title: 'Onze Diensten', href: '/diensten', description: 'Ontdek wat wij voor u kunnen betekenen' },
    { title: 'Speeltuin', href: '/speeltuin', description: 'Ervaar interactieve 3D website elementen' },
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

// Get nearby locations for a specific location
export function getNearbyLocations(currentLocation: string): LocationPage[] {
  const current = locations.find(l => l.slug === currentLocation);
  if (!current) return [];
  
  return locations.filter(l => 
    current.nearbyLocations.includes(l.slug)
  ).slice(0, 3);
}

// Get content suggestions for current page
export function getContentSuggestions(pathname: string): Array<{title: string; href: string; description: string}> {
  return contentSuggestions[pathname] || [];
}