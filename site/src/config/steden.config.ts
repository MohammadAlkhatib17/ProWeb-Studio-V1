/**
 * Dutch cities (steden) configuration for dynamic routes
 * Used for /steden/[stad] and /steden/[stad]/[dienst] routes
 */

import { getAllDienstSlugs } from './diensten.config';

export interface Stad {
  name: string;
  slug: string;
  region: string;
  province: string;
  population: number;
  description: string;
  shortDescription: string;
  // relatedServices REMOVED - now dynamically generated
  nearbySteden: string[]; // slugs of nearby cities
  keywords: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * All Dutch cities for which we generate static pages
 * These will be used in generateStaticParams for SSG
 */
export const steden: Stad[] = [
  {
    name: 'Amsterdam',
    slug: 'amsterdam',
    region: 'Randstad',
    province: 'Noord-Holland',
    population: 872680,
    description: 'Website laten maken in Amsterdam door lokale webdesign experts. Professionele websites, webshops en 3D ervaringen voor Amsterdamse bedrijven. Van de Jordaan tot Zuid, van startups tot gevestigde ondernemingen - wij realiseren digitale oplossingen die werken.',
    shortDescription: 'Professionele webdesign en ontwikkeling in Amsterdam voor lokale ondernemers en bedrijven.',
    nearbySteden: ['haarlem', 'almere', 'zaanstad', 'hoofddorp'],
    keywords: ['website laten maken amsterdam', 'webdesign amsterdam', 'website amsterdam', 'webshop amsterdam', 'seo amsterdam'],
    coordinates: { lat: 52.3676, lng: 4.9041 },
  },
  {
    name: 'Rotterdam',
    slug: 'rotterdam',
    region: 'Randstad',
    province: 'Zuid-Holland',
    population: 651446,
    description: 'Website laten maken Rotterdam - moderne webdesign voor bedrijven in de havenstad. Van corporate websites tot innovatieve webshops, wij bouwen digitale platforms die impact maken in Rotterdam en omstreken. Lokale expertise met internationale allure.',
    shortDescription: 'Webdesign Rotterdam - moderne websites voor bedrijven in de havenstad.',
    nearbySteden: ['den-haag', 'schiedam', 'capelle-aan-den-ijssel', 'barendrecht'],
    keywords: ['website laten maken rotterdam', 'webdesign rotterdam', 'website rotterdam', 'webshop rotterdam', 'seo rotterdam'],
    coordinates: { lat: 51.9244, lng: 4.4777 },
  },
  {
    name: 'Utrecht',
    slug: 'utrecht',
    region: 'Randstad',
    province: 'Utrecht',
    population: 361924,
    description: 'Website laten maken Utrecht - centraal gelegen webdesign expertise. Professionele websites voor Utrechtse ondernemers en bedrijven. Van het stadscentrum tot Leidsche Rijn, wij realiseren weboplossingen die bezoekers omzetten in klanten.',
    shortDescription: 'Website ontwikkeling Utrecht - centraal gelegen webdesign expertise.',
    nearbySteden: ['amersfoort', 'nieuwegein', 'zeist', 'houten'],
    keywords: ['website laten maken utrecht', 'webdesign utrecht', 'website utrecht', 'webshop utrecht', 'seo utrecht'],
    coordinates: { lat: 52.0907, lng: 5.1214 },
  },
  {
    name: 'Den Haag',
    slug: 'den-haag',
    region: 'Randstad',
    province: 'Zuid-Holland',
    population: 548320,
    description: 'Website laten maken Den Haag - professionele webdesign voor overheid en bedrijfsleven. Van ministeries tot internationale organisaties en MKB-bedrijven, wij bouwen betrouwbare, veilige websites die voldoen aan de hoogste standaarden.',
    shortDescription: 'Webdesign Den Haag - professionele websites voor overheid en bedrijfsleven.',
    nearbySteden: ['rotterdam', 'delft', 'zoetermeer', 'leiden'],
    keywords: ['website laten maken den haag', 'webdesign den haag', 'website den haag', 'webshop den haag', 'seo den haag'],
    coordinates: { lat: 52.0705, lng: 4.3007 },
  },
  {
    name: 'Eindhoven',
    slug: 'eindhoven',
    region: 'Brabant',
    province: 'Noord-Brabant',
    population: 238326,
    description: 'Website laten maken Eindhoven - innovatieve weboplossingen in Brainport regio. Technologie en design komen samen voor Eindhovense tech bedrijven, startups en scale-ups. Van Strijp-S tot High Tech Campus, wij spreken de taal van innovatie.',
    shortDescription: 'Website ontwikkeling Eindhoven - innovatieve weboplossingen in Brainport.',
    nearbySteden: ['tilburg', 'helmond', 'veldhoven', 'best'],
    keywords: ['website laten maken eindhoven', 'webdesign eindhoven', 'website eindhoven', 'webshop eindhoven', 'seo eindhoven'],
    coordinates: { lat: 51.4416, lng: 5.4697 },
  },
  {
    name: 'Tilburg',
    slug: 'tilburg',
    region: 'Brabant',
    province: 'Noord-Brabant',
    population: 223578,
    description: 'Website laten maken Tilburg - kwaliteitswebsites voor bedrijven in Noord-Brabant. Van lokale ondernemers tot internationale bedrijven, wij bouwen websites die conversie en groei stimuleren voor Tilburgse organisaties.',
    shortDescription: 'Webdesign Tilburg - kwaliteitswebsites voor Noord-Brabantse bedrijven.',
    nearbySteden: ['eindhoven', 'breda', 'den-bosch', 'waalwijk'],
    keywords: ['website laten maken tilburg', 'webdesign tilburg', 'website tilburg', 'webshop tilburg', 'seo tilburg'],
    coordinates: { lat: 51.5555, lng: 5.0913 },
  },
  {
    name: 'Groningen',
    slug: 'groningen',
    region: 'Noord-Nederland',
    province: 'Groningen',
    population: 235287,
    description: 'Website laten maken Groningen - noordelijke webdesign expertise. Professionele websites voor Groningse ondernemers, studenten-startups en gevestigde bedrijven. Van de binnenstad tot Zernike, digitale oplossingen met noordelijk nuchterheid.',
    shortDescription: 'Website laten maken Groningen - noordelijke expertise in webdesign.',
    nearbySteden: ['assen', 'leeuwarden', 'emmen', 'hoogezand'],
    keywords: ['website laten maken groningen', 'webdesign groningen', 'website groningen', 'webshop groningen', 'seo groningen'],
    coordinates: { lat: 53.2194, lng: 6.5665 },
  },
  {
    name: 'Almere',
    slug: 'almere',
    region: 'Flevoland',
    province: 'Flevoland',
    population: 218096,
    description: 'Website laten maken Almere - moderne webdesign voor de snelstgroeiende stad van Nederland. Van Almere Stad tot Poort, wij helpen jonge ondernemers en groeiende bedrijven met professionele websites die impact maken.',
    shortDescription: 'Webdesign Almere - moderne websites voor snelgroeiende ondernemers.',
    nearbySteden: ['amsterdam', 'lelystad', 'hilversum', 'huizen'],
    keywords: ['website laten maken almere', 'webdesign almere', 'website almere', 'webshop almere', 'seo almere'],
    coordinates: { lat: 52.3508, lng: 5.2647 },
  },
  {
    name: 'Breda',
    slug: 'breda',
    region: 'Brabant',
    province: 'Noord-Brabant',
    population: 184403,
    description: 'Website laten maken Breda - professionele weboplossingen in West-Brabant. Voor Bredase ondernemers en bedrijven bouwen wij websites die onderscheidend zijn en resultaten opleveren. Van centrum tot randgemeenten.',
    shortDescription: 'Website ontwikkeling Breda - professionele weboplossingen West-Brabant.',
    nearbySteden: ['tilburg', 'roosendaal', 'etten-leur', 'oosterhout'],
    keywords: ['website laten maken breda', 'webdesign breda', 'website breda', 'webshop breda', 'seo breda'],
    coordinates: { lat: 51.5719, lng: 4.7683 },
  },
  {
    name: 'Nijmegen',
    slug: 'nijmegen',
    region: 'Oost-Nederland',
    province: 'Gelderland',
    population: 179073,
    description: 'Website laten maken Nijmegen - historische stad, moderne websites. Voor Nijmeegse ondernemers, universiteiten en culturele instellingen realiseren wij weboplossingen die traditie en innovatie verbinden.',
    shortDescription: 'Webdesign Nijmegen - historische stad, moderne websites.',
    nearbySteden: ['arnhem', 'den-bosch', 'oss', 'tiel'],
    keywords: ['website laten maken nijmegen', 'webdesign nijmegen', 'website nijmegen', 'webshop nijmegen', 'seo nijmegen'],
    coordinates: { lat: 51.8126, lng: 5.8372 },
  },
  {
    name: 'Haarlem',
    slug: 'haarlem',
    region: 'Randstad',
    province: 'Noord-Holland',
    population: 162543,
    description: 'Website laten maken Haarlem - webdesign voor de bloemenstad. Professionele websites voor Haarlemse ondernemers en creatieve bedrijven. Van historisch centrum tot Schalkwijk, digitale oplossingen met karakter.',
    shortDescription: 'Webdesign Haarlem - professionele websites met karakter.',
    nearbySteden: ['amsterdam', 'heemstede', 'zandvoort', 'bloemendaal'],
    keywords: ['website laten maken haarlem', 'webdesign haarlem', 'website haarlem', 'webshop haarlem', 'seo haarlem'],
    coordinates: { lat: 52.3874, lng: 4.6462 },
  },
  {
    name: 'Arnhem',
    slug: 'arnhem',
    region: 'Oost-Nederland',
    province: 'Gelderland',
    population: 161368,
    description: 'Website laten maken Arnhem - webdesign expertise in Gelderland. Voor Arnhemse bedrijven, mode-ondernemers en tech-startups bouwen wij websites die aandacht trekken en conversie verhogen.',
    shortDescription: 'Website ontwikkeling Arnhem - webdesign expertise in Gelderland.',
    nearbySteden: ['nijmegen', 'apeldoorn', 'ede', 'wageningen'],
    keywords: ['website laten maken arnhem', 'webdesign arnhem', 'website arnhem', 'webshop arnhem', 'seo arnhem'],
    coordinates: { lat: 51.9851, lng: 5.8987 },
  },
  {
    name: 'Amersfoort',
    slug: 'amersfoort',
    region: 'Randstad',
    province: 'Utrecht',
    population: 159896,
    description: 'Website laten maken Amersfoort - strategisch gelegen webdesign diensten. Voor ondernemers tussen Randstad en Veluwe bouwen wij professionele websites die zakelijk succes ondersteunen.',
    shortDescription: 'Webdesign Amersfoort - strategisch gelegen webdesign diensten.',
    nearbySteden: ['utrecht', 'hilversum', 'apeldoorn', 'barneveld'],
    keywords: ['website laten maken amersfoort', 'webdesign amersfoort', 'website amersfoort', 'webshop amersfoort', 'seo amersfoort'],
    coordinates: { lat: 52.1561, lng: 5.3878 },
  },
  {
    name: 'Zaanstad',
    slug: 'zaanstad',
    region: 'Randstad',
    province: 'Noord-Holland',
    population: 156711,
    description: 'Website laten maken Zaanstad - webdesign voor industrie en handel. Van Zaandam tot Wormerveer, professionele websites voor lokale ondernemers in de historische industrieregio.',
    shortDescription: 'Webdesign Zaanstad - professionele websites voor industrie en handel.',
    nearbySteden: ['amsterdam', 'alkmaar', 'purmerend', 'hoorn'],
    keywords: ['website laten maken zaanstad', 'webdesign zaanstad', 'website zaandam', 'webshop zaanstad', 'seo zaanstad'],
    coordinates: { lat: 52.4389, lng: 4.8258 },
  },
  {
    name: 'Den Bosch',
    slug: 'den-bosch',
    region: 'Brabant',
    province: 'Noord-Brabant',
    population: 157486,
    description: 'Website laten maken Den Bosch (\'s-Hertogenbosch) - webdesign in de Brabantse hoofdstad. Voor lokale ondernemers en regionale bedrijven realiseren wij professionele websites die Bourgondische gastvrijheid combineren met digitale innovatie.',
    shortDescription: 'Webdesign Den Bosch - Brabantse webdesign met digitale innovatie.',
    nearbySteden: ['tilburg', 'eindhoven', 'nijmegen', 'oss'],
    keywords: ['website laten maken den bosch', 'webdesign den bosch', 'website s-hertogenbosch', 'webshop den bosch', 'seo den bosch'],
    coordinates: { lat: 51.6978, lng: 5.3037 },
  },
];

/**
 * Get all available services for any city
 * ALL services are available in ALL cities (universal availability)
 * 
 * @param _stadSlug - City slug (unused, kept for API consistency)
 * @returns Array of all service slugs from diensten.config.ts
 */
export function getServicesForStad(_stadSlug?: string): string[] {
  return getAllDienstSlugs();
}

/**
 * Get city by slug
 */
export function getStadBySlug(slug: string): Stad | undefined {
  return steden.find(stad => stad.slug === slug);
}

/**
 * Get nearby cities for a specific city
 */
export function getNearbySteden(stadSlug: string): Stad[] {
  const currentStad = getStadBySlug(stadSlug);
  if (!currentStad) return [];
  
  return steden.filter(stad => 
    currentStad.nearbySteden.includes(stad.slug)
  );
}

/**
 * Get all cities slugs for static generation
 */
export function getAllStadSlugs(): string[] {
  return steden.map(stad => stad.slug);
}

/**
 * Get cities by region
 */
export function getstedenByRegion(region: string): Stad[] {
  return steden.filter(stad => stad.region === region);
}

/**
 * Get popular cities (by population)
 */
export function getPopularSteden(limit: number = 5): Stad[] {
  return [...steden]
    .sort((a, b) => b.population - a.population)
    .slice(0, limit);
}

/**
 * Search cities by name or keywords
 */
export function searchSteden(query: string): Stad[] {
  const lowerQuery = query.toLowerCase();
  return steden.filter(stad => 
    stad.name.toLowerCase().includes(lowerQuery) ||
    stad.slug.includes(lowerQuery) ||
    stad.keywords.some(kw => kw.includes(lowerQuery))
  );
}
