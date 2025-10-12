import type { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";
import UnifiedServicePage from "@/components/unified/UnifiedServicePage";
import { ServicePageProps } from "@/components/unified/ServicePageComponents";

export const dynamic = "force-static";
export const revalidate = 7200; // 2 hours - service content is fairly stable
export const fetchCache = "force-cache";

// Enhanced service page metadata with all SEO optimizations
export const metadata: Metadata = generateMetadata(
  "/diensten/seo-optimalisatie",
  {
    service: "seo-optimalisatie",
    pageType: "service",
    lastModified: new Date().toISOString(),
    image: {
      url: "/og-seo-optimalisatie.png",
      alt: "SEO Optimalisatie Nederland - ProWeb Studio Zoekmachine Services",
      width: 1200,
      height: 630,
    },
  },
);

const servicePageData: ServicePageProps = {
  // Hero Section
  title: "SEO Optimalisatie",
  subtitle: "Verhoog uw Google rankings met datagedreven SEO strategieën",
  heroDescription:
    "Technische SEO, content optimalisatie en link building voor duurzame organische groei. Professionele zoekmachine optimalisatie die meetbare resultaten levert.",
  primaryCTA: "Gratis SEO Analyse",
  secondaryCTA: "SEO Voorbeelden",

  // Features Section
  featuresTitle: "Volledige SEO Service",
  featuresSubtitle:
    "Van technische optimalisatie tot content strategie - wij zorgen voor alle aspecten van moderne zoekmachine optimalisatie.",
  features: [
    {
      title: "Technische SEO",
      description:
        "Complete technische optimalisatie voor betere crawlability en indexering",
      icon: "�",
      details: [
        "Core Web Vitals optimalisatie",
        "Site speed & performance verbetering",
        "Crawlability & indexering optimalisatie",
        "Schema markup implementatie",
      ],
    },
    {
      title: "Content Optimalisatie",
      description: "SEO-geoptimaliseerde content die rankt en converteert",
      icon: "�",
      details: [
        "Keyword research & strategie ontwikkeling",
        "On-page optimalisatie & content audit",
        "Content gap analyse & planning",
        "Semantic SEO & topic clustering",
      ],
    },
    {
      title: "Link Building",
      description: "Autoriteit opbouw door kwalitatieve backlink acquisitie",
      icon: "🔗",
      details: [
        "High-authority link acquisition",
        "Guest posting & outreach strategieën",
        "Broken link building campagnes",
        "Internal linking optimalisatie",
      ],
    },
    {
      title: "SEO Analytics",
      description: "Data-driven SEO met uitgebreide tracking en rapportage",
      icon: "📊",
      details: [
        "Google Analytics 4 implementatie",
        "Search Console optimalisatie",
        "Ranking monitoring & alerts",
        "ROI tracking & performance rapportage",
      ],
    },
  ],

  // Packages Section
  packagesTitle: "SEO Pakketten",
  packagesSubtitle:
    "Van eenmalige audit tot doorlopende SEO begeleiding - kies het pakket dat bij uw doelen past.",
  packages: [
    {
      name: "SEO Audit",
      description: "Complete technische en content analyse van uw website",
      price: "€750",
      features: [
        "Technische SEO audit & analyse",
        "Keyword research & opportunity mapping",
        "Concurrentie onderzoek & benchmarking",
        "Gedetailleerd actieplan rapport",
      ],
      popular: false,
    },
    {
      name: "SEO Optimalisatie",
      description: "Volledige on-page en technische SEO implementatie",
      price: "€1.500",
      features: [
        "Technische SEO fixes & implementatie",
        "Content optimalisatie & herstructurering",
        "Schema markup & structured data",
        "Performance & Core Web Vitals verbetering",
      ],
      popular: true,
    },
    {
      name: "SEO Campaign",
      description: "Maandelijkse SEO begeleiding met content en link building",
      price: "€750/maand",
      features: [
        "Maandelijkse SEO optimalisatie",
        "Content creatie & optimalisatie",
        "Link building & outreach",
        "Uitgebreide maandelijkse rapportage",
      ],
      popular: false,
    },
  ],

  // Statistics Section
  statisticsTitle: "Bewezen SEO Resultaten",
  statistics: [
    {
      value: "150%",
      label: "Gemiddelde Organisch Verkeer Stijging",
      description: "Bewezen resultaten bij onze SEO klanten",
    },
    {
      value: "85%",
      label: "Websites Die Top 3 Bereiken",
      description: "Succespercentage voor competitieve keywords",
    },
    {
      value: "6 maanden",
      label: "Gemiddelde Tijd Tot Resultaten",
      description: "Duurzame rankings verbetering",
    },
  ],

  // Process Section
  processTitle: "Ons SEO Proces",
  processSubtitle: "Datagedreven aanpak voor meetbare SEO resultaten.",
  processSteps: [
    {
      step: "01",
      title: "SEO Audit & Analyse",
      description:
        "Complete technische audit, keyword research en concurrentie analyse voor een solide SEO strategie.",
    },
    {
      step: "02",
      title: "Strategie Ontwikkeling",
      description:
        "SEO roadmap en actieplan gebaseerd op audit bevindingen en bedrijfsdoelstellingen.",
    },
    {
      step: "03",
      title: "Implementatie",
      description:
        "Technische fixes, on-page optimalisatie en content verbetering volgens best practices.",
    },
    {
      step: "04",
      title: "Monitoring & Optimalisatie",
      description:
        "Continue monitoring, rapportage en iteratieve verbeteringen voor duurzame resultaten.",
    },
    {
      step: "06",
      title: "Doorlopende Ondersteuning",
      description:
        "Maandelijkse monitoring, updates en professionele support voor optimale website prestaties.",
    },
  ],

  // Trust Indicators Section
  trustTitle: "Waarom Kiezen Voor Onze SEO Expertise",
  trustIndicators: [
    {
      icon: "📊",
      title: "Google Analytics & Search Console Certified",
      description:
        "Gecertificeerde SEO professionals met diepgaande tool kennis en bewezen expertise.",
    },
    {
      icon: "🎯",
      title: "Technische SEO Specialisten",
      description:
        "Ervaren developers en SEO experts die technische en strategische optimalisatie combineren.",
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
  faqTitle: "Veelgestelde Vragen over SEO Optimalisatie",
  faqs: [
    {
      question: "Hoe lang duurt het om een website te laten maken?",
      answer:
        "De ontwikkeltijd hangt af van de complexiteit van uw project. Een eenvoudige bedrijfswebsite is meestal binnen 2-3 weken klaar, terwijl meer complexe websites 4-8 weken kunnen duren. We houden u gedurende het hele proces op de hoogte van de voortgang via online updates en regelmatige videocalls.",
    },
    {
      question: "Wat zijn de kosten voor het laten maken van een website?",
      answer:
        "Onze website prijzen starten vanaf €750 voor een landingspagina tot €2.500+ voor complexe bedrijfswebsites. De exacte kosten hangen af van uw specifieke wensen, functionaliteiten en design complexiteit. We bieden altijd een gratis, gedetailleerde offerte op maat zonder verplichtingen.",
    },
    {
      question:
        "Krijg ik een responsive website die werkt op mobiele apparaten?",
      answer:
        "Absoluut! Alle websites die wij ontwikkelen zijn volledig responsive en geoptimaliseerd voor alle apparaten. We gebruiken een mobile-first aanpak om ervoor te zorgen dat uw website perfect werkt op smartphones, tablets en desktops met optimale gebruikerservaring.",
    },
    {
      question: "Hoe meten jullie SEO succes?",
      answer:
        "We monitoren rankings, organisch verkeer, conversies, Core Web Vitals en technische website gezondheid. Maandelijkse rapportages tonen concrete vooruitgang met actionable insights en aanbevelingen voor verdere verbetering.",
    },
    {
      question: "Doen jullie ook lokale SEO?",
      answer:
        "Ja, we zijn gespecialiseerd in lokale SEO voor Nederlandse bedrijven. Dit omvat Google Business Profile optimalisatie, lokale citations, review management en geo-gerichte content strategie voor betere lokale vindbaarheid.",
    },
    {
      question: "Welke SEO tools gebruiken jullie?",
      answer:
        "We werken met professionele SEO tools zoals Google Analytics 4, Search Console, Screaming Frog, Ahrefs, SEMrush en proprietary tracking systemen voor uitgebreide analyse en monitoring van SEO prestaties.",
    },
  ],

  // Final CTA Section
  finalCTATitle: "Klaar om uw Google rankings te verbeteren?",
  finalCTADescription:
    "Ontvang een gratis SEO analyse en ontdek hoe wij uw website naar de top van Google kunnen brengen.",
  finalPrimaryCTA: "Gratis SEO Analyse",
  finalSecondaryCTA: "Direct Bellen",

  // SEO
  pageSlug: "seo-optimalisatie",
};

export default function SEOOptimalisatie() {
  return <UnifiedServicePage {...servicePageData} />;
}
