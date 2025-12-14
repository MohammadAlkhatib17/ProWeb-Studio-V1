import dynamicImport from 'next/dynamic';
import Link from 'next/link';

import { Rocket, Palette, TrendingUp, ShieldCheck, CheckCircle2, MapPin, Building2, CircuitBoard } from 'lucide-react';

import { Button } from '@/components/Button';
import DutchMarketFAQ from '@/components/DutchMarketFAQ';
import FAQSection from '@/components/sections/FAQSection';
import SEOSchema from '@/components/SEOSchema';
import { BentoGrid, BentoGridItem } from '@/components/ui/BentoGrid';
import { generatePageMetadata } from '@/lib/metadata';

import type { Metadata } from 'next';

export const dynamic = 'force-static';
export const revalidate = 3600; // 1 hour - homepage updates frequently
export const fetchCache = 'force-cache';

export const metadata: Metadata = generatePageMetadata('home');

const HeroCanvas = dynamicImport(() => import('@/components/HeroCanvas'), {
  ssr: false,
  loading: () => null,
});

const HeroScene = dynamicImport(() => import('@/three/HeroScene'), {
  ssr: false,
  loading: () => null,
});

// Dynamic import for 3D hexagonal prism scene with performance optimization
const HexagonalPrism = dynamicImport(() => import('@/three/HexagonalPrism'), {
  ssr: false,
  loading: () => <div className="w-full h-full animate-pulse" />,
});

interface CaseCardProps {
  title: string;
  metric: string;
  desc: string;
  linkText?: string;
  linkHref?: string;
}

