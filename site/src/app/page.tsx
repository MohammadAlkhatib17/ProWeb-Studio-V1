import type { Metadata } from 'next';
import { getISRConfig } from '@/lib/isr-config';
import { generateMetadata } from '@/lib/metadata';

// ISR configuration for optimal Core Web Vitals
const isrConfig = getISRConfig('/');

export const dynamic = 'force-static';
export const revalidate = isrConfig.revalidate; // Optimized ISR timing
export const fetchCache = 'force-cache';

// Enhanced homepage metadata with all SEO optimizations
export const metadata: Metadata = generateMetadata('/', {
  title: 'Website Laten Maken Nederland | Webdesign & Webshop Ontwikkeling Amsterdam, Rotterdam, Utrecht – ProWeb Studio',
  description: 'Website laten maken door Nederlandse webdesign experts. Professionele websites, webshops en 3D ervaringen voor MKB, startups en enterprise. Transparante prijzen, Nederlandse kwaliteit!',
  pageType: 'homepage',
  lastModified: new Date().toISOString(),
  image: {
    url: '/og-homepage.png',
    alt: 'ProWeb Studio - Professionele Website Laten Maken Nederland',
    width: 1200,
    height: 630,
  },
});

import dynamicImport from 'next/dynamic';
import Link from 'next/link';
import SEOSchema from '@/components/SEOSchema';
import FAQSection from '@/components/sections/FAQSection';
import DutchMarketFAQ from '@/components/DutchMarketFAQ';
import { Button } from '@/components/Button';

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
    <article className="glass p-6 sm:p-7 md:p-8 rounded-xl hover:border-cyan-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 group relative overflow-hidden flex flex-col h-full">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-magenta-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

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
      <div className="sr-only">
        <h1>Website Laten Maken Nederland - ProWeb Studio Webdesign Experts</h1>
        <p>ProWeb Studio is een Nederlandse webdesign bureau gespecialiseerd in het laten maken van professionele websites, webshops en 3D ervaringen. Wij bedienen klanten in Amsterdam, Rotterdam, Utrecht, Den Haag, Eindhoven en heel Nederland met transparante prijzen en Nederlandse kwaliteit.</p>
        <nav aria-label="Diensten overzicht">
          <ul>
            <li><a href="/diensten/website-laten-maken">Website laten maken</a></li>
            <li><a href="/diensten/webshop-laten-maken">Webshop laten maken</a></li>
            <li><a href="/diensten/seo-optimalisatie">SEO optimalisatie</a></li>
            <li><a href="/diensten/3d-website-ervaringen">3D websites</a></li>
          </ul>
        </nav>
      </div>
      
      {/* HERO SECTION */}
      <section
        aria-label="Hero"
        className="homepage-hero relative min-h-[92vh] grid place-items-center overflow-hidden"
      >
        {/* 3D Portal Scene */}
        <div className="absolute inset-0">
          {/* Global HeroBackground is now rendered in RootLayout to unify the top edge site-wide. */}
          <HeroCanvas>
            <HeroScene />
          </HeroCanvas>
        </div>

        {/* Hero content with enhanced typography */}
        <div className="text-center max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto py-section">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-extrabold text-shadow-sharp tracking-tight leading-tight mb-8 motion-safe:animate-fade-in">
            Website Laten Maken die Indruk Maakt. En Converteert.
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
      <section aria-label="Cases" className="py-section px-4 sm:px-6">
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
              linkText="Ervaar de 3D magie zelf"
              linkHref="/speeltuin"
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
                <Link href="/speeltuin" className="text-cyan-300 hover:text-cyan-300 ml-1">creatieve 3D design voorbeelden</Link>.
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight">
                3D Websites Nederland: Waar Het Onmogelijke Werkelijkheid Wordt
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-slate-200 mb-8 leading-relaxed">
                In een digitale wereld vol vlakke ervaringen creëren wij dimensies die ontroeren. Wij transformeren uw producten en visies in levensechte, 
                interactieve **3D website** ervaringen die de grenzen tussen fysiek en digitaal doen vervagen. Van configurators tot virtuele showrooms — 
                wij architectureren de toekomst van het web, vandaag. Bekijk onze <Link href="/diensten" className="text-cyan-300 hover:text-cyan-300">innovatieve webdevelopment services</Link>.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-base sm:text-lg md:text-xl mt-1">→</span>
                  <span className="text-slate-200">
                    <strong className="text-white">
                      Real-time 3D Rendering:
                    </strong>{' '}
                    Vloeiende 60+ FPS experiences op elk device
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-base sm:text-lg md:text-xl mt-1">→</span>
                  <span className="text-slate-200">
                    <strong className="text-white">WebGL & Three.js:</strong>{' '}
                    Cutting-edge tech, maximale browser support
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-base sm:text-lg md:text-xl mt-1">→</span>
                  <span className="text-slate-200">
                    <strong className="text-white">Performance First:</strong>{' '}
                    Geoptimaliseerd voor mobile en desktop
                  </span>
                </li>
              </ul>
              <Button
                href="/speeltuin"
                variant="secondary"
                className="gap-2 hover:gap-4 group"
              >
                Bekijk 3D website voorbeelden
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </Button>
            </div>
            <div className="h-[400px] rounded-2xl overflow-hidden glass relative hover:border-cyan-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 group">
              <HexagonalPrism />
            </div>
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


      {/* New transparent intro section - PHASE C: Clean in-flow content */}
      <section className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-shadow-sharp">
          Website Laten Maken Nederland: Uw Expert Partner voor Digitale Groei
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed">
          ProWeb Studio transformeert uw bedrijfsvisie in krachtige digitale ervaringen. 
          Of u nu een <strong>professionele website wilt laten maken</strong>, uw bestaande site wilt vernieuwen, 
          of een complete <strong>webshop laten ontwikkelen</strong> – wij zijn uw strategische partner 
          voor meetbare online groei in Nederland. Van Amsterdam tot Maastricht, van startup tot enterprise: 
          <strong>website laten maken</strong> door ervaren Nederlandse webdesign specialisten.
        </p>
      </section>

      <FAQSection title="Veelgestelde Vragen">
        <DutchMarketFAQ />
      </FAQSection>
    </main>
  );
}
