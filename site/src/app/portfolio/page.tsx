import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/Button';
import SimpleBrandIdentityModel from '@/components/SimpleBrandIdentityModel';
import SimpleEcommerceShowcase from '@/components/SimpleEcommerceShowcase';
import SimplePortfolioComputer from '@/components/SimplePortfolioComputer';
import { siteConfig } from '@/config/site.config';

import MobileShowcase from '../../components/portfolio/MobileShowcase';
import PortfolioHero from '../../components/portfolio/PortfolioHero';
import PortfolioSchema from '../../components/portfolio/PortfolioSchema';

import type { Metadata } from 'next';

// ISR Configuration for portfolio page
export const dynamic = 'force-static';
export const revalidate = 14400; // 4 hours - portfolio updates less frequently
export const fetchCache = 'force-cache';

export const metadata: Metadata = {
  title: 'Portfolio | Onze Beste Werk - 3D Web & App Ontwikkeling',
  description:
    'Bekijk ons portfolio van hoogwaardige websites, webshops en mobiele applicaties. Van 3D interactieve ervaringen tot e-commerce platforms - ontdek ons Nederlandse vakmanschap.',
  keywords: [
    'portfolio webdesign nederland',
    'website portfolio',
    'webshop voorbeelden',
    '3d website portfolio',
    'responsive design voorbeelden',
    'dutch web development',
    'e-commerce portfolio',
    'mobile app design nederland',
    'interactieve websites',
    'webontwikkeling portfolio'
  ],
  openGraph: {
    title: 'Portfolio | ProWeb Studio - Nederlandse Web Development',
    description: 'Ontdek ons portfolio van innovatieve websites en apps. Van 3D interactieve ervaringen tot prestatie-geoptimaliseerde e-commerce platforms.',
    url: `${siteConfig.url}/portfolio`,
    siteName: siteConfig.name,
    images: [
      {
        url: '/assets/og/portfolio-og.jpg',
        width: 1200,
        height: 630,
        alt: 'ProWeb Studio Portfolio - Nederlandse Web Development'
      }
    ],
    locale: 'nl_NL',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | ProWeb Studio - Nederlandse Web Development',
    description: 'Ontdek ons portfolio van innovatieve websites en apps. Van 3D ervaringen tot prestatie-geoptimaliseerde platforms.',
    images: ['/assets/og/portfolio-og.jpg']
  },
  alternates: {
    canonical: `${siteConfig.url}/portfolio`
  }
};

const breadcrumbs = [
  { title: 'Home', href: '/' },
  { title: 'Portfolio', href: '/portfolio' }
];

export default function PortfolioPage() {
  return (
    <>
      <PortfolioSchema />
      <main className="relative min-h-screen overflow-x-hidden">
        {/* Breadcrumbs */}
        <div className="relative z-10 pt-24 pb-8">
          <div className="container mx-auto px-safe">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </div>

        {/* Portfolio Hero Section */}
        <PortfolioHero />

        {/* Capabilities Showcase Sections */}
        <section id="capabilities" className="relative py-16 lg:py-24">
          {/* Section 1: Interactive 3D Web Development */}
          <section className="py-12 md:py-16 px-4">
            <div className="container mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-cyan-300">Webontwikkeling met een Extra Dimensie</h2>
                  <p className="text-base md:text-lg text-slate-200 mb-6 leading-relaxed">
                    Wij creëren websites die verder gaan dan platte schermen. Met technologie zoals Three.js en React Three Fiber bouwen we interactieve 3D-ervaringen die uw digitale visie tot leven brengen. Dit is geen template; dit is cutting-edge technologie, op maat gemaakt voor uw merk.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-full">Three.js</span>
                    <span className="px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-300 rounded-full">React Three Fiber</span>
                    <span className="px-3 py-1 text-xs font-medium bg-green-500/20 text-green-300 rounded-full">WebGL</span>
                    <span className="px-3 py-1 text-xs font-medium bg-cyan-500/20 text-cyan-300 rounded-full">Responsive</span>
                  </div>
                </div>
                <div className="order-1 lg:order-2">
                  <SimplePortfolioComputer />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Immersive E-commerce Platforms */}
          <section className="py-12 md:py-16 px-4 bg-cosmic-900/30">
            <div className="container mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="order-2">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-cyan-300">E-commerce Platforms die Converteren</h2>
                  <p className="text-base md:text-lg text-slate-200 mb-6 leading-relaxed">
                    Voor webshops, van kleine boetieks tot grootschalige marktplaatsen, bouwen wij e-commerce oplossingen die niet alleen verkopen, maar ook een unieke winkelervaring bieden. Visualiseer uw producten in 3D, laat klanten ermee interacteren en verhoog de conversie significant.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-300 rounded-full">3D Product Viewer</span>
                    <span className="px-3 py-1 text-xs font-medium bg-pink-500/20 text-pink-300 rounded-full">Interactive UX</span>
                    <span className="px-3 py-1 text-xs font-medium bg-orange-500/20 text-orange-300 rounded-full">Conversie Optimalisatie</span>
                  </div>
                </div>
                <div className="order-1">
                  <SimpleEcommerceShowcase />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Dynamic Brand Identity */}
          <section className="py-12 md:py-16 px-4">
            <div className="container mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-cyan-300">Brand Identity met Impact</h2>
                  <p className="text-base md:text-lg text-slate-200 mb-6 leading-relaxed">
                    Van logo-ontwerp tot complete huisstijl, wij creëren brand identities die resoneren met de Nederlandse markt en uw doelgroep aanspreken. We visualiseren uw merkidentiteit in dynamische 3D-modellen die authenticiteit, herkenbaarheid en tijdloosheid uitstralen.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 text-xs font-medium bg-green-500/20 text-green-300 rounded-full">Logo Design</span>
                    <span className="px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-full">3D Branding</span>
                    <span className="px-3 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-300 rounded-full">Nederlandse Markt</span>
                    <span className="px-3 py-1 text-xs font-medium bg-red-500/20 text-red-300 rounded-full">Visual Identity</span>
                  </div>
                </div>
                <div className="order-1 lg:order-2">
                  <SimpleBrandIdentityModel />
                </div>
              </div>
            </div>
          </section>
          
          {/* Mobile-Responsive Design Showcase */}
          <MobileShowcase />
        </section>

        {/* Call to Action */}
        <section className="relative py-16 lg:py-24 bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-stellar-900">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container relative mx-auto px-4 md:px-safe text-center">
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-6">
              Klaar voor een Project met Extra Dimensie?
            </h2>
            <p className="text-lg md:text-xl text-cosmic-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              Laat ons uw visie tot leven brengen met cutting-edge 3D technologie, authentieke Nederlandse vakmanschap en bewezen expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                href="/contact"
                variant="primary"
                className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4"
              >
                Start Uw 3D Project
              </Button>
              <Button
                href="/diensten"
                variant="secondary"
                className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4"
              >
                Ontdek Onze Diensten
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}