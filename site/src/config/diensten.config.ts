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
