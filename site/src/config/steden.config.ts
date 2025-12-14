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
  // NEW SEO FIELDS
  digitalEconomy: string;
  localIndustries: string[];
  uniqueSellingPoint: string;
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
    digitalEconomy: 'Amsterdam is de onbetwiste tech-hoofdstad van Europa. Met een ecosysteem dat bruist van unicorns (zoals Ayden en Booking.com), creatieve bureaus en fintech-startups, ligt de lat hier hoger dan waar ook. De digitale economie in Amsterdam vraagt niet om "gewoon een website", maar om platforms die internationaal kunnen concurreren op snelheid, user experience en brand identity.',
    localIndustries: ['FinTech', 'Creative Industries', 'SaaS & Tech', 'Tourism', 'E-commerce'],
    uniqueSellingPoint: 'In een stad met de hoogste bureau-dichtheid van Nederland onderscheidt u zich alleen met digitale perfectie. Onze 3D-websites geven u die cruciale "Wow-factor" die nodig is om Amsterdams talent en kapitaal aan te trekken.'
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
    digitalEconomy: 'Rotterdam is de stad van doeners en innovatie. De transitie van havenstad naar tech-hub is in volle gang, met plekken als RDM Rotterdam en het Cambridge Innovation Center (CIC) als bewijs. Hier draait het om Smart Port oplossingen, Clean Tech en logistieke innovatie. Uw digitale aanwezigheid moet diezelfde robuustheid en efficiëntie uitstralen.',
    localIndustries: ['Maritime & Logistics', 'Clean Tech', 'Architecture', 'Smart Industry', 'Corporate Services'],
    uniqueSellingPoint: 'Rotterdammers prikken direct door bluf heen. Wij bouwen websites die "niet lullen maar poetsen": razendsnel, technisch onverwoestbaar en gericht op meetbare conversie in plaats van alleen mooie plaatjes.'
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
    digitalEconomy: 'Utrecht is het kloppende hart van de Nederlandse IT-dienstverlening en Gaming industrie. Met de Jaarbeurs en Utrecht Science Park als ankers, heerst hier een klimaat van kennisintensieve innovatie. Het is de gezondste en snelst groeiende regio, waar gebruikersgemak (UX) en toegankelijkheid hoog in het vaandel staan.',
    localIndustries: ['Software & IT', 'Gaming & New Media', 'Health & Life Sciences', 'Business Services', 'Education'],
    uniqueSellingPoint: 'Utrechtse bedrijven opereren vaak op het snijvlak van kennis en commercie. Wij vertalen complexe diensten naar heldere, interactieve websites die uw expert-status direct bevestigen.'
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
    digitalEconomy: 'Den Haag is uniek als Impact City. Hier staat "Tech for Good", cyber security en legal tech centraal. De aanwezigheid van internationale tribunalen, ministeries en ambassades schept een verwachting van autoriteit, veiligheid en meertaligheid. Een website hier moet vertrouwen en statuur uitstralen.',
    localIndustries: ['Cyber Security', 'Legal & GovTech', 'International NGO', 'Impact Economy', 'Hospitality'],
    uniqueSellingPoint: 'Security by design is onze standaard. Voor de Haagse markt bouwen wij digitale vestingen die er elegant uitzien: volledig WCAG-toegankelijk, AVG-proof en voorzien van enterprise-grade beveiliging.'
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
    digitalEconomy: 'Eindhoven Brainport is de slimste regio ter wereld. Hier wordt de toekomst van ASML, Philips en duizenden deep-tech startups gemaakt. De standaard voor digitale presentatie ligt hier torenhoog: als uw product cutting-edge is, mag uw website niet uit 2015 komen. Design en Techniek zijn hier één.',
    localIndustries: ['High Tech Systems', 'Automotive', 'Industrial Design', 'MedTech', 'Manufacturing'],
    uniqueSellingPoint: 'U bouwt de technologie van morgen; wij bouwen uw website. Met onze expertise in WebGL en 3D-rendering visualiseren wij complexe high-tech producten op een manier die investeerders en engineers direct overtuigt.'
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
    digitalEconomy: 'Tilburg transformeert in rap tempo van textielstad naar kennisstad en logistieke hotspot. De Spoorzone en Logistics House zijn trekpleisters voor nieuwe media en e-fulfilment. Tilburgse bedrijven zijn pragmatisch maar ambitieus; ze zoeken schaalbare oplossingen voor groei.',
    localIndustries: ['Logistics & Supply Chain', 'Manufacturing', 'New Media', 'Education', 'SME (MKB)'],
    uniqueSellingPoint: 'Onze e-commerce en corporate websites zijn gebouwd voor groei. Wij snappen de Tilburgse handelsgeest: uw website is geen kostenpost, maar een investering die zichzelf moet terugverdienen via leads en sales.'
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
    digitalEconomy: 'Groningen is de jongste stad van Nederland en "Digital City" van het Noorden. Met de RUG en Hanzehogeschool is er een continue stroom van IT-talent en startups (Founded in Groningen). De focus ligt op Energie, Healthy Ageing en Digital Society. Een website hier moet fris, snel en mobiel-perfect zijn.',
    localIndustries: ['Energy & Sustainability', 'Life Sciences', 'Digital Agencies', 'Education', 'AgriTech'],
    uniqueSellingPoint: 'Wij spreken de taal van de nieuwe generatie. Onze ' + 'mobile-first' + ' aanpak en PWA-technologieën zorgen ervoor dat u de jonge, digitaal-geletterde doelgroep in Groningen perfect bereikt.'
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
    digitalEconomy: 'Almere is pionier in moderne stadsontwikkeling en duurzaamheid. Het is een magneet voor forenzen en nieuwe ondernemers die de ruimte zoeken buiten Amsterdam. De economie is jong, divers en sterk gericht op constructie, retail en zakelijke dienstverlening. Online zichtbaarheid is cruciaal om niet te verdwijnen in de schaduw van de hoofdstad.',
    localIndustries: ['Construction & Real Estate', 'Retail & E-commerce', 'Business Services', 'ICT', 'Logistics'],
    uniqueSellingPoint: 'Schaalbaarheid is key in Almere. Wij bouwen modulaire Next.js websites die moeiteloos met uw bedrijf meegroeien, van lokale starter tot nationale speler. Geen limieten aan uw digitale ambitie.'
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
    digitalEconomy: 'Breda excelleert in Applied Technology en Creatieve Industrie (Game City). Het is een logistiek knooppunt tussen Rotterdam en Antwerpen, maar ook een stad van levensgenieters. Digitalisering in Breda betekent: processen optimaliseren aan de achterkant, maar de  klantbeleving warm en persoonlijk houden aan de voorkant.',
    localIndustries: ['Logistics', 'Gaming & Robotics', 'Hospitality', 'Retail', 'Maintenance'],
    uniqueSellingPoint: 'Wij brengen de "Bredase kwaliteit van leven" naar het scherm. Door storytelling en sfeervolle interacties (micro-animaties) zorgen we dat bezoekers niet alleen kijken, maar zich thuis voelen op uw website.'
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
    digitalEconomy: 'Nijmegen is de Health & High Tech hotspot van Gelderland. Met Novio Tech Campus en Radboudumc, focust de regio op Semiconductor, Health en Chip Integration. Hier wordt gewerkt aan innovaties die de wereld veranderen. Uw website moet die wetenschappelijke autoriteit en precisie weerspiegelen.',
    localIndustries: ['Health & High Tech', 'Semiconductors', 'Education & Research', 'Public Sector', 'Culture'],
    uniqueSellingPoint: 'Voor de Nijmeegse kenniseconomie is accuratesse en snelheid vitaal. Wij bouwen razendsnelle, statische gegenereerde sites (SSG) die complexe informatie kristalhelder presenteren aan een kritisch publiek.'
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
    digitalEconomy: 'Haarlem heeft een sterke reputatie in de media- en uitgeverijsector, en groeit als vestigingsplaats voor hoogwaardige zakelijke dienstverlening en niche-retail. Het publiek is koopkrachtig en kwaliteitsbewust. Een standaard template werkt hier niet; esthetiek en gebruiksgemak (UX) moeten van "boutique" niveau zijn.',
    localIndustries: ['Media & Publishing', 'High-end Retail', 'Cultural Sector', 'Business Services', 'Tourism'],
    uniqueSellingPoint: 'Esthetiek staat voorop in Haarlem. Ons team van designers en 3D-artists creëert digitale kunstwerken die naadloos aansluiten bij de verfijnde smaak van uw Haarlemse clientèle.'
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
    digitalEconomy: 'Arnhem is Energy City en Modestad. Industriepark Kleefse Waard (IPKW) is broedplaats voor clean mobility en energie-tech, terwijl ArtEZ zorgt voor een constante stroom creatieven. De synergie tussen techniek en design is hier de norm. Uw website moet "Sustainable Chic" zijn: groen gehost, efficiënt gecodeerd, prachtig ontworpen.',
    localIndustries: ['Energy & Environmental Tech', 'Fashion & Design', 'E-commerce', 'Consultancy', 'Manufacturing'],
    uniqueSellingPoint: 'Wij spreken zowel de taal van de engineer als de designer. Onze websites zijn technisch geoptimaliseerd voor minimale CO2-footprint (Green Web) en voorzien van high-end visualisaties die passen bij Arnhems design-DNA.'
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
    digitalEconomy: 'Amersfoort is de ideale uitvalsbasis voor landelijke spelers. Het is een sterke groeistad met focus op Geo-informatie, zakelijke dienstverlening en hoofdkantoren van grote retailers en corporaties. Betrouwbaarheid, bereikbaarheid en data-integratie zijn sleutelwoorden. Uw website moet functioneren als een centraal hub voor uw organisatie.',
    localIndustries: ['Geo-ICT', 'Corporate Headquarters', 'Healthcare', 'Logistics', 'Financial Services'],
    uniqueSellingPoint: 'Voor Amersfoortse hubs bouwen wij integratie-vriendelijke platforms. Onze Headless CMS oplossingen koppelen naadloos met uw CRM, ERP of voorraadbeheer, zodat uw website het centrale zenuwstelsel van uw bedrijf wordt.'
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
    digitalEconomy: 'De Zaanstreek is een powerhouse van Food & Industry. Hier zitten wereldspelers in cacao en logistiek naast hypermoderne maakindustrie. De mentaliteit is: hard werken en kwaliteit leveren. Websites moeten hier niet "fancy" doen, maar presteren. B2B leadgeneratie en employer branding (personeel werven) zijn top prioriteiten.',
    localIndustries: ['Food Industry', 'Manufacturing', 'Wholesale', 'Construction', 'Process Tech'],
    uniqueSellingPoint: 'Wij helpen de Zaanse industrie digitaliseren. Van B2B portalen tot wervingssites: wij bouwen robuuste online tools die uw sales teams ondersteunen en technisch personeel aantrekken.'
  },
  {
    name: 'Den Bosch',
    slug: 'den-bosch',
    region: 'Brabant',
    province: 'Noord-Brabant',
    population: 157486,
    description: 'Bourgondische gastvrijheid, digitale innovatie. Van de Sint-Janskathedraal tot het Paleisquartier, van de Tramkade tot de binnenstad - Den Bosch combineert historie met data-driven ondernemerschap. Wij bouwen websites, webshops en 3D-ervaringen die net zo karaktervol zijn als de stad zelf. Voor horeca, retail, en data-science startups (JADS). Razendsnelle techniek verpakt in sfeervol design. Omdat een Bossche bol ook niet alleen maar lucht is.',
    shortDescription: 'Websites, webshops en 3D-ervaringen voor Den Bosch - karaktervol en innovatief.',
    nearbySteden: ['tilburg', 'eindhoven', 'nijmegen', 'oss'],
    keywords: ['website laten maken den bosch', 'webdesign den bosch', 'website s-hertogenbosch', 'webshop den bosch', 'seo den bosch'],
    coordinates: { lat: 51.6978, lng: 5.3037 },
    digitalEconomy: 'Den Bosch is de Data-stad van Brabant, home van JADS (Data Science Academy) en toonaangevende ICT-dienstverleners. Maar het is óók een stad van retail en gastvrijheid. De kunst is om Big Data te combineren met een warme "human touch". Uw website moet slim zijn aan de achterkant, maar vriendelijk aan de voorkant.',
    localIndustries: ['Data Science & IT', 'Public Sector', 'Retail & Hospitality', 'Construction', 'Marketing Agencies'],
    uniqueSellingPoint: 'Wij maken big data menselijk. Voor de Bossche markt ontwikkelen wij websites met slimme personalisatie en data-visualisaties, verpakt in een warm, uitnodigend design dat past bij de Brabantse gastvrijheid.'
  },
  {
    name: 'Zwolle',
    slug: 'zwolle',
    region: 'Oost-Nederland',
    province: 'Overijssel',
    population: 130668,
    description: 'Hanzestad met digitale handelsgeest. Van de Peperbus tot het Hanzeland, van de Diezerstraat tot Hessenpoort - Zwolle is de economische motor van de regio. Wij bouwen websites, webshops en 3D-ervaringen die deZwollenaar aanspreken: nuchter, betrouwbaar, maar met ambitie. Voor logistiek, e-commerce, maakindustrie en dienstverlening. Geavanceerde techniek zonder gedoe. Uw digitale visitekaartje voor heel Noordoost-Nederland.',
    shortDescription: 'Websites, webshops en 3D-platforms voor Zwolle - Hanzestad innovatie.',
    nearbySteden: ['amsterdam', 'groningen', 'amersfoort', 'arnhem'],
    keywords: ['website laten maken zwolle', 'webdesign zwolle', 'website zwolle', 'webshop zwolle', 'seo zwolle'],
    coordinates: { lat: 52.5168, lng: 6.0830 },
    digitalEconomy: 'Regio Zwolle is de vierde economische topregio van Nederland. Een knooppunt van transport, kunststoffen (Polymer Science) en e-commerce. Zwolse ondernemers zijn aanpakkers die groeien door samenwerking. Uw website moet functioneel, snel en extreem gebruiksvriendelijk zijn om deze doelgroep te overtuigen.',
    localIndustries: ['Logistics & Transport', 'E-commerce', 'Polymer & Manufacturing', 'Business Services', 'Healthcare'],
    uniqueSellingPoint: 'Wij spreken de taal van de Hanzestad 2.0. Geen loze beloftes, maar meetbaar resultaat. Onze conversie-gerichte websites zijn de perfecte digitale motor voor Zwolse handelsondernemingen die willen opschalen.'
  },
];

/**
 * Get all available services for any city
 * ALL services are available in ALL cities (universal availability)
 * 
 * @param _stadSlug - City slug (unused, kept for API consistency)
 * @returns Array of all service slugs from diensten.config.ts
 */
export function getServicesForStad(): string[] {
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
