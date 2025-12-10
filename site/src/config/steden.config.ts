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
    description: 'Van de Jordaan tot de Zuidas: digitale excellentie voor Amsterdamse bedrijven. Wij realiseren websites, webshops én interactieve 3D-ervaringen die uw merk laten schitteren in de hoofdstad. Of u nu een startup bent aan de Herengracht of een scale-up op de Zuidas - moderne weboplossingen met SEO-optimalisatie, razendsnelle performance en dat typisch Amsterdamse lef. Innovatie ontmoet vakmanschap.',
    shortDescription: 'Websites, webshops en 3D-ervaringen voor Amsterdamse innovators - van Jordaan tot Zuidas.',
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
    description: 'Rotterdamse no-nonsense mentaliteit, wereldklasse resultaten. Van de Koopgoot tot Katendrecht, van de Kop van Zuid tot het World Port Center - wij bouwen websites, webshops en immersieve 3D-ervaringen die werken. Geen poespas, wel innovatie. Maatwerk websites voor havenbedrijven, creatieve bureaus en tech-ondernemers die niet van half werk houden. SEO, branding, en digital design dat impact maakt.',
    shortDescription: 'Websites, webshops en 3D-design voor Rotterdam - no-nonsense, wél innovatie.',
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
    description: 'Centraal in Nederland, centraal in innovatie. Van de Domtoren tot Leidsche Rijn, van het Stationsgebied tot Science Park - Utrechtse bedrijven verdienen websites, webshops en 3D-ervaringen die nét zo dynamisch zijn als de stad zelf. Wij combineren technische perfectie met creatieve vormgeving: razendsnelle laadtijden, zoekmachine-optimalisatie, en designs die converteren. Voor startups, scale-ups én established names.',
    shortDescription: 'Websites, webshops en 3D-ervaringen voor Utrecht - centraal in innovatie.',
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
    description: 'Internationale stad, internationale standaarden. Van het Binnenhof tot Scheveningen, van International Zone tot MKB - Den Haag verdient websites, webshops en 3D-ervaringen op het hoogste niveau. Wij leveren beveiligde, schaalbare digitale oplossingen voor overheidsinstellingen, ambassades, internationale organisaties én lokale ondernemers. AVG-compliant, toegankelijk, en gebouwd met de precisie die past bij de hofstad.',
    shortDescription: 'Websites, webshops en 3D-ervaringen voor Den Haag - internationale kwaliteit.',
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
    description: 'Brainport innovatie, digitaal vertaald. Van Strijp-S tot de High Tech Campus, van de TU/e tot het Automotive Campus - Eindhoven ademt technologie. Wij bouwen websites, webshops en cutting-edge 3D-ervaringen voor tech-startups, design studios en industry leaders. Denk: WebGL animaties, real-time configurators, AR-ready platforms. Want in Eindhoven praat je niet over innovatie - je bouwt het. SEO, branding en performance die past bij Lighttown.',
    shortDescription: 'Websites, webshops en 3D-ervaringen voor Eindhoven - Brainport innovatie.',
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
    description: 'Tilburgse ondernemersgeest, digitaal versterkt. Van Piushaven tot Reeshof, van Tilburg University tot de Spoorzone - wij realiseren websites, webshops en 3D-ervaringen voor bedrijven die verder willen dan de standaard. Brabantse warmte met digitale scherpte: snelle websites, slimme SEO-strategieën, visueel onderscheidende designs. Voor textielindustrie, creatieve sector, tech-startups en alles daartussenin. Kwaliteit zonder opsmuk.',
    shortDescription: 'Websites, webshops en 3D-design voor Tilburg - ondernemersgeest digitaal.',
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
    description: 'Noordelijke nuchterheid, digitale ambitie. Van de Grote Markt tot Zernike Campus, van Suikerunieterrein tot de Ebbingekwartier - Groningen bruist van jong talent en gevestigde ondernemingen. Wij bouwen websites, webshops en innovatieve 3D-ervaringen voor studenten-startups, scale-ups en familiebedrijven. Geen franje, wel resultaat: razendsnelle performance, slimme SEO, en designs die écht converteren. Want noordelijk betekent praktisch, maar zeker niet kleinschalig.',
    shortDescription: 'Websites, webshops en 3D-ervaringen voor Groningen - noordelijke ambitie.',
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
    description: 'Snelstgroeiende stad, snelstgroeiende ambities. Van Almere Stad tot Almere Poort, van het Centrum tot Floriade-terrein - jonge ondernemers en scale-ups verdienen websites, webshops en 3D-ervaringen die even dynamisch zijn als hun stad. Wij bouwen moderne, schaalbare platforms met SEO-optimalisatie, lightning-fast performance en designs die meegroeien met uw succes. Voor retail, tech, creative industries en alles wat Almere zo veelzijdig maakt.',
    shortDescription: 'Websites, webshops en 3D-platforms voor Almere - groei in de snelste stad.',
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
    description: 'Parel van West-Brabant, digitaal schitterend. Van de Grote Markt tot Havenkwartier, van Belcrum tot Bavel - Bredase bedrijven verdienen websites, webshops en 3D-ervaringen die opvallen én converteren. Wij combineren lokale betrokkenheid met internationale expertise: snelle websites, strategische SEO, merkversterkende designs. Voor horeca, retail, events, creative agencies en alle ondernemers die Breda z\'n levendigheid geven. Brabants warm, digitaal scherp.',
    shortDescription: 'Websites, webshops en 3D-design voor Breda - West-Brabantse excellentie.',
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
    description: 'Oudste stad van Nederland, nieuwste digitale technologieën. Van de Waalkade tot de Radboud Campus, van Bottendaal tot de Mariënburg - Nijmegen verbindt historie met innovatie. Wij bouwen websites, webshops en immersieve 3D-ervaringen voor ondernemers, universiteiten, culturele instellingen en tech-startups. Denk: virtual museum tours, e-commerce met AR-preview, campagnesites met WebGL. Traditie respecteren, digitaal excelleren.',
    shortDescription: 'Websites, webshops en 3D-ervaringen voor Nijmegen - historie ontmoet innovatie.',
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
    description: 'Bloemenstad, creative hub. Van de Grote Markt tot Schalkwijk, van het Teylers Museum tot Raaks - Haarlem combineert cultureel erfgoed met creatief ondernemerschap. Wij realiseren websites, webshops en 3D-ervaringen voor galeries, design studios, retail conceptstores en lifestyle brands. Visueel onderscheidend, technisch perfect, strategisch slim. Want Haarlem verdient designs die net zo karaktervol zijn als de stad zelf. SEO, branding, performance.',
    shortDescription: 'Websites, webshops en 3D-design voor Haarlem - bloemenstad, creative hub.',
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
    description: 'Mode, tech en alles daartussenin. Van Korenmarkt tot Klarendal, van de Modekwartier tot Arnhem CS - deze stad ademt creativiteit. Wij bouwen websites, webshops en 3D-ervaringen voor fashion brands, e-commerce ondernemers, design studios en tech-startups. Denk: lookbook experiences met WebGL, AR fitting rooms, high-performance webshops. Arnhems eigenzinnig, digitaal vooruitstrevend. SEO-optimalisatie en conversie-gerichte designs included.',
    shortDescription: 'Websites, webshops en 3D-ervaringen voor Arnhem - mode en tech verenigd.',
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
    description: 'Strategisch gelegen, digitaal excellent. Van de Koppelpoort tot Vathorst, van het Eemkwartier tot het Soesterkwartier - Amersfoort verbindt Randstad met Veluwe, en wij verbinden uw business met digitale groei. Websites, webshops en 3D-ervaringen voor logistiek, B2B, retail en alle sectoren die profiteren van deze centrale ligging. Razendsnelle performance, strategische SEO, designs die converteren. Want centraal betekent bereikbaar - laten we dat digitaal verzilveren.',
    shortDescription: 'Websites, webshops en 3D-platforms voor Amersfoort - strategisch digitaal.',
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
    description: 'Industrieel erfgoed, digitale toekomst. Van Zaandam tot Wormerveer, van de Zaanse Schans tot Inverdan - eeuwenlange ondernemerstraditie verdient 21ste-eeuwse digitale oplossingen. Wij realiseren websites, webshops en 3D-ervaringen voor industrie, maakindustrie, handel en modern ambacht. Van historische molenbedrijven tot tech-startups - allemaal verdienen ze razendsnelle websites met SEO-kracht en designs die converteren. Zaans pragmatisch, wereldwijd zichtbaar.',
    shortDescription: 'Websites, webshops en 3D-ervaringen voor Zaanstad - industrie meets digitaal.',
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
    description: 'Bourgondische gastvrijheid, digitale innovatie. Van de Sint-Janskathedraal tot het Paleisquartier, van de Tramkade tot de binnenstad - Den Bosch combineert historie met data-driven ondernemerschap. Wij bouwen websites, webshops en 3D-ervaringen die net zo karaktervol zijn als de stad zelf. Voor horeca-iconen, zakelijke dienstverleners en creatieve startups. Razendsnelle techniek verpakt in sfeervol design. Omdat een Bossche bol ook niet alleen maar lucht is.',
    shortDescription: 'Websites, webshops en 3D-ervaringen voor Den Bosch - karaktervol en innovatief.',
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
