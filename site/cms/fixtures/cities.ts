/**
 * City Fixtures
 * 
 * Sample city data for testing and development.
 * Contains 5 major Dutch cities with realistic data.
 * 
 * @module cms/fixtures/cities
 */

import type { City } from '../schema';

/**
 * City fixtures - 5 major Dutch cities
 */
export const cityFixtures: Omit<City, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'c1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6',
    name: 'Amsterdam',
    slug: 'amsterdam',
    region: 'Randstad',
    province: 'Noord-Holland',
    description: 'Amsterdam is de hoofdstad van Nederland en een bruisend centrum van innovatie en technologie. Met een sterke focus op digitalisering en een bloeiende startup-scene biedt de stad uitstekende mogelijkheden voor moderne webdiensten. Van de creatieve bureaus in de Jordaan tot de tech-hubs in Zuid en de financiële sector op de Zuidas - Amsterdam vraagt om professionele digitale oplossingen.',
    shortDescription: 'Hoofdstad van Nederland met bloeiende tech-sector en internationale focus.',
    metaDescription: 'Website laten maken in Amsterdam? Professionele webdesign en ontwikkeling voor Amsterdamse bedrijven. Lokale expertise met internationale allure.',
    coordinates: {
      lat: 52.3676,
      lng: 4.9041,
    },
    postalCodes: ['1011AA', '1012AB', '1015AC', '1071AA', '1077AA', '1091AA'],
    stats: {
      population: 872680,
      businesses: 97500,
      avgIncome: 38400,
      internetPenetration: 98.5,
    },
    neighborhoods: [
      'Centrum',
      'Jordaan',
      'De Pijp',
      'Oud-Zuid',
      'Amsterdam-Noord',
      'Zuidas',
      'Oost',
      'Nieuw-West',
    ],
    landmarks: [
      'Dam',
      'Rijksmuseum',
      'Anne Frank Huis',
      'Vondelpark',
      'Amsterdam Arena',
      'A\'DAM Toren',
    ],
    businessHours: {
      monday: '09:00-17:30',
      tuesday: '09:00-17:30',
      wednesday: '09:00-17:30',
      thursday: '09:00-17:30',
      friday: '09:00-17:00',
      saturday: 'Op afspraak',
      sunday: 'Gesloten',
    },
    localPhonePrefix: '020',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],
    nearbySteden: ['haarlem', 'zaanstad', 'hoofddorp', 'almere'],
    keywords: [
      'website laten maken amsterdam',
      'webdesign amsterdam',
      'webshop amsterdam',
      'seo amsterdam',
      'webdevelopment amsterdam',
      'wordpress amsterdam',
      'online marketing amsterdam',
    ],
    featured: true,
    localCharacteristics: [
      'Internationale oriëntatie',
      'Sterke startup-cultuur',
      'Hoge digitale adoptie',
      'Creatieve industrie',
      'Financiële sector',
      'Toerisme en horeca',
    ],
    targetIndustries: [
      'Technologie & IT',
      'Financiële dienstverlening',
      'Creatieve industrie',
      'E-commerce',
      'Horeca & Toerisme',
      'Zakelijke dienstverlening',
    ],
    isActive: true,
  },
  {
    id: 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6',
    name: 'Rotterdam',
    slug: 'rotterdam',
    region: 'Randstad',
    province: 'Zuid-Holland',
    description: 'Rotterdam is de moderne havenstad van Nederland en staat bekend om zijn zakelijke, no-nonsense mentaliteit. De stad is een economische motor met de grootste haven van Europa, een sterke logistieke sector en groeiende tech-industrie. Rotterdamse bedrijven zoeken pragmatische, robuuste digitale oplossingen die impact maken en meetbare resultaten leveren.',
    shortDescription: 'Moderne havenstad met zakelijke focus en sterke industriële sector.',
    metaDescription: 'Website laten maken Rotterdam? Professionele webdiensten voor bedrijven in de havenstad. Pragmatisch, modern en resultaatgericht.',
    coordinates: {
      lat: 51.9225,
      lng: 4.4792,
    },
    postalCodes: ['3011AA', '3012AB', '3021AC', '3031AA', '3051AA', '3061AA'],
    stats: {
      population: 651446,
      businesses: 68200,
      avgIncome: 32800,
      internetPenetration: 97.2,
    },
    neighborhoods: [
      'Centrum',
      'Delfshaven',
      'Kralingen-Crooswijk',
      'Feijenoord',
      'Noord',
      'Charlois',
      'Hoogvliet',
      'Prins Alexander',
    ],
    landmarks: [
      'Erasmusbrug',
      'Markthal',
      'Euromast',
      'Kubuswoningen',
      'Centraal Station',
      'Witte de Withstraat',
    ],
    businessHours: {
      monday: '08:30-17:30',
      tuesday: '08:30-17:30',
      wednesday: '08:30-17:30',
      thursday: '08:30-17:30',
      friday: '08:30-17:00',
      saturday: 'Op afspraak',
      sunday: 'Gesloten',
    },
    localPhonePrefix: '010',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],
    nearbySteden: ['schiedam', 'capelle-aan-den-ijssel', 'den-haag', 'spijkenisse'],
    keywords: [
      'website laten maken rotterdam',
      'webdesign rotterdam',
      'webshop rotterdam',
      'seo rotterdam',
      'webdevelopment rotterdam',
      'online marketing rotterdam',
      'website rotterdam',
    ],
    featured: true,
    localCharacteristics: [
      'Zakelijke mentaliteit',
      'Logistiek & transport',
      'Moderne architectuur',
      'Multicultureel',
      'Industriële sector',
      'Pragmatische aanpak',
    ],
    targetIndustries: [
      'Logistiek & Transport',
      'Industrie & Productie',
      'Bouw & Architectuur',
      'Zakelijke dienstverlening',
      'Maritieme sector',
      'Retail & E-commerce',
    ],
    isActive: true,
  },
  {
    id: 'b1c2d3e4-f5a6-b7c8-d9e0-f1a2b3c4d5e6',
    name: 'Utrecht',
    slug: 'utrecht',
    region: 'Utrecht',
    province: 'Utrecht',
    description: 'Utrecht is het kloppende hart van Nederland en combineert historische charme met moderne innovatie. Als centrale ontmoetingsplaats voor heel Nederland biedt de stad uitstekende zakelijke mogelijkheden. Met een jonge, hoogopgeleide bevolking, sterke gezondheidszorg- en educatieve sector, en groeiende tech-community is Utrecht een dynamische markt voor professionele webdiensten.',
    shortDescription: 'Centrale ligging en jonge, dynamische zakelijke omgeving met focus op innovatie.',
    metaDescription: 'Website laten maken Utrecht? Professionele webdesign voor het hart van Nederland. Innovatief, bereikbaar en toekomstgericht.',
    coordinates: {
      lat: 52.0907,
      lng: 5.1214,
    },
    postalCodes: ['3511AA', '3512AB', '3521AC', '3531AA', '3541AA', '3551AA'],
    stats: {
      population: 361699,
      businesses: 42800,
      avgIncome: 35600,
      internetPenetration: 98.1,
    },
    neighborhoods: [
      'Binnenstad',
      'Noordoost',
      'Noordwest',
      'Oost',
      'West',
      'Zuid',
      'Zuidwest',
      'Vleuten-De Meern',
      'Leidsche Rijn',
    ],
    landmarks: [
      'Domtoren',
      'Oudegracht',
      'Trajectum Lumen',
      'Centraal Museum',
      'Rietveld Schröder Huis',
      'Hoog Catharijne',
    ],
    businessHours: {
      monday: '09:00-17:30',
      tuesday: '09:00-17:30',
      wednesday: '09:00-17:30',
      thursday: '09:00-17:30',
      friday: '09:00-17:00',
      saturday: 'Op afspraak',
      sunday: 'Gesloten',
    },
    localPhonePrefix: '030',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],
    nearbySteden: ['amersfoort', 'zeist', 'nieuwegein', 'houten'],
    keywords: [
      'website laten maken utrecht',
      'webdesign utrecht',
      'webshop utrecht',
      'seo utrecht',
      'webdevelopment utrecht',
      'online marketing utrecht',
      'website utrecht',
    ],
    featured: true,
    localCharacteristics: [
      'Centrale ligging',
      'Jonge bevolking',
      'Sterke onderwijs sector',
      'Historisch centrum',
      'Groeiende tech-scene',
      'Gezondheids zorg hub',
    ],
    targetIndustries: [
      'Gezondheidszorg',
      'Onderwijs & Training',
      'Technologie & Software',
      'Zakelijke dienstverlening',
      'Detailhandel',
      'Advies & Consultancy',
    ],
    isActive: true,
  },
  {
    id: 'd1e2f3a4-b5c6-d7e8-f9a0-b1c2d3e4f5a6',
    name: 'Eindhoven',
    slug: 'eindhoven',
    region: 'Brabant',
    province: 'Noord-Brabant',
    description: 'Eindhoven is de technologie hoofdstad van Nederland en staat bekend als Brainport regio. De stad is een bruisend centrum van innovatie, design en hightech industrie. Met grote bedrijven als ASML en Philips, en een sterke focus op IoT, AI en smart industry vraagt Eindhoven om geavanceerde, technologisch hoogwaardige digitale oplossingen die aansluiten bij de innovatieve geest van de regio.',
    shortDescription: 'Technologie hoofdstad en Brainport regio met focus op hightech en innovatie.',
    metaDescription: 'Website laten maken Eindhoven? Professionele webdiensten voor Brainport bedrijven. Technologisch hoogwaardig en innovatief.',
    coordinates: {
      lat: 51.4416,
      lng: 5.4697,
    },
    postalCodes: ['5611AA', '5612AB', '5621AC', '5631AA', '5641AA', '5651AA'],
    stats: {
      population: 234456,
      businesses: 28600,
      avgIncome: 34200,
      internetPenetration: 98.8,
    },
    neighborhoods: [
      'Centrum',
      'Woensel',
      'Stratum',
      'Gestel',
      'Strijp',
      'Tongelre',
      'Woensel-West',
    ],
    landmarks: [
      'Strijp-S',
      'Philips Stadium',
      'Evoluon',
      'Van Abbemuseum',
      'High Tech Campus',
      'Glow Festival route',
    ],
    businessHours: {
      monday: '08:30-17:30',
      tuesday: '08:30-17:30',
      wednesday: '08:30-17:30',
      thursday: '08:30-17:30',
      friday: '08:30-17:00',
      saturday: 'Op afspraak',
      sunday: 'Gesloten',
    },
    localPhonePrefix: '040',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],
    nearbySteden: ['helmond', 'best', 'veldhoven', 'son-en-breugel'],
    keywords: [
      'website laten maken eindhoven',
      'webdesign eindhoven',
      'webshop eindhoven',
      'seo eindhoven',
      'webdevelopment eindhoven',
      'online marketing eindhoven',
      'website eindhoven',
    ],
    featured: true,
    localCharacteristics: [
      'Hightech industrie',
      'Innovatie & design',
      'Brainport regio',
      'R&D focus',
      'Smart city initiatieven',
      'Creatieve tech-scene',
    ],
    targetIndustries: [
      'Hightech & Industrie',
      'Technologie & Software',
      'Design & Innovatie',
      'IoT & Smart Systems',
      'Productie & Manufacturing',
      'R&D & Engineering',
    ],
    isActive: true,
  },
  {
    id: 'e1f2a3b4-c5d6-e7f8-a9b0-c1d2e3f4a5b6',
    name: 'Den Haag',
    slug: 'den-haag',
    region: 'Randstad',
    province: 'Zuid-Holland',
    description: 'Den Haag is de internationale stad van vrede en recht, en tevens de bestuurszetel van Nederland. Met talrijke overheidsinstanties, internationale organisaties en juridische kantoren heeft de stad een formele, professionele uitstraling. Haagse bedrijven waarderen betrouwbare, veilige en representatieve digitale oplossingen die aansluiten bij de bestuurlijke en internationale context van de stad.',
    shortDescription: 'Hofstad met internationale focus, overheid en zakelijke dienstverlening.',
    metaDescription: 'Website laten maken Den Haag? Professionele webdiensten voor de internationale stad. Representatief, veilig en betrouwbaar.',
    coordinates: {
      lat: 52.0705,
      lng: 4.3007,
    },
    postalCodes: ['2511AA', '2512AB', '2521AC', '2531AA', '2541AA', '2551AA'],
    stats: {
      population: 545838,
      businesses: 58400,
      avgIncome: 33900,
      internetPenetration: 97.5,
    },
    neighborhoods: [
      'Centrum',
      'Scheveningen',
      'Loosduinen',
      'Segbroek',
      'Laak',
      'Escamp',
      'Haagse Hout',
      'Leidschenveen-Ypenburg',
    ],
    landmarks: [
      'Binnenhof',
      'Vredespaleis',
      'Madurodam',
      'Mauritshuis',
      'Scheveningen Pier',
      'Paleis Noordeinde',
    ],
    businessHours: {
      monday: '09:00-17:30',
      tuesday: '09:00-17:30',
      wednesday: '09:00-17:30',
      thursday: '09:00-17:30',
      friday: '09:00-17:00',
      saturday: 'Op afspraak',
      sunday: 'Gesloten',
    },
    localPhonePrefix: '070',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],
    nearbySteden: ['delft', 'zoetermeer', 'leiden', 'rijswijk'],
    keywords: [
      'website laten maken den haag',
      'webdesign den haag',
      'webshop den haag',
      'seo den haag',
      'webdevelopment den haag',
      'online marketing den haag',
      'website den haag',
    ],
    featured: true,
    localCharacteristics: [
      'Overheid & bestuur',
      'Internationale organisaties',
      'Juridische sector',
      'Diplomatieke aanwezigheid',
      'Formele business cultuur',
      'Culturele instellingen',
    ],
    targetIndustries: [
      'Overheid & Publieke sector',
      'Juridische dienstverlening',
      'Internationale organisaties',
      'Zakelijke dienstverlening',
      'Advies & Consultancy',
      'Toerisme & Horeca',
    ],
    isActive: true,
  },
];

/**
 * Get city by slug
 */
export function getCityBySlug(slug: string): typeof cityFixtures[0] | undefined {
  return cityFixtures.find(city => city.slug === slug);
}

/**
 * Get city by ID
 */
export function getCityById(id: string): typeof cityFixtures[0] | undefined {
  return cityFixtures.find(city => city.id === id);
}

/**
 * Get featured cities
 */
export function getFeaturedCities(): typeof cityFixtures {
  return cityFixtures.filter(city => city.featured);
}

/**
 * Get cities by province
 */
export function getCitiesByProvince(province: string): typeof cityFixtures {
  return cityFixtures.filter(city => city.province === province);
}
