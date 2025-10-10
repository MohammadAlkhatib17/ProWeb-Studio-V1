import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';
import UnifiedServicePage from '@/components/unified/UnifiedServicePage';
import { ServicePageProps } from '@/components/unified/ServicePageComponents';

export const dynamic = 'force-static';
export const revalidate = 7200; // 2 hours - service content is fairly stable
export const fetchCache = 'force-cache';

// Enhanced service page metadata with all SEO optimizations
export const metadata: Metadata = generateMetadata('/diensten/content-marketing', {
  service: 'content-marketing',
  pageType: 'service',
  lastModified: new Date().toISOString(),
  image: {
    url: '/og-content-marketing.png',
    alt: 'Content Marketing Nederland - ProWeb Studio Content Services',
    width: 1200,
    height: 630,
  },
});

const servicePageData: ServicePageProps = {
  // Hero Section
  title: 'Content Marketing',
  subtitle: 'Strategische content die uw merk laat groeien',
  heroDescription: 'Van blog artikelen tot social media content - wij creëren waardevolle content die uw doelgroep betrekt en converteert. SEO-geoptimaliseerd en data-driven.',
  primaryCTA: 'Gratis Content Strategie',
  secondaryCTA: 'Bekijk Contentcases',
  
  // Features Section
  featuresTitle: 'Complete Content Marketing Strategie',
  featuresSubtitle: 'Van contentplanning tot prestatiemonitoring - wij zorgen voor alle aspecten van succesvolle content marketing.',
  features: [
    {
      title: 'Content Strategy',
      description: 'Datagedreven contentstrategie afgestemd op uw doelgroep',
      icon: '🎯',
      details: [
        'Doelgroep analyse & persona ontwikkeling',
        'Content calendar & redactionele planning',
        'Competitive analysis & gap identificatie',
        'Performance KPI\'s & success metrics'
      ]
    },
    {
      title: 'SEO Content Creation',
      description: 'SEO-geoptimaliseerde content die rankt en converteert',
      icon: '✍️',
      details: [
        'Keyword research & content optimalisatie',
        'Blog artikelen & website content',
        'Landing pages & product beschrijvingen',
        'Long-form content & whitepapers'
      ]
    },
    {
      title: 'Social Media Content',
      description: 'Engaging social media content voor alle platforms',
      icon: '📱',
      details: [
        'Platform-specifieke content strategie',
        'Visual content & graphic design',
        'Video content & motion graphics',
        'Community management & engagement'
      ]
    },
    {
      title: 'Content Analytics',
      description: 'Uitgebreide analyse en rapportage van content prestaties',
      icon: '�',
      details: [
        'Google Analytics & social insights',
        'Content ROI & conversion tracking',
        'Engagement metrics & audience analysis',
        'Monthly performance reports'
      ]
    }
  ],
  
  // Packages Section
  packagesTitle: 'Webshop Pakketten',
  packagesSubtitle: 'Van basis webshop tot premium e-commerce platform - kies het pakket dat bij uw ambities past.',
  packages: [
    {
      name: 'Starter Webshop',
      description: 'Professionele webshop voor startende ondernemers',
      price: '€2.500',
      features: [
        'Tot 50 producten',
        'Basis betaalintegraties (iDEAL, PayPal)',
        'Responsive design & mobiel geoptimaliseerd',
        'Basis SEO optimalisatie'
      ],
      popular: false
    },
    {
      name: 'Business Webshop',
      description: 'Complete e-commerce oplossing voor groeiende bedrijven',
      price: '€4.500',
      features: [
        'Onbeperkt aantal producten',
        'Alle betaalmethoden & verzendintegraties',
        'Geavanceerde SEO & marketing tools',
        'Customer portal & wishlist functionaliteit'
      ],
      popular: true
    },
    {
      name: 'Enterprise Webshop',
      description: 'Premium e-commerce platform met custom functionaliteiten',
      price: '€7.500',
      features: [
        'Custom functionaliteiten & integraties',
        'Multi-vendor marketplace mogelijkheden',
        'Geavanceerde analytics & rapportage',
        'Dedicated account management'
      ],
      popular: false
    }
  ],
  
  // Statistics Section
  statisticsTitle: 'Bewezen E-commerce Resultaten',
  statistics: [
    {
      value: '250%',
      label: 'Gemiddelde Omzet Stijging',
      description: 'Resultaten behaald door onze webshop klanten'
    },
    {
      value: '85%',
      label: 'Websites Die Top 3 Bereiken',
      description: 'Succespercentage voor competitieve keywords'
    },
    {
      value: '99.9%',
      label: 'Uptime Garantie',
      description: 'Betrouwbare hosting en ondersteuning'
    },
    {
      value: '4 weken',
      label: 'Gemiddelde Oplevering',
      description: 'Van concept tot live webshop'
    }
  ],
  
  // Process Section
  processTitle: 'Ons Webshop Proces',
  processSubtitle: 'Van concept tot conversie - ons bewezen stappenplan voor succesvolle webshops.',
  processSteps: [
    {
      step: '01',
      title: 'Strategie & Planning',
      description: 'Complete e-commerce strategie, doelgroep analyse en technische planning voor uw perfecte webshop.'
    },
    {
      step: '02',
      title: 'Design & Development',
      description: 'Custom webshop design en development met focus op gebruiksvriendelijkheid en conversie.'
    },
    {
      step: '03',
      title: 'Integratie & Testing',
      description: 'Betaal- en verzendintegraties, uitgebreid testen en optimalisatie voor perfecte functionaliteit.'
    },
    {
      step: '04',
      title: 'Launch & Support',
      description: 'Succesvolle webshop launch met training, documentatie en doorlopende technische ondersteuning.'
    }
  ],
  
  // Trust Indicators Section
  trustTitle: 'Waarom Kiezen Voor Onze E-commerce Expertise',
  trustIndicators: [
    {
      icon: '🏆',
      title: 'Shopify & WooCommerce Certified',
      description: 'Gecertificeerde e-commerce professionals met bewezen expertise in alle major platforms.'
    },
    {
      icon: '🔒',
      title: 'PCI DSS & Security Experts',
      description: 'Ervaren developers die veiligheid en compliance prioriteren voor vertrouwde webshops.'
    },
    {
      icon: '⚡',
      title: 'Core Web Vitals Experts',
      description: 'Gespecialiseerd in Google\'s nieuwste ranking factoren en performance optimalisatie.'
    },
    {
      icon: '✅',
      title: 'White-hat SEO Methoden',
      description: 'Uitsluitend veilige, Google-conforme SEO technieken voor duurzame resultaten.'
    }
  ],
  
  // FAQ Section
  faqTitle: 'Veelgestelde Vragen over Webshop Laten Maken',
  faqs: [
    {
      question: 'Hoe lang duurt het om een webshop te laten maken?',
      answer: 'Een professionele webshop is meestal binnen 4-6 weken gereed, afhankelijk van de complexiteit en het aantal producten. Voor enterprise webshops met custom functionaliteiten kunnen we 8-12 weken nodig hebben. We plannen alles vooraf en houden u op de hoogte via wekelijkse updates.'
    },
    {
      question: 'Wat zijn de kosten voor een webshop laten maken?',
      answer: 'Onze webshop prijzen beginnen bij €2.500 voor een starter webshop tot €7.500+ voor enterprise oplossingen. De kosten hangen af van het aantal producten, gewenste integraties en custom functionaliteiten. We bieden altijd een gedetailleerde offerte inclusief alle kosten.'
    },
    {
      question: 'Welke betaalmethoden kunnen worden geïntegreerd?',
      answer: 'We integreren alle populaire betaalmethoden: iDEAL, Bancontact, PayPal, creditcards (Visa/Mastercard), Apple Pay, Google Pay en achteraf betalen opties zoals Klarna en Afterpay. Alle betalingen zijn PCI DSS compliant beveiligd.'
    },
    {
      question: 'Krijg ik training om mijn webshop zelf te beheren?',
      answer: 'Ja! Na oplevering krijgt u uitgebreide training en documentatie om producten toe te voegen, bestellingen te beheren en content bij te werken. We bieden ook optionele video tutorials en doorlopende support wanneer nodig.'
    },
    {
      question: 'Worden verzendintegraties meegeleverd?',
      answer: 'Absoluut! We koppelen uw webshop aan major verzendpartners zoals PostNL, DPD, UPS en DHL. Dit omvat automatische track & trace, verzendlabels printen en dynamische verzendkosten berekening.'
    },
    {
      question: 'Is mijn webshop SEO geoptimaliseerd?',
      answer: 'Alle webshops worden volledig SEO geoptimaliseerd geleverd: snelle laadtijden, mobiel-vriendelijk design, gestructureerde data voor producten, XML sitemaps en Google Shopping integratie voor maximale online vindbaarheid.'
    }
  ],
  
  // Final CTA Section
  finalCTATitle: 'Klaar om uw eigen webshop te starten?',
  finalCTADescription: 'Ontvang een gratis webshop consult en ontdek hoe wij uw e-commerce droom werkelijkheid maken.',
  finalPrimaryCTA: 'Gratis SEO Analyse',
  finalSecondaryCTA: 'Direct Bellen',
  
  // SEO
  pageSlug: 'content-marketing'
};

export default function ContentMarketing() {
  return <UnifiedServicePage {...servicePageData} />;
}