/**
 * Complete Cities Data Source
 * Single source of truth for ALL Dutch city pages
 */

// All services available in every city (online-first approach)
const ALL_SERVICES = [
  'website-laten-maken', 
  'webshop-laten-maken', 
  'seo-optimalisatie', 
  '3d-website-ervaringen', 
  'content-marketing', 
  'ui-ux-design', 
  'conversion-optimalisatie', 
  'onderhoud-support'
];

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
 * ALL Dutch cities - combines existing + missing cities from local-seo.config.ts
 * Complete list of 23 cities for static generation
 */
export const cities: CityData[] = [
  // EXISTING CITIES (from cities.config.ts)
  {
    name: 'Amsterdam',
    slug: 'amsterdam',
    region: 'Noord-Holland',
    population: 872680,
    description: 'Professionele webdesign voor Amsterdam ondernemers - volledig online ontwikkeld met videocalls en digitale samenwerking. Van startup tot corporate, wij bedienen alle Amsterdamse bedrijven met moderne webtechnologieën.',
    relatedServices: ALL_SERVICES,
    nearbyLocations: ['haarlem', 'almere', 'utrecht'],
    keyIndustries: ['financiële dienstverlening', 'toerisme', 'technologie', 'creatieve industrie', 'e-commerce', 'consulting', 'media', 'startup ecosystem'],
    coordinates: { lat: 52.3676, lng: 4.9041 },
    characteristics: ['hoofdstad', 'internationale zakelijke hub', 'creatieve industrie', 'startup ecosysteem', 'fintech centrum', 'scale-up community'],
    localTerms: ['Amsterdamse ondernemers', 'Grachtengordel business', 'Zuidas corporates', 'startup scene', 'tech community']
  },
  {
    name: 'Rotterdam',
    slug: 'rotterdam',
    region: 'Zuid-Holland',
    population: 651446,
    description: 'Webdesign Rotterdam - moderne websites voor bedrijven in de havenstad met innovatieve digitale oplossingen.',
    relatedServices: ALL_SERVICES,
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
    relatedServices: ALL_SERVICES,
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
    relatedServices: ALL_SERVICES,
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
    relatedServices: ALL_SERVICES,
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
    relatedServices: ALL_SERVICES,
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
    relatedServices: ALL_SERVICES,
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
    relatedServices: ALL_SERVICES,
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
    relatedServices: ALL_SERVICES,
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
    relatedServices: ALL_SERVICES,
    nearbyLocations: ['arnhem', 'den-bosch', 'oss'],
    keyIndustries: ['onderwijs', 'gezondheidszorg', 'onderzoek', 'toerisme'],
    coordinates: { lat: 51.8426, lng: 5.8518 },
    characteristics: ['oudste stad', 'universiteitsstad', 'grens Duitsland', 'groene omgeving'],
    localTerms: ['Radboud Universiteit', 'oudste stad Nederland', 'Waal rivier']
  },

  // MISSING CITIES (restored from local-seo.config.ts)
  {
    name: 'Haarlem',
    slug: 'haarlem',
    region: 'Noord-Holland',
    population: 162961,
    description: 'Website laten maken Haarlem - creatieve webdesign voor bloemenstad met rijke geschiedenis.',
    relatedServices: ALL_SERVICES,
    nearbyLocations: ['amsterdam', 'zaanstad', 'heemstede'],
    keyIndustries: ['bloemenhandel', 'toerisme', 'cultuur', 'retail'],
    coordinates: { lat: 52.3874, lng: 4.6462 },
    characteristics: ['bloemenstad', 'historisch centrum', 'culturele hoofdstad', 'museumstad'],
    localTerms: ['Frans Hals Museum', 'Grote Markt', 'bloembollenvelden']
  },
  {
    name: 'Arnhem',
    slug: 'arnhem',
    region: 'Gelderland',
    population: 161368,
    description: 'Webdesign Arnhem - moderne websites voor provinciale hoofdstad met groene omgeving.',
    relatedServices: ALL_SERVICES,
    nearbyLocations: ['nijmegen', 'apeldoorn', 'wageningen'],
    keyIndustries: ['overheid', 'mode', 'toerisme', 'onderwijs'],
    coordinates: { lat: 51.9851, lng: 5.8987 },
    characteristics: ['provinciehoofdstad', 'modestad', 'groene stad', 'historisch'],
    localTerms: ['Airborne Museum', 'Sonsbeek park', 'modestad']
  },
  {
    name: 'Zaanstad',
    slug: 'zaanstad',
    region: 'Noord-Holland',
    population: 156711,
    description: 'Website ontwikkeling Zaanstad - digitale oplossingen voor industriestad in de Zaanstreek.',
    relatedServices: ALL_SERVICES,
    nearbyLocations: ['amsterdam', 'haarlem', 'purmerend'],
    keyIndustries: ['industrie', 'voedingsmiddelen', 'logistiek', 'handel'],
    coordinates: { lat: 52.4689, lng: 4.8177 },
    characteristics: ['industriestad', 'Zaanstreek', 'voedingsindustrie', 'molens'],
    localTerms: ['Zaanse Schans', 'Verkade fabriek', 'industrie erfgoed']
  },
  {
    name: 'Apeldoorn',
    slug: 'apeldoorn',
    region: 'Gelderland',
    population: 165525,
    description: 'Website laten maken Apeldoorn - webdesign voor Kroondomein in het hart van de Veluwe.',
    relatedServices: ALL_SERVICES,
    nearbyLocations: ['arnhem', 'zwolle', 'deventer'],
    keyIndustries: ['toerisme', 'zorg', 'onderwijs', 'overheid'],
    coordinates: { lat: 52.2112, lng: 5.9699 },
    characteristics: ['kroondomein', 'Veluwe', 'groene omgeving', 'koningshuis'],
    localTerms: ['Paleis Het Loo', 'Kroondomein', 'Apenheul']
  },
  {
    name: 'Enschede',
    slug: 'enschede',
    region: 'Overijssel',
    population: 158986,
    description: 'Webdesign Enschede - innovatieve websites voor kennisstad aan de Duitse grens.',
    relatedServices: ALL_SERVICES,
    nearbyLocations: ['hengelo', 'zwolle', 'deventer'],
    keyIndustries: ['technologie', 'onderwijs', 'textiel', 'grenshandel'],
    coordinates: { lat: 52.2215, lng: 6.8937 },
    characteristics: ['kennisstad', 'universiteitsstad', 'textielgeschiedenis', 'grensligging'],
    localTerms: ['Universiteit Twente', 'Roombeek', 'textielmuseum']
  },
  {
    name: 'Haarlemmermeer',
    slug: 'haarlemmermeer',
    region: 'Noord-Holland',
    population: 156039,
    description: 'Website ontwikkeling Haarlemmermeer - moderne weboplossingen voor luchthaven gemeente.',
    relatedServices: ALL_SERVICES,
    nearbyLocations: ['amsterdam', 'haarlem', 'leiden'],
    keyIndustries: ['luchtvaart', 'logistiek', 'bloementeelt', 'internationale handel'],
    coordinates: { lat: 52.3007, lng: 4.6910 },
    characteristics: ['luchthaven gemeente', 'internationale connecties', 'polder', 'logistiek hub'],
    localTerms: ['Schiphol Airport', 'Hoofddorp', 'bloembollen']
  },
  {
    name: 'Amersfoort',
    slug: 'amersfoort',
    region: 'Utrecht',
    population: 158531,
    description: 'Webdesign Amersfoort - strategische websites voor centraal gelegen historische stad.',
    relatedServices: ALL_SERVICES,
    nearbyLocations: ['utrecht', 'hilversum', 'apeldoorn'],
    keyIndustries: ['zorg', 'onderwijs', 'zakelijke dienstverlening', 'logistiek'],
    coordinates: { lat: 52.1561, lng: 5.3878 },
    characteristics: ['historische binnenstad', 'centraal gelegen', 'muurstad', 'knooppunt'],
    localTerms: ['Koppelpoort', 'muurstad', 'historisch centrum']
  },
  {
    name: 'Dordrecht',
    slug: 'dordrecht',
    region: 'Zuid-Holland',
    population: 119300,
    description: 'Website laten maken Dordrecht - webdesign voor oudste stad van Holland met maritiem karakter.',
    relatedServices: ALL_SERVICES,
    nearbyLocations: ['rotterdam', 'breda', 'gorinchem'],
    keyIndustries: ['scheepvaart', 'industrie', 'toerisme', 'onderwijs'],
    coordinates: { lat: 51.8133, lng: 4.6901 },
    characteristics: ['oudste stad Holland', 'maritiem', 'rivieren', 'historisch'],
    localTerms: ['Grote Kerk', 'oudste stad', 'drie rivieren']
  },
  {
    name: 'Leiden',
    slug: 'leiden',
    region: 'Zuid-Holland',
    population: 125174,
    description: 'Webdesign Leiden - academische websites voor universiteitsstad met wereldfaam.',
    relatedServices: ALL_SERVICES,
    nearbyLocations: ['den-haag', 'haarlem', 'alphen'],
    keyIndustries: ['onderwijs', 'onderzoek', 'farmaceutisch', 'biotechnologie'],
    coordinates: { lat: 52.1601, lng: 4.4970 },
    characteristics: ['universiteitsstad', 'kennisstad', 'grachtenstad', 'academisch'],
    localTerms: ['Universiteit Leiden', 'Pieterskerk', 'grachten']
  },
  {
    name: 'Zoetermeer',
    slug: 'zoetermeer',
    region: 'Zuid-Holland',
    population: 125283,
    description: 'Website ontwikkeling Zoetermeer - moderne weboplossingen voor groeiende woonstad.',
    relatedServices: ALL_SERVICES,
    nearbyLocations: ['den-haag', 'delft', 'gouda'],
    keyIndustries: ['wonen', 'zakelijke dienstverlening', 'detailhandel', 'recreatie'],
    coordinates: { lat: 52.0575, lng: 4.4937 },
    characteristics: ['woonstad', 'groeistad', 'moderne architectuur', 'recreatiemogelijkheden'],
    localTerms: ['stadshart', 'Zoetermeerse plas', 'moderne wijk']
  },
  {
    name: 'Zwolle',
    slug: 'zwolle',
    region: 'Overijssel',
    population: 132441,
    description: 'Webdesign Zwolle - strategische websites voor Hanzestad aan de IJssel.',
    relatedServices: ALL_SERVICES,
    nearbyLocations: ['apeldoorn', 'enschede', 'deventer'],
    keyIndustries: ['handel', 'onderwijs', 'zorg', 'overheid'],
    coordinates: { lat: 52.5168, lng: 6.0830 },
    characteristics: ['Hanzestad', 'provinciehoofdstad', 'historisch centrum', 'IJssel'],
    localTerms: ['Sassenpoort', 'Hanzestad', 'IJssel rivier']
  },
  {
    name: 'Maastricht',
    slug: 'maastricht',
    region: 'Limburg',
    population: 121558,
    description: 'Website laten maken Maastricht - Europese webdesign voor oudste stad van Nederland.',
    relatedServices: ALL_SERVICES,
    nearbyLocations: ['heerlen', 'sittard', 'roermond'],
    keyIndustries: ['toerisme', 'onderwijs', 'zorg', 'Europa'],
    coordinates: { lat: 50.8514, lng: 5.6910 },
    characteristics: ['Europese stad', 'oudste stad', 'universiteit', 'internationale flair'],
    localTerms: ['Vrijthof', 'Sint Servaas', 'Europa']
  },
  {
    name: 'Venlo',
    slug: 'venlo',
    region: 'Limburg',
    population: 101797,
    description: 'Webdesign Venlo - grensoverschrijdende websites voor logistieke hoofdstad van Limburg.',
    relatedServices: ALL_SERVICES,
    nearbyLocations: ['roermond', 'helmond', 'weert'],
    keyIndustries: ['logistiek', 'handel', 'tuinbouw', 'grenshandel'],
    coordinates: { lat: 51.3704, lng: 6.1724 },
    characteristics: ['logistieke hub', 'grensstad', 'tuinbouw', 'handel'],
    localTerms: ['Trade Port', 'grenshandel', 'Floriade']
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