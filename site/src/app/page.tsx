import type { Metadata } from 'next';

// Get canonical URL from environment with fallback
const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');

export const dynamic = 'force-static';
export const revalidate = 60 * 60 * 24;

export const metadata: Metadata = {
  title:
    'Website laten maken Nederland | Professioneel webdesign & 3D websites – ProWeb Studio',
  description:
    'Website laten maken voor Nederlandse ondernemers. Wij bouwen snelle, SEO-geoptimaliseerde websites die converteren. Transparante prijzen, Nederlandse kwaliteit, no-nonsense aanpak.',
  alternates: {
    canonical: '/',
    languages: { 
      'nl-NL': '/',
      'x-default': '/'
    },
  },
  openGraph: {
    images: [
      { url: '/og', width: 1200, height: 630 },
    ],
    title:
      'Website laten maken Nederland | Professioneel webdesign & 3D websites – ProWeb Studio',
    description:
      'Website laten maken voor Nederlandse ondernemers. Wij bouwen snelle, SEO-geoptimaliseerde websites die converteren. Transparante prijzen, Nederlandse kwaliteit, no-nonsense aanpak.',
    url: `${SITE_URL}/`,
    type: 'website',
    locale: 'nl_NL',
  },
  keywords: [
    'website laten maken',
    'website maken',
    'maken van een website',
    '3D website',
    'webdesign Nederland',
  ],
};

import dynamicImport from 'next/dynamic';
import SEOSchema from '@/components/SEOSchema';

const HeroCanvas = dynamicImport(() => import('@/components/HeroCanvas'), {
  ssr: false,
  loading: () => null,
});

