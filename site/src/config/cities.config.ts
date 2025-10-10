/**
 * Unified City Configuration
 * Consolidates city data from multiple sources into a single, canonical source
 */

export interface CityData {
  name: string;
  slug: string;
  region: string;
  population: number;
  description: string;
  relatedServices: string[];
  nearbyLocations: string[];
  keyIndustries: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  characteristics?: string[];
  localTerms?: string[];
}

/**
 * Canonical city data - single source of truth for all city pages
 * This replaces both `locations` from internal-linking.config.ts and `dutchCities` from local-seo.config.ts
 */
export const cities: CityData[] = [
  {
    name: 'Amsterdam',
    slug: 'amsterdam',
    region: 'Noord-Holland',
    population: 872680,
    description: 'Professionele webdesign en ontwikkeling in Amsterdam. Lokale expertise voor Nederlandse bedrijven in de hoofdstad.',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie', '3d-website-ervaringen'],
    nearbyLocations: ['haarlem', 'almere', 'utrecht'],
    keyIndustries: ['financiële dienstverlening', 'toerisme', 'technologie', 'creatieve industrie'],
    coordinates: { lat: 52.3676, lng: 4.9041 },
    characteristics: ['hoofdstad', 'internationale zakelijke hub', 'creatieve industrie', 'startup ecosysteem'],
    localTerms: ['Amsterdamse ondernemers', 'Grachtengordel gebied', 'Zuidas business district']
  },
  {
    name: 'Rotterdam',
    slug: 'rotterdam',
    region: 'Zuid-Holland',
    population: 651446,
    description: 'Webdesign Rotterdam - moderne websites voor bedrijven in de havenstad met innovatieve digitale oplossingen.',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],
    nearbyLocations: ['den-haag', 'dordrecht', 'breda'],
    keyIndustries: ['logistiek', 'scheepvaart', 'petrochemie', 'architectuur'],
    coordinates: { lat: 51.9244, lng: 4.4777 },
    characteristics: ['havenstad', 'logistiek centrum', 'moderne architectuur', 'internationale handel'],
    localTerms: ['Rotterdamse haven', 'Erasmus MC gebied', 'Kop van Zuid']
  },
  {
    name: 'Utrecht',
    slug: 'utrecht',
    region: 'Utrecht',
    population: 361924,
    description: 'Website laten maken Utrecht - centraal gelegen webdesign expertise met focus op kwaliteit en performance.',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie', '3d-website-ervaringen'],
    nearbyLocations: ['amsterdam', 'hilversum', 'amersfoort'],
    keyIndustries: ['onderwijs', 'gezondheidszorg', 'overheid', 'consultancy'],
    coordinates: { lat: 52.0907, lng: 5.1214 },
    characteristics: ['centraal gelegen', 'universiteitsstad', 'knooppunt', 'historisch centrum'],
    localTerms: ['Utrechtse binnenstad', 'Universiteit Utrecht', 'centraal station']
  },
  {
    name: 'Den Haag',
    slug: 'den-haag',
    region: 'Zuid-Holland',
    population: 548320,
    description: 'Webdesign Den Haag - professionele websites voor overheid, internationale organisaties en bedrijfsleven.',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],
    nearbyLocations: ['rotterdam', 'leiden', 'delft'],
    keyIndustries: ['overheid', 'internationale organisaties', 'juridische dienstverlening', 'diplomatie'],
    coordinates: { lat: 52.0705, lng: 4.3007 },
    characteristics: ['regeringszetel', 'internationale stad', 'diplomatiek centrum', 'juridische sector'],
    localTerms: ['Binnenhof', 'Haagse regering', 'internationale zone']
  },
  {
    name: 'Eindhoven',
    slug: 'eindhoven',
    region: 'Noord-Brabant',
    population: 238326,
    description: 'Website ontwikkeling Eindhoven - innovatieve weboplossingen in de technologie-hoofdstad Brainport.',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],
    nearbyLocations: ['tilburg', 'breda', 'helmond'],
    keyIndustries: ['technologie', 'automotive', 'elektronica', 'design'],
    coordinates: { lat: 51.4416, lng: 5.4697 },
    characteristics: ['technologiestad', 'innovatie hub', 'Brainport regio', 'hightech industrie'],
    localTerms: ['Brainport Eindhoven', 'High Tech Campus', 'Philips stad']
  },
  {
    name: 'Tilburg',
    slug: 'tilburg',
    region: 'Noord-Brabant',
    population: 223578,
    description: 'Webdesign Tilburg - kwaliteitswebsites voor bedrijven in Noord-Brabant met focus op gebruiksvriendelijkheid.',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],
    nearbyLocations: ['eindhoven', 'breda', 'den-bosch'],
    keyIndustries: ['onderwijs', 'logistiek', 'dienstverlening', 'cultuur'],
    coordinates: { lat: 51.5555, lng: 5.0913 },
    characteristics: ['universiteitsstad', 'cultureel centrum', 'textielgeschiedenis', 'creatieve industrie'],
    localTerms: ['Tilburg University', 'Spoorzone', 'textielstad']
  },
  {
    name: 'Groningen',
    slug: 'groningen',
    region: 'Groningen',
    population: 235287,
    description: 'Website laten maken Groningen - noordelijke expertise in webdesign met duurzame digitale oplossingen.',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],
    nearbyLocations: ['assen', 'leeuwarden', 'emmen'],
    keyIndustries: ['energie', 'landbouw', 'onderwijs', 'gezondheidszorg'],
    coordinates: { lat: 53.2194, lng: 6.5665 },
    characteristics: ['studentenstad', 'noordelijke centrum', 'gaswinning', 'duurzame energie'],
    localTerms: ['Groninger studenten', 'Martinitoren', 'gaswinning gebied']
  },
  {
    name: 'Almere',
    slug: 'almere',
    region: 'Flevoland',
    population: 218096,
    description: 'Webdesign Almere - moderne websites voor de snelstgroeiende stad van Nederland.',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],
    nearbyLocations: ['amsterdam', 'lelystad', 'hilversum'],
    keyIndustries: ['retail', 'woningbouw', 'dienstverlening', 'gezinsbedrijven'],
    coordinates: { lat: 52.3508, lng: 5.2647 },
    characteristics: ['nieuwste stad', 'snelle groei', 'moderne planning', 'jonge bevolking'],
    localTerms: ['Flevoland polder', 'nieuwe stad', 'moderne architectuur']
  },
  {
    name: 'Breda',
    slug: 'breda',
    region: 'Noord-Brabant',
    population: 184403,
    description: 'Webdesign Breda - strategische weboplossingen voor bedrijven in het hart van Noord-Brabant.',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],
    nearbyLocations: ['tilburg', 'eindhoven', 'rotterdam'],
    keyIndustries: ['defensie', 'voedingsindustrie', 'logistiek', 'onderwijs'],
    coordinates: { lat: 51.5719, lng: 4.7683 },
    characteristics: ['historische stad', 'strategische ligging', 'defensie', 'voedingsindustrie'],
    localTerms: ['Breda nassau', 'historisch centrum', 'defensie stad']
  },
  {
    name: 'Nijmegen',
    slug: 'nijmegen',
    region: 'Gelderland',
    population: 179073,
    description: 'Webdesign Nijmegen - historische stad, moderne websites met een focus op innovatie en duurzaamheid.',
    relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],
    nearbyLocations: ['arnhem', 'den-bosch', 'oss'],
    keyIndustries: ['onderwijs', 'gezondheidszorg', 'onderzoek', 'toerisme'],
    coordinates: { lat: 51.8426, lng: 5.8518 },
    characteristics: ['oudste stad', 'universiteitsstad', 'grens Duitsland', 'groene omgeving'],
    localTerms: ['Radboud Universiteit', 'oudste stad Nederland', 'Waal rivier']
  }
];

/**
 * Get city by slug
 */
export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find(city => city.slug === slug);
}

/**
 * Get nearby cities for a given city
 */
export function getNearbyLocations(citySlug: string): CityData[] {
  const city = getCityBySlug(citySlug);
  if (!city) return [];
  
  return city.nearbyLocations
    .map(slug => getCityBySlug(slug))
    .filter((nearbyCity): nearbyCity is CityData => nearbyCity !== undefined);
}

/**
 * Generate static params for all cities
 */
export function generateStaticParams() {
  return cities.map((city) => ({
    location: city.slug,
  }));
}

/**
 * Get cities by population (for prioritization)
 */
export function getCitiesByPopulation(limit?: number): CityData[] {
  const sorted = cities.sort((a, b) => b.population - a.population);
  return limit ? sorted.slice(0, limit) : sorted;
}

/**
 * Get major cities (population > 200k)
 */
export function getMajorCities(): CityData[] {
  return cities.filter(city => city.population > 200000);
}