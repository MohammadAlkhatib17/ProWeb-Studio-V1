/**
 * Dutch cities (steden) configuration for dynamic routes
 * Used for /steden/[stad] and /steden/[stad]/[dienst] routes
 */

import { getAllDienstSlugs } from './diensten.config';

/**
 * Service-specific content for granular differentiation
 * Each city can have unique content per service to avoid duplicate pages
 */
export interface ServiceContent {
  localHeadline: string;          // City-specific H2 for this service
  localParagraph: string;         // Unique intro paragraph (200+ words for VIP cities)
  localStats?: string;            // "45% of Amsterdam businesses..." - data point
  localCaseStudy?: string;        // "In 2024, we helped [Local Business]..."
  localFAQ?: { q: string; a: string }[]; // City-specific FAQ items
}

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
  // PROGRAMMATIC SEO: City-specific service content for unique pages
  serviceContent?: {
    [dienstSlug: string]: ServiceContent;
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
    digitalEconomy: 'Amsterdam is de onbetwiste tech-hoofdstad van Europa. Met een ecosysteem dat bruist van unicorns (zoals Ayden en Booking.com), creatieve bureaus en fintech-startups, ligt de lat hier hoger dan waar ook. De digitale economie in Amsterdam vraagt niet om "gewoon een website", maar om platforms die internationaal kunnen concurreren op snelheid, user experience en brand identity.',
    localIndustries: ['FinTech', 'Creative Industries', 'SaaS & Tech', 'Tourism', 'E-commerce'],
    uniqueSellingPoint: 'In een stad met de hoogste bureau-dichtheid van Nederland onderscheidt u zich alleen met digitale perfectie. Onze 3D-websites geven u die cruciale "Wow-factor" die nodig is om Amsterdams talent en kapitaal aan te trekken.',
    // ========== PROGRAMMATIC SEO: VIP City Content ==========
    serviceContent: {
      'website-laten-maken': {
        localHeadline: 'De Amsterdamse Digitale Standaard',
        localParagraph: 'In de creatieve hoofdstad waar meer dan 5.000 digital agencies strijden om aandacht, is een standaard website niet genoeg. Amsterdamse ondernemers eisen meer: snelheid, stijl én strategie. Van de grachtengordelaars aan de Herengracht tot de tech-unicorns op de Zuidas - iedereen hier speelt op het hoogste niveau. Wij leveren websites die presteren op de Prinsengracht én in Silicon Valley: razendsnelle Next.js applicaties met 3D-elementen die uw internationale ambities weerspiegelen. Geen template-werk, maar maatwerk dat past bij het Amsterdamse DNA van innovatie en ondernemerschap.',
        localStats: 'Amsterdam heeft 42.000+ actieve ZZP\'ers en 12.000+ startups die allemaal online vindbaar willen zijn. De term "website laten maken Amsterdam" wordt maandelijks 2.400x gezocht in Google.',
        localCaseStudy: 'Vorig jaar transformeerden we een Jordaan-gebaseerde designstudio tot een internationale speler met 300% meer leads binnen 6 maanden dankzij een strategische combinatie van 3D-portfolio en lokale SEO.',
        localFAQ: [
          { q: 'Werken jullie met Amsterdamse startups en scale-ups?', a: 'Absoluut! Van Station F alumni tot funding-ready teams op B.Amsterdam en de Zuidas - wij spreken de taal van ambitie en leveren websites die investeerders én klanten overtuigen.' },
          { q: 'Hoe onderscheid ik me in de drukste markt van Nederland?', a: 'Met technologie die 99% van de bureaus niet beheerst: WebGL, 3D-ervaringen, en performance die Google\'s Core Web Vitals met vlag en wimpel haalt. Dat is uw edge in Amsterdam.' }
        ]
      },
      'webshop-laten-maken': {
        localHeadline: 'E-commerce voor de Amsterdamse Consument',
        localParagraph: 'Amsterdam is het e-commerce epicentrum van de Benelux. Met koopkrachtige consumenten, internationale bezoekers en een bloeiende influencer-cultuur is de potentie voor online verkoop hier enorm. Maar de concurrentie is net zo hevig: Amsterdammers zijn kritisch, verwachten snelle levering, en haken af bij trage checkouts. Onze webshops zijn gebouwd voor dit veeleisende publiek: headless architectuur voor milliseconde-laadtijden, naadloze iDEAL-integratie, en UX die converteert. Of u nu fashion verkoopt aan de Negen Straatjes of specialty food vanuit de Pijp - wij bouwen uw digitale winkelervaring.',
        localStats: 'De Amsterdamse e-commerce markt groeit met 15% per jaar. 78% van de Amsterdammers koopt minstens maandelijks online.',
        localFAQ: [
          { q: 'Kan mijn webshop ook internationale klanten bedienen?', a: 'Ja, wij bouwen meertalige webshops met multi-currency checkout, perfect voor het internationale karakter van Amsterdam.' }
        ]
      },
      'seo-optimalisatie': {
        localHeadline: 'SEO in de Meest Competitieve Markt van Nederland',
        localParagraph: 'In Amsterdam concurreert u niet alleen met lokale bedrijven, maar met internationale spelers, multinationals en duizenden digital agencies die allemaal claimen "de beste" te zijn. Organisch gevonden worden in deze arena vereist een chirurgische SEO-strategie. Wij analyseren uw concurrenten op de Zuidas, identificeren longtail-kansen in niche-markten en bouwen autoriteit op via geprogrammeerde landingspagina\'s en strategische backlinks. Voor Amsterdamse bedrijven die niet willen betalen voor elke klik, maar duurzaam verkeer willen opbouwen.',
        localStats: 'Top 3 positie voor "website laten maken Amsterdam" is €15.000+ waard aan maandelijks verkeer. Wij helpen u die positie organisch te verdienen.',
        localFAQ: [
          { q: 'Hoe lang duurt het om te ranken in Amsterdam?', a: 'Amsterdam is competitief. Reken op 4-6 maanden voor merkbare resultaten, en 12+ maanden voor top posities op hoofdzoekwoorden. Wij focussen eerst op longtail-wins.' }
        ]
      },
      '3d-website-ervaringen': {
        localHeadline: '3D Web Experiences voor de Creatieve Hoofdstad',
        localParagraph: 'Amsterdam is de creatieve hoofdstad van Europa - hier wordt design serieus genomen. Een platte, statische website volstaat niet meer voor merken die willen opvallen in deze visueel geletterde stad. Onze 3D-ervaringen zijn de logische volgende stap voor Amsterdamse creative agencies, architect bureaus, fashion brands en innovatieve retailers. Van interactieve productiepresentaties tot volledige WebGL-omgevingen die bezoekers onderdompelen in uw merkwereld. Dit is wat Amsterdam van u verwacht: het onverwachte.',
        localStats: 'Websites met interactieve 3D-elementen hebben in Amsterdam 47% hogere engagement-rates dan traditionele sites.',
        localFAQ: [
          { q: 'Past 3D bij mijn B2B-merk?', a: 'Absolutely. Juist in B2B (tech, finance, consulting) zorgt 3D-visualisatie voor memorabele first impressions. Denk aan interactieve data-visualisaties of product-configurators.' }
        ]
      },
      'onderhoud-support': {
        localHeadline: 'Altijd Bereikbaar voor Amsterdamse Ondernemers',
        localParagraph: 'In een stad die nooit slaapt, kan uw website ook niet stil staan. Amsterdamse ondernemers werken internationaal, hebben klanten in meerdere tijdzones en kunnen zich geen downtime veroorloven. Ons onderhoudspakket is ontworpen voor deze 24/7 mentaliteit: proactieve monitoring, bliksemsnelle response bij issues en regelmatige performance-optimalisatie. Of het nu gaat om een kritieke update om middernacht of een last-minute content-wijziging voor een pitch op de Zuidas - wij staan klaar.',
        localStats: '99.9% uptime garantie. Gemiddelde responstijd bij kritieke issues: 2 uur.',
        localFAQ: [
          { q: 'Kan ik jullie ook bereiken buiten kantoortijden?', a: 'Met ons Professional of Enterprise pakket heeft u toegang tot ons noodnummer voor kritieke issues, ook in het weekend.' }
        ]
      }
    }
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
    uniqueSellingPoint: 'Rotterdammers prikken direct door bluf heen. Wij bouwen websites die "niet lullen maar poetsen": razendsnel, technisch onverwoestbaar en gericht op meetbare conversie in plaats van alleen mooie plaatjes.',
    // ========== PROGRAMMATIC SEO: VIP City Content ==========
    serviceContent: {
      'website-laten-maken': {
        localHeadline: 'Websites voor Rotterdamse Doeners',
        localParagraph: 'Rotterdam staat niet bekend om praatjes - hier wordt geleverd. Van Katendrecht tot de Kop van Zuid, van havenbedrijven tot architectenbureaus: Rotterdamse ondernemers hebben websites nodig die werken. Snel, robuust, en gebouwd om te presteren. Wij begrijpen de Rotterdamse mentaliteit: geen poespas, wel resultaat. Onze Next.js websites laden in onder de 2 seconden, scoren 95+ op Google Lighthouse, en zijn technisch zo sterk gebouwd dat ze een Rotterdamse storm kunnen doorstaan. Voor bedrijven in de maritieme sector, clean tech startups op RDM, of corporate dienstverleners bij Rotterdam Central - wij bouwen wat u nodig heeft.',
        localStats: 'Rotterdam telt 60.000+ bedrijven en groeit als tech-hub. De zoekterm "website laten maken Rotterdam" heeft 1.900 zoekopdrachten per maand.',
        localCaseStudy: 'Voor een maritiem bedrijf aan de Wilhelminakade bouwden we een B2B platform met real-time scheepsdata integratie, resulterend in 40% snellere offerteprocessen.',
        localFAQ: [
          { q: 'Bouwen jullie ook voor havenbedrijven en logistiek?', a: 'Dat is onze specialiteit in Rotterdam. Van supply chain dashboards tot B2B portalen met tracking-integraties - wij begrijpen de complexiteit van de maritieme sector.' },
          { q: 'Hoe snel kan mijn nieuwe website live?', a: 'Geen gedoe: een Kickstart website staat binnen 3-4 weken online. Wij werken efficiënt en communiceren direct.' }
        ]
      },
      'webshop-laten-maken': {
        localHeadline: 'E-commerce met Rotterdamse Efficiëntie',
        localParagraph: 'Rotterdam is de poort van Europa - dagelijks stromen miljoenen producten door deze stad. Die handelsmentaliteit zit in het DNA van Rotterdamse ondernemers. Wij bouwen webshops die die efficiëntie weerspiegelen: gestroomlijnde checkouts, directe koppelingen met voorraadsystemen, en logistieke integraties die u uren per week besparen. Van lokale retailers in de Koopgoot tot wholesalers in Spaanse Polder - onze e-commerce oplossingen zijn gebouwd voor schaal en snelheid.',
        localStats: 'Rotterdamse e-commerce bedrijven ervaren gemiddeld 23% hogere conversie met geoptimaliseerde checkout flows.',
        localFAQ: [
          { q: 'Kunnen jullie koppelen met mijn voorraadbeheer?', a: 'Ja, wij integreren met Exact, Picqer, en de meeste WMS-systemen. Automatisering is key in Rotterdam.' }
        ]
      },
      'seo-optimalisatie': {
        localHeadline: 'Lokaal Gevonden Worden in Rotterdam',
        localParagraph: 'In Rotterdam telt resultaat. SEO-investeringen moeten zich terugverdienen in leads en omzet - niet in vage rapporten. Onze SEO-aanpak is typisch Rotterdams: data-driven, meetbaar, en recht op het doel af. We focussen op zoektermen die uw Rotterdamse klanten daadwerkelijk gebruiken, optimaliseren voor Google Maps om lokale bezoekers aan te trekken, en bouwen landingspagina\'s die ranken én converteren. Geen lange verhalen, wel stijgende lijnen.',
        localStats: 'Een top 3 positie voor industrie-gerelateerde zoektermen in Rotterdam levert gemiddeld 200+ gekwalificeerde bezoekers per maand op.',
        localFAQ: [
          { q: 'Leveren jullie concrete cijfers of alleen advies?', a: 'Wij werken met meetbare KPI\'s: posities, verkeer, leads. Maandelijks krijgt u een no-nonsense rapport met de cijfers die ertoe doen.' }
        ]
      },
      '3d-website-ervaringen': {
        localHeadline: '3D Visualisaties voor Rotterdams Design',
        localParagraph: 'Rotterdam is een stad van architectuur en design - van de kubuswoningen tot de Markthal. Die visuele ambitie verdient digitale evenknieën. Onze 3D-ervaringen laten architectenbureaus hun ontwerpen tot leven komen, helpen product designers hun concepten presenteren, en geven vastgoedontwikkelaars tools om projecten te verkopen voordat ze gebouwd zijn. WebGL-technologie die past bij een stad die nooit stopt met bouwen.',
        localStats: 'Vastgoedprojecten met 3D-visualisaties sluiten 35% sneller af dan projecten met alleen 2D-materiaal.',
        localFAQ: [
          { q: 'Kunnen jullie een architectuurproject in 3D visualiseren?', a: 'Absoluut. Wij werken regelmatig met Rotterdamse architectenbureaus voor interactieve project-presentaties en virtual tours.' }
        ]
      },
      'onderhoud-support': {
        localHeadline: 'Support zonder Bureaucratie',
        localParagraph: 'Rotterdammers hebben geen tijd voor wachtrijen en formulieren. Als uw website vastloopt, moet het opgelost worden - nu. Ons onderhoudspakket is ontworpen voor die directheid: korte lijnen, snelle response, en proactief handelen voordat problemen ontstaan. Wij monitoren uw site 24/7, installeren updates voordat ze kritiek worden, en staan paraat als u ons nodig heeft. Praktisch, betrouwbaar, Rotterdams.',
        localStats: 'Gemiddelde responstijd voor support tickets: 4 uur. Voor kritieke issues: binnen 2 uur.',
        localFAQ: [
          { q: 'Moet ik een ticket aanmaken of kan ik gewoon bellen?', a: 'Bij ons Professional pakket kunt u gewoon bellen. Geen ticketsystemen, geen wachtrijen - directe lijnen met ons team.' }
        ]
      }
    }
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
    uniqueSellingPoint: 'Utrechtse bedrijven opereren vaak op het snijvlak van kennis en commercie. Wij vertalen complexe diensten naar heldere, interactieve websites die uw expert-status direct bevestigen.',
    // ========== PROGRAMMATIC SEO: VIP City Content ==========
    serviceContent: {
      'website-laten-maken': {
        localHeadline: 'Websites voor het Hart van Nederland',
        localParagraph: 'Utrecht is niet zomaar centraal gelegen - het is het zenuwcentrum van de Nederlandse kenniseconomie. Van IT-dienstverleners in het Stationsgebied tot health-tech startups op Science Park: hier worden complexe diensten verkocht aan veeleisende klanten. Uw website moet die complexiteit versimpelen zonder te verwateren. Wij bouwen heldere, gebruiksvriendelijke websites die uw expertise direct overbrengen. Met een focus op toegankelijkheid (WCAG 2.1) en gebruiksgemak die past bij de Utrechtse standaard. Van kennisbank tot leadgeneratie-platform: technisch perfect, visueel helder.',
        localStats: 'Utrecht groeit sneller dan welke Nederlandse stad ook. Jaarlijks vestigen zich 3.500+ nieuwe bedrijven in de regio.',
        localCaseStudy: 'Voor een IT-consultancyfirma bij Utrecht Centraal ontwikkelden we een kennisplatform dat hun thought leadership versterkte en 250% meer qualified leads opleverde.',
        localFAQ: [
          { q: 'Kunnen jullie integreren met mijn CRM-systeem?', a: 'Absoluut. Wij bouwen headless sites die koppelen met Salesforce, HubSpot, Pipedrive en vrijwel elk ander CRM. Perfect voor de B2B-focus van Utrecht.' },
          { q: 'Hoe zorgen jullie voor toegankelijkheid?', a: 'WCAG 2.1 niveau AA is onze standaard. Voor overheidsgerelateerde projecten bieden we niveau AAA compliance.' }
        ]
      },
      'webshop-laten-maken': {
        localHeadline: 'E-commerce vanuit het Centrum van Nederland',
        localParagraph: 'Centraal gelegen betekent logistiek voordeel. Utrechtse e-commerce ondernemers kunnen heel Nederland binnen 24 uur bereiken. Wij bouwen webshops die dat potentieel benutten: snelle checkouts, slimme verzendopties, en een UX die is geoptimaliseerd voor de kritische Nederlandse consument. Of u nu vanuit de Jaarbeurszijde verzendingen coördineert of een lifestyle merk runt vanuit de Twijnstraat - wij leveren technologie die uw groei niet tempert maar versnelt.',
        localStats: 'E-commerce vanuit Utrecht profiteert van 4 uur kortere gemiddelde levertijden vergeleken met randstedelijke concurrenten.',
        localFAQ: [
          { q: 'Ondersteunen jullie same-day delivery integraties?', a: 'Ja, we koppelen met Fietskoeriers, Trunkrs en andere same-day diensten voor de ultieme Utrechtse klanttevredenheid.' }
        ]
      },
      'seo-optimalisatie': {
        localHeadline: 'SEO Strategie voor Kennisintensieve Bedrijven',
        localParagraph: 'B2B SEO in Utrecht vraagt om een andere aanpak dan consumentenmarketing. Uw doelgroep zoekt niet op "goedkoop" maar op "specialist", "expert", en "advies". Wij bouwen SEO-strategieën voor kennisbedrijven: thought leadership content, longtail optimalisatie voor specifieke diensten, en lokale vindbaarheid voor Utrechtse ondernemers die zoeken naar een betrouwbare partner. Van IT-consultancy tot opleidingsinstituut - wij snappen de Utrechtse B2B-markt.',
        localStats: 'B2B zoektermen in Utrecht hebben 40% minder concurrentie maar 60% hogere leadwaarde dan generieke termen.',
        localFAQ: [
          { q: 'Schrijven jullie ook de content?', a: 'Ja, wij hebben ervaren copywriters die B2B en kennisintensieve sectoren begrijpen. Van whitepapers tot productpaginas.' }
        ]
      },
      '3d-website-ervaringen': {
        localHeadline: '3D Ervaringen voor Gaming en New Media',
        localParagraph: 'Utrecht is de onofficiële gaming-hoofdstad van Nederland. Met studios als Abbey Games, Guerrilla, en talloze indie-ontwikkelaars is 3D hier geen luxe maar verwachting. Onze WebGL-ervaringen sluiten aan bij die cultuur: interactieve portfolios voor game studios, product-configurators voor tech-bedrijven, en immersieve webomgevingen voor creative agencies. Als uw team in Unity of Unreal werkt, begrijpen wij uw visuele taal en vertalen die naar het web.',
        localStats: 'De Utrechtse gaming-sector genereert €1.5 miljard per jaar. Dit publiek verwacht 60fps webervaring.',
        localFAQ: [
          { q: 'Kunnen jullie onze game-assets hergebruiken voor de website?', a: 'Vaak wel. Wij optimaliseren 3D-assets (Blender, Maya) voor real-time webweergave met tools als Draco en glTF.' }
        ]
      },
      'onderhoud-support': {
        localHeadline: 'Betrouwbare Partner voor Utrechtse Bedrijven',
        localParagraph: 'Centraal in Nederland, centraal in onze aandacht. Utrechtse bedrijven verwachten betrouwbaarheid en professionaliteit - geen excuses. Ons onderhoudspakket levert precies dat: proactieve monitoring, geplande updates buiten kantooruren, en een snelle response wanneer het nodig is. Wij zijn uw digitale huismeester, altijd bereikbaar en altijd bezig uw online aanwezigheid te optimaliseren.',
        localStats: 'Onze Utrechtse klanten rapporteren 99.97% uptime over het afgelopen jaar.',
        localFAQ: [
          { q: 'Voeren jullie updates uit tijdens werkuren?', a: 'Nooit. Geplande updates voeren wij uit in de avonduren of weekenden om uw bedrijfscontinuïteit te waarborgen.' }
        ]
      }
    }
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
    uniqueSellingPoint: 'Security by design is onze standaard. Voor de Haagse markt bouwen wij digitale vestingen die er elegant uitzien: volledig WCAG-toegankelijk, AVG-proof en voorzien van enterprise-grade beveiliging.',
    // ========== PROGRAMMATIC SEO: VIP City Content ==========
    serviceContent: {
      'website-laten-maken': {
        localHeadline: 'Websites met Internationale Statuur',
        localParagraph: 'Den Haag opereert op het wereldtoneel. Van het Internationaal Gerechtshof tot de cybersecurity-hub rond The Hague Security Delta - hier wordt vertrouwen en autoriteit verwacht. Uw website moet die standing reflecteren: professioneel, beveiligd, en waar nodig meertalig. Wij bouwen websites voor overheidsinstanties, internationale organisaties, ambassades en het MKB dat in deze context opereert. Met speciale aandacht voor security headers, WCAG 2.1 toegankelijkheid, en AVG-compliance. Geen concessies aan kwaliteit - uw digitale ambassade.',
        localStats: 'Den Haag telt 160+ internationale organisaties en honderden ambassades. De standaard voor digitale presentatie ligt hier hoger dan waar ook.',
        localCaseStudy: 'Voor een internationale NGO bij het World Forum bouwden we een meertalig platform (NL/EN/FR) met AAA-toegankelijkheid, resulterend in 180% toename in internationale funding-aanvragen.',
        localFAQ: [
          { q: 'Voldoen jullie websites aan overheidsstandaarden?', a: 'Ja. Wij bouwen volgens DigiToegankelijk (WCAG 2.1), voldoen aan BIO-richtlijnen en implementeren de aanbevolen beveiligingsheaders.' },
          { q: 'Kunnen jullie meertalige websites bouwen?', a: 'Absoluut. Wij implementeren professionele i18n-systemen met ondersteuning voor RTL-talen, perfect voor het internationale karakter van Den Haag.' }
        ]
      },
      'webshop-laten-maken': {
        localHeadline: 'Beveiligde E-commerce voor de Hofstad',
        localParagraph: 'E-commerce in Den Haag vraagt om extra aandacht voor beveiliging en professionaliteit. Of u nu luxury goods verkoopt aan het internationale diplomatieke corps of een hospitality-webshop runt voor Scheveningse bezoekers - veiligheid staat voorop. Wij bouwen webshops met enterprise-niveau beveiliging: PCI-DSS compliance, fraud detection en waterdichte betaalflows. Elegant gepresenteerd, ijzersterk beveiligd.',
        localStats: 'Den Haag heeft het hoogste percentage high-net-worth individuals van Nederland. Luxury e-commerce groeit hier met 25% per jaar.',
        localFAQ: [
          { q: 'Hoe zorgen jullie voor betalingsbeveiliging?', a: 'Wij werken met PCI-DSS gecertificeerde payment providers en implementeren 3D Secure voor alle creditcard transacties.' }
        ]
      },
      'seo-optimalisatie': {
        localHeadline: 'Internationale SEO vanuit Den Haag',
        localParagraph: 'Haagse organisaties denken niet alleen lokaal. Uw doelgroep zit in Genève, New York en Nairobi. Onze internationale SEO-strategie gaat verder dan vertalen: wij optimaliseren voor regionale zoekmachines, bouwen landingspaginas voor specifieke landen en implementeren hreflang-tags voor perfecte internationale indexering. Voor NGOs, consultancies en internationaal opererende bedrijven die wereldwijd gevonden willen worden.',
        localStats: 'Meertalige websites met correcte hreflang-implementatie krijgen 35% meer verkeer uit niet-NL markten.',
        localFAQ: [
          { q: 'Optimaliseren jullie ook voor niet-Google zoekmachines?', a: 'Ja, afhankelijk van uw doelmarkt optimaliseren wij ook voor Bing (VS/UK), Baidu (China) of Yandex (Rusland).' }
        ]
      },
      '3d-website-ervaringen': {
        localHeadline: '3D Visualisaties voor Impact en Inzicht',
        localParagraph: 'Complexe data en impact-storytelling vragen om visuele helderheid. Voor Haagse organisaties die werken aan klimaat, vrede of gezondheid bieden 3D-visualisaties een krachtige manier om data te presenteren, processen te verduidelijken en stakeholders te overtuigen. Van interactieve wereldkaarten tot data-dashboards met WebGL-animaties - wij helpen u uw impact zichtbaar te maken. Professional en impactvol.',
        localStats: 'Interactieve data-visualisaties verhogen de engagement op impact-rapporten met 300%.',
        localFAQ: [
          { q: 'Kunnen jullie real-time data visualiseren?', a: 'Ja, wij koppelen 3D-visualisaties aan live API-feeds voor actuele data-presentatie in uw impact-dashboard.' }
        ]
      },
      'onderhoud-support': {
        localHeadline: 'Enterprise-Grade Support voor Den Haag',
        localParagraph: 'Downtime is geen optie wanneer u opereert op internationaal niveau. Onze support voor Haagse organisaties is gebouwd op enterprise-standaarden: 24/7 monitoring, redundante backups, en een incident response-protocol dat past bij de kritieke aard van uw werk. Of u nu een ministerie, NGO of internationaal bedrijf bent - wij leveren de zekerheid die u nodig heeft.',
        localStats: 'SLA met gegarandeerde uptime van 99.9% en response binnen 1 uur voor kritieke issues.',
        localFAQ: [
          { q: 'Bieden jullie security audits?', a: 'Ja, als onderdeel van onze Enterprise pakket voeren wij kwartaal security scans uit en leveren rapportages voor uw compliance-dossier.' }
        ]
      }
    }
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
    uniqueSellingPoint: 'U bouwt de technologie van morgen; wij bouwen uw website. Met onze expertise in WebGL en 3D-rendering visualiseren wij complexe high-tech producten op een manier die investeerders en engineers direct overtuigt.',
    // ========== PROGRAMMATIC SEO: High Priority City Content ==========
    serviceContent: {
      'website-laten-maken': {
        localHeadline: 'Websites voor de Slimste Regio ter Wereld',
        localParagraph: 'Eindhoven Brainport is niet zomaar een tech-hub - het is het epicentrum van Europese high-tech innovatie. Van ASML machine-onderdelen tot Philips medische apparatuur, van automotive startups tot industrieel design: hier wordt de toekomst gemaakt. Uw website moet die standaard weerspiegelen. Wij bouwen websites voor tech-bedrijven die willen imponeren: interactieve 3D-productvisualisaties, technische documentatieportalen, en corporate sites die zowel engineers als investeerders overtuigen. Next.js performance die past bij bedrijven die lithografiemachines van miljoenen euros verkopen.',
        localStats: 'Brainport Eindhoven telt 7.000+ tech-bedrijven en de hoogste patentdichtheid van Europa. Uw concurrenten investeren zwaar in digitale presentatie.',
        localCaseStudy: 'Voor een High Tech Campus-gebaseerde startup bouwden we een interactieve 3D-productconfigurator die hun complexe mechatronische systemen visualiseert, resulterend in 60% kortere sales cycles.',
        localFAQ: [
          { q: 'Kunnen jullie technische producten in 3D visualiseren?', a: 'Dat is onze specialiteit. Wij werken met CAD-exports, technische tekeningen en fotogrammetrie om zelfs de meest complexe high-tech producten interactief te presenteren op het web.' },
          { q: 'Werken jullie met NDA-gevoelige projecten?', a: 'Absoluut. Wij begrijpen de IP-gevoeligheid in Brainport en werken standaard met vertrouwelijkheidsovereenkomsten.' }
        ]
      },
      'webshop-laten-maken': {
        localHeadline: 'B2B E-commerce voor High-Tech Componenten',
        localParagraph: 'E-commerce in Brainport is geen simpele productcatalogus. Het gaat om complexe configuraties, technische specificaties en lange B2B-salescycli. Wij bouwen webshops die dit aankunnen: CPQ-integraties (Configure-Price-Quote), technische filters op microniveau, en naadloze koppelingen met ERP-systemen. Voor distributeurs van elektronische componenten, mechanische onderdelen of industriele supplies. Wij begrijpen dat uw klanten engineers zijn die exacte specs nodig hebben.',
        localStats: 'De supply chain industrie rond Eindhoven is goed voor 12 miljard euro jaaromzet. B2B e-commerce groeit hier met 28% per jaar.',
        localFAQ: [
          { q: 'Kunnen jullie koppelen met ons legacy ERP-systeem?', a: 'Ja, wij hebben ervaring met SAP, Microsoft Dynamics, Exact en maatwerk ERP-koppelingen voor high-tech industrieen.' }
        ]
      },
      'seo-optimalisatie': {
        localHeadline: 'Technische SEO voor Brainport Bedrijven',
        localParagraph: 'SEO voor high-tech bedrijven is een vak apart. Uw doelgroep zoekt op technische termen, specificaties en oplossingen voor complexe problemen. Wij bouwen SEO-strategieen die deze niche-zoekopdrachten targeten: longtail optimalisatie voor technische termen, content die engineers overtuigt, en structured data die Google vertelt dat u de expert bent. Van semiconductors tot medische devices - wij spreken de taal van Brainport.',
        localStats: 'Technische B2B-zoektermen hebben 70% minder concurrentie maar leveren leads op met 10x hogere waarde.',
        localFAQ: [
          { q: 'Begrijpen jullie onze technische industrie?', a: 'Wij investeren in het begrijpen van uw sector. Van chip manufacturing tot automotive systems - wij doen ons huiswerk voordat we content schrijven.' }
        ]
      },
      '3d-website-ervaringen': {
        localHeadline: '3D Web voor de Design-Hoofdstad',
        localParagraph: 'Eindhoven is waar design en technologie samenkomen. Van de Design Academy tot Strijp-S, van industrieel ontwerp tot user experience - visuele excellentie is hier de norm. Onze 3D-webervaringen passen bij die standaard: WebGL-visualisaties die uw mechatronische systemen tot leven brengen, interactieve productcatalogi voor design studios, en immersieve brand experiences voor tech-startups. AR-ready, VR-compatible, en gebouwd voor de toekomst.',
        localStats: 'Eindhoven is uitgeroepen tot World Design Capital en Creative City. 3D-webpresentaties zijn hier geen luxe maar verwachting.',
        localFAQ: [
          { q: 'Kunnen jullie onze CAD-modellen omzetten naar web-ready 3D?', a: 'Ja, wij werken met STEP, IGES, STL en andere industriele formaten. Onze pipeline optimaliseert voor web zonder detail te verliezen.' }
        ]
      },
      'onderhoud-support': {
        localHeadline: 'Enterprise Support voor Tech-Bedrijven',
        localParagraph: 'High-tech bedrijven kunnen geen digitale stilstand veroorloven. Wanneer uw website de enige toegang is tot uw productcatalogus of configurator, is uptime kritiek. Ons onderhoudspakket voor Brainport-bedrijven omvat proactieve monitoring, snelle response times, en regelmatige security updates. Wij begrijpen dat uw website een business-critical applicatie is.',
        localStats: 'SLA met 99.9% uptime garantie en kritieke issue response binnen 2 uur.',
        localFAQ: [
          { q: 'Bieden jullie 24/7 support?', a: 'Met ons Enterprise pakket heeft u toegang tot ons noodnummer voor kritieke issues, inclusief weekenden en feestdagen.' }
        ]
      }
    }
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
    uniqueSellingPoint: 'Onze e-commerce en corporate websites zijn gebouwd voor groei. Wij snappen de Tilburgse handelsgeest: uw website is geen kostenpost, maar een investering die zichzelf moet terugverdienen via leads en sales.',
    // ========== PROGRAMMATIC SEO: High Priority City Content ==========
    serviceContent: {
      'website-laten-maken': {
        localHeadline: 'Websites voor Tilburgse Ondernemers die Willen Groeien',
        localParagraph: 'Tilburg is een stad van doeners. Van de Spoorzone waar startups bloeien tot de industrieterreinen waar familiebedrijven generaties lang groeien - hier draait het om resultaat. Wij bouwen websites die dat weerspiegelen: geen poespas, wel conversie. Schaalbare platforms voor MKB-bedrijven die klaar zijn voor de volgende groeifase. Van lokale dienstverleners tot internationale logistieke spelers: wij leveren websites die werken als sales-machine. Brabantse nuchterheid, digitale ambitie.',
        localStats: 'Tilburg telt 15.000+ MKB-bedrijven. De logistieke sector groeit met 12% per jaar dankzij de centrale ligging tussen Rotterdam en Antwerpen.',
        localCaseStudy: 'Voor een Tilburgs fulfilment-bedrijf bouwden we een B2B-portal met real-time voorraadinzicht, resulterend in 35% minder telefonische vragen en 50% snellere orderafhandeling.',
        localFAQ: [
          { q: 'Zijn jullie betaalbaar voor MKB?', a: 'Absoluut. Onze Kickstart-pakketten zijn specifiek ontworpen voor groeiende MKB-bedrijven. Geen overbodige toeters, wel alles wat u nodig heeft.' },
          { q: 'Hoe snel kunnen jullie leveren?', a: 'Wij begrijpen de Tilburgse mentaliteit: geen lange vergaderingen, wel actie. Een Kickstart website staat binnen 3-4 weken live.' }
        ]
      },
      'webshop-laten-maken': {
        localHeadline: 'E-commerce voor de Logistieke Hotspot',
        localParagraph: 'Tilburg ligt strategisch tussen de havens van Rotterdam en Antwerpen. Die logistieke positie maakt de stad ideaal voor e-commerce en fulfilment. Wij bouwen webshops die die ligging benutten: slimme integraties met WMS-systemen, multi-carrier verzendmodules, en checkout-flows die converteren. Voor wholesalers, retailers en e-fulfilment bedrijven die willen schalen zonder technische hoofdpijn.',
        localStats: 'E-commerce fulfilment vanuit Tilburg bereikt 80% van de Benelux binnen 24 uur. De perfecte basis voor snelle levering.',
        localFAQ: [
          { q: 'Integreren jullie met fulfilment-software?', a: 'Ja, wij koppelen met Picqer, Sendcloud, Montapacking en de meeste andere fulfilment-platforms in de regio.' }
        ]
      },
      'seo-optimalisatie': {
        localHeadline: 'Lokaal Gevonden Worden in Tilburg en Brabant',
        localParagraph: 'Tilburgse ondernemers weten: elke euro moet werken. SEO-investeringen moeten zich terugverdienen in leads en klanten. Wij bouwen pragmatische SEO-strategieen voor het Brabantse MKB: focus op lokale vindbaarheid, Google Maps optimalisatie, en longtail-zoekwoorden die uw ideale klant gebruikt. Geen vage rapporten, wel stijgende omzet.',
        localStats: 'Lokale zoektermen in Tilburg hebben 60% minder concurrentie dan in de Randstad, met vergelijkbare koopintentie.',
        localFAQ: [
          { q: 'Zien we concrete resultaten?', a: 'Ja, wij werken met meetbare KPIs: posities, verkeer, leads. Maandelijks ontvangt u een helder rapport met de cijfers die ertoe doen.' }
        ]
      },
      '3d-website-ervaringen': {
        localHeadline: '3D Visualisaties voor Productie en Industrie',
        localParagraph: 'Tilburg heeft een rijke industriele geschiedenis. Die maakindustrie-mentaliteit leeft voort in moderne productiebedrijven en distributeurs. Onze 3D-webervaringen helpen u producten te presenteren die moeilijk te fotograferen zijn: grote machines, technische componenten, op maat gemaakte oplossingen. Interactieve 3D-catalogi die uw sales team ondersteunen en klanten overtuigen.',
        localStats: 'B2B-bedrijven met 3D-productvisualisaties rapporteren 40% hogere engagement en 25% kortere beslissingscycli.',
        localFAQ: [
          { q: 'Kunnen jullie grote industriele producten visualiseren?', a: 'Ja, van verpakkingsmachines tot magazijnstellingen - wij maken elk product interactief presenteerbaar op het web.' }
        ]
      },
      'onderhoud-support': {
        localHeadline: 'Betrouwbare Partner voor Groeiend MKB',
        localParagraph: 'Groeiende bedrijven hebben geen tijd voor technische problemen. Ons onderhoudspakket voor Tilburgse ondernemers is gebouwd op eenvoud en betrouwbaarheid: proactieve updates, snelle response, en een vast aanspreekpunt. Wij groeien mee met uw bedrijf en zorgen dat uw website altijd klaar is voor de volgende stap.',
        localStats: 'Onze Tilburgse klanten rapporteren gemiddeld 99.95% uptime over het afgelopen jaar.',
        localFAQ: [
          { q: 'Kan ik gewoon bellen als er iets is?', a: 'Met ons Professional pakket heeft u een direct nummer naar ons team. Geen ticketsystemen, gewoon menselijk contact.' }
        ]
      }
    }
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
    uniqueSellingPoint: 'Wij spreken de taal van de nieuwe generatie. Onze mobile-first aanpak en PWA-technologieen zorgen ervoor dat u de jonge, digitaal-geletterde doelgroep in Groningen perfect bereikt.',
    // ========== PROGRAMMATIC SEO: High Priority City Content ==========
    serviceContent: {
      'website-laten-maken': {
        localHeadline: 'Websites voor het Digitale Noorden',
        localParagraph: 'Groningen is de onbetwiste hoofdstad van Noord-Nederland en de jongste stad van het land. Hier komt jong IT-talent samen met duurzame energie-innovatie en gezondheid. Van startups op Zernike tot scale-ups in de Ebbingekwartier - Groningen bruist van digitale ambitie. Wij bouwen websites die bij die energie passen: mobile-first, razendsnel, en met een frisse uitstraling die de jonge doelgroep aanspreekt. Next.js performance voor bedrijven die geen genoegen nemen met middelmatig.',
        localStats: 'Groningen heeft 60.000+ studenten en is uitgeroepen tot Digital City of the North met 500+ IT-bedrijven.',
        localCaseStudy: 'Voor een Groningse energie-startup bouwden we een interactief dashboard voor duurzame energiemonitoring, resulterend in 200% meer gebruikersbetrokkenheid.',
        localFAQ: [
          { q: 'Bouwen jullie voor jonge doelgroepen?', a: 'Absoluut. Mobile-first design, snelle laadtijden en moderne UI/UX zijn onze standaard. Wij weten hoe digital natives navigeren.' },
          { q: 'Werken jullie met lokale startups?', a: 'Ja, wij ondersteunen meerdere Founded in Groningen startups met schaalbare weboplossingen die meegroeien.' }
        ]
      },
      'webshop-laten-maken': {
        localHeadline: 'E-commerce voor het Noorden',
        localParagraph: 'Noordelijke ondernemers denken praktisch en handelen slim. E-commerce vanuit Groningen betekent: efficiënte logistiek naar heel Noord-Nederland, een nuchtere aanpak en focus op rendement. Wij bouwen webshops die converteren: geoptimaliseerde checkout, slimme upselling en integraties met lokale bezorgdiensten. Van regionale specialiteiten tot duurzame producten - wij helpen u Noord-Nederland te veroveren.',
        localStats: 'E-commerce in Noord-Nederland groeit met 18% per jaar. De regionale markt is loyaal aan lokale leveranciers.',
        localFAQ: [
          { q: 'Is er genoeg markt in het Noorden?', a: 'Absoluut. Noord-Nederland telt 1.7 miljoen inwoners met sterke koopkracht en loyaliteit aan regionale merken.' }
        ]
      },
      'seo-optimalisatie': {
        localHeadline: 'Lokale SEO voor Noordelijke Bedrijven',
        localParagraph: 'Gevonden worden in Groningen, Friesland en Drenthe vraagt om een regionale SEO-strategie. Wij optimaliseren voor lokale zoektermen, Google Business Profile en de specifieke zoekpatronen van Noord-Nederland. Van "beste restaurant Groningen" tot "energieadvies Noorden" - wij zorgen dat uw bedrijf bovenaan staat wanneer noordelijke klanten zoeken.',
        localStats: 'Lokale SEO in Noord-Nederland heeft 50% minder concurrentie dan de Randstad, met vergelijkbare zoekvolumes.',
        localFAQ: [
          { q: 'Optimaliseren jullie ook voor de hele noordelijke regio?', a: 'Ja, wij bouwen regionale SEO-strategieen die Groningen, Friesland en Drenthe dekken voor maximaal bereik.' }
        ]
      },
      '3d-website-ervaringen': {
        localHeadline: '3D Visualisaties voor Energie en Innovatie',
        localParagraph: 'Groningen is het epicentrum van de Nederlandse energietransitie. Van het Gasunie hoofdkwartier tot waterstof-startups - hier wordt de duurzame toekomst gebouwd. Onze 3D-webervaringen helpen energie-bedrijven hun innovaties te visualiseren: interactieve windparken, waterstof-infrastructuur simulaties en duurzaamheidsrapporten met WebGL-visualisaties. Maak uw impact zichtbaar.',
        localStats: 'De Groningse Energy Valley sector omvat 700+ bedrijven en 40.000 banen. Visualisatie is cruciaal voor stakeholder-communicatie.',
        localFAQ: [
          { q: 'Kunnen jullie technische energie-projecten visualiseren?', a: 'Ja, van offshore windparken tot waterstof-infrastructuur - wij maken complexe energie-systemen begrijpelijk voor alle doelgroepen.' }
        ]
      },
      'onderhoud-support': {
        localHeadline: 'Betrouwbare Support vanuit het Noorden',
        localParagraph: 'Noordelijke nuchterheid betekent ook betrouwbaarheid. Ons onderhoudspakket voor Groningse bedrijven levert wat we beloven: proactieve updates, snelle response en geen verrassingen. Wij begrijpen dat uw website de digitale voordeur is en zorgen dat die altijd open staat.',
        localStats: 'Onze noordelijke klanten rapporteren gemiddeld 99.97% uptime en een gemiddelde response van onder de 4 uur.',
        localFAQ: [
          { q: 'Kunnen jullie ook ter plaatse komen?', a: 'Als dat nodig is, absoluut. Wij werken primair remote maar bezoeken onze noordelijke klanten graag voor belangrijke projecten.' }
        ]
      }
    }
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
    uniqueSellingPoint: 'Wij brengen de "Bredase kwaliteit van leven" naar het scherm. Door storytelling en sfeervolle interacties (micro-animaties) zorgen we dat bezoekers niet alleen kijken, maar zich thuis voelen op uw website.',
    // ========== PROGRAMMATIC SEO: High Priority City Content ==========
    serviceContent: {
      'website-laten-maken': {
        localHeadline: 'Websites voor de Game City van Nederland',
        localParagraph: 'Breda is waar gaming, entertainment en Bourgondisch levensgenot samenkomen. Van de gamesector rond BUas tot de gezellige horeca in de binnenstad - hier wordt plezier serieus genomen. Wij bouwen websites die bij die sfeer passen: visueel rijke ervaringen, intuïtieve navigatie en storytelling die verbindt. Voor gaming studios, horecaondernemers, retailers en iedereen die begrijpt dat een goede website net zo belangrijk is als een warm welkom.',
        localStats: 'Breda is uitgeroepen tot Game City met 60+ gamebedrijven en 2.500+ professionals in de creative industries.',
        localCaseStudy: 'Voor een Breda-gebaseerde game studio ontwikkelden we een portfolio-website met interactieve demo-previews, resulterend in 150% meer publisher-interesse.',
        localFAQ: [
          { q: 'Bouwen jullie voor de gaming industrie?', a: 'Dat is onze passie. Van studio-websites tot game portals met interactieve previews - wij begrijpen wat gamers en publishers verwachten.' },
          { q: 'Kunnen jullie interactieve elementen toevoegen?', a: 'Absoluut. Micro-animaties, scroll-effecten en WebGL-ervaringen zijn onze specialiteit. Wij maken websites die aanvoelen als spel.' }
        ]
      },
      'webshop-laten-maken': {
        localHeadline: 'E-commerce met Bredase Charme',
        localParagraph: 'Bredaase retailers begrijpen dat winkelen een beleving is. Die filosofie moet doorwerken in uw webshop. Wij bouwen e-commerce platforms die het gevoel van een boutique winkel naar het scherm brengen: sfeervolle productpresentatie, persoonlijke aanbevelingen en een checkout die zo soepel loopt als Bredase gastvrijheid. Voor mode, lifestyle, food en alles wat het Bredase winkelhart sneller doet kloppen.',
        localStats: 'Breda scoort in de top 5 van Nederland voor retaildichtheid. Online retail groeit hier met 22% per jaar.',
        localFAQ: [
          { q: 'Kunnen jullie de sfeer van mijn winkel online brengen?', a: 'Dat is precies wat we doen. Door fotografie-richtlijnen, kleurpaletten en micro-animaties creeren we een online ervaring die past bij uw merk.' }
        ]
      },
      'seo-optimalisatie': {
        localHeadline: 'Lokale SEO voor Bredase Horeca en Retail',
        localParagraph: 'In een stad waar horeca en retail floreren, is gevonden worden cruciaal. Wij bouwen SEO-strategieen voor de Bredase gastheer: Google Maps optimalisatie, review-management en lokale content die bezoekers en bewoners aanspreekt. Van "beste restauran Breda" tot "unieke cadeauwinkel West-Brabant" - wij zorgen dat u gevonden wordt door mensen die willen genieten.',
        localStats: 'Lokale zoektermen met "Breda" tonen 35% hogere koopintentie dan generieke zoektermen.',
        localFAQ: [
          { q: 'Helpen jullie met review-management?', a: 'Ja, als onderdeel van onze lokale SEO-strategie adviseren wij over het actief verzamelen en beheren van reviews op Google en sociale media.' }
        ]
      },
      '3d-website-ervaringen': {
        localHeadline: '3D Ervaringen voor Gaming en Entertainment',
        localParagraph: 'In Game City verwacht men niet minder dan cutting-edge visuele ervaringen. Onze WebGL-experts bouwen interactieve 3D-omgevingen die passen bij de Bredase gaming-standaard: real-time rendering, VR-ready experiences, en gamified webinteracties. Voor studios die hun portfolio willen showcasen, retailers die producten in 3D willen tonen, of evenementen die digitale wow-factoren zoeken.',
        localStats: 'Game en VR-content scoort 400% hogere engagement dan statische content. Breda loopt voorop in deze trend.',
        localFAQ: [
          { q: 'Kunnen jullie game-ready assets bouwen?', a: 'Wij optimaliseren voor web, maar onze 3D-pipeline is compatible met Unity en Unreal voor cross-platform gebruik.' }
        ]
      },
      'onderhoud-support': {
        localHeadline: 'Support met Bourgondische Service',
        localParagraph: 'Net als een goede gastheer zijn wij er wanneer u ons nodig heeft. Ons onderhoudspakket voor Bredase ondernemers combineert technische excellentie met persoonlijke service: proactieve updates, snelle response en een vast contactpersoon die uw bedrijf kent. Geen anonieme ticketsystemen, wel de warme service die bij Breda past.',
        localStats: 'Onze Bredase klanten waarderen met 9.2 gemiddeld op persoonlijke service en bereikbaarheid.',
        localFAQ: [
          { q: 'Is er een vast aanspreekpunt?', a: 'Altijd. U krijgt een dedicated accountmanager die uw website en bedrijf door en door kent.' }
        ]
      }
    }
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
