import {
  Code2, ShoppingBag, Palette,
  Layers, Globe,
  CheckCircle2
} from 'lucide-react';

import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/Button';
import SimpleBrandIdentityModel from '@/components/SimpleBrandIdentityModel';
import SimpleEcommerceShowcase from '@/components/SimpleEcommerceShowcase';
import SimplePortfolioComputer from '@/components/SimplePortfolioComputer';
import { siteConfig } from '@/config/site.config';

import DigitalGalaxyLabs from '../../components/portfolio/DigitalGalaxyLabs';
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
        {/* Immersive Showcase Sections - Zig Zag Layout */}
        <section id="capabilities" className="relative py-16 lg:py-24 space-y-24 lg:space-y-32">

          {/* Section 1: The 3D Web (Laptop) */}
          <section className="relative px-4 sm:px-6">
            <div className="container mx-auto">
              <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                {/* Text Side */}
                <div className="lg:w-1/2 order-2 lg:order-1">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
                      <Globe className="w-4 h-4" />
                      <span>3D Web Development</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight text-white">
                      Websites die de<br />
                      <span className="gradient-text">Schermgrens Doorbreken</span>
                    </h2>
                    <p className="text-lg text-slate-300 leading-relaxed">
                      Wij bouwen geen platte websites; wij creëren digitale werelden. Met geavanceerde 3D-technologie transformeren we uw online aanwezigheid van een statische pagina naar een interactieve bestemming.
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
                        <Code2 className="w-8 h-8 text-cyan-400 mb-2" />
                        <h3 className="font-semibold text-white mb-1">WebGL Native</h3>
                        <p className="text-sm text-slate-400">Directe GPU acceleratie voor soepele 60fps animaties.</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
                        <Layers className="w-8 h-8 text-cyan-400 mb-2" />
                        <h3 className="font-semibold text-white mb-1">React Fiber</h3>
                        <p className="text-sm text-slate-400">Component-based 3D architectuur voor schaalbaarheid.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3D Side */}
                <div className="lg:w-1/2 w-full order-1 lg:order-2">
                  <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/20 border border-cyan-500/20 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 z-0" />
                    <div className="relative z-10 w-full h-full">
                      <SimplePortfolioComputer />
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-cyan-300 border border-cyan-500/30">
                      Probeer te roteren 360°
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: E-commerce Revolution (Product Configurator) */}
          <section className="relative px-4 sm:px-6">
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-magenta-500/10 rounded-full blur-[100px] pointer-events-none opacity-40" />

            <div className="container mx-auto">
              <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                {/* 3D Side (Left) */}
                <div className="lg:w-1/2 w-full order-1">
                  <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-magenta-500/20 border border-magenta-500/20">
                    <div className="absolute inset-0 bg-gradient-to-tr from-magenta-500/10 to-purple-500/10 z-0" />
                    <div className="relative z-10 w-full h-full">
                      <SimpleEcommerceShowcase />
                    </div>
                  </div>
                </div>

                {/* Text Side (Right) */}
                <div className="lg:w-1/2 order-2">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-magenta-500/10 border border-magenta-500/20 text-magenta-400 text-sm font-medium">
                      <ShoppingBag className="w-4 h-4" />
                      <span>Next-Gen E-commerce</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight text-white">
                      Verkoop Producten,<br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-magenta-400 to-purple-400">Geen Plaatjes</span>
                    </h2>
                    <p className="text-lg text-slate-300 leading-relaxed">
                      Geef uw klanten de controle. Met onze interactieve 3D-configurators kunnen bezoekers producten van alle kanten bekijken, aanpassen en ervaren voordat ze kopen. Dit verhoogt niet alleen de conversie, maar verlaagt ook het retourpercentage.
                    </p>

                    <ul className="space-y-4">
                      {[
                        "Interactieve Product visualisatie",
                        "Real-time Customization & Filtering",
                        "Seamless integratie met Shopify & WooCommerce",
                        "Laadtijden < 2 seconden, zelfs met 3D"
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-300">
                          <CheckCircle2 className="w-5 h-5 text-magenta-500 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Brand Identity (Living Logo) */}
          <section className="relative px-4 sm:px-6">
            <div className="container mx-auto">
              <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                {/* Text Side */}
                <div className="lg:w-1/2 order-2 lg:order-1">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
                      <Palette className="w-4 h-4" />
                      <span>Dynamische Branding</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight text-white">
                      Identiteit die<br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Leeft en Ademt</span>
                    </h2>
                    <p className="text-lg text-slate-300 leading-relaxed">
                      Een logo hoeft niet stil te staan. Wij creëren dynamische merkidentiteiten die reageren op interactie, omgeving en context. Uw merk wordt een levend organisme dat de aandacht grijpt en vasthoudt.
                    </p>

                    <div className="flex flex-wrap gap-3 pt-4">
                      <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm">Motion Design</span>
                      <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm">Sound Design</span>
                      <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm">Interactive Logo&apos;s</span>
                      <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm">Digital Art Direction</span>
                    </div>
                  </div>
                </div>

                {/* 3D Side */}
                <div className="lg:w-1/2 w-full order-1 lg:order-2">
                  <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-green-500/20 border border-green-500/20">
                    <div className="absolute inset-0 bg-gradient-to-bl from-green-500/10 to-emerald-500/10 z-0" />
                    <div className="relative z-10 w-full h-full">
                      <SimpleBrandIdentityModel />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Mobile-Responsive Design Showcase */}
          <MobileShowcase />
        </section>

        {/* Digital Galaxy Labs - Interactive 3D Service Showcase */}
        <DigitalGalaxyLabs />

        {/* Call to Action */}
        {/* Premium Call to Action */}
        {/* Premium Call to Action */}
        <section className="relative py-24 lg:py-32 overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-purple-900/20 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none opacity-40" />

          <div className="container relative mx-auto px-4 md:px-safe text-center z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight gradient-text leading-tight">
              Klaar voor een Project<br />met Extra Dimensie?
            </h2>
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Laat ons uw visie tot leven brengen met cutting-edge 3D technologie, authentieke Nederlandse vakmanschap en bewezen expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                href="/contact"
                variant="primary"
                size="large"
                className="text-lg px-10 py-5 !bg-gradient-to-r !from-indigo-600 !to-cyan-500 !shadow-xl hover:!shadow-cyan-500/30 hover:!scale-105 transition-transform duration-300 !text-white"
              >
                Start Uw 3D Project
              </Button>
              <Button
                href="/diensten"
                variant="secondary"
                size="large"
                className="text-lg px-10 py-5 hover:!scale-105 transition-transform duration-300 !bg-white/5 !border-white/10 hover:!bg-white/10 !text-white"
              >
                Ontdek Onze Diensten
              </Button>
            </div>

            <div className="mt-16 flex justify-center gap-8 text-slate-500 items-center opacity-70">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                <span>Vrijblijvend advies</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                <span>Directe prijsopgave</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}