/**
 * CityService Fixtures
 * 
 * City-specific service overrides and customizations.
 * Contains fixtures for 5 cities × 3 services = 15 combinations.
 * 
 * @module cms/fixtures/city-services
 */

import type { CityService } from '../schema';

/**
 * CityService fixtures - 15 city × service combinations
 */
export const cityServiceFixtures: Omit<CityService, 'createdAt' | 'updatedAt'>[] = [
  // Amsterdam × Website Laten Maken
  {
    id: 'cs1-amsterdam-website',
    cityId: 'c1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6',
    citySlug: 'amsterdam',
    serviceId: 's1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6',
    serviceSlug: 'website-laten-maken',
    titleOverride: 'Website Laten Maken Amsterdam | Top Webdesign Bureau',
    localBenefits: [
      'Lokale kennismaking mogelijk op centrale locatie',
      'Bekend met Amsterdamse bedrijfscultuur',
      'Netwerk van Amsterdamse fotografen en copywriters',
      'Expertise in meertalige websites voor internationale markt',
    ],
    localExamples: [
      'Startup websites voor Amsterdam Science Park',
      'Horeca websites voor de Jordaan',
      'Corporate websites voor Zuidas bedrijven',
      'E-commerce platforms voor Amsterdamse retailers',
    ],
    localFaqs: [
      {
        question: 'Waarom een lokaal webdesign bureau in Amsterdam kiezen?',
        answer: 'Een lokaal bureau kent de Amsterdamse markt, kan persoonlijke meetings organiseren in de stad, en begrijpt de diversiteit van bedrijven - van startups in Noord tot corporate op de Zuidas. We spreken uw taal en kennen de lokale concurrentie.',
      },
    ],
    projectCount: 87,
    marketInsights: {
      competitionLevel: 'high',
      averageProjectValue: 4200,
      popularServices: ['Corporate websites', 'Startup landing pages', 'Meertalige platforms'],
      localTrends: ['Internationale focus', 'Moderne, minimalistisch design', 'Multi-language support'],
    },
    isAvailable: true,
    additionalKeywords: [
      'webdesign bureau amsterdam',
      'website laten maken amsterdam centrum',
      'webdeveloper amsterdam',
    ],
    localAngle: 'Internationale hoofdstad met diverse bedrijven vraagt om professionele, meertalige websites',
    citySpecificChallenges: [
      'Hoge concurrentie in zoekmachine resultaten',
      'Noodzaak voor meertalige content',
      'Internationale doelgroep bereiken',
    ],
    priority: 95,
    featured: true,
  },
  // Amsterdam × Webshop Laten Maken
  {
    id: 'cs2-amsterdam-webshop',
    cityId: 'c1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6',
    citySlug: 'amsterdam',
    serviceId: 's2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7',
    serviceSlug: 'webshop-laten-maken',
    titleOverride: 'Webshop Laten Maken Amsterdam | E-commerce Specialist',
    localBenefits: [
      'Kennis van Amsterdamse retail trends',
      'Integratie met lokale bezorgdiensten',
      'Expertise in internationale verzending',
      'Contacten met lokale productiefotografen',
    ],
    localExamples: [
      'Fashion webshops voor PC Hooftstraat retailers',
      'Design webshops voor Jordaan kunstenaars',
      'Food & beverage shops voor lokale producenten',
      'Tourist merchandise shops',
    ],
    projectCount: 63,
    marketInsights: {
      competitionLevel: 'high',
      averageProjectValue: 7800,
      popularServices: ['Fashion & lifestyle webshops', 'Kunstgalerij webshops', 'Food delivery platforms'],
      localTrends: ['Duurzaamheid', 'Lokale producten', 'Same-day delivery'],
    },
    isAvailable: true,
    waitingList: false,
    priority: 90,
    featured: true,
  },
  // Amsterdam × SEO Optimalisatie
  {
    id: 'cs3-amsterdam-seo',
    cityId: 'c1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6',
    citySlug: 'amsterdam',
    serviceId: 's3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8',
    serviceSlug: 'seo-optimalisatie',
    titleOverride: 'SEO Optimalisatie Amsterdam | Hoger in Google',
    localBenefits: [
      'Lokale SEO voor Amsterdam Noord, Zuid, West, Oost',
      'Google My Business optimalisatie per stadsdeel',
      'Kennis van Amsterdamse zoekgedrag',
      'Meertalige SEO voor internationale bezoekers',
    ],
    localExamples: [
      'Horeca SEO voor restaurants in centrum',
      'Retail SEO voor winkels in 9 Straatjes',
      'B2B SEO voor Zuidas kantoren',
      'Toerisme SEO voor hotels en attracties',
    ],
    projectCount: 94,
    marketInsights: {
      competitionLevel: 'high',
      averageProjectValue: 650,
      popularServices: ['Lokale SEO per stadsdeel', 'Meertalige SEO', 'E-commerce SEO'],
      localTrends: ['Voice search optimalisatie', 'Mobile-first', 'Video content SEO'],
    },
    isAvailable: true,
    waitingList: false,
    priority: 92,
    featured: true,
  },
  // Rotterdam × Website Laten Maken
  {
    id: 'cs4-rotterdam-website',
    cityId: 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6',
    citySlug: 'rotterdam',
    serviceId: 's1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6',
    serviceSlug: 'website-laten-maken',
    titleOverride: 'Website Laten Maken Rotterdam | Webdesign Havenstad',
    localBenefits: [
      'No-nonsense Rotterdamse aanpak',
      'Ervaring met maritieme en logistieke sector',
      'Expertise in industriële B2B websites',
      'Snelle communicatie en pragmatische oplossingen',
    ],
    localExamples: [
      'Logistieke bedrijven in havengebied',
      'Architectuur bureaus rond Centraal Station',
      'Horeca websites voor Witte de Withstraat',
      'Corporate websites voor zakelijke dienstverlening',
    ],
    projectCount: 72,
    marketInsights: {
      competitionLevel: 'medium',
      averageProjectValue: 3800,
      popularServices: ['B2B websites', 'Corporate platforms', 'Portfolio sites'],
      localTrends: ['Industrieel design', 'Functionaliteit boven franje', 'Robuuste systemen'],
    },
    isAvailable: true,
    waitingList: false,
    additionalKeywords: [
      'website laten maken rotterdam centrum',
      'webdesign bureau rotterdam',
      'website rotterdam 010',
    ],
    localAngle: 'Pragmatische havenstad vraagt om robuuste, functionele websites die resultaat leveren',
    priority: 88,
    featured: true,
  },
  // Rotterdam × Webshop Laten Maken
  {
    id: 'cs5-rotterdam-webshop',
    cityId: 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6',
    citySlug: 'rotterdam',
    serviceId: 's2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7',
    serviceSlug: 'webshop-laten-maken',
    titleOverride: 'Webshop Laten Maken Rotterdam | E-commerce 010',
    localBenefits: [
      'Ervaring met groothandel en B2B webshops',
      'Integratie met havengerelateerde logistiek',
      'Kennis van import/export procedures',
      'Pragmatische prijsstelling',
    ],
    localExamples: [
      'B2B groothandel platforms',
      'Bouwmaterialen webshops',
      'Fashion outlets voor Lijnbaan retailers',
      'Design producten van lokale makers',
    ],
    projectCount: 48,
    marketInsights: {
      competitionLevel: 'medium',
      averageProjectValue: 6900,
      popularServices: ['B2B webshops', 'Groothandel platforms', 'Industrial supplies'],
      localTrends: ['Bulk ordering', 'Zakelijke klantaccounts', 'Offerte aanvragen'],
    },
    isAvailable: true,
    waitingList: false,
    priority: 85,
    featured: false,
  },
  // Rotterdam × SEO Optimalisatie
  {
    id: 'cs6-rotterdam-seo',
    cityId: 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6',
    citySlug: 'rotterdam',
    serviceId: 's3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8',
    serviceSlug: 'seo-optimalisatie',
    titleOverride: 'SEO Optimalisatie Rotterdam | Zoekmachine Expert 010',
    localBenefits: [
      'Lokale SEO voor alle Rotterdamse gebieden',
      'B2B SEO expertise',
      'Ervaring met maritieme en logistieke zoekwoorden',
      'Resultaatgerichte aanpak',
    ],
    localExamples: [
      'SEO voor logistieke bedrijven',
      'Lokale SEO voor restaurants en cafés',
      'B2B SEO voor havengerelateerde diensten',
      'Retail SEO voor winkelcentra',
    ],
    projectCount: 81,
    marketInsights: {
      competitionLevel: 'medium',
      averageProjectValue: 575,
      popularServices: ['B2B SEO', 'Lokale SEO', 'Industrial keywords'],
      localTrends: ['Long-tail B2B zoekwoorden', 'Google Maps optimalisatie', 'LinkedIn integratie'],
    },
    isAvailable: true,
    waitingList: false,
    priority: 87,
    featured: false,
  },
  // Utrecht × Website Laten Maken
  {
    id: 'cs7-utrecht-website',
    cityId: 'b1c2d3e4-f5a6-b7c8-d9e0-f1a2b3c4d5e6',
    citySlug: 'utrecht',
    serviceId: 's1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6',
    serviceSlug: 'website-laten-maken',
    titleOverride: 'Website Laten Maken Utrecht | Webdesign Hart van Nederland',
    localBenefits: [
      'Centraal gelegen voor heel Nederland',
      'Expertise in zorg en onderwijs websites',
      'Kennis van jonge, dynamische doelgroep',
      'Ervaring met educatieve platforms',
    ],
    localExamples: [
      'Zorgprofessionals en klinieken',
      'Onderwijsinstellingen en trainers',
      'Adviesbureaus en consultants',
      'Startups en scale-ups',
    ],
    projectCount: 56,
    marketInsights: {
      competitionLevel: 'medium',
      averageProjectValue: 3500,
      popularServices: ['Zorg websites', 'Educatieve platforms', 'Advies websites'],
      localTrends: ['Jonge, moderne uitstraling', 'Toegankelijkheid (WCAG)', 'Online afspraak systemen'],
    },
    isAvailable: true,
    waitingList: false,
    additionalKeywords: [
      'website laten maken utrecht centrum',
      'webdesign utrecht',
      'wordpress website utrecht',
    ],
    localAngle: 'Jonge, centrale stad met focus op zorg, onderwijs en innovatie vraagt om toegankelijke websites',
    priority: 82,
    featured: false,
  },
  // Utrecht × Webshop Laten Maken
  {
    id: 'cs8-utrecht-webshop',
    cityId: 'b1c2d3e4-f5a6-b7c8-d9e0-f1a2b3c4d5e6',
    citySlug: 'utrecht',
    serviceId: 's2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7',
    serviceSlug: 'webshop-laten-maken',
    titleOverride: 'Webshop Laten Maken Utrecht | Online Verkopen Centraal Nederland',
    localBenefits: [
      'Centrale locatie voor bezorging heel Nederland',
      'Ervaring met lifestyle en wellness producten',
      'Kennis van jonge doelgroep',
      'Expertise in subscription modellen',
    ],
    localExamples: [
      'Lifestyle en wellness producten',
      'Lokale food specialties',
      'Duurzame mode en accessoires',
      'Educatieve materialen en boeken',
    ],
    projectCount: 41,
    marketInsights: {
      competitionLevel: 'medium',
      averageProjectValue: 6200,
      popularServices: ['Lifestyle webshops', 'Food & wellness', 'Subscription boxes'],
      localTrends: ['Duurzaamheid', 'Lokale producenten', 'Wellness trend'],
    },
    isAvailable: true,
    waitingList: false,
    priority: 78,
    featured: false,
  },
  // Utrecht × SEO Optimalisatie
  {
    id: 'cs9-utrecht-seo',
    cityId: 'b1c2d3e4-f5a6-b7c8-d9e0-f1a2b3c4d5e6',
    citySlug: 'utrecht',
    serviceId: 's3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8',
    serviceSlug: 'seo-optimalisatie',
    titleOverride: 'SEO Optimalisatie Utrecht | Google Rankings Hart NL',
    localBenefits: [
      'Lokale SEO voor Utrecht en omliggende gemeenten',
      'Expertise in zorg en onderwijs SEO',
      'Kennis van lokale zoektrends',
      'Ervaring met concurrerende markt',
    ],
    localExamples: [
      'Zorgprofessionals vindbaarheid',
      'Onderwijsinstelling rankings',
      'Lokale dienstverleners SEO',
      'Detailhandel Utrechtse binnenstad',
    ],
    projectCount: 68,
    marketInsights: {
      competitionLevel: 'medium',
      averageProjectValue: 525,
      popularServices: ['Lokale SEO', 'Zorg SEO', 'Onderwijs SEO'],
      localTrends: ['Review management', 'Google Maps focus', 'Lokale content marketing'],
    },
    isAvailable: true,
    waitingList: false,
    priority: 80,
    featured: false,
  },
  // Eindhoven × Website Laten Maken
  {
    id: 'cs10-eindhoven-website',
    cityId: 'd1e2f3a4-b5c6-d7e8-f9a0-b1c2d3e4f5a6',
    citySlug: 'eindhoven',
    serviceId: 's1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6',
    serviceSlug: 'website-laten-maken',
    titleOverride: 'Website Laten Maken Eindhoven | Tech & Innovation Webdesign',
    localBenefits: [
      'Begrip van hightech industrie',
      'Ervaring met innovatieve technologieën',
      'Netwerk in Brainport ecosysteem',
      'Expertise in technische B2B websites',
    ],
    localExamples: [
      'Hightech bedrijven op High Tech Campus',
      'Design studios in Strijp-S',
      'Innovatieve startups en scale-ups',
      'Technische dienstverleners',
    ],
    projectCount: 44,
    marketInsights: {
      competitionLevel: 'medium',
      averageProjectValue: 4500,
      popularServices: ['Tech company websites', 'Innovation platforms', 'B2B portals'],
      localTrends: ['Cutting-edge design', 'Tech showcases', 'Innovation storytelling'],
    },
    isAvailable: true,
    waitingList: false,
    additionalKeywords: [
      'website laten maken eindhoven brainport',
      'webdesign eindhoven hightech',
      'website eindhoven 040',
    ],
    localAngle: 'Technologie hoofdstad vraagt om innovatieve, tech-forward websites met wow-factor',
    priority: 84,
    featured: false,
  },
  // Eindhoven × Webshop Laten Maken
  {
    id: 'cs11-eindhoven-webshop',
    cityId: 'd1e2f3a4-b5c6-d7e8-f9a0-b1c2d3e4f5a6',
    citySlug: 'eindhoven',
    serviceId: 's2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7',
    serviceSlug: 'webshop-laten-maken',
    titleOverride: 'Webshop Laten Maken Eindhoven | Innovatieve E-commerce',
    localBenefits: [
      'Ervaring met tech producten en gadgets',
      'Kennis van B2B e-commerce',
      'Expertise in geavanceerde functionaliteit',
      'Begrip van design community',
    ],
    localExamples: [
      'Design producten van lokale makers',
      'Tech gadgets en accessoires',
      'Industrial supplies B2B',
      'Dutch Design webshops',
    ],
    projectCount: 32,
    marketInsights: {
      competitionLevel: 'low',
      averageProjectValue: 7200,
      popularServices: ['Tech e-commerce', 'Design webshops', 'B2B platforms'],
      localTrends: ['Smart product recommendations', 'AR product preview', '3D configurators'],
    },
    isAvailable: true,
    waitingList: false,
    priority: 75,
    featured: false,
  },
  // Eindhoven × SEO Optimalisatie
  {
    id: 'cs12-eindhoven-seo',
    cityId: 'd1e2f3a4-b5c6-d7e8-f9a0-b1c2d3e4f5a6',
    citySlug: 'eindhoven',
    serviceId: 's3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8',
    serviceSlug: 'seo-optimalisatie',
    titleOverride: 'SEO Optimalisatie Eindhoven | Brainport Zichtbaarheid',
    localBenefits: [
      'Expertise in technische B2B zoekwoorden',
      'Kennis van Brainport ecosysteem',
      'Ervaring met innovation marketing',
      'Tech-savvy SEO aanpak',
    ],
    localExamples: [
      'Hightech bedrijven vindbaarheid',
      'Design studio rankings',
      'Innovation consultants SEO',
      'Lokale tech events promotie',
    ],
    projectCount: 47,
    marketInsights: {
      competitionLevel: 'low',
      averageProjectValue: 625,
      popularServices: ['Technical SEO', 'B2B SEO', 'Innovation keywords'],
      localTrends: ['Thought leadership SEO', 'Technical content marketing', 'Innovation storytelling'],
    },
    isAvailable: true,
    waitingList: false,
    priority: 77,
    featured: false,
  },
  // Den Haag × Website Laten Maken
  {
    id: 'cs13-den-haag-website',
    cityId: 'e1f2a3b4-c5d6-e7f8-a9b0-c1d2e3f4a5b6',
    citySlug: 'den-haag',
    serviceId: 's1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6',
    serviceSlug: 'website-laten-maken',
    titleOverride: 'Website Laten Maken Den Haag | Professioneel Webdesign Hofstad',
    localBenefits: [
      'Ervaring met overheid en publieke sector',
      'Kennis van juridische websites',
      'Begrip van formele business cultuur',
      'Expertise in representatieve websites',
    ],
    localExamples: [
      'Advocatenkantoren en juridische diensten',
      'Adviesbureaus en consultancy',
      'Internationale organisaties',
      'Overheidsgerichte bedrijven',
    ],
    projectCount: 58,
    marketInsights: {
      competitionLevel: 'medium',
      averageProjectValue: 4100,
      popularServices: ['Professional services websites', 'Legal websites', 'Corporate platforms'],
      localTrends: ['Formeel en representatief', 'Veiligheid en privacy', 'Meertalig (EN)'],
    },
    isAvailable: true,
    waitingList: false,
    additionalKeywords: [
      'website laten maken den haag centrum',
      'webdesign den haag',
      'website den haag 070',
    ],
    localAngle: 'Internationale stad vraagt om representatieve, betrouwbare websites met formele uitstraling',
    priority: 83,
    featured: false,
  },
  // Den Haag × Webshop Laten Maken
  {
    id: 'cs14-den-haag-webshop',
    cityId: 'e1f2a3b4-c5d6-e7f8-a9b0-c1d2e3f4a5b6',
    citySlug: 'den-haag',
    serviceId: 's2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7',
    serviceSlug: 'webshop-laten-maken',
    titleOverride: 'Webshop Laten Maken Den Haag | E-commerce Hofstad',
    localBenefits: [
      'Expertise in toerisme e-commerce',
      'Kennis van beach lifestyle producten',
      'Ervaring met internationale verzending',
      'Begrip van premium positionering',
    ],
    localExamples: [
      'Beach & surf lifestyle producten',
      'Premium fashion en accessoires',
      'Culturele merchandise',
      'Toerisme gerelateerde producten',
    ],
    projectCount: 36,
    marketInsights: {
      competitionLevel: 'medium',
      averageProjectValue: 6500,
      popularServices: ['Lifestyle webshops', 'Tourism e-commerce', 'Premium products'],
      localTrends: ['Kwaliteit boven kwantiteit', 'Internationale focus', 'Premium uitstraling'],
    },
    isAvailable: true,
    waitingList: false,
    priority: 76,
    featured: false,
  },
  // Den Haag × SEO Optimalisatie
  {
    id: 'cs15-den-haag-seo',
    cityId: 'e1f2a3b4-c5d6-e7f8-a9b0-c1d2e3f4a5b6',
    citySlug: 'den-haag',
    serviceId: 's3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8',
    serviceSlug: 'seo-optimalisatie',
    titleOverride: 'SEO Optimalisatie Den Haag | Professionele Zoekmachine Expert',
    localBenefits: [
      'Ervaring met professional services SEO',
      'Kennis van juridische zoekwoorden',
      'Lokale SEO voor Den Haag en Scheveningen',
      'Expertise in reputatie management',
    ],
    localExamples: [
      'Advocatenkantoren vindbaarheid',
      'Zakelijke dienstverleners rankings',
      'Toerisme en horeca SEO',
      'Internationale organisaties',
    ],
    projectCount: 64,
    marketInsights: {
      competitionLevel: 'medium',
      averageProjectValue: 595,
      popularServices: ['Professional services SEO', 'Legal SEO', 'Tourism SEO'],
      localTrends: ['Reputation management', 'International SEO', 'Professional content'],
    },
    isAvailable: true,
    waitingList: false,
    priority: 79,
    featured: false,
  },
];

/**
 * Get CityService by city and service slugs
 */
export function getCityServiceBySlug(citySlug: string, serviceSlug: string): typeof cityServiceFixtures[0] | undefined {
  return cityServiceFixtures.find(
    cs => cs.citySlug === citySlug && cs.serviceSlug === serviceSlug
  );
}

/**
 * Get all services for a city
 */
export function getServicesForCity(citySlug: string): typeof cityServiceFixtures {
  return cityServiceFixtures.filter(cs => cs.citySlug === citySlug);
}

/**
 * Get all cities offering a service
 */
export function getCitiesForService(serviceSlug: string): typeof cityServiceFixtures {
  return cityServiceFixtures.filter(cs => cs.serviceSlug === serviceSlug);
}

/**
 * Get featured city-service combinations
 */
export function getFeaturedCityServices(): typeof cityServiceFixtures {
  return cityServiceFixtures.filter(cs => cs.featured);
}
