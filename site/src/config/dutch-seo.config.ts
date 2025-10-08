// Dutch keyword density and natural language optimization
export const DUTCH_KEYWORDS = {
  primary: [
    'website laten maken',
    'webdesign',
    'webshop laten maken',
    'professionele website',
    'website ontwikkeling'
  ],
  secondary: [
    'Nederlandse webdesigner',
    'lokale webdesign',
    'MKB website',
    'bedrijfswebsite',
    'responsive website',
    'SEO optimalisatie',
    'webdesign bureau',
    'website specialist'
  ],
  locationBased: [
    'webdesign Amsterdam',
    'website maken Rotterdam',
    'webdesign Utrecht',
    'website Den Haag',
    'webdesign Eindhoven',
    'website Tilburg',
    'webdesign Groningen',
    'website Almere',
    'webdesign Breda',
    'website Nijmegen'
  ],
  businessTerms: [
    'KvK registratie',
    'iDEAL betaling',
    'AVG compliant',
    'Nederlandse hosting',
    'lokale ondersteuning',
    'MKB ondernemer',
    'digitale transformatie',
    'online marketing'
  ]
} as const;

// Dutch cities with specific content variations
export const DUTCH_CITIES = [
  {
    name: 'Amsterdam',
    slug: 'amsterdam',
    region: 'Noord-Holland',
    characteristics: ['hoofdstad', 'internationale zakelijke hub', 'creatieve industrie', 'startup ecosysteem'],
    localTerms: ['Amsterdamse ondernemers', 'Grachtengordel gebied', 'Zuidas business district'],
    businessFocus: ['fintech', 'creative agencies', 'international business', 'startups'],
    population: 872680,
    keyIndustries: ['financiële dienstverlening', 'toerisme', 'technologie', 'creatieve industrie']
  },
  {
    name: 'Rotterdam',
    slug: 'rotterdam',
    region: 'Zuid-Holland',
    characteristics: ['havenstad', 'logistiek centrum', 'moderne architectuur', 'internationale handel'],
    localTerms: ['Rotterdamse haven', 'Erasmus MC gebied', 'Kop van Zuid'],
    businessFocus: ['logistics', 'maritime', 'architecture', 'engineering'],
    population: 651446,
    keyIndustries: ['logistiek', 'scheepvaart', 'petrochemie', 'architectuur']
  },
  {
    name: 'Utrecht',
    slug: 'utrecht',
    region: 'Utrecht',
    characteristics: ['centraal gelegen', 'universiteitsstad', 'knooppunt', 'historisch centrum'],
    localTerms: ['Utrechtse binnenstad', 'Universiteit Utrecht', 'centraal station'],
    businessFocus: ['education', 'healthcare', 'consulting', 'government'],
    population: 361924,
    keyIndustries: ['onderwijs', 'gezondheidszorg', 'overheid', 'consultancy']
  },
  {
    name: 'Den Haag',
    slug: 'den-haag',
    region: 'Zuid-Holland',
    characteristics: ['regeringszetel', 'internationale stad', 'diplomatiek centrum', 'juridische sector'],
    localTerms: ['Haagse regering', 'Binnenhof', 'internationale organisaties'],
    businessFocus: ['government', 'international organizations', 'legal services', 'NGOs'],
    population: 548320,
    keyIndustries: ['overheid', 'internationale organisaties', 'juridische dienstverlening', 'diplomatie']
  },
  {
    name: 'Eindhoven',
    slug: 'eindhoven',
    region: 'Noord-Brabant',
    characteristics: ['technologiestad', 'innovatie hub', 'Brainport regio', 'hightech industrie'],
    localTerms: ['Brainport Eindhoven', 'High Tech Campus', 'Design Academy'],
    businessFocus: ['technology', 'manufacturing', 'design', 'research'],
    population: 238326,
    keyIndustries: ['technologie', 'automotive', 'elektronica', 'design']
  },
  {
    name: 'Tilburg',
    slug: 'tilburg',
    region: 'Noord-Brabant',
    characteristics: ['universiteitsstad', 'cultureel centrum', 'textielgeschiedenis', 'creatieve industrie'],
    localTerms: ['Tilburg University', 'Spoorzone', 'textielmuseum'],
    businessFocus: ['education', 'culture', 'logistics', 'services'],
    population: 223578,
    keyIndustries: ['onderwijs', 'logistiek', 'dienstverlening', 'cultuur']
  },
  {
    name: 'Groningen',
    slug: 'groningen',
    region: 'Groningen',
    characteristics: ['studentenstad', 'noordelijke centrum', 'gaswinning', 'duurzame energie'],
    localTerms: ['Rijksuniversiteit Groningen', 'Martinitoren', 'Noorderplantsoen'],
    businessFocus: ['energy', 'agriculture', 'education', 'healthcare'],
    population: 235287,
    keyIndustries: ['energie', 'landbouw', 'onderwijs', 'gezondheidszorg']
  },
  {
    name: 'Almere',
    slug: 'almere',
    region: 'Flevoland',
    characteristics: ['nieuwste stad', 'snelle groei', 'moderne planning', 'jonge bevolking'],
    localTerms: ['Flevoland polder', 'nieuwe stad', 'moderne architectuur'],
    businessFocus: ['retail', 'services', 'housing', 'family businesses'],
    population: 218096,
    keyIndustries: ['retail', 'woningbouw', 'dienstverlening', 'gezinsbedrijven']
  },
  {
    name: 'Breda',
    slug: 'breda',
    region: 'Noord-Brabant',
    characteristics: ['historische stad', 'strategische ligging', 'defensie', 'voedingsindustrie'],
    localTerms: ['Koninklijke Militaire Academie', 'Grote Kerk', 'Valkenberg'],
    businessFocus: ['food industry', 'defense', 'logistics', 'tourism'],
    population: 184403,
    keyIndustries: ['voedingsindustrie', 'defensie', 'logistiek', 'toerisme']
  },
  {
    name: 'Nijmegen',
    slug: 'nijmegen',
    region: 'Gelderland',
    characteristics: ['oudste stad', 'universiteitsstad', 'grens Duitsland', 'groene omgeving'],
    localTerms: ['Radboud Universiteit', 'Vierdaagse', 'Waal rivier'],
    businessFocus: ['education', 'healthcare', 'cross-border', 'research'],
    population: 179073,
    keyIndustries: ['onderwijs', 'gezondheidszorg', 'onderzoek', 'grenshandel']
  }
] as const;

// Content cluster topics around "website laten maken"
export const CONTENT_CLUSTERS = {
  'website-laten-maken': {
    mainTopic: 'Website Laten Maken',
    supportingTopics: [
      'Kosten website laten maken',
      'Website laten maken proces',
      'Responsive website ontwikkeling',
      'Moderne website trends 2025',
      'Website onderhoud en beheer'
    ],
    relatedServices: ['webshop-laten-maken', 'seo-optimalisatie', '3d-website-ervaringen'],
    targetKeywords: ['website laten maken', 'professionele website', 'website ontwikkeling'],
    internalLinks: [
      '/diensten/website-laten-maken',
      '/werkwijze',
      '/portfolio',
      '/contact'
    ]
  },
  'webdesign-nederland': {
    mainTopic: 'Webdesign Nederland',
    supportingTopics: [
      'Nederlandse webdesign trends',
      'Lokale webdesign expertise',
      'Webdesign voor MKB bedrijven',
      'Cultureel aangepast webdesign'
    ],
    relatedServices: ['website-laten-maken', 'seo-optimalisatie'],
    targetKeywords: ['webdesign Nederland', 'Nederlandse webdesigner', 'lokale webdesign'],
    internalLinks: [
      '/over-ons',
      '/locaties',
      '/diensten'
    ]
  },
  'lokale-seo': {
    mainTopic: 'Lokale SEO Nederland',
    supportingTopics: [
      'Google My Business optimalisatie',
      'Lokale zoekwoorden onderzoek',
      'Regionaal gericht content marketing',
      'Nederlandse zoekmachine optimalisatie'
    ],
    relatedServices: ['seo-optimalisatie', 'website-laten-maken'],
    targetKeywords: ['lokale SEO', 'regionale vindbaarheid', 'lokale zoekmachine optimalisatie'],
    internalLinks: [
      '/diensten/seo-optimalisatie',
      '/locaties'
    ]
  }
} as const;

