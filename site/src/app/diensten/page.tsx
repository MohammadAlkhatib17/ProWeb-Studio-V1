import { Suspense } from 'react';

import Link from 'next/link';

import {
  Rocket, Target, TrendingUp, Code2, Cpu, Server,
  Zap, Search, Layout, Database,
  Laptop, CheckCircle2, ArrowRight
} from 'lucide-react';

import { ServicesPolyhedra } from '@/components/3d/ClientScene';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/Button';
import ContentSuggestions from '@/components/ContentSuggestions';
import DutchMarketFAQ from '@/components/DutchMarketFAQ';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DutchBusinessInfo, LocalBusinessJSON } from '@/components/local-seo';
import RelatedServices from '@/components/RelatedServices';
import FAQSection from '@/components/sections/FAQSection';
import PricingSection from '@/components/sections/PricingSection';
import SEOSchema from '@/components/SEOSchema';
import { BentoGrid, BentoGridItem } from '@/components/ui/BentoGrid';
import { Icon } from '@/components/ui/Icon';
import { steden } from '@/config/steden.config';
import { generatePageMetadata } from '@/lib/metadata';

import type { Metadata } from 'next';

export const dynamic = 'force-static';
export const revalidate = 7200; // 2 hours - services content is fairly stable
export const fetchCache = 'force-cache';

export const metadata: Metadata = generatePageMetadata('services');

// Get canonical URL from environment with fallback
const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');

const services = [
  {
    title: 'Fundamenten voor Digitale Dominantie',
    description:
      'Uw website is het strategische wapen van uw bedrijf. Wij smeden razendsnelle, veilige en schaalbare platformen die uw concurrentie irrelevant maken.',
    features: [
      'Next.js & React Architectuur',
      'Headless CMS Vrijheid',
      'Instant Laadtijden',
      'Mobile-First Perfectie',
    ],
    icon: <Rocket className="w-8 h-8 text-cyan-400" />,
    iconBg: "bg-cyan-500/20",
    id: "website"
  },
  {
    title: 'Meeslepende 3D Revolutie',
    description:
      'Stop met scrollen, start met ervaren. Wij gebruiken WebGL technologie om uw producten en verhaal tot leven te wekken op een manier die klanten nooit vergeten.',
    features: [
      'WebGL & Three.js Meesterwerken',
      'Interactieve Product Configurators',
      'Filmische Web Ervaringen',
      'Performance zonder Compromis',
    ],
    icon: <Target className="w-8 h-8 text-magenta-400" />,
    iconBg: "bg-magenta-500/20",
    id: "3d-web"
  },
  {
    title: 'Wetenschappelijke Groei',
    description:
      'Wij gokken niet. Wij meten. Door datapunten te analyseren en gebruikersgedrag te ontleden, transformeren wij bezoekers in loyale ambassadeurs.',
    features: [
      'Conversie Optimalisatie (CRO)',
      'Neuro-marketing Principes',
      'SEO Dominantie Strategie',
      'Real-time Analytics',
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
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-transparent" />

        <Suspense
          fallback={<div className="absolute inset-0 bg-cosmic-900/50" />}
        >
          <ErrorBoundary>
            <ServicesPolyhedra />
          </ErrorBoundary>
        </Suspense>

        <div className="relative z-10 w-full">
          <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-8 glow-text leading-tight max-w-6xl mx-auto animate-fade-in tracking-tight">
              Website Maken & Meer: <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Technologie die Winst Genereert.
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed animate-slide-up font-light drop-shadow-md">
              Wij bouwen geen websites. Wij bouwen digitale ecosystemen die uw marktpositie veroveren.
              Ontdek de kracht van Next.js, 3D en strategisch design.
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

                  <p className="text-slate-300 mb-8 leading-relaxed flex-grow text-base">
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
                    Ontdek strategie
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section with Bento Grid */}
      <section className="py-section px-4 sm:px-6 bg-black/20 backdrop-blur-sm border-y border-white/5">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight gradient-text">
              Het Arsenaal van de Winnaar
            </h2>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              In de digitale arena telt elke milliseconde. Wij bewapenen uw bedrijf met een technologische voorsprong
              waar uw concurrenten alleen van kunnen dromen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-cosmic-800/30 backdrop-blur-sm p-6 rounded-2xl border border-cosmic-700/50 hover:border-cyan-500/30 transition-all duration-300 group hover:bg-cosmic-800/50">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
                <Code2 className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Frontend Elite</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_cyan]" /> Next.js 14+</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> React Server Components</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Strict TypeScript</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Tailwind CSS</li>
              </ul>
            </div>

            <div className="bg-cosmic-800/30 backdrop-blur-sm p-6 rounded-2xl border border-cosmic-700/50 hover:border-magenta-500/30 transition-all duration-300 group hover:bg-cosmic-800/50">
              <div className="w-12 h-12 bg-magenta-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-magenta-500/20 transition-colors">
                <Layout className="w-6 h-6 text-magenta-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Immersive Core</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-magenta-500 shadow-[0_0_8px_magenta]" /> WebGL / R3F</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-magenta-500" /> Three.js shaders</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-magenta-500" /> GSAP Animations</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-magenta-500" /> Framer Motion</li>
              </ul>
            </div>

            <div className="bg-cosmic-800/30 backdrop-blur-sm p-6 rounded-2xl border border-cosmic-700/50 hover:border-blue-500/30 transition-all duration-300 group hover:bg-cosmic-800/50">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <Database className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Scalable Backend</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Headless CMS</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Edge Functions</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Postgres SQL</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> GraphQL API</li>
              </ul>
            </div>

            <div className="bg-cosmic-800/30 backdrop-blur-sm p-6 rounded-2xl border border-cosmic-700/50 hover:border-green-500/30 transition-all duration-300 group hover:bg-cosmic-800/50">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                <Server className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Global Infra</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_green]" /> Vercel Edge Network</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> CI/CD Automation</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> DDoS Protection</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> 99.9% Uptime SLA</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services & Internal Links Section */}
      <section className="py-12 sm:py-section px-4 sm:px-6">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 text-center gradient-text">
            Ontdek het ProWeb Universum
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
            <div className="glass p-6 rounded-xl hover:border-cyan-500/60 transition-all duration-300 group text-center hover:scale-105">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors duration-300">
                <Icon name="code" className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-cyan-300 group-hover:text-cyan-200">
                Onze Werkwijze
              </h3>
              <p className="text-slate-200 mb-4 text-sm leading-relaxed">
                Transparantie is onze standaard. Zie hoe wij van een vaag idee
                naar een marktleidend product werken in duidelijke sprints.
              </p>
              <Link
                href="/werkwijze"
                className="inline-flex items-center text-cyan-300 hover:text-cyan-300 transition-colors text-sm font-medium"
              >
                Bekijk onze projectaanpak
                <span className="ml-1">→</span>
              </Link>
            </div>

            <div className="glass p-6 rounded-xl hover:border-magenta-500/60 transition-all duration-300 group text-center hover:scale-105">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-magenta-500/10 flex items-center justify-center text-magenta-400 group-hover:bg-magenta-500/20 transition-colors duration-300">
                <Icon name="rocket" className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-cyan-300 group-hover:text-cyan-200">
                Portfolio
              </h3>
              <p className="text-slate-200 mb-4 text-sm leading-relaxed">
                Geen woorden, maar resultaten. Bekijk de projecten waar wij trots op zijn
                en die onze klanten groei hebben gebracht.
              </p>
              <Link
                href="/portfolio"
                className="inline-flex items-center text-cyan-300 hover:text-cyan-300 transition-colors text-sm font-medium"
              >
                Zie onze resultaten
                <span className="ml-1">→</span>
              </Link>
            </div>

            <div className="glass p-6 rounded-xl hover:border-cyan-500/60 transition-all duration-300 group text-center hover:scale-105">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors duration-300">
                <Icon name="users" className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-cyan-300 group-hover:text-cyan-200">
                Over ProWeb Studio
              </h3>
              <p className="text-slate-200 mb-4 text-sm leading-relaxed">
                Leer het elite team kennen achter de code. Onze missie is simpel:
                Nederlandse bedrijven digitaal onverslaanbaar maken.
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
              Genoeg Theorie. Tijd voor Actie.
            </h3>
            <p className="text-slate-200 mb-6 max-w-2xl mx-auto">
              Uw concurrenten zitten niet stil. Waarom u wel?
              Plan vandaag nog een strategiegesprek en claim uw plek in de markt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                href="/contact"
                variant="primary"
                size="large"
              >
                Plan Gratis Strategie Call
              </Button>
              <Button
                href="/portfolio"
                variant="secondary"
                size="large"
              >
                Bekijk Bewezen Resultaat
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (Unified) */}
      <section id="pricing" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-cosmic-900/30 relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        <div className="max-w-7xl mx-auto">
          <PricingSection />
        </div>
      </section>

      {/* SEO Content Section - Bento Grid */}
      <section
        id="seo-content"
        className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 gradient-text leading-tight">
              Dominantie door Design & Data
            </h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Wij geloven niet in &apos;mooie plaatjes&apos;. Wij geloven in systemen die renderen.
              Elk pixel, elke regel code heeft één doel: uw bedrijf laten groeien.
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
        </div>
      </section>

      {/* Business Info Section - NAP for Local SEO */}
      <section className="py-section px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Klaar om de Markt te Veroveren?
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Wij werken het liefst met ambitieuze Nederlandse bedrijven die willen groeien.
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

      <FAQSection title="Veelgestelde Vragen over Onze Diensten">
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
