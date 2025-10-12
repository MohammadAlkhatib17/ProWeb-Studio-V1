import type { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";
import UnifiedServicePage from "@/components/unified/UnifiedServicePage";
import { ServicePageProps } from "@/components/unified/ServicePageComponents";

export const dynamic = "force-static";
export const revalidate = 7200; // 2 hours - service content is fairly stable
export const fetchCache = "force-cache";

// Enhanced service page metadata with all SEO optimizations
export const metadata: Metadata = generateMetadata(
  "/diensten/conversion-optimalisatie",
  {
    service: "conversion-optimalisatie",
    pageType: "service",
    lastModified: new Date().toISOString(),
    image: {
      url: "/og-webshop-laten-maken.png",
      alt: "Webshop Laten Maken Nederland - ProWeb Studio E-commerce Services",
      width: 1200,
      height: 630,
    },
  },
);

const servicePageData: ServicePageProps = {
  // Hero Section
  title: "Conversion Optimalisatie",
  subtitle: "Meer conversies uit uw bestaande verkeer",
  heroDescription:
    "Van A/B testing tot user behavior analyse - wij optimaliseren uw website voor maximale conversie. Datagedreven aanpak met meetbare resultaten.",
  primaryCTA: "Gratis Conversie Audit",
  secondaryCTA: "Bekijk Resultaten",

  // Features Section
  featuresTitle: "Complete E-commerce Oplossing",
  featuresSubtitle:
    "Van productbeheer tot betalingsverwerking - wij zorgen voor alle aspecten van moderne e-commerce.",
  features: [
    {
      title: "Product Management",
      description: "Uitgebreid productcatalogus systeem met voorraad beheer",
      icon: "📦",
      details: [
        "Onbeperkt aantal producten",
        "Varianten en opties beheer",
        "Voorraad tracking & alerts",
        "Bulk product import/export",
      ],
    },
    {
      title: "Betaal Integraties",
      description: "Veilige betalingsverwerking met alle populaire methoden",
      icon: "💳",
      details: [
        "iDEAL, Bancontact, PayPal integratie",
        "Creditcard verwerking (Visa, Mastercard)",
        "Achteraf betalen (Klarna, Afterpay)",
        "PCI DSS compliant beveiliging",
      ],
    },
    {
      title: "Bestelling & Verzending",
      description: "Geautomatiseerd bestel- en verzendproces voor efficiëntie",
      icon: "�",
      details: [
        "Automatische bestelling notificaties",
        "PostNL, DPD, UPS integratie",
        "Track & trace functionaliteit",
        "Verzendkosten calculator",
      ],
    },
    {
      title: "Marketing & SEO",
      description: "E-commerce geoptimaliseerde marketing tools en SEO",
      icon: "📈",
      details: [
        "Product SEO optimalisatie",
        "Google Shopping integratie",
        "Kortingscodes & promoties",
        "E-mail marketing automation",
      ],
    },
  ],

  // Packages Section
  packagesTitle: "Webshop Pakketten",
  packagesSubtitle:
    "Van basis webshop tot premium e-commerce platform - kies het pakket dat bij uw ambities past.",
  packages: [
    {
      name: "Starter Webshop",
      description: "Professionele webshop voor startende ondernemers",
      price: "€2.500",
      features: [
        "Tot 50 producten",
        "Basis betaalintegraties (iDEAL, PayPal)",
        "Responsive design & mobiel geoptimaliseerd",
        "Basis SEO optimalisatie",
      ],
      popular: false,
    },
    {
      name: "Business Webshop",
      description: "Complete e-commerce oplossing voor groeiende bedrijven",
      price: "€4.500",
      features: [
        "Onbeperkt aantal producten",
        "Alle betaalmethoden & verzendintegraties",
        "Geavanceerde SEO & marketing tools",
        "Customer portal & wishlist functionaliteit",
      ],
      popular: true,
    },
    {
      name: "Enterprise Webshop",
      description: "Premium e-commerce platform met custom functionaliteiten",
      price: "€7.500",
      features: [
        "Custom functionaliteiten & integraties",
        "Multi-vendor marketplace mogelijkheden",
        "Geavanceerde analytics & rapportage",
        "Dedicated account management",
      ],
      popular: false,
    },
  ],

  // Statistics Section
  statisticsTitle: "Bewezen E-commerce Resultaten",
  statistics: [
    {
      value: "250%",
      label: "Gemiddelde Omzet Stijging",
      description: "Resultaten behaald door onze webshop klanten",
    },
    {
      value: "85%",
      label: "Websites Die Top 3 Bereiken",
      description: "Succespercentage voor competitieve keywords",
    },
    {
      value: "99.9%",
      label: "Uptime Garantie",
      description: "Betrouwbare hosting en ondersteuning",
    },
    {
      value: "4 weken",
      label: "Gemiddelde Oplevering",
      description: "Van concept tot live webshop",
    },
  ],

  // Process Section
  processTitle: "Ons Webshop Proces",
  processSubtitle:
    "Van concept tot conversie - ons bewezen stappenplan voor succesvolle webshops.",
  processSteps: [
    {
      step: "01",
      title: "Strategie & Planning",
      description:
        "Complete e-commerce strategie, doelgroep analyse en technische planning voor uw perfecte webshop.",
    },
    {
      step: "02",
      title: "Design & Development",
      description:
        "Custom webshop design en development met focus op gebruiksvriendelijkheid en conversie.",
    },
    {
      step: "03",
      title: "Integratie & Testing",
      description:
        "Betaal- en verzendintegraties, uitgebreid testen en optimalisatie voor perfecte functionaliteit.",
    },
    {
      step: "04",
      title: "Launch & Support",
      description:
        "Succesvolle webshop launch met training, documentatie en doorlopende technische ondersteuning.",
    },
  ],

  // Trust Indicators Section
  trustTitle: "Waarom Kiezen Voor Onze E-commerce Expertise",
  trustIndicators: [
    {
      icon: "🏆",
      title: "Shopify & WooCommerce Certified",
      description:
        "Gecertificeerde e-commerce professionals met bewezen expertise in alle major platforms.",
    },
    {
      icon: "🔒",
      title: "PCI DSS & Security Experts",
      description:
        "Ervaren developers die veiligheid en compliance prioriteren voor vertrouwde webshops.",
    },
    {
      icon: "⚡",
      title: "Core Web Vitals Experts",
      description:
        "Gespecialiseerd in Google's nieuwste ranking factoren en performance optimalisatie.",
    },
    {
      icon: "✅",
      title: "White-hat SEO Methoden",
      description:
        "Uitsluitend veilige, Google-conforme SEO technieken voor duurzame resultaten.",
    },
  ],

  // FAQ Section
  faqTitle: "Veelgestelde Vragen over Webshop Laten Maken",
  faqs: [
    {
      question: "Hoe lang duurt het om een webshop te laten maken?",
      answer:
        "Een professionele webshop is meestal binnen 4-6 weken gereed, afhankelijk van de complexiteit en het aantal producten. Voor enterprise webshops met custom functionaliteiten kunnen we 8-12 weken nodig hebben. We plannen alles vooraf en houden u op de hoogte via wekelijkse updates.",
    },
    {
      question: "Wat zijn de kosten voor een webshop laten maken?",
      answer:
        "Onze webshop prijzen beginnen bij €2.500 voor een starter webshop tot €7.500+ voor enterprise oplossingen. De kosten hangen af van het aantal producten, gewenste integraties en custom functionaliteiten. We bieden altijd een gedetailleerde offerte inclusief alle kosten.",
    },
    {
      question: "Welke betaalmethoden kunnen worden geïntegreerd?",
      answer:
        "We integreren alle populaire betaalmethoden: iDEAL, Bancontact, PayPal, creditcards (Visa/Mastercard), Apple Pay, Google Pay en achteraf betalen opties zoals Klarna en Afterpay. Alle betalingen zijn PCI DSS compliant beveiligd.",
    },
    {
      question: "Krijg ik training om mijn webshop zelf te beheren?",
      answer:
        "Ja! Na oplevering krijgt u uitgebreide training en documentatie om producten toe te voegen, bestellingen te beheren en content bij te werken. We bieden ook optionele video tutorials en doorlopende support wanneer nodig.",
    },
    {
      question: "Worden verzendintegraties meegeleverd?",
      answer:
        "Absoluut! We koppelen uw webshop aan major verzendpartners zoals PostNL, DPD, UPS en DHL. Dit omvat automatische track & trace, verzendlabels printen en dynamische verzendkosten berekening.",
    },
    {
      question: "Is mijn webshop SEO geoptimaliseerd?",
      answer:
        "Alle webshops worden volledig SEO geoptimaliseerd geleverd: snelle laadtijden, mobiel-vriendelijk design, gestructureerde data voor producten, XML sitemaps en Google Shopping integratie voor maximale online vindbaarheid.",
    },
  ],

  // Final CTA Section
  finalCTATitle: "Klaar om uw eigen webshop te starten?",
  finalCTADescription:
    "Ontvang een gratis webshop consult en ontdek hoe wij uw e-commerce droom werkelijkheid maken.",
  finalPrimaryCTA: "Gratis SEO Analyse",
  finalSecondaryCTA: "Direct Bellen",

  // SEO
  pageSlug: "conversion-optimalisatie",
};

export default function ConversionOptimalisatie() {
  return <UnifiedServicePage {...servicePageData} />;
}
