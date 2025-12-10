/**
* Services (diensten) configuration for dynamic routes
* Used for /diensten/[dienst] and /steden/[stad]/[dienst] routes
*/

export interface Dienst {
  name: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  features: string[];
  benefits: string[];
  relatedDiensten: string[]; // slugs of related services
  targetAudience: string[];
  pricing: {
    from: string;
    model: string;
  };
  deliveryTime: string;
  icon: string;
  keywords: string[];
  useCases: string[];
  // Rich content additions for unification
  featuresDetail?: {
    title: string;
    description: string;
    icon: string;
    details: string[];
  }[];
  packages?: {
    name: string;
    description: string;
    features: string[];
    price: string;
  }[];
  process?: {
    step: string;
    title: string;
    description: string;
    duration: string;
  }[];
  faq?: {
    question: string;
    answer: string;
  }[];
}

/**
 * All services for which we generate static pages
 */
export const diensten: Dienst[] = [
  {
    name: 'Website Laten Maken',
    slug: 'website-laten-maken',
    title: 'Professionele Website Laten Maken',
    shortDescription: 'Professionele maatwerk websites die bezoekers omzetten in klanten.',
    description: 'Een professionele website is de basis van uw online succes. Wij bouwen razendsnelle, veilige en schaalbare websites met Next.js en React. Van visitekaartje tot complexe webapplicatie - maatwerk dat past bij uw ambities en budget.',
    features: [
      'Responsive design voor alle apparaten',
      'Next.js & React ontwikkeling',
      'SEO-geoptimaliseerd vanaf dag 1',
      'Core Web Vitals optimalisatie',
      'AVIF/WebP beeldoptimalisatie',
      'HTTPS en beveiligingsheaders',
      'Google Analytics integratie',
      'Cookie consent (AVG-compliant)',
    ],
    benefits: [
      'Snelle laadtijden (< 2.5s LCP)',
      'Hogere conversie door UX focus',
      'Betere ranking in Google',
      'Schaalbaar voor toekomstige groei',
      'Lage onderhoudskosten',
      'Nederlandse hosting & support',
    ],
    relatedDiensten: ['webshop-laten-maken', 'seo-optimalisatie', '3d-website-ervaringen', 'onderhoud-support'],
    targetAudience: ['MKB', 'ZZP\'ers', 'Startups', 'Corporate', 'Non-profit'],
    pricing: {
      from: '€2.500',
      model: 'Vaste prijs of maandelijks abonnement',
    },
    deliveryTime: '4-8 weken',
    icon: '🚀',
    keywords: [
      'website laten maken',
      'website bouwen',
      'professionele website',
      'responsive website',
      'next.js website',
      'react website',
      'maatwerk website',
      'snel ladende website',
    ],
    useCases: [
      'Bedrijfswebsite met portfolio',
      'Landingspagina voor campagnes',
      'Corporate website met CMS',
      'Persoonlijke website voor ZZP\'ers',
      'Website voor verenigingen',
    ],
    featuresDetail: [
      {
        title: 'Responsive Webdesign',
        description: 'Websites die perfect werken op alle apparaten - van smartphone tot desktop',
        icon: '📱',
        details: ['Mobile-first ontwikkeling', 'Optimaal gebruiksgemak', 'Touch-vriendelijke interface', 'Snelle laadtijden op mobiel']
      },
      {
        title: 'SEO-Geoptimaliseerd',
        description: 'Technische SEO en content-optimalisatie voor hogere Google rankings',
        icon: '🔍',
        details: ['Technische SEO-implementatie', 'Schema markup', 'Core Web Vitals optimalisatie', 'Lokale SEO']
      },
      {
        title: 'Moderne Technologieën',
        description: 'Next.js, React en TypeScript voor snelle, veilige websites',
        icon: '⚡',
        details: ['Server-side rendering (SSR)', 'Statische site generatie (SSG)', 'PWA functionaliteiten', 'Moderne frameworks']
      },
      {
        title: 'Content Management',
        description: 'Eenvoudig uw website beheren met gebruiksvriendelijke CMS-systemen',
        icon: '✏️',
        details: ['Headless CMS integratie', 'Gebruiksvriendelijke interface', 'Content workflows', 'Media management']
      }
    ],
    packages: [
      {
        name: 'Landingspagina',
        description: 'Geoptimaliseerde landingspagina voor marketing',
        features: ['Conversie optimalisatie', 'A/B testing setup', 'Analytics integratie', 'Lead capture forms'],
        price: '€750'
      },
      {
        name: 'Bedrijfswebsite',
        description: 'Professionele corporate website',
        features: ['Corporate branding', 'Team pagina\'s', 'Nieuwsmodule', 'Contact formulieren'],
        price: '€2.500'
      },
      {
        name: 'Portfolio Website',
        description: 'Creatieve portfolio voor creators',
        features: ['Galerij functionaliteit', 'Project showcases', 'Client testimonials', 'Social media integratie'],
        price: '€1.500'
      },
      {
        name: 'Blog Platform',
        description: 'Content-gerichte website',
        features: ['CMS integratie', 'SEO tools', 'Social sharing', 'Comment systeem'],
        price: '€1.200'
      }
    ],
    process: [
      { step: '01', title: 'Strategie & Planning', description: 'Intake gesprek, requirements analyse en projectplanning', duration: '1 week' },
      { step: '02', title: 'Design & Development', description: 'UX/UI design, frontend en backend ontwikkeling', duration: '2-6 weken' },
      { step: '03', title: 'Testing & Launch', description: 'Uitgebreid testen, optimalisatie en live deployment', duration: '1 week' }
    ],
    faq: [
      { question: 'Hoe lang duurt het om een website te laten maken?', answer: 'De ontwikkeltijd hangt af van de complexiteit. Een eenvoudige website is binnen 2-3 weken klaar, complexe projecten duren 4-8 weken.' },
      { question: 'Wat zijn de kosten?', answer: 'Prijzen starten vanaf €750 voor een landingspagina tot €2.500+ voor complete bedrijfswebsites. We bieden altijd een offerte op maat.' },
      { question: 'Is de website mobiel-vriendelijk?', answer: 'Ja, wij hanteren een mobile-first aanpak. Uw website werkt perfect op elk apparaat.' },
      { question: 'Kan ik zelf content aanpassen?', answer: 'Ja, we implementeren een gebruiksvriendelijk CMS zodat u teksten en afbeeldingen zelf kunt beheren.' },
      { question: 'Hoe zit het met SEO?', answer: 'Technische SEO is standaard inbegrepen. We zorgen voor een perfecte basis voor Google.' }
    ],
  },
  {
    name: 'Webshop Laten Maken',
    slug: 'webshop-laten-maken',
    title: 'Webshop Laten Maken met iDEAL',
    shortDescription: 'Complete e-commerce oplossing met Nederlandse betalingsmethoden.',
    description: 'Verkoop online met een professionele webshop. Wij bouwen complete e-commerce platforms met iDEAL, creditcard en andere Nederlandse betalingsmethoden. Van productcatalogus tot voorraad- en orderbeheer - alles wordt op maat gemaakt.',
    features: [
      'iDEAL, creditcard & andere betaalmethoden',
      'Voorraad- en orderbeheer',
      'Automatische factuurverwerking',
      'Verzending & track & trace',
      'BTW-berekening (NL/EU/Wereld)',
      'Kortingscodes & acties',
      'Klantaccounts & wishlist',
      'Review & rating systeem',
    ],
    featuresDetail: [
      {
        title: 'Complete E-commerce',
        description: 'Alles wat u nodig heeft om succesvol online te verkopen',
        icon: '🛍️',
        details: ['Productbeheer', 'Voorraadbeheer', 'Klantaccounts', 'Uitgebreide rapportages']
      },
      {
        title: 'Nederlandse Betalingen',
        description: 'Naadloze integratie met alle populaire betaalmethoden',
        icon: '💳',
        details: ['iDEAL integratie', 'Creditcard support', 'Achteraf betalen', 'Veilige transacties']
      },
      {
        title: 'Conversie Gericht',
        description: 'Geoptimaliseerde checkouts en flows voor maximale verkoop',
        icon: '📈',
        details: ['One-page checkout', 'Abandoned cart recovery', 'Cross-sell opties', 'Reviews integratie']
      },
      {
        title: 'Automatisering',
        description: 'Bespaar tijd met slimme koppelingen',
        icon: '⚙️',
        details: ['Boekhouding koppeling', 'Verzendlabels printen', 'Automatische mails', 'Voorraad updates']
      }
    ],
    packages: [
      {
        name: 'Kickstart Webshop',
        description: 'Ideaal voor startende ondernemers',
        features: ['Tot 50 producten', 'iDEAL betalingen', 'Basis design', 'Google Shopping feed'],
        price: '€5.000'
      },
      {
        name: 'Professional',
        description: 'Voor groeiende e-commerce bedrijven',
        features: ['Onbeperkt producten', 'Advanced filtering', 'Uniek design', 'Koppelingen (Bol.com)'],
        price: '€8.500'
      },
      {
        name: 'Enterprise',
        description: 'Maatwerk voor grote volumes',
        features: ['B2B portal functionaliteit', 'ERP koppeling', 'Multi-store setup', 'Custom features'],
        price: '€15.000+'
      }
    ],
    process: [
      { step: '01', title: 'Scope & Design', description: 'Webshop architectuur, user flows en visual design bepalen', duration: '2 weken' },
      { step: '02', title: 'Bouw & Integratie', description: 'Ontwikkeling, betaalsystemen en product import', duration: '4-8 weken' },
      { step: '03', title: 'Test & Launch', description: 'Betaaltesten, order flows controleren en livegang', duration: '2 weken' }
    ],
    faq: [
      { question: 'Welk e-commerce systeem gebruiken jullie?', answer: 'Wij bouwen maatwerk webshops met Next.js (headless) voor maximale snelheid en flexibiliteit, vaak gekoppeld aan Shopify of een custom backend.' },
      { question: 'Kan ik koppelen met mijn boekhouding?', answer: 'Ja, wij realiseren koppelingen met Exact, Moneybird, e-Boekhouden en andere populaire pakketten.' },
      { question: 'Zijn er terugkerende kosten?', answer: 'Naast hosting en domeinnaam betaalt u alleen voor eventuele software licenties (bijv. Shopify) en transactiekosten van de payment provider.' }
    ],
    benefits: [
      'Start binnen 6 weken verkopen',
      '24/7 online omzet genereren',
      'Lagere kosten dan fysieke winkel',
      'Volledige controle over voorraad',
      'Integratie met boekhouding',
      'Schaalbaarheid voor groei',
    ],
    relatedDiensten: ['website-laten-maken', 'seo-optimalisatie', '3d-website-ervaringen', 'onderhoud-support'],
    targetAudience: ['Retailers', 'Groothandel', 'Producenten', 'MKB', 'Startups'],
    pricing: {
      from: '€5.000',
      model: 'Vaste prijs + transactiekosten',
    },
    deliveryTime: '6-12 weken',
    icon: '🛒',
    keywords: [
      'webshop laten maken',
      'webwinkel bouwen',
      'e-commerce website',
      'online verkopen',
      'ideal webshop',
      'webshop nederland',
      'webshop met betaling',
      'professionele webshop',
    ],
    useCases: [
      'B2C webshop voor consument',
      'B2B webshop met offerteaanvraag',
      'Marktplaats-achtig platform',
      'Dropshipping webshop',
      'Subscription e-commerce',
    ],
  },
  {
    name: 'SEO Optimalisatie',
    slug: 'seo-optimalisatie',
    title: 'SEO Optimalisatie voor Meer Bezoekers',
    shortDescription: 'Word gevonden in Google met professionele SEO-optimalisatie.',
    description: 'Zichtbaarheid in Google is cruciaal voor online succes. Wij optimaliseren uw website technisch en inhoudelijk voor betere rankings. Van zoekwoordenonderzoek tot linkbuilding - een complete SEO-strategie op maat.',
    features: [
      'Technische SEO audit',
      'Zoekwoordenonderzoek & strategie',
      'On-page optimalisatie',
      'Content creatie & optimalisatie',
      'Backlink analyse & strategie',
      'Local SEO voor lokale vindbaarheid',
      'Core Web Vitals optimalisatie',
      'Schema.org structured data',
    ],
    featuresDetail: [
      {
        title: 'Technische SEO',
        description: 'Fundamentele optimalisatie van uw website code en structuur',
        icon: '🔧',
        details: ['Crawling & Indexing', 'Site snelheid (Core Web Vitals)', 'Mobile-friendliness', 'Structured Data']
      },
      {
        title: 'Content Strategie',
        description: 'Waardevolle content die scoort én converteert',
        icon: '📝',
        details: ['Zoekwoordenonderzoek', 'Content kalender', 'Copywriting', 'On-page optimalisatie']
      },
      {
        title: 'Autoriteit Bouwen',
        description: 'Linkbuilding en PR voor hogere domain authority',
        icon: '🔗',
        details: ['Kwalitatieve backlinks', 'Digital PR', 'Gastblogs', 'Broken link building']
      },
      {
        title: 'Lokale SEO',
        description: 'Domineer de zoekresultaten in uw regio',
        icon: '📍',
        details: ['Google Mijn Bedrijf', 'Lokale citaties', 'Regionale landingspagina\'s', 'Review management']
      }
    ],
    packages: [
      {
        name: 'Local SEO',
        description: 'Voor lokale zichtbaarheid',
        features: ['Google Mijn Bedrijf setup', 'Lokale zoekwoorden', '5 landingspagina\'s', 'Maandelijkse rapportage'],
        price: '€750/m'
      },
      {
        name: 'National Growth',
        description: 'Voor landelijk bereik',
        features: ['Uitgebreid zoekwoordenonderzoek', 'Content creatie (4 blogs/m)', 'Technische audit', 'Linkbuilding'],
        price: '€1.500/m'
      },
      {
        name: 'E-commerce SEO',
        description: 'Voor webshops',
        features: ['Productpagina optimalisatie', 'Categorie structuur', 'Technical health check', 'Conversie optimalisatie'],
        price: '€2.500/m'
      }
    ],
    process: [
      { step: '01', title: 'Audit & Strategie', description: 'Nulmeting, concurrentieanalyse en kansen in kaart brengen', duration: '2 weken' },
      { step: '02', title: 'Implementatie', description: 'Technische fixes doorvoeren en content optimaliseren', duration: 'Doorlopend' },
      { step: '03', title: 'Monitoring & Groei', description: 'Posities tracken, bijsturen en rapporteren', duration: 'Maandelijks' }
    ],
    faq: [
      { question: 'Hoe snel zie ik resultaat?', answer: 'SEO is een lange termijn strategie. De eerste verbeteringen zijn vaak na 3 maanden zichtbaar, met serieuze groei na 6-12 maanden.' },
      { question: 'Geven jullie garanties op nummer 1 posities?', answer: 'Niemand kan nummer 1 posities in Google garanderen (pas op voor partijen die dat wel doen). Wij garanderen wel een bewezen, transparante werkwijze en stijgende lijnen.' }
    ],
    benefits: [
      'Meer organisch verkeer uit Google',
      'Hogere conversie door relevante bezoekers',
      'Lagere kosten dan adverteren',
      'Duurzame resultaten',
      'Betere merkbekendheid',
      'Concurrentievoordeel',
    ],
    relatedDiensten: ['website-laten-maken', 'webshop-laten-maken', 'onderhoud-support'],
    targetAudience: ['MKB', 'E-commerce', 'Lokale bedrijven', 'B2B', 'B2C'],
    pricing: {
      from: '€750/maand',
      model: 'Maandelijks abonnement',
    },
    deliveryTime: '3-6 maanden voor resultaten',
    icon: '📈',
    keywords: [
      'seo optimalisatie',
      'zoekmachine optimalisatie',
      'google ranking',
      'lokale seo',
      'seo specialist',
      'hoger in google',
      'seo advies',
      'seo diensten',
    ],
    useCases: [
      'Nieuwe website zichtbaar maken',
      'Bestaande website hoger ranken',
      'Lokale dienstverlening promoten',
      'E-commerce verkeer verhogen',
      'B2B leadgeneratie',
    ],
  },
  {
    name: '3D Website Ervaringen',
    slug: '3d-website-ervaringen',
    title: 'Interactieve 3D Website Ervaringen',
    shortDescription: 'Onderscheidende 3D visualisaties en product configurators.',
    description: 'Maak indruk met interactieve 3D-ervaringen op uw website. Van productconfigurators tot immersieve merkbelevenissen - wij gebruiken WebGL en Three.js om uw aanbod op een unieke manier te presenteren.',
    features: [
      'WebGL & Three.js ontwikkeling',
      'Product configurators in 3D',
      'Interactieve showrooms',
      '360° product views',
      'AR (Augmented Reality) ready',
      'Real-time visualisaties',
      'Performance optimalisatie',
      'Mobiel-vriendelijk',
    ],
    featuresDetail: [
      {
        title: 'WebGL & Three.js',
        description: 'High-end 3D graphics direct in de browser',
        icon: '🧊',
        details: ['GPU-accelerated', 'Geen plugins nodig', 'Realistische materials', 'Soepele animaties']
      },
      {
        title: 'Interactieve Configurators',
        description: 'Laat klanten hun eigen product samenstellen',
        icon: '🎨',
        details: ['Kleur & materiaal wissel', 'Onderdelen aanpassen', 'Directe prijsberekening', 'Opslaan & delen']
      },
      {
        title: 'Storytelling',
        description: 'Immersieve ervaringen die blijven hangen',
        icon: '🎭',
        details: ['Scroll-based animaties', '3D scenes', 'Audio-visuele ervaringen', 'Merkbeleving']
      },
      {
        title: 'Performance',
        description: '3D zonder trage laadtijden',
        icon: '🚀',
        details: ['Asset compressie (Draco)', 'Texture optimalisatie', 'Lazy loading', 'Progressive enhancement']
      }
    ],
    packages: [
      {
        name: '3D Product Viewer',
        description: 'Interactief product in 3D',
        features: ['1 High-poly model', '360 graden rotatie', 'Zoom functie', 'Mobiel geoptimaliseerd'],
        price: '€3.500'
      },
      {
        name: 'Product Configurator',
        description: 'Zelf samenstellen',
        features: ['Meerdere opties/kleuren', 'Logica & regels', 'Offerte tool integratie', 'UI/UX design'],
        price: '€7.500'
      },
      {
        name: 'Immersive Website',
        description: 'Volledige 3D website ervaring',
        features: ['Custom 3D wereld', 'Award-winning design', 'Sound design', 'Unieke navigatie'],
        price: '€12.500+'
      }
    ],
    process: [
      { step: '01', title: 'Concept & Art Direction', description: 'Visuele stijl, storyboard en interactie ontwerp bepalen', duration: '2 weken' },
      { step: '02', title: 'Modeling & Dev', description: '3D assets creëren en programmeren in Three.js/React', duration: '4-8 weken' },
      { step: '03', title: 'Optimalisatie', description: 'Performance tuning voor 60fps op alle devices', duration: '2 weken' }
    ],
    faq: [
      { question: 'Werkt dit op mobiel?', answer: 'Ja, onze 3D ervaringen zijn volledig responsive en geoptimaliseerd voor smartphones en tablets.' },
      { question: 'Wordt de website hier traag van?', answer: 'Nee, door slimme laadtechnieken en optimalisatie zorgen we dat de website snel blijft aanvoelen.' }
    ],
    benefits: [
      'Hogere betrokkenheid bezoekers',
      'Onderscheidend ten opzichte van concurrentie',
      'Minder retouren door betere productvisualisatie',
      'Hogere conversie',
      'Modern en innovatief imago',
      'Deelbaar op social media',
    ],
    relatedDiensten: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],
    targetAudience: ['E-commerce', 'Real estate', 'Automotive', 'Design', 'Tech'],
    pricing: {
      from: '€3.500',
      model: 'Per project',
    },
    deliveryTime: '4-10 weken',
    icon: '🎯',
    keywords: [
      '3d website',
      'webgl development',
      'three.js',
      'product configurator',
      '3d visualisatie',
      'interactieve website',
      '3d web experience',
      'ar website',
    ],
    useCases: [
      'Meubel configurator',
      'Auto showcases',
      'Real estate virtual tours',
      'Product presentaties',
      'Portfolio showcases',
    ],
  },
  {
    name: 'Website Onderhoud & Support',
    slug: 'onderhoud-support',
    title: 'Website Onderhoud & Support',
    shortDescription: 'Zorgeloos onderhoud, updates en technische support.',
    description: 'Houd uw website veilig, snel en up-to-date met ons onderhoudspakket. Van beveiligingsupdates tot contentwijzigingen - wij zorgen dat uw website optimaal blijft presteren.',
    features: [
      'Beveiligingsupdates & patches',
      'Performance monitoring',
      'Backup & recovery',
      'Content updates (tekst/beeld)',
      'Bug fixes & troubleshooting',
      'Uptime monitoring 24/7',
      'Analytics rapportage',
      'Technische support',
    ],
    featuresDetail: [
      {
        title: '24/7 Monitoring',
        description: 'Wij houden uw website dag en nacht in de gaten',
        icon: '👀',
        details: ['Uptime monitoring', 'Performance checks', 'Security scans', 'Error logging']
      },
      {
        title: 'Beveiliging',
        description: 'Proactieve bescherming tegen hackers en malware',
        icon: '🛡️',
        details: ['Firewall configuratie', 'SSL certificaten', 'Updates installeren', 'Backup beheer']
      },
      {
        title: 'Content Service',
        description: 'Hulp bij het plaatsen van nieuwe content',
        icon: '✍️',
        details: ['Tekst aanpassingen', 'Afbeeldingen plaatsen', 'Blog posts', 'Pagina\'s aanmaken']
      },
      {
        title: 'Technische Support',
        description: 'Direct hulp bij vragen of problemen',
        icon: '📞',
        details: ['Telefonisch bereikbaar', 'Snelle responstijd', 'Proactief advies', 'Emergency fix']
      }
    ],
    packages: [
      {
        name: 'Basic',
        description: 'Essentieel onderhoud',
        features: ['Technische updates', 'Dagelijkse backups', 'Uptime monitoring', 'Email support'],
        price: '€95/m'
      },
      {
        name: 'Pro',
        description: 'Voor actieve websites',
        features: ['Content updates (2u)', 'Priority support', 'Security scans', 'Performance rapport'],
        price: '€195/m'
      },
      {
        name: 'Enterprise',
        description: 'Volledige ontzorging',
        features: ['Onbeperkt klein onderhoud', '24/7 noodnummer', 'Strategisch advies', 'Dedicated developer'],
        price: '€495/m'
      }
    ],
    process: [
      { step: '01', title: 'Onboarding', description: 'Toegang regelen, nulmeting doen en backups instellen', duration: '1 dag' },
      { step: '02', title: 'Monitoring', description: 'Systemen koppelen aan onze monitoring tools', duration: 'Doorlopend' },
      { step: '03', title: 'Rapportage', description: 'Maandelijkse update over de status en werkzaamheden', duration: 'Maandelijks' }
    ],
    faq: [
      { question: 'Zit ik aan een contract vast?', answer: 'Onze onderhoudscontracten zijn maandelijks opzegbaar. We geloven in klanttevredenheid, niet in wurgcontracten.' },
      { question: 'Wat gebeurt er als mijn site gehackt wordt?', answer: 'Met ons onderhoudspakket lossen wij dit kosteloos voor u op. We zetten een schone backup terug en dichten het lek.' }
    ],
    benefits: [
      'Altijd een actuele en veilige website',
      'Snelle respons bij problemen',
      'Focus op uw core business',
      'Voorkom downtime en datalies',
      'Vaste kosten, geen verrassingen',
      'Nederlandse support tijdens kantooruren',
    ],
    relatedDiensten: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],
    targetAudience: ['MKB', 'E-commerce', 'Corporate', 'Non-profit', 'ZZP\'ers'],
    pricing: {
      from: '€95/maand',
      model: 'Maandelijks abonnement',
    },
    deliveryTime: 'Direct beschikbaar',
    icon: '🛠️',
    keywords: [
      'website onderhoud',
      'website support',
      'website beheer',
      'hosting support',
      'website updates',
      'technische support',
      'website maintenance',
      'website verzorging',
    ],
    useCases: [
      'Onderhoud bestaande website',
      'Maandelijkse content updates',
      'E-commerce shop beheer',
      'Technische support on-demand',
      'Preventief onderhoud',
    ],
  },
];

/**
 * Get service by slug
 */
export function getDienstBySlug(slug: string): Dienst | undefined {
  return diensten.find(dienst => dienst.slug === slug);
}

/**
 * Get related services
 */
export function getRelatedDiensten(dienstSlug: string): Dienst[] {
  const currentDienst = getDienstBySlug(dienstSlug);
  if (!currentDienst) return [];

  return diensten.filter(dienst =>
    currentDienst.relatedDiensten.includes(dienst.slug)
  );
}

/**
 * Get all service slugs for static generation
 */
export function getAllDienstSlugs(): string[] {
  return diensten.map(dienst => dienst.slug);
}

/**
 * Search services by name or keywords
 */
export function searchDiensten(query: string): Dienst[] {
  const lowerQuery = query.toLowerCase();
  return diensten.filter(dienst =>
    dienst.name.toLowerCase().includes(lowerQuery) ||
    dienst.slug.includes(lowerQuery) ||
    dienst.keywords.some(kw => kw.includes(lowerQuery))
  );
}

/**
 * Check if a service is available in a specific city
 * All services are available in all cities by default
 */
export function isDienstAvailableInStad(_dienstSlug: string, _stadSlug: string): boolean {
  // All services are available in all cities
  // This can be customized later if needed
  return true;
}
