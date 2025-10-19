/**
 * Centralized Dutch metadata defaults
 * All titles, descriptions, and keywords are optimized for the Dutch market
 */

import { siteConfig } from '@/config/site.config';

export const SITE_URL = (
  process.env.SITE_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  'https://prowebstudio.nl'
).replace(/\/+$/, '');

/**
 * Dutch metadata defaults for all pages
 */
export const dutchMetadataDefaults = {
  locale: 'nl_NL' as const,
  language: 'nl' as const,
  hreflang: 'nl-NL' as const,
  country: 'NL' as const,
  region: 'Netherlands' as const,
} as const;

/**
 * Default Dutch keywords for all pages
 */
export const defaultDutchKeywords = [
  'website laten maken nederland',
  'website bouwen',
  'webdesign nederland',
  'webshop laten maken',
  'professionele website laten maken',
  'responsive webdesign',
  'bedrijfswebsite laten maken',
  'website ontwikkeling',
  'seo geoptimaliseerde website',
  'mkb-vriendelijk',
  'ondernemers',
  'nederlands webdesign bureau',
  'betrouwbare webdesign partner',
  'transparante communicatie',
  'no-nonsense aanpak',
  'iDEAL integratie',
  'nederlandse kwaliteit',
  'website laten maken amsterdam',
  'webdesign rotterdam',
  'website ontwikkeling den haag',
  'professionele website utrecht',
  'toekomstbestendig',
  'digital agency nederland',
] as const;

/**
 * Page-specific Dutch metadata
 */
export const dutchPageMetadata = {
  home: {
    title: `Website Laten Maken Nederland | Webdesign & Webshop Ontwikkeling Amsterdam, Rotterdam, Utrecht – ${siteConfig.name}`,
    description:
      'Website laten maken door Nederlandse webdesign experts. Professionele websites, webshops en 3D ervaringen voor MKB, startups en enterprise. Van Amsterdam tot Eindhoven - transparante prijzen, snelle oplevering, Nederlandse kwaliteit.',
    keywords: [
      'website laten maken',
      'website maken',
      'webdesign Nederland',
      'webshop laten maken',
      'website ontwikkeling',
      'professionele website',
      'website bouwen',
      'webdesign bureau',
      'website laten bouwen',
      'responsive website',
      '3D website Nederland',
      'SEO website',
      'website Amsterdam',
      'website Rotterdam',
      'website Utrecht',
      'website Den Haag',
      'website Eindhoven',
      'webdesign Amsterdam',
      'MKB website',
      'corporate website',
      'startup website',
      'e-commerce website',
      'modern webdesign',
      'Nederlandse webdesigner',
      'lokale webdesign',
      'website specialist',
      'web ontwikkeling',
      'digitale transformatie',
      'online aanwezigheid',
      'conversie optimalisatie',
      'gebruiksvriendelijke website',
      'mobiele website',
      'snelle website',
      'veilige website',
    ],
  },
  services: {
    title: `Website laten maken & Webshop bouwen | Nederlandse webdesign diensten – ${siteConfig.name}`,
    description:
      'Professionele website laten maken of webshop bouwen voor Nederlandse bedrijven. Responsive webdesign, SEO-optimalisatie, iDEAL integratie. Betrouwbare partner voor uw digitale groei.',
    keywords: [
      'webdesign diensten',
      'website laten maken',
      'webshop bouwen',
      'SEO optimalisatie',
      '3D websites',
      'website onderhoud',
      'e-commerce ontwikkeling',
      'digitale marketing',
      'conversie optimalisatie',
      'Nederlandse webstandaarden',
    ],
  },
  contact: {
    title: `Contact – Gratis Strategiegesprek | ${siteConfig.name}`,
    description:
      'Neem contact op voor een vrijblijvend gesprek over uw website project. Nederlandse webdesign experts helpen u verder met professionele websites en webshops. Bel, mail of plan een afspraak.',
    keywords: [
      'contact webdesign',
      'offerte aanvragen',
      'strategiegesprek',
      'website advies',
      'gratis consultatie',
      'webdesign offerte',
      'website project bespreken',
    ],
  },
  werkwijze: {
    title: `Onze Werkwijze – Van Intake tot Launch | ${siteConfig.name}`,
    description:
      'Ontdek onze bewezen werkwijze voor website ontwikkeling. Van strategische intake tot succesvolle livegang. Transparant proces, vaste contactpersoon, geen verrassingen. Zo werkt website laten maken bij ProWeb Studio.',
    keywords: [
      'website werkwijze',
      'ontwikkelproces',
      'website stappenplan',
      'project aanpak',
      'agile development',
      'website proces',
      'hoe werkt het',
      'website timeline',
    ],
  },
  'over-ons': {
    title: `Over Ons – Nederlands Webdesign Team | ${siteConfig.name}`,
    description:
      'Maak kennis met het ProWeb Studio team. Nederlandse webdesign professionals met passie voor innovatieve websites. Ontdek onze missie, visie en waarom klanten voor ons kiezen.',
    keywords: [
      'webdesign team',
      'over proweb studio',
      'Nederlands ontwikkelteam',
      'webdesign professionals',
      'bedrijfsinformatie',
      'ons verhaal',
      'waarom proweb',
    ],
  },
  portfolio: {
    title: `Portfolio – Onze Webdesign Projecten | ${siteConfig.name}`,
    description:
      'Bekijk onze portfolio met gerealiseerde websites, webshops en 3D web experiences. Van startup tot enterprise - ontdek hoe wij Nederlandse bedrijven helpen groeien met professionele websites.',
    keywords: [
      'webdesign portfolio',
      'website voorbeelden',
      'gerealiseerde projecten',
      'case studies',
      'referentie websites',
      'webshop voorbeelden',
      '3D website voorbeelden',
    ],
  },
  speeltuin: {
    title: `Speeltuin – 3D Web Experiences Demo | ${siteConfig.name}`,
    description:
      'Ontdek onze technische mogelijkheden met interactieve 3D web experiences. WebGL, Three.js en React 3D Fiber demonstraties. Ervaar de toekomst van webdesign.',
    keywords: [
      '3D web demo',
      'WebGL voorbeelden',
      'Three.js showcase',
      'interactieve demo',
      '3D configurator',
      'technische showcase',
      'web innovatie',
    ],
  },
  privacy: {
    title: `Privacyverklaring – Bescherming Persoonsgegevens | ${siteConfig.name}`,
    description:
      'Privacyverklaring ProWeb Studio. Lees hoe wij uw persoonsgegevens beschermen conform AVG/GDPR. Transparant over het gebruik van cookies en bezoekersdata.',
    keywords: [
      'privacy policy',
      'AVG',
      'GDPR',
      'persoonsgegevens',
      'cookies',
      'privacyverklaring',
      'databescherming',
    ],
  },
  voorwaarden: {
    title: `Algemene Voorwaarden – Dienstverlening | ${siteConfig.name}`,
    description:
      'Algemene voorwaarden ProWeb Studio. Transparante afspraken over onze webdesign dienstverlening, projecten, betalingen en intellectueel eigendom.',
    keywords: [
      'algemene voorwaarden',
      'terms and conditions',
      'dienstverlening',
      'contractvoorwaarden',
      'juridische informatie',
    ],
  },
} as const;

/**
 * Get page-specific metadata with fallback to defaults
 */
export function getPageMetadata(page: keyof typeof dutchPageMetadata) {
  return dutchPageMetadata[page] || dutchPageMetadata.home;
}

/**
 * Merge keywords with defaults
 */
export function mergeWithDefaultKeywords(
  pageKeywords?: string[]
): string[] {
  const keywords = pageKeywords || [];
  return [...new Set([...keywords, ...defaultDutchKeywords])];
}
