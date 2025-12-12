import type { Metadata } from 'next';

import { generatePageMetadata } from '@/lib/metadata';

import dynamicImport from 'next/dynamic';

export const dynamic = 'force-static';
export const revalidate = 7200; // 2 hours - services content is fairly stable
export const fetchCache = 'force-cache';

export const metadata: Metadata = generatePageMetadata('services');

import { Suspense } from 'react';

import Link from 'next/link';

import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/Button';
import ContentSuggestions from '@/components/ContentSuggestions';
import DutchMarketFAQ from '@/components/DutchMarketFAQ';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DutchBusinessInfo, LocalBusinessJSON } from '@/components/local-seo';
import RelatedServices from '@/components/RelatedServices';
import FAQSection from '@/components/sections/FAQSection';
import SEOSchema from '@/components/SEOSchema';
import { steden } from '@/config/steden.config';
import { BentoGrid, BentoGridItem } from '@/components/ui/BentoGrid';
import {
  Rocket, Target, TrendingUp, Code2, Cpu, Server,
  Zap, Search, Layout, Database,
  CheckCircle2, ArrowRight, Laptop
} from 'lucide-react';

// Get canonical URL from environment with fallback
const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');

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
      'Uw website is het hart van uw digitale ecosysteem. Wij bouwen razendsnelle, veilige en schaalbare platformen die niet alleen vandaag indruk maken, maar ook klaar zijn voor de ambities van morgen.',
    features: [
      'Next.js & React Ontwikkeling',
      'Headless CMS Integratie',
      'Core Web Vitals Optimalisatie',
      'Responsive Design',
    ],
    icon: <Rocket className="w-8 h-8 text-cyan-400" />,
    iconBg: "bg-cyan-500/20",
    id: "website"
  },
  {
    title: 'Meeslepende 3D Ervaringen',
    description:
      'Differentieer uw merk met interactieve 3D-technologie. Wij gebruiken WebGL om producten tot leven te brengen en een onvergetelijke connectie met uw publiek te smeden.',
    features: [
      'WebGL & Three.js Experiences',
      'Interactieve Product Configurators',
      'Real-time 3D Visualisaties',
      'Performance Optimalisatie',
    ],
    icon: <Target className="w-8 h-8 text-magenta-400" />,
    iconBg: "bg-magenta-500/20",
    id: "3d-web"
  },
  {
    title: 'Data-gedreven Groei',
    description:
      'Een prachtige website is slechts het begin. Wij analyseren, testen en optimaliseren continu om bezoekers in klanten te transformeren en uw ROI te maximaliseren.',
    features: [
      'Gebruikersdata Analyse',
      'A/B Testing & Conversie',
      'SEO & Content Strategie',
      'Analytics & Tracking',
    ],
    icon: <TrendingUp className="w-8 h-8 text-green-400" />,
    iconBg: "bg-green-500/20",
    id: "growth"
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
          <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 glow-text leading-tight max-w-5xl mx-auto animate-fade-in">
              Meer dan Code. Oplossingen die Groeien.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-cyan-300 max-w-4xl mx-auto leading-relaxed animate-slide-up">
              Ontdek onze complete oplossingen voor professionele websites,
              van moderne webdesign tot geavanceerde functionaliteiten.
            </p>
          </div>
        </div>
      </section>

      {/* Services grid - Premium Cards */}
      <section className="py-section px-4 sm:px-6 relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, i) => (
              <div
                key={i}
                id={service.id}
                className="group relative overflow-hidden rounded-2xl bg-cosmic-800/40 border border-cosmic-700/60 p-8 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col hover:-translate-y-1"
              >
                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-magenta-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className={`w-16 h-16 rounded-2xl ${service.iconBg} flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-slate-300 mb-8 leading-relaxed flex-grow">
                    {service.description}
                  </p>

                  <div className="space-y-3 mt-auto">
                    {service.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-3 text-sm text-slate-300">
                        <div className="w-5 h-5 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                        </div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center text-cyan-400 font-medium group/link">
                    Ontdek meer
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section with Bento Grid */}
      <section className="py-section px-4 sm:px-6 bg-cosmic-800/10 border-y border-cosmic-700/30">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight gradient-text">
              Onze Technologische Kern
            </h2>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Wij kiezen compromisloos voor de beste tools. Een moderne, performante en schaalbare stack die u een oneerlijk voordeel geeft.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-cosmic-800/30 backdrop-blur-sm p-6 rounded-2xl border border-cosmic-700/50 hover:border-cyan-500/30 transition-all duration-300 group">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
                <Code2 className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Frontend</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Next.js 14+</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> React</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> TypeScript</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Tailwind CSS</li>
              </ul>
            </div>

            <div className="bg-cosmic-800/30 backdrop-blur-sm p-6 rounded-2xl border border-cosmic-700/50 hover:border-magenta-500/30 transition-all duration-300 group">
              <div className="w-12 h-12 bg-magenta-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-magenta-500/20 transition-colors">
                <Layout className="w-6 h-6 text-magenta-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">3D & Animatie</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-magenta-500" /> WebGL / R3F</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-magenta-500" /> Three.js</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-magenta-500" /> GSAP</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-magenta-500" /> Framer Motion</li>
              </ul>
            </div>

            <div className="bg-cosmic-800/30 backdrop-blur-sm p-6 rounded-2xl border border-cosmic-700/50 hover:border-blue-500/30 transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <Database className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Backend & CMS</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Headless CMS</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Node.js</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Postgres / Edge</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> GraphQL</li>
              </ul>
            </div>

            <div className="bg-cosmic-800/30 backdrop-blur-sm p-6 rounded-2xl border border-cosmic-700/50 hover:border-green-500/30 transition-all duration-300 group">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                <Server className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Infra</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Vercel Edge</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> AWS Cloud</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> CDN Global</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> CI/CD Pipelines</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services & Internal Links Section */}
      <section className="py-12 sm:py-section px-4 sm:px-6">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 text-center gradient-text">
            Ontdek Meer van ProWeb Studio
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
            <div className="glass p-6 rounded-xl hover:border-cyan-500/60 transition-all duration-300 group text-center hover:scale-105">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center text-2xl group-hover:bg-cyan-500/20 transition-colors duration-300">
                🏗️
              </div>
              <h3 className="text-xl font-bold mb-3 text-cyan-300 group-hover:text-cyan-200">
                Onze Werkwijze
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

            <div className="glass p-6 rounded-xl hover:border-cyan-500/60 transition-all duration-300 group text-center hover:scale-105">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-magenta-500/10 flex items-center justify-center text-2xl group-hover:bg-magenta-500/20 transition-colors duration-300">
                🎮
              </div>
              <h3 className="text-xl font-bold mb-3 text-cyan-300 group-hover:text-cyan-200">
                3D Technologie Speeltuin
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

            <div className="glass p-6 rounded-xl hover:border-cyan-500/60 transition-all duration-300 group text-center hover:scale-105">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center text-2xl group-hover:bg-cyan-500/20 transition-colors duration-300">
                👥
              </div>
              <h3 className="text-xl font-bold mb-3 text-cyan-300 group-hover:text-cyan-200">
                Over ProWeb Studio
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
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 leading-tight">
            Op maat gemaakte oplossingen
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-12 text-slate-200 max-w-3xl mx-auto leading-relaxed">
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

      {/* SEO Content Section - Replaced with Bento Grid */}
      <section
        id="seo-content"
        className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-cosmic-900/30 relative"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 gradient-text leading-tight">
              Diensten die Groei Versnellen
            </h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Een professionele website laten maken is slechts het begin.
              Wij transformeren uw digitale aanwezigheid met een complete suite van premium services.
            </p>
          </div>

          <BentoGrid className="mb-12">
            <BentoGridItem
              title="Webdesign & Development"
              description="Maatwerk websites met een scherp oog voor snelheid, UX en conversie. Gebouwd op Next.js voor maximale prestaties."
              header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20" />}
              icon={<Laptop className="h-8 w-8 text-cyan-400" />}
              className="md:col-span-2"
            />
            <BentoGridItem
              title="3D Experiences"
              description="Interactieve WebGL elementen die uw merk onvergetelijk maken. Van productconfigurators tot scrollytelling."
              header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-magenta-500/10 to-purple-500/10 border border-magenta-500/20" />}
              icon={<Cpu className="h-8 w-8 text-magenta-400" />}
              className="md:col-span-1"
            />
            <BentoGridItem
              title="Performance First"
              description="Core Web Vitals optimalisatie, edge-caching en next-gen image formats (AVIF/WebP) voor bliksemsnelle laadtijden."
              header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20" />}
              icon={<Zap className="h-8 w-8 text-green-400" />}
              className="md:col-span-1"
            />
            <BentoGridItem
              title="SEO & Content Strategie"
              description="Diepgaand zoekwoordenonderzoek en technische SEO zorgen dat uw website domineert in Nederlandse zoekresultaten."
              header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20" />}
              icon={<Search className="h-8 w-8 text-amber-400" />}
              className="md:col-span-2"
            />
          </BentoGrid>

          <div className="grid md:grid-cols-2 gap-8 my-12">
            <div className="bg-cosmic-800/40 p-8 rounded-2xl border border-cosmic-700/60">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-white">
                <Database className="w-6 h-6 text-blue-400" />
                Headless CMS
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Volledige vrijheid over uw content met Sanity of Contentful.
                Geen technische kennis nodig om uw website actueel te houden.
                Naadloze integratie met uw bestaande systemen.
              </p>
            </div>
            <div className="bg-cosmic-800/40 p-8 rounded-2xl border border-cosmic-700/60">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-white">
                <TrendingUp className="w-6 h-6 text-green-400" />
                Conversie Optimalisatie (CRO)
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Systematische A/B-testing en gebruikersanalyse. Wij transformeren
                uw website van een digitale folder naar een 24/7 verkoopmachine.
                Data-gedreven beslissingen voor maximaal rendement.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              href="/contact"
              variant="primary"
              size="large"
              className="shadow-lg shadow-cyan-500/20"
            >
              Vraag een gratis groeiscan aan
            </Button>
          </div>
        </div>
      </section>

      {/* Business Info Section - NAP for Local SEO */}
      <section className="py-section px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Contact & Bedrijfsinformatie
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Professionele webdevelopment diensten voor Nederlandse bedrijven.
              Neem contact op voor een vrijblijvend gesprek.
            </p>
          </div>

          <DutchBusinessInfo
            variant="full"
            showAddress={true}
            showOpeningHours={true}
            showContact={true}
            showRegistration={true}
          />
        </div>
      </section>

      <FAQSection title="Vragen over onze Diensten">
        <DutchMarketFAQ />
      </FAQSection>

      <RelatedServices showAll={true} />

      <ContentSuggestions />

      {/* LocalBusiness JSON-LD Schema */}
      <LocalBusinessJSON
        areaServed={steden.map(stad => stad.name)}
      />

      <SEOSchema
        pageType="services"
        includeFAQ={true}
      />
    </main>
  );
}