const HeroScene = dynamicImport(() => import('@/three/HeroScene'), {
  ssr: false,
  loading: () => null,
});
import Link from 'next/link';

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
    <article className="rounded-2xl border border-cosmic-700/60 bg-cosmic-800/40 p-6 sm:p-7 md:p-8 hover:bg-cosmic-800/60 transition-all duration-300 hover:border-cosmic-600/80 hover:shadow-2xl hover:shadow-cyan-500/10 group relative overflow-hidden">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-magenta-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 group-hover:text-cyan-300 transition-colors duration-300 leading-tight">
          {title}
        </h3>
        <p className="text-cyan-400 font-semibold text-base sm:text-lg mb-4 group-hover:text-cyan-300 transition-colors duration-300">
          {metric}
        </p>
        <p className="text-gray-300 leading-relaxed text-sm mb-4">{desc}</p>
        {linkText && linkHref && (
          <Link 
            href={linkHref}
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors duration-200 text-sm font-medium"
          >
            {linkText}
            <span className="ml-1">→</span>
          </Link>
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
        <div className="relative z-10 text-center max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto py-12 sm:py-16 md:py-20 lg:py-24">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-extrabold text-shadow-sharp tracking-tight leading-tight mb-8 motion-safe:animate-fade-in">
            Laat een website maken die indruk maakt. En converteert.
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-100 mb-12 max-w-4xl mx-auto motion-safe:animate-slide-up">
            Wij transformeren uw idee tot een razendsnelle, interactieve
            ervaring — van corporate sites tot meeslepende 3D-werelden die uw
            bezoekers boeien en uw bedrijf laten groeien.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-lg font-semibold text-base sm:text-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-cosmic-900"
            >
              Start uw project
            </Link>
            <Link
              href="/werkwijze"
              className="px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 border-2 border-gray-600 rounded-lg font-semibold text-base sm:text-lg hover:border-white hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-cosmic-900"
            >
              Ontdek onze werkwijze →
            </Link>
          </div>

          <p className="mt-12 text-gray-400 text-sm motion-safe:animate-fade-in-delayed">
            Vertrouwd door founders, misb en scale-ups die vooruit willen.
          </p>
        </div>
      </section>

      {/* Rest of the sections remain unchanged */}
      <section aria-label="Cases" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 glass">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center leading-tight">
            Meetbare Impact, Elke Keer Weer.
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-3xl mx-auto">
            We bouwen niet zomaar websites — we leveren digitale groeimotoren
            die presteren.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <CaseCard
              title="Fundament voor Groei"
              metric="Razendsnelle Next.js Websites"
              desc="Wij bouwen op maat gemaakte, veilige en SEO-geoptimaliseerde websites die de kern van uw digitale aanwezigheid vormen en klaar zijn voor de toekomst."
              linkText="Ontdek onze webdevelopment diensten"
              linkHref="/diensten"
            />
            <CaseCard
              title="Meeslepende 3D Ervaringen"
              metric="Interactieve WebGL & R3F"
              desc="Transformeer uw merk met unieke 3D-productvisualisaties en interactieve ervaringen die bezoekers boeien en een onvergetelijke indruk achterlaten."
              linkText="Bekijk onze 3D speeltuin"
              linkHref="/speeltuin"
            />
            <CaseCard
              title="Complete E-commerce Oplossingen"
              metric="Conversiegerichte Webshops"
              desc="Van ontwerp tot implementatie, wij creëren krachtige webshops die niet alleen prachtig zijn, maar ook ontworpen om uw online verkoop te maximaliseren."
              linkText="Leer meer over onze aanpak"
              linkHref="/werkwijze"
            />
          </div>
        </div>
      </section>

      {/* Process section remains unchanged */}
      <section aria-label="Process" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-16 text-center leading-tight">
            Van Visie naar Virtuoze Uitvoering
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/25">
                🎯
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                Strategie
              </h3>
              <p className="text-gray-400">
                Deep-dive in uw doelen, markt en gebruikers. We vertalen
                ambities naar een technisch stappenplan. 
                <Link href="/werkwijze" className="text-cyan-400 hover:text-cyan-300 ml-1">
                  Lees meer over onze strategische aanpak
                </Link>.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/25">
                ✨
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                Design
              </h3>
              <p className="text-gray-400">
                Van wireframes tot pixel-perfect designs. UI/UX die converteert
                én uw merk versterkt.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/25">
                🚀
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                Build
              </h3>
              <p className="text-gray-400">
                Clean code, moderne stack, 100% maatwerk. Gebouwd voor snelheid,
                schaal en toekomst.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/25">
                📈
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                Growth
              </h3>
              <p className="text-gray-400">
                Continue optimalisatie op basis van data. A/B testing, SEO, en
                conversion rate optimization.
                <Link href="/diensten" className="text-cyan-400 hover:text-cyan-300 ml-1">
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
        className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 relative overflow-hidden"
      >
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight">
                De Toekomst is 3D. Wij Bouwen Die Vandaag.
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                Transformeer uw producten in interactieve ervaringen. Van
                configurators tot virtuele showrooms — wij pushen de grenzen van
                het web.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-base sm:text-lg md:text-xl mt-1">→</span>
                  <span className="text-gray-300">
                    <strong className="text-white">
                      Real-time 3D Rendering:
                    </strong>{' '}
                    Vloeiende 60+ FPS experiences op elk device
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-base sm:text-lg md:text-xl mt-1">→</span>
                  <span className="text-gray-300">
                    <strong className="text-white">WebGL & Three.js:</strong>{' '}
                    Cutting-edge tech, maximale browser support
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-base sm:text-lg md:text-xl mt-1">→</span>
                  <span className="text-gray-300">
                    <strong className="text-white">Performance First:</strong>{' '}
                    Geoptimaliseerd voor mobile en desktop
                  </span>
                </li>
              </ul>
              <Link
                href="/speeltuin"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-all duration-300 hover:gap-4 group focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-cosmic-900"
              >
                Bekijk live demos
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </Link>
            </div>
            <div className="h-[400px] rounded-2xl overflow-hidden border border-cosmic-700/60 bg-cosmic-800/20 relative">
              <HexagonalPrism />
            </div>
          </div>
        </div>
      </section>

      {/* CTA section remains unchanged */}
      <section aria-label="Call to action" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight">
            Klaar om de Sprong te Maken?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Of u nu een startup bent die wil opschalen, of een enterprise die
            digitaal wil transformeren — wij zijn er om uw visie werkelijkheid
            te maken.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/contact"
              className="px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-lg font-semibold text-base sm:text-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-cosmic-900"
            >
              Plan een strategiesessie
            </Link>
            <Link
              href="/diensten"
              className="px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 border-2 border-gray-600 rounded-lg font-semibold text-base sm:text-lg hover:border-white hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-cosmic-900"
            >
              Bekijk onze diensten
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced SEO Content Section with Proper Semantic Structure */}
      <section
        id="seo-content"
        className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-cosmic-900/30"
      >
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-invert prose-lg max-w-none">
            <header>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-center gradient-text">
                Website Laten Maken in Nederland: Uw Partner voor Digitale Groei
              </h2>
              <p className="text-xl text-center text-gray-300 mb-12 max-w-3xl mx-auto">
                ProWeb Studio transformeert uw bedrijfsvisie in krachtige digitale ervaringen. 
                Of u nu een <strong>website wilt laten maken</strong>, uw bestaande site wilt vernieuwen, 
                of een complete digitale transformatie ambieert – wij zijn uw strategische partner 
                voor meetbare online groei.
              </p>
            </header>

            <section>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-cyan-300">
                Waarom Kiezen voor ProWeb Studio als Website Ontwikkelaar?
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-cosmic-800/40 p-6 rounded-xl border border-cosmic-700/60">
                  <h4 className="text-xl font-semibold mb-3 text-cyan-400">
                    🚀 Razendsnelle Performance
                  </h4>
                  <p className="text-gray-300">
                    Onze websites behalen perfecte Core Web Vitals scores en laden binnen 1 seconde. 
                    Dit betekent betere Google rankings, hogere conversies en tevreden bezoekers 
                    die langer op uw site blijven.
                  </p>
                </div>
                
                <div className="bg-cosmic-800/40 p-6 rounded-xl border border-cosmic-700/60">
                  <h4 className="text-xl font-semibold mb-3 text-cyan-400">
                    🎨 Unieke 3D Ervaringen
                  </h4>
                  <p className="text-gray-300">
                    Van interactieve productconfigurators tot meeslepende WebGL-animaties – 
                    wij creëren websites die uw bezoekers verbazen en uw merk onvergetelijk maken. 
                    <Link href="/speeltuin" className="text-cyan-400 hover:text-cyan-300 ml-1">
                      Bekijk onze 3D showcases
                    </Link>.
                  </p>
                </div>
                
                <div className="bg-cosmic-800/40 p-6 rounded-xl border border-cosmic-700/60">
                  <h4 className="text-xl font-semibold mb-3 text-cyan-400">
                    📈 SEO-Geoptimaliseerde Architectuur
                  </h4>
                  <p className="text-gray-300">
                    Elke regel code schrijven we met zoekmachine-optimalisatie in gedachten. 
                    Van technische SEO tot contentstructuur – uw website wordt gevonden 
                    door uw ideale klanten.
                  </p>
                </div>
                
                <div className="bg-cosmic-800/40 p-6 rounded-xl border border-cosmic-700/60">
                  <h4 className="text-xl font-semibold mb-3 text-cyan-400">
                    🛡️ Enterprise-Grade Beveiliging
                  </h4>
                  <p className="text-gray-300">
                    Met geavanceerde beveiligingsprotocollen, CSP-headers en continue monitoring 
                    zorgen we dat uw website en klantgegevens optimaal beschermd zijn tegen 
                    moderne cyberdreigingen.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-cyan-300">
                Onze Werkwijze: Van Concept tot Conversie
              </h3>
              <p className="text-gray-300 mb-6">
                Als specialist in <strong>website laten maken</strong> hanteren wij een bewezen 
                methodiek die uw succes garandeert. Ontdek hoe wij uw digitale ambities 
                realiseren in onze gedetailleerde{' '}
                <Link href="/werkwijze" className="text-cyan-400 hover:text-cyan-300">
                  werkwijze en projectaanpak
                </Link>.
              </p>

              <div className="bg-gradient-to-r from-cosmic-800/40 to-cosmic-700/40 p-6 rounded-xl border border-cosmic-600/60 mb-8">
                <h4 className="text-xl font-semibold mb-4 text-cyan-400">
                  Onze Dienstverlening Omvat:
                </h4>
                <ul className="grid md:grid-cols-2 gap-3 text-gray-300">
                  <li>✓ Strategische digitale consultancy</li>
                  <li>✓ UX/UI design en prototyping</li>
                  <li>✓ Frontend & backend ontwikkeling</li>
                  <li>✓ E-commerce en webshop oplossingen</li>
                  <li>✓ 3D visualisaties en interacties</li>
                  <li>✓ SEO en performance optimalisatie</li>
                  <li>✓ Hosting en technisch beheer</li>
                  <li>✓ Conversie-optimalisatie (CRO)</li>
                </ul>
              </div>

              <p className="text-gray-300 mb-8">
                Bekijk ons complete overzicht van{' '}
                <Link href="/diensten" className="text-cyan-400 hover:text-cyan-300">
                  webdesign en ontwikkeling diensten
                </Link>{' '}
                om te ontdekken hoe wij uw specifieke doelen kunnen realiseren.
              </p>
            </section>

            <section>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-cyan-300">
                Website Laten Maken: Voor Elk Type Organisatie
              </h3>
              
              <div className="space-y-6 mb-12">
                <div>
                  <h4 className="text-xl font-semibold mb-3 text-white">
                    🏢 MKB & Ondernemers
                  </h4>
                  <p className="text-gray-300">
                    Wilt u een <strong>professionele website laten maken</strong> die uw lokale 
                    of nationale markt verovert? Wij specialiseren ons in websites voor het 
                    Nederlandse MKB die direct impact hebben op uw omzet en merkbekendheid.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold mb-3 text-white">
                    🚀 Startups & Scale-ups
                  </h4>
                  <p className="text-gray-300">
                    Voor ambitieuze startups die snel willen groeien, ontwikkelen wij schaalbare 
                    platforms die meegroeien met uw succes. Van MVP tot enterprise-oplossing – 
                    wij denken mee in uw groeistrategie.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold mb-3 text-white">
                    🏭 Enterprise & Corporates
                  </h4>
                  <p className="text-gray-300">
                    Complexe enterprise-websites en digitale ecosystemen zijn onze specialiteit. 
                    Wij integreren naadloos met uw bestaande systemen en processen voor een 
                    toekomstbestendige digitale infrastructuur.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-cyan-300">
                Veelgestelde Vragen over Website Laten Maken
              </h3>
              
              <div className="space-y-6">
                <details className="bg-cosmic-800/40 p-6 rounded-xl border border-cosmic-700/60">
                  <summary className="font-semibold text-white cursor-pointer hover:text-cyan-300 transition-colors">
                    Wat kost het om een website te laten maken bij ProWeb Studio?
                  </summary>
                  <div className="mt-4 text-gray-300">
                    <p>
                      De investering voor een professionele website varieert tussen €3.500 en €25.000+, 
                      afhankelijk van functionaliteiten, design complexiteit en integraties. We werken 
                      met transparante, vaste prijzen per project. Na een gratis strategiesessie 
                      ontvangt u een gedetailleerde offerte zonder verborgen kosten.
                    </p>
                  </div>
                </details>
                
                <details className="bg-cosmic-800/40 p-6 rounded-xl border border-cosmic-700/60">
                  <summary className="font-semibold text-white cursor-pointer hover:text-cyan-300 transition-colors">
                    Hoe lang duurt het om een website te laten maken?
                  </summary>
                  <div className="mt-4 text-gray-300">
                    <p>
                      Een standaard business website realiseren we binnen 4-6 weken. Complexere 
                      projecten met 3D-elementen of uitgebreide functionaliteiten kunnen 8-12 weken 
                      in beslag nemen. We plannen altijd een realistische timeline en houden u 
                      wekelijks op de hoogte van de voortgang.
                    </p>
                  </div>
                </details>
                
                <details className="bg-cosmic-800/40 p-6 rounded-xl border border-cosmic-700/60">
                  <summary className="font-semibold text-white cursor-pointer hover:text-cyan-300 transition-colors">
                    Waarom zou ik mijn website laten maken door ProWeb Studio?
                  </summary>
                  <div className="mt-4 text-gray-300">
                    <p>
                      Wij combineren technische excellentie met creatieve innovatie. Onze websites 
                      behalen niet alleen perfecte Google PageSpeed scores, maar onderscheiden zich 
                      ook visueel met unieke 3D-ervaringen. Bovendien bieden we volledige transparantie, 
                      persoonlijke begeleiding en continue support na oplevering.
                    </p>
                  </div>
                </details>
                
                <details className="bg-cosmic-800/40 p-6 rounded-xl border border-cosmic-700/60">
                  <summary className="font-semibold text-white cursor-pointer hover:text-cyan-300 transition-colors">
                    Krijg ik ook SEO en online marketing ondersteuning?
                  </summary>
                  <div className="mt-4 text-gray-300">
                    <p>
                      Ja, elke website bouwen we met een sterke SEO-basis: technische optimalisatie, 
                      snelheidsoptimalisatie, schema markup en contentstrategie. Voor doorlopende 
                      SEO en marketing kunnen we u doorverwijzen naar onze vertrouwde partners 
                      gespecialiseerd in Nederlandse marktbewerking.
                    </p>
                  </div>
                </details>
              </div>
            </section>

            <section>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-cyan-300">
                Over ProWeb Studio: Uw Digitale Partner in Nederland
              </h3>
              <p className="text-gray-300 mb-6">
                Als Nederlandse website specialist met internationale expertise combineren wij 
                lokale marktkennis met wereldklasse technologie. Ons team van ervaren developers, 
                designers en strategen heeft één doel: uw digitale succes realiseren.
              </p>
              
              <p className="text-gray-300 mb-8">
                Leer meer{' '}
                <Link href="/over-ons" className="text-cyan-400 hover:text-cyan-300">
                  over ons team en onze missie
                </Link>{' '}
                om Nederlandse bedrijven te helpen groeien met innovative webtechnologie.
              </p>
            </section>

            <footer className="bg-gradient-to-r from-cyan-500/10 to-magenta-500/10 p-8 rounded-xl border border-cyan-500/20 text-center">
              <h3 className="text-2xl font-bold mb-4 text-white">
                Klaar om Uw Website te Laten Maken?
              </h3>
              <p className="text-gray-300 mb-6">
                Start vandaag nog met een gratis strategiesessie. We bespreken uw doelen, 
                uitdagingen en mogelijkheden voor digitale groei.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25"
              >
                Plan Gratis Strategiesessie
                <span>→</span>
              </Link>
            </footer>
          </article>
        </div>
      </section>
    </main>
  );
}
