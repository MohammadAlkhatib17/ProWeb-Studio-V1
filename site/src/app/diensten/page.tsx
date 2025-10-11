import type { Metadata } from 'next';
import dynamicImport from 'next/dynamic';

export const dynamic = 'force-static';
export const revalidate = 7200; // 2 hours - services content is fairly stable
export const fetchCache = 'force-cache';

import { Suspense } from 'react';

import Link from 'next/link';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Button } from '@/components/Button';
import SEOSchema from '@/components/SEOSchema';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQSection from '@/components/sections/FAQSection';
import DutchMarketFAQ from '@/components/DutchMarketFAQ';
import RelatedServices from '@/components/RelatedServices';
import ContentSuggestions from '@/components/ContentSuggestions';
import { 
  PageTitle,
  BodyText
} from '@/components/unified/LayoutComponents';

// Get canonical URL from environment with fallback
const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Website laten maken & Webshop bouwen | Nederlandse webdesign diensten – ProWeb Studio',
  description:
    'Professionele website laten maken of webshop bouwen voor Nederlandse bedrijven. Responsive webdesign, SEO-optimalisatie, iDEAL integratie. Betrouwbare partner voor uw digitale groei.',
  alternates: {
    canonical: '/diensten',
    languages: { 
      'nl-NL': '/diensten',
      'x-default': '/diensten'
    },
  },
  openGraph: {
    title: 'Website laten maken & Webshop bouwen | Nederlandse webdesign diensten – ProWeb Studio',
    description:
      'Maatwerk webdesign & development met 3D-ervaringen, technische SEO, Core Web Vitals en headless CMS. Gericht op groei en resultaat.',
    url: `${SITE_URL}/diensten`,
    type: 'website',
    locale: 'nl_NL',
  },
};

const ServicesPolyhedra = dynamicImport(() => import('@/three/ServicesPolyhedra'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-cosmic-900/50 animate-pulse rounded-lg" />
  ),
});

const services = [
  {
    title: 'Fundamenten voor Digitale Dominantie',
    description:
      'Uw website is het hart van uw digitale ecosysteem. Wij bouwen razendsnelle, veilige en schaalbare platformen die niet alleen vandaag indruk maken, maar ook klaar zijn voor de ambities van morgen. Dit is de technologische ruggengraat voor uw online groei. Ontdek meer over onze strategische aanpak in onze werkwijze.',
    features: [
      'Next.js & React Ontwikkeling',
      'Headless CMS Integratie',
      'Core Web Vitals Optimalisatie',
      'Responsive Design',
    ],
    icon: '🚀',
  },
  {
    title: 'Meeslepende Ervaringen die Onderscheiden',
    description:
      'In een overvolle markt is differentiatie cruciaal. Wij gebruiken interactieve 3D-technologie niet als gimmick, maar als een krachtig middel om uw producten tot leven te brengen, uw merkverhaal te vertellen en een onvergetelijke, diepe connectie met uw publiek te smeden. Bekijk voorbeelden in onze speeltuin.',
    features: [
      'WebGL & Three.js Experiences',
      'Interactieve Product Configurators',
      'Real-time 3D Visualisaties',
      'Performance Optimalisatie',
    ],
    icon: '🎯',
  },
  {
    title: 'Data-gedreven Groei en Optimalisatie',
    description:
      'Een prachtige website is slechts het begin. Wij zetten data om in actie. Door continu te analyseren, te testen en te optimaliseren, transformeren we uw bezoekers in klanten en maximaliseren we de return on investment (ROI) van uw digitale platform. Leer meer over ons team en onze missie.',
    features: [
      'Gebruikersdata Analyse',
      'A/B Testing & Conversie Optimalisatie',
      'SEO & Content Strategie',
      'Analytics & Tracking',
    ],
    icon: '📈',
  },
];

export default function Diensten() {
  // Generate JSON-LD schema for services
  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}/diensten#services`,
    inLanguage: 'nl-NL',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        '@id': `${SITE_URL}/diensten#service-${index + 1}`,
        name: service.title,
        description: service.description,
        provider: {
          '@id': `${SITE_URL}#organization`,
        },
        areaServed: {
          '@type': 'Place',
          name: 'Netherlands',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'NL',
          },
        },
        serviceType: service.features.join(', '),
        inLanguage: 'nl-NL',
        hasFAQ: {
          '@id': `${SITE_URL}/diensten#faq`,
        },
      },
    })),
  };

  return (
    <main className="pt-20 md:pt-24 relative overflow-hidden">
      {/* Breadcrumbs */}
      <Breadcrumbs />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(servicesSchema),
        }}
      />

      {/* Hero section with 3D elements */}
      <section className="relative min-h-[75svh] md:min-h-[70vh] overflow-hidden flex items-center content-safe-top">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cosmic-900/20 to-cosmic-900/40" />

        <Suspense
          fallback={<div className="absolute inset-0 bg-cosmic-900/50" />}
        >
          <ErrorBoundary>
            <ServicesPolyhedra />
          </ErrorBoundary>
        </Suspense>

        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <PageTitle className="max-w-5xl mx-auto animate-fade-in">
              Meer dan Code. Oplossingen die Groeien.
            </PageTitle>
            <BodyText className="max-w-4xl mx-auto text-cyan-300 animate-slide-up">
              Ontdek onze complete oplossingen voor professionele websites, 
              van moderne webdesign tot geavanceerde functionaliteiten.
            </BodyText>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-section px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {services.map((service, i) => {
              // Map service indices to semantic IDs
              const serviceIds = ['website', 'webshop', 'seo'];
              const serviceId = serviceIds[i] || `service-${i + 1}`;
              
              return (
              <div
                key={i}
                id={serviceId}
                className="glass p-6 sm:p-7 md:p-8 rounded-xl hover:border-cyan-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 group relative overflow-hidden animate-fade-in"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-magenta-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

                <div className="relative z-10">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 group-hover:text-cyan-300 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-slate-200 mb-8 leading-relaxed">
                    {service.description}
                  </p>
                  <h4 className="font-semibold text-cyan-300 mb-4">
                    Inclusief:
                  </h4>
                  <ul className="space-y-3">
                    {service.features.map((feature, j) => (
                      <li key={j} className="flex items-center text-sm">
                        <span className="text-cyan-300 mr-3 font-bold text-lg">
                          ✓
                        </span>
                        <span className="text-gray-200">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-section px-4 sm:px-6 bg-cosmic-800/20 border-t border-cosmic-700/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white leading-tight">
              Onze Technologische Kern
            </h2>
            <p className="text-base sm:text-lg text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Wij geloven in het kiezen van het juiste gereedschap voor elke
              uitdaging. Onze expertise ligt in een moderne, performante en
              schaalbare technologiestack, ontworpen om u een
              concurrentievoordeel te geven.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
            <div className="glass p-6 rounded-xl">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-300 mb-4">Frontend</h3>
              <ul className="space-y-2 text-slate-200 text-sm sm:text-base">
                <li>Next.js</li>
                <li>React</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>GSAP</li>
              </ul>
            </div>
            <div className="glass p-6 rounded-xl">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-300 mb-4">
                3D & Animatie
              </h3>
              <ul className="space-y-2 text-slate-200 text-sm sm:text-base">
                <li>WebGL</li>
                <li>Three.js</li>
                <li>React Three Fiber</li>
              </ul>
            </div>
            <div className="glass p-6 rounded-xl">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-300 mb-4">
                Backend & CMS
              </h3>
              <ul className="space-y-2 text-slate-200 text-sm sm:text-base">
                <li>Headless CMS (o.a. Sanity, Contentful)</li>
                <li>Node.js</li>
                <li>Vercel Serverless Functions</li>
              </ul>
            </div>
            <div className="glass p-6 rounded-xl">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-300 mb-4">
                Deployment & Infrastructuur
              </h3>
              <ul className="space-y-2 text-slate-200 text-sm sm:text-base">
                <li>Vercel</li>
                <li>Netlify</li>
                <li>AWS</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services & Internal Links Section */}
      <section className="py-section px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white leading-tight">
              Ontdek Meer van ProWeb Studio
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
            <div className="glass p-6 rounded-xl hover:border-cyan-500/60 transition-all duration-300 group">
              <h3 className="text-xl font-bold mb-3 text-cyan-300 group-hover:text-cyan-200">
                🏗️ Onze Werkwijze
              </h3>
              <p className="text-slate-200 mb-4 text-sm leading-relaxed">
                Ontdek hoe wij van idee naar realisatie werken. Van strategische planning 
                tot technische implementatie en doorlopende optimalisatie.
              </p>
              <Link 
                href="/werkwijze" 
                className="inline-flex items-center text-cyan-300 hover:text-cyan-300 transition-colors text-sm font-medium"
              >
                Bekijk onze projectaanpak
                <span className="ml-1">→</span>
              </Link>
            </div>

            <div className="glass p-6 rounded-xl hover:border-cyan-500/60 transition-all duration-300 group">
              <h3 className="text-xl font-bold mb-3 text-cyan-300 group-hover:text-cyan-200">
                🎮 3D Technologie Speeltuin
              </h3>
              <p className="text-slate-200 mb-4 text-sm leading-relaxed">
                Ervaar de kracht van moderne webtechnologie. Interactieve 3D-ervaringen, 
                WebGL-experimenten en innovatieve gebruikersinterfaces.
              </p>
              <Link 
                href="/speeltuin" 
                className="inline-flex items-center text-cyan-300 hover:text-cyan-300 transition-colors text-sm font-medium"
              >
                Ontdek onze 3D showcases
                <span className="ml-1">→</span>
              </Link>
            </div>

            <div className="glass p-6 rounded-xl hover:border-cyan-500/60 transition-all duration-300 group">
              <h3 className="text-xl font-bold mb-3 text-cyan-300 group-hover:text-cyan-200">
                👥 Over ProWeb Studio
              </h3>
              <p className="text-slate-200 mb-4 text-sm leading-relaxed">
                Leer het team kennen achter de innovatieve weboplossingen. Onze missie, 
                visie en de expertise die we inzetten voor uw digitale succes.
              </p>
              <Link 
                href="/over-ons" 
                className="inline-flex items-center text-cyan-300 hover:text-cyan-300 transition-colors text-sm font-medium"
              >
                Ontmoet het team
                <span className="ml-1">→</span>
              </Link>
            </div>
          </div>

          {/* Conversion-focused CTA */}
          <div className="text-center">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-cyan-300">
              Klaar voor een Website die Indruk Maakt?
            </h3>
            <p className="text-slate-200 mb-6 max-w-2xl mx-auto">
              Van concept tot conversie - wij realiseren digitale oplossingen die uw bedrijf 
              naar het volgende niveau tillen. Plan een gratis strategiesessie en ontdek de mogelijkheden.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                href="/contact"
                variant="primary"
                size="large"
              >
                Plan Gratis Strategiesessie
              </Button>
              <Button
                href="/portfolio"
                variant="secondary"
                size="large"
              >
                Bekijk Portfolio
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-section px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none -z-10 bg-gradient-to-b from-transparent via-cosmic-900/15 to-transparent" />
        <div className="absolute inset-0 pointer-events-none -z-10 portal-gradient opacity-40" />
        <div className="max-w-4xl mx-auto text-center glass rounded-2xl p-6 sm:p-8 md:p-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white leading-tight">
            Op maat gemaakte oplossingen
          </h2>
          <p className="text-base sm:text-lg text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Elk project is uniek. Laten we samen jouw perfecte oplossing bouwen
            die jouw verwachtingen overtreft.
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <Button
              href="/contact"
              variant="primary"
            >
              Plan een intake
            </Button>
            <Button
              href="/speeltuin"
              variant="secondary"
              className="flex items-center gap-2"
            >
              Ervaar onze technologie
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5-5 5M6 12h12"
                />
              </svg>
            </Button>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-section px-4 sm:px-6 bg-cosmic-800/20 border-t border-cosmic-700/60">
        <div className="max-w-7xl mx-auto">
          <div
            id="seo-content"
            className="prose prose-sm sm:prose-base prose-invert max-w-4xl mx-auto leading-relaxed"
          >
            <h1>Diensten die groei versnellen</h1>
            <h2>Webdesign &amp; Development</h2>
            <p>
              Een professionele website laten maken begint bij een ijzersterk
              fundament. Wij bouwen maatwerk websites met een scherp oog voor
              snelheid, gebruiksvriendelijkheid en een conversiegericht ontwerp dat
              bezoekers omzet in klanten. Of u nu ZZP&apos;er bent of een groeiend
              MKB-bedrijf runt, uw online groei is onze prioriteit.
            </p>
            <h2>3D Web Experiences (WebGL/Three.js)</h2>
            <p>
              Onderscheid uw merk met interactieve 3D-ervaringen die uw producten en
              diensten tot leven brengen. Door WebGL en Three.js technologie slim in
              te zetten, creëren we meeslepende gebruikerservaringen die langer op
              uw website blijven hangen. Perfect voor bedrijven die hun merkverhaal
              op een unieke manier willen vertellen en een blijvende indruk willen
              maken.
            </p>
            <h2>Performance Optimalisatie</h2>
            <p>
              Een snelle website is essentieel voor een hogere ranking in Google en
              betere gebruikerservaring. Wij optimaliseren uw Core Web Vitals,
              implementeren geavanceerde caching strategieën en gebruiken moderne
              beeldformaten zoals AVIF en WebP. Het resultaat: een bliksemsnelle
              website die zowel gebruikers als zoekmachines tevreden houdt.
            </p>
            <h2>SEO &amp; Content Strategie</h2>
            <p>
              Zichtbaarheid in Google begint met een solide SEO-strategie. Wij
              voeren diepgaand zoekwoordenonderzoek uit, optimaliseren technische
              aspecten en ontwikkelen een contentplan dat uw doelgroep aanspreekt.
              Van lokale SEO voor Nederlandse bedrijven tot internationale groei –
              wij zorgen ervoor dat uw website gevonden wordt door de juiste
              klanten.
            </p>
            <h2>Headless CMS &amp; Integraties</h2>
            <p>
              Flexibel contentbeheer is de sleutel tot efficiënte online
              communicatie. Met headless CMS-oplossingen zoals Sanity of Contentful
              krijgt u volledige controle over uw content, zonder technische
              beperkingen. Wij integreren naadloos met uw bestaande systemen en
              zorgen voor een workflow die aansluit bij uw bedrijfsprocessen.
            </p>
            <h2>CRO (Conversion Rate Optimization)</h2>
            <p>
              Meer bezoekers is mooi, maar meer klanten is beter. Door systematische
              A/B-testing, gebruikersanalyse en UX-verbeteringen transformeren we uw
              website van een digitale brochure naar een krachtige verkoopmotor.
              Elke aanpassing is data-gedreven en gericht op het verhogen van uw
              conversie en omzet.
            </p>
            <p>
              <a href="/contact" className="inline-block mt-4">
                Vraag een groeiscan aan
              </a>
            </p>
          </div>
        </div>
      </section>

      <FAQSection title="Vragen over onze Diensten">
        <DutchMarketFAQ />
      </FAQSection>
      
      <RelatedServices showAll={true} />
      
      <ContentSuggestions />
      
      <SEOSchema 
        pageType="services" 
        includeFAQ={true}
      />
    </main>
  );
}