function CaseCard({ title, metric, desc, linkText, linkHref }: CaseCardProps) {
  return (
    <article className="rounded-2xl border border-cosmic-700/60 bg-cosmic-800/40 p-6 sm:p-7 md:p-8 hover:bg-cosmic-800/60 transition-all duration-300 hover:border-cosmic-600/80 hover:shadow-2xl hover:shadow-cyan-500/10 group relative overflow-hidden flex flex-col h-full">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-magenta-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Icon placeholder for future enhancement - currently using emoji/text */}
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 flex items-center justify-center text-2xl">
          {title.includes('3D') ? '🎯' : title.includes('Webshop') ? '🛒' : '🌐'}
        </div>

        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 group-hover:text-cyan-300 transition-colors duration-300 leading-tight text-center">
          {title}
        </h3>
        <p className="text-cyan-300 font-semibold text-base sm:text-lg mb-4 group-hover:text-cyan-300 transition-colors duration-300 text-center">
          {metric}
        </p>
        <p className="text-slate-200 leading-relaxed text-sm mb-4 flex-grow text-center">{desc}</p>
        {linkText && linkHref && (
          <div className="text-center mt-auto">
            <Link
              href={linkHref}
              className="inline-flex items-center text-cyan-300 hover:text-cyan-300 transition-colors duration-200 text-sm font-medium"
            >
              {linkText}
              <span className="ml-1">→</span>
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}

export default function HomePage() {
  return (
    <main className="relative content-safe-top pt-20 md:pt-24 overflow-hidden">
      <SEOSchema
        pageType="homepage"
        pageTitle={metadata.title as string}
        pageDescription={metadata.description as string}
        includeFAQ={true}
      />

      {/* Critical SEO content - always rendered server-side */}
      {/* 
        NOTE: Hidden text block removed to prevent "Keyword Stuffing" penalties (SpamBrain).
        If specific keyword targeting is needed, create dedicated visible Landing Pages (e.g. /diensten/website-laten-maken-amsterdam).
      */}

      {/* HERO SECTION */}
      <section
        aria-label="Hero"
        className="homepage-hero relative min-h-[92vh] grid place-items-center overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/20 to-transparent z-0" />

        {/* 3D Portal Scene */}
        <div className="absolute inset-0">
          {/* Global HeroBackground is now rendered in RootLayout to unify the top edge site-wide. */}
          <HeroCanvas>
            <HeroScene />
          </HeroCanvas>
        </div>

        {/* Hero content with enhanced typography */}
        <div className="relative z-10 text-center max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto py-section">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-extrabold text-shadow-sharp tracking-tight leading-tight mb-8 motion-safe:animate-fade-in">
            Website Laten Maken: <span className="block text-cyan-300 mt-2">Uw Digitale Universum.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-100 mb-12 max-w-4xl mx-auto motion-safe:animate-slide-up">
            In het digitale tijdperk is uw website meer dan een visitekaartje — het is uw universum. Daarom transformeren wij uw idee tot een razendsnelle, interactieve
            ervaring die uw merk tot leven brengt. Van corporate websites en webshops tot meeslepende 3D-ervaringen — wij architectureren digitale
            platforms die uw bezoekers boeien en uw bedrijf laten groeien. Met onze bewezen ontwikkelmethodiek realiseren we websites die niet alleen mooi zijn, maar ook daadwerkelijk presteren.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              href="/contact"
              variant="primary"
              size="large"
            >
              Start jouw digitale transformatie
            </Button>
            <Button
              href="/werkwijze"
              variant="secondary"
              size="large"
            >
              Zo maken wij dit mogelijk →
            </Button>
          </div>

          {/* Limited Time Promotional Banner */}
          <div className="mt-8 motion-safe:animate-fade-in-delayed">
            <div className="relative mx-auto max-w-md">
              {/* Animated glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-magenta-500 to-cyan-500 rounded-lg blur opacity-75 animate-pulse"></div>

              {/* Main promotional banner */}
              <div className="relative bg-gradient-to-r from-cyan-500/20 to-magenta-500/20 backdrop-blur-sm border border-cyan-300/30 rounded-lg px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-yellow-400 text-sm font-bold">🎉 BEPERKTE TIJD</span>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-bounce">HOT</span>
                </div>

                <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-magenta-300 mb-1">
                  30% KORTING
                </div>

                <p className="text-sm text-cyan-200 font-medium mb-2">
                  Op alle website projecten
                </p>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Geldig 6 maanden
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Geen verborgen kosten
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the sections remain unchanged */}
      <section aria-label="Cases" className="py-section px-4 sm:px-6 glass">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center leading-tight">
            Webdesign Nederland: Waar Visie Meetbare Impact Wordt
          </h2>
          <p className="text-slate-400 text-center mb-16 max-w-3xl mx-auto">
            Elke website die wij bouwen vertelt een verhaal van transformatie. We architectureren niet zomaar digitale platforms — we creëren groeimotoren
            die uw ambities naar werkelijkheid transformeren. Onze complete service portfolio en gestructureerde ontwikkelingsproces maken deze resultaten mogelijk.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-stretch">
            <CaseCard
              title="Website Laten Maken: Waar Ambities Groeien"
              metric="Razendsnelle Next.js Websites"
              desc="Elke **website laten maken** begint met uw visie. Wij architectureren op maat gemaakte, veilige en SEO-geoptimaliseerde digitale ecosystemen die de kern van uw ondernemingsstrategie vormen — gebouwd voor vandaag, klaar voor morgen."
              linkText="Zie hoe wij dit voor jou realiseren"
              linkHref="/diensten"
            />
            <CaseCard
              title="3D Ervaringen: Het Onmogelijke Mogelijk"
              metric="Interactieve WebGL & R3F"
              desc="In een wereld vol standaardwebsites creëren wij digitale wonderen. Onze 3D-productvisualisaties en interactieve ervaringen transformeren gewone bezoekers in betrokken klanten die uw merk nooit vergeten."
              linkText="Bekijk onze 3D projecten"
              linkHref="/portfolio"
            />
            <CaseCard
              title="Webshop Laten Maken: Verkopen Herontdacht"
              metric="Conversiegerichte Webshops"
              desc="Een **webshop laten maken** is meer dan technologie — het is psychologie in code. Wij creëren e-commerce ervaringen die niet alleen prachtig zijn, maar intuïtief begrijpen hoe uw klanten denken en kopen."
              linkText="Ontdek het geheim van onze aanpak"
              linkHref="/werkwijze"
            />
          </div>
        </div>
      </section>

      {/* Process section remains unchanged */}
      <section aria-label="Process" className="py-section px-4 sm:px-6">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-16 text-center leading-tight">
            Website Ontwikkeling: Waar Visie Virtuoze Werkelijkheid Wordt
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/25">
                🎯
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                Webdesign Strategie
              </h3>
              <p className="text-slate-400">
                Elke grote transformatie begint met een diepe duik in uw digitale DNA. We ontcijferen uw doelen, markt en gebruikers om ambities
                te vertalen naar een kristalhelder technisch stappenplan voor <Link href="/diensten" className="text-cyan-300 hover:text-cyan-300">professionele website ontwikkeling</Link>.
                <Link href="/werkwijze" className="text-cyan-300 hover:text-cyan-300 ml-1">
                  Lees meer over onze strategische aanpak
                </Link> die visies omzet in virtuoze realiteit.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/25">
                ✨
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                UX/UI Design
              </h3>
              <p className="text-slate-400">
                Hier ontstaat de magie tussen psychologie en pixels. Van eerste wireframes tot adembenemende designs creëren wij UI/UX ervaringen die niet alleen converteren,
                maar uw merkidentiteit versterken en gebruikers raken. Ontdek onze <Link href="/diensten" className="text-cyan-300 hover:text-cyan-300">webdesign service</Link> en
                <Link href="/portfolio" className="text-cyan-300 hover:text-cyan-300 ml-1">onze creatieve projecten</Link>.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/25">
                🚀
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                Website Ontwikkeling
              </h3>
              <p className="text-slate-400">
                Hier wordt code tot kunst, technologie tot transformatie. Met kristalheldere code, cutting-edge stack en 100% maatwerk bouwen wij digitale ervaringen
                die niet alleen razendsnel zijn, maar meegroeien met uw ambities. Bekijk onze <Link href="/diensten" className="text-cyan-300 hover:text-cyan-300">technische expertise</Link> en
                <Link href="/werkwijze" className="text-cyan-300 hover:text-cyan-300 ml-1">development methodiek</Link> die toekomst realiteit maakt.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/25">
                📈
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                SEO & Groei Optimalisatie
              </h3>
              <p className="text-slate-400">
                Data vertelt verhalen, wij luisteren en handelen. Door continue optimalisatie op basis van intelligente analyses transformeren we inzichten in impact.
                A/B testing, SEO-magie, en conversie-optimalisatie zorgen voor <Link href="/diensten" className="text-cyan-300 hover:text-cyan-300">maximale website performance</Link> die groeit met uw succes.
                <Link href="/diensten" className="text-cyan-300 hover:text-cyan-300 ml-1">
                  Bekijk onze optimalisatie services
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Tech section with enhanced background */}
      <section
        aria-label="3D Technology"
        className="py-section px-4 sm:px-6 relative overflow-hidden"
      >
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight max-w-4xl mx-auto">
              3D Websites Nederland: Waar Het Onmogelijke Werkelijkheid Wordt
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-200 mb-8 leading-relaxed max-w-3xl mx-auto">
              In een digitale wereld vol vlakke ervaringen creëren wij dimensies die ontroeren. Wij transformeren uw producten en visies in levensechte,
              interactieve 3D website ervaringen die de grenzen tussen fysiek en digitaal doen vervagen. Van configurators tot virtuele showrooms —
              wij architectureren de toekomst van het web, vandaag. Bekijk onze <Link href="/diensten" className="text-cyan-300 hover:text-cyan-300">innovatieve webdevelopment services</Link>.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            <div className="glass p-6 rounded-xl text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center text-2xl group-hover:bg-cyan-500/20 transition-colors duration-300">
                ⚡
              </div>
              <h3 className="text-xl font-bold mb-3 text-cyan-300">
                Real-time 3D Rendering
              </h3>
              <p className="text-slate-200 leading-relaxed">
                Vloeiende 60+ FPS experiences op elk device
              </p>
            </div>

            <div className="glass p-6 rounded-xl text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-magenta-500/10 flex items-center justify-center text-2xl group-hover:bg-magenta-500/20 transition-colors duration-300">
                🎮
              </div>
              <h3 className="text-xl font-bold mb-3 text-cyan-300">
                WebGL & Three.js
              </h3>
              <p className="text-slate-200 leading-relaxed">
                Cutting-edge tech, maximale browser support
              </p>
            </div>

            <div className="glass p-6 rounded-xl text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center text-2xl group-hover:bg-cyan-500/20 transition-colors duration-300">
                🚀
              </div>
              <h3 className="text-xl font-bold mb-3 text-cyan-300">
                Performance First
              </h3>
              <p className="text-slate-200 leading-relaxed">
                Geoptimaliseerd voor mobile en desktop
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button
              href="/portfolio"
              variant="secondary"
              className="gap-2 hover:gap-4 group"
            >
              Bekijk 3D cases in portfolio
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </Button>
          </div>

          <div className="h-[400px] rounded-2xl overflow-hidden border border-cosmic-700/60 bg-cosmic-800/20 relative mt-12">
            <HexagonalPrism />
          </div>
        </div>
      </section>

      {/* CTA section remains unchanged */}
      <section aria-label="Call to action" className="py-section px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight">
            Website Laten Maken: Klaar om de Sprong te Maken?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Of u nu een startup bent die wil opschalen, of een enterprise die
            digitaal wil transformeren — wij zijn er om uw visie werkelijkheid
            te maken. Ontdek waarom bedrijven kiezen voor onze <Link href="/diensten" className="text-cyan-300 hover:text-cyan-300">professionele website ontwikkeling services</Link>
            en <Link href="/werkwijze" className="text-cyan-300 hover:text-cyan-300">bewezen projectaanpak</Link>.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              href="/contact"
              variant="primary"
              size="large"
            >
              Website laten maken - Plan strategiesessie
            </Button>
            <Button
              href="/diensten"
              variant="secondary"
              size="large"
            >
              Bekijk webdesign diensten
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced SEO Content Section with Proper Semantic Structure */}
      <section
        id="seo-content"
        className="py-section px-4 sm:px-6 lg:px-8 bg-cosmic-900/30 relative"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />

        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 gradient-text leading-tight">
              Website Laten Maken Nederland: Uw Expert Partner voor Digitale Groei
            </h2>
            <p className="text-xl text-slate-300 mb-12 leading-relaxed">
              ProWeb Studio transformeert uw bedrijfsvisie in krachtige digitale ervaringen.
              Of u nu een <strong>professionele website wilt laten maken</strong>, of een complete <Link href="/diensten" className="text-cyan-300 hover:text-cyan-200 decoration-cyan-500/30 underline underline-offset-4">webshop</Link> nodig heeft –
              wij zijn uw strategische partner voor meetbare online groei.
            </p>
          </div>

          {/* Why Choose Us - Bento Grid */}
          <section className="mb-24">
            <h3 className="text-2xl sm:text-3xl font-bold mb-10 text-center text-white">
              Waarom ProWeb Studio Kiezen?
            </h3>
            <BentoGrid>
              <BentoGridItem
                title="Google Core Web Vitals"
                description="Wij bouwen websites die binnen 1 seconde laden. Snellere websites betekenen hogere Google rankings, meer bezoekers en betere conversies voor uw bedrijf."
                header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20" />}
                icon={<Rocket className="h-8 w-8 text-green-400" />}
                className="md:col-span-2"
              />
              <BentoGridItem
                title="3D & WebGL Magic"
                description="Onderscheid u van de concurrentie met interactieve 3D elementen en productvisualisaties die bezoekers omver blazen."
                header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-magenta-500/20 to-purple-500/20" />}
                icon={<Palette className="h-8 w-8 text-magenta-400" />}
                className="md:col-span-1"
              />
              <BentoGridItem
                title="SEO Dominantie"
                description="Technische SEO zit in ons DNA. Van structuur tot sitemap: wij optimaliseren alles zodat u gevonden wordt door uw ideale klant."
                header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20" />}
                icon={<TrendingUp className="h-8 w-8 text-cyan-400" />}
                className="md:col-span-1"
              />
              <BentoGridItem
                title="Veilig & Schaalbaar"
                description="Enterprise-grade beveiliging met geavanceerde headers en CSP. Gebouwd om met uw bedrijf mee te groeien, van startup tot multinational."
                header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-slate-500/20 to-slate-700/20" />}
                icon={<ShieldCheck className="h-8 w-8 text-slate-300" />}
                className="md:col-span-2"
              />
            </BentoGrid>
          </section>

          {/* Services List - Horizontal Cards */}
          <section className="mb-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
                  Website Ontwikkeling: Van Concept tot Conversie
                </h3>
                <p className="text-slate-300 mb-8 text-lg">
                  Onze gestructureerde aanpak garandeert resultaat. Wij combineren creativiteit met keiharde data om websites te bouwen die werken.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    "Strategische digitale consultancy", "UX/UI design & prototyping",
                    "Frontend & backend development", "E-commerce oplossingen",
                    "Interactieve 3D visualisaties", "SEO & Performance",
                    "Betrouwbare hosting", "Conversie-optimalisatie",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Link href="/diensten" className="text-cyan-300 hover:text-cyan-200 font-semibold group flex items-center gap-2">
                    Bekijk alle diensten <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div className="bg-cosmic-800/30 rounded-2xl p-8 border border-cosmic-700/50 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <CircuitBoard className="w-64 h-64 text-cyan-500" />
                </div>
                <h4 className="text-xl font-bold text-white mb-6 relative z-10">Voor Elk Type Organisatie</h4>
                <div className="space-y-6 relative z-10">
                  <div className="flex gap-4">
                    <div className="bg-cyan-500/20 p-3 rounded-lg h-fit">
                      <Building2 className="w-6 h-6 text-cyan-300" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-200">MKB & Ondernemers</h5>
                      <p className="text-sm text-slate-400 mt-1">Directe impact op uw digitale aanwezigheid en omzet.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-magenta-500/20 p-3 rounded-lg h-fit">
                      <Rocket className="w-6 h-6 text-magenta-300" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-200">Startups & Scale-ups</h5>
                      <p className="text-sm text-slate-400 mt-1">Schaalbare platforms die investeerders imponeren.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Region Coverage */}
          <section className="mb-24 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold mb-10 text-white">
              Actief in Heel Nederland
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "Amsterdam", "Rotterdam", "Utrecht", "Den Haag", "Eindhoven",
                "Groningen", "Tilburg", "Almere", "Breda", "Nijmegen",
                "Enschede", "Haarlem", "Arnhem", "Amersfoort", "Zwolle"
              ].map((city) => (
                <Link
                  key={city}
                  href={`/steden/${city.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-4 py-2 rounded-full bg-cosmic-800/50 border border-cosmic-700 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all text-slate-300 hover:text-cyan-300 text-sm flex items-center gap-2"
                >
                  <MapPin className="w-3 h-3" />
                  {city}
                </Link>
              ))}
            </div>
            <p className="mt-6 text-slate-400 text-sm">
              En vele andere regio&apos;s. <Link href="/steden" className="text-cyan-400 hover:underline">Bekijk volledig overzicht</Link>.
            </p>
          </section>

          <FAQSection title="Veelgestelde Vragen">
            <DutchMarketFAQ />
          </FAQSection>

          {/* About & Final CTA */}
          <section className="mt-24 bg-gradient-to-br from-cosmic-800/50 to-cosmic-900/50 rounded-3xl p-8 sm:p-12 border border-cosmic-700/50 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-magenta-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
                Klaar om Jouw Digitale Verhaal te Schrijven?
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                Uw website is uw belangrijkste medewerker. Zorg dat hij presteert.
                Laten we in een vrijblijvend gesprek ontdekken hoe wij uw ambities kunnen realiseren.
              </p>
              <Button
                href="/contact"
                variant="primary"
                size="large"
                className="gap-2 shadow-lg shadow-cyan-500/20"
              >
                Start met een gratis strategiesessie
                <span>✨</span>
              </Button>
            </div>
          </section>

        </div>
      </section>
    </main>
  );
}