// Dutch trust signals and business credentials
export const DUTCH_TRUST_SIGNALS = {
  payments: [
    {
      name: 'iDEAL',
      description: 'Nederlandse online betaalmethode',
      icon: '🏦',
      importance: 'essential'
    },
    {
      name: 'Bancontact',
      description: 'Belgische en Nederlandse betaalkaart',
      icon: '💳',
      importance: 'important'
    }
  ],
  certifications: [
    {
      name: 'KvK Registratie',
      description: 'Officieel geregistreerd bij de Kamer van Koophandel',
      number: '12345678',
      importance: 'essential'
    },
    {
      name: 'AVG Compliant',
      description: 'Volledige naleving van Nederlandse privacywetgeving',
      importance: 'essential'
    },
    {
      name: 'Nederlandse Hosting',
      description: 'Servers gevestigd in Nederland voor snelheid en compliance',
      importance: 'important'
    }
  ],
  testimonials: [
    {
      name: 'Jan van der Berg',
      company: 'Bakkerij Van der Berg',
      location: 'Amsterdam',
      text: 'ProWeb Studio heeft onze bakkerij volledig digitaal getransformeerd. Dankzij de nieuwe website krijgen we nu dagelijks online bestellingen uit heel Amsterdam.',
      service: 'webshop-laten-maken',
      rating: 5
    },
    {
      name: 'Marieke Jansen',
      company: 'Jansen Consultancy',
      location: 'Utrecht',
      text: 'Als MKB ondernemer was ik op zoek naar een betrouwbare partner voor mijn website. ProWeb Studio begrijpt de Nederlandse markt perfect.',
      service: 'website-laten-maken',
      rating: 5
    },
    {
      name: 'Peter de Vries',
      company: 'Tech Innovate',
      location: 'Eindhoven',
      text: 'De 3D website die ProWeb Studio voor ons heeft gemaakt past perfect bij onze innovatieve producten. Klanten zijn onder de indruk!',
      service: '3d-website-ervaringen',
      rating: 5
    }
  ]
} as const;

// Voice search optimized FAQ questions
export const VOICE_SEARCH_FAQS = [
  {
    question: 'Hoeveel kost het om een website te laten maken in Nederland?',
    answer: 'De kosten voor een professionele website in Nederland variëren tussen €2.500 en €15.000, afhankelijk van functionaliteiten en complexiteit. Voor MKB bedrijven bieden wij transparante prijspakketten vanaf €2.500.',
    category: 'prijzen',
    keywords: ['kosten website', 'prijzen webdesign', 'website laten maken kosten'],
    voiceOptimized: true
  },
  {
    question: 'Hoe lang duurt het om een website te laten maken?',
    answer: 'Een professionele website ontwikkelen duurt gemiddeld 4-8 weken, afhankelijk van de scope. Eenvoudige bedrijfswebsites kunnen binnen 3 weken opgeleverd worden, complexere projecten zoals webshops nemen 6-12 weken in beslag.',
    category: 'proces',
    keywords: ['ontwikkeltijd website', 'hoe lang website maken', 'website oplevering'],
    voiceOptimized: true
  },
  {
    question: 'Wat is het verschil tussen een goedkope en professionele website?',
    answer: 'Een professionele website wordt op maat gemaakt, is SEO geoptimaliseerd, mobiel-vriendelijk, veilig en onderhoudsvrij. Goedkope templates missen vaak Nederlandse lokalisatie, goede beveiliging en professionele ondersteuning.',
    category: 'kwaliteit',
    keywords: ['professionele website', 'website kwaliteit', 'verschil goedkoop duur'],
    voiceOptimized: true
  },
  {
    question: 'Kan ik zelf mijn website onderhouden na oplevering?',
    answer: 'Ja, wij leveren alle websites op met een gebruiksvriendelijk beheersysteem. Daarnaast bieden wij Nederlandse ondersteuning en trainingen zodat u zelfstandig content kunt bijwerken.',
    category: 'onderhoud',
    keywords: ['website beheer', 'zelf website onderhouden', 'cms systeem'],
    voiceOptimized: true
  },
  {
    question: 'Welke betaalmethoden accepteren jullie voor website projecten?',
    answer: 'Wij accepteren alle gangbare Nederlandse betaalmethoden: iDEAL, bankoverschrijving, creditcard en voor bedrijven ook factuurbetalingen. Betalingen kunnen gespreid worden over het project.',
    category: 'betaling',
    keywords: ['betaalmethoden', 'iDEAL', 'factuur betaling'],
    voiceOptimized: true
  },
  {
    question: 'Maken jullie ook websites voor kleine bedrijven en ZZP-ers?',
    answer: 'Absoluut! Wij zijn gespecialiseerd in websites voor het Nederlandse MKB, inclusief ZZP-ers, kleine bedrijven en startups. Onze pakketten zijn speciaal ontworpen voor ondernemers die kwaliteit zoeken tegen een eerlijke prijs.',
    category: 'doelgroep',
    keywords: ['ZZP website', 'MKB website', 'kleine bedrijven'],
    voiceOptimized: true
  }
] as const;

export type DutchCity = typeof DUTCH_CITIES[number];
export type DutchKeywords = typeof DUTCH_KEYWORDS;
export type ContentCluster = typeof CONTENT_CLUSTERS[keyof typeof CONTENT_CLUSTERS];