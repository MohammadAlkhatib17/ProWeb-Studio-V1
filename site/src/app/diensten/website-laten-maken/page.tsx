import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';
import UnifiedServicePage from '@/components/unified/UnifiedServicePage';
import { ServicePageProps } from '@/components/unified/ServicePageComponents';

export const dynamic = 'force-static';
export const revalidate = 7200; // 2 hours - service content is fairly stable
export const fetchCache = 'force-cache';

// Enhanced service page metadata with all SEO optimizations
export const metadata: Metadata = generateMetadata('/diensten/website-laten-maken', {
  service: 'website-laten-maken',
  pageType: 'service',
  lastModified: new Date().toISOString(),
  image: {
    url: '/og-website-laten-maken.png',
    alt: 'Website Laten Maken Nederland - ProWeb Studio Webdesign Services',
    width: 1200,
    height: 630,
  },
});

const servicePageData: ServicePageProps = {
  // Hero Section
  title: 'Website Laten Maken',
  subtitle: 'Professionele websites die converteren en groei stimuleren',
  heroDescription: 'Van concept tot lancering - wij creëren responsive, snelle en SEO-geoptimaliseerde websites die uw bedrijf online laten excelleren in de Nederlandse markt.',
  primaryCTA: 'Gratis Offerte Aanvragen',
  secondaryCTA: 'Bekijk Portfolio',
  
  // Features Section
  featuresTitle: 'Waarom Kiezen Voor ProWeb Studio',
  featuresSubtitle: 'Wij combineren creatief design met moderne technologie om websites te bouwen die niet alleen mooi zijn, maar ook presteren.',
  features: [
    {
      title: 'Responsive Webdesign',
      description: 'Websites die perfect werken op alle apparaten - van smartphone tot desktop',
      icon: '📱',
      details: [
        'Mobile-first ontwikkeling',
        'Optimaal gebruiksgemak op alle schermformaten',
        'Touch-vriendelijke interface',
        'Snelle laadtijden op mobiel'
      ]
    },
    {
      title: 'SEO-Geoptimaliseerd',
      description: 'Technische SEO en content-optimalisatie voor hogere Google rankings',
      icon: '🔍',
      details: [
        'Technische SEO-implementatie',
        'Schema markup en structured data',
        'Core Web Vitals optimalisatie',
        'Lokale SEO voor Nederlandse markt'
      ]
    },
    {
      title: 'Moderne Technologieën',
      description: 'Next.js, React en TypeScript voor snelle, veilige websites',
      icon: '⚡',
      details: [
        'Server-side rendering (SSR)',
        'Statische site generatie (SSG)',
        'Progressive Web App functionaliteiten',
        'Moderne JavaScript frameworks'
      ]
    },
    {
      title: 'Content Management',
      description: 'Eenvoudig uw website beheren met gebruisvriendelijke CMS-systemen',
      icon: '✏️',
      details: [
        'Headless CMS integratie',
        'Gebruiksvriendelijke admin interface',
        'Content workflows en approval',
        'Media management systeem'
      ]
    }
  ],
  
  // Service Types Section
  packagesTitle: 'Website Oplossingen',
  packagesSubtitle: 'Professionele websites voor elke bedrijfsbehoefte en budget.',
  serviceTypes: [
    {
      type: 'Bedrijfswebsite',
      description: 'Professionele corporate websites voor MKB en grote bedrijven',
      features: ['Corporate branding', 'Team pagina\'s', 'Nieuwsmodule', 'Contact formulieren'],
      startingPrice: '€2.500',
      badge: 'Populair'
    },
    {
      type: 'Portfolio Website',
      description: 'Creatieve portfolio\'s voor kunstenaars, fotografen en designers',
      features: ['Galerij functionaliteit', 'Project showcases', 'Client testimonials', 'Social media integratie'],
      startingPrice: '€1.500'
    },
    {
      type: 'Landingspagina',
      description: 'Geoptimaliseerde landingspagina\'s voor marketing campagnes',
      features: ['Conversie optimalisatie', 'A/B testing setup', 'Analytics integratie', 'Lead capture forms'],
      startingPrice: '€750'
    },
    {
      type: 'Blog Platform',
      description: 'Content-gerichte websites met uitgebreide blog functionaliteiten',
      features: ['CMS integratie', 'SEO tools', 'Social sharing', 'Comment systeem'],
      startingPrice: '€1.200'
    }
  ],
  
  // Statistics Section
  statisticsTitle: 'Bewezen Resultaten',
  statistics: [
    {
      value: '200+',
      label: 'Websites Gelanceerd',
      description: 'Succesvolle projecten voor Nederlandse bedrijven'
    },
    {
      value: '98%',
      label: 'Klant Tevredenheid',
      description: 'Gebaseerd op client feedback en reviews'
    },
    {
      value: '< 2s',
      label: 'Gemiddelde Laadtijd',
      description: 'Optimale Core Web Vitals scores'
    }
  ],
  
  // Process Section
  processTitle: 'Ons Website Ontwikkelproces',
  processSubtitle: 'Van eerste idee tot live website - zo werken wij aan uw online succes.',
  processSteps: [
    {
      step: '01',
      title: 'Online Kennismakingsgesprek',
      description: 'Uitgebreide intake via videocall om uw wensen, doelen en budget te bespreken voor een perfect passende website.'
    },
    {
      step: '02',
      title: 'Digitale Strategie & Design',
      description: 'Wireframing, visual design en user experience planning met online feedback rondes voor optimale resultaten.'
    },
    {
      step: '03',
      title: 'Technische Ontwikkeling',
      description: 'Professionele ontwikkeling met moderne technologieën, live preview en uitgebreide testing op alle apparaten.'
    },
    {
      step: '04',
      title: 'SEO & Performance Optimalisatie',
      description: 'Technische SEO implementatie, snelheidsoptimalisatie en Core Web Vitals configuratie.'
    },
    {
      step: '05',
      title: 'Lancering & Training',
      description: 'Website lancering met volledige documentatie, CMS training en 30 dagen gratis support.'
    },
    {
      step: '06',
      title: 'Doorlopende Ondersteuning',
      description: 'Maandelijkse monitoring, updates en professionele support voor optimale website prestaties.'
    }
  ],
  
  // Trust Indicators Section
  trustTitle: 'Waarom Nederlandse Bedrijven voor Ons Kiezen',
  trustIndicators: [
    {
      icon: '🎯',
      title: 'Nederlandse Expertise',
      description: 'Specialisten in de Nederlandse markt met begrip voor lokale business cultuur en gebruikersgedrag.'
    },
    {
      icon: '🚀',
      title: 'Bewezen Performance',
      description: 'Gemiddeld 300% meer online leads en 40% betere conversie rates na website lancering.'
    },
    {
      icon: '🛡️',
      title: 'Volledige Transparantie',
      description: 'Geen verborgen kosten, duidelijke communicatie en 100% eigendom van uw website en content.'
    }
  ],
  
  // FAQ Section
  faqTitle: 'Veelgestelde Vragen over Websites Laten Maken',
  faqs: [
    {
      question: 'Hoe lang duurt het om een website te laten maken?',
      answer: 'De ontwikkeltijd hangt af van de complexiteit van uw project. Een eenvoudige bedrijfswebsite is meestal binnen 2-3 weken klaar, terwijl meer complexe websites 4-8 weken kunnen duren. We houden u gedurende het hele proces op de hoogte van de voortgang via online updates en regelmatige videocalls.'
    },
    {
      question: 'Wat zijn de kosten voor het laten maken van een website?',
      answer: 'Onze website prijzen starten vanaf €750 voor een landingspagina tot €2.500+ voor complexe bedrijfswebsites. De exacte kosten hangen af van uw specifieke wensen, functionaliteiten en design complexiteit. We bieden altijd een gratis, gedetailleerde offerte op maat zonder verplichtingen.'
    },
    {
      question: 'Krijg ik een responsive website die werkt op mobiele apparaten?',
      answer: 'Absoluut! Alle websites die wij ontwikkelen zijn volledig responsive en geoptimaliseerd voor alle apparaten. We gebruiken een mobile-first aanpak om ervoor te zorgen dat uw website perfect werkt op smartphones, tablets en desktops met optimale gebruikerservaring.'
    },
    {
      question: 'Kan ik zelf de content van mijn website aanpassen?',
      answer: 'Ja, we implementeren gebruiksvriendelijke CMS-systemen waarmee u eenvoudig content kunt toevoegen, bewerken en verwijderen. We verzorgen ook uitgebreide online training via screensharing zodat u zelfstandig uw website kunt beheren en updaten.'
    },
    {
      question: 'Is mijn website geoptimaliseerd voor Google (SEO)?',
      answer: 'Alle websites worden standaard geoptimaliseerd voor zoekmachines. Dit omvat technische SEO, snelle laadtijden, mobile-vriendelijkheid, proper schema markup en basis content optimalisatie. Voor uitgebreide SEO campagnes hebben we separate pakketten beschikbaar.'
    },
    {
      question: 'Wat voor ondersteuning krijg ik na de lancering?',
      answer: 'Elke website komt met 30 dagen gratis support na lancering. Daarnaast bieden we doorlopende onderhouds- en supportpakketten voor hosting, updates, backups en technische ondersteuning. We zijn altijd bereikbaar voor vragen of aanpassingen.'
    }
  ],
  
  // Final CTA Section
  finalCTATitle: 'Klaar voor uw nieuwe professionele website?',
  finalCTADescription: 'Krijg een gratis website audit en persoonlijk advies voor uw online aanwezigheid. Geen verplichtingen, wel concrete aanbevelingen.',
  finalPrimaryCTA: 'Gratis Website Audit',
  finalSecondaryCTA: 'Direct Bellen',
  
  // SEO
  pageSlug: 'website-laten-maken'
};

export default function WebsiteLatenMaken() {
  return <UnifiedServicePage {...servicePageData} />;
}