import { Rocket, ShieldCheck, Zap, Users, Trophy, Sparkles, ArrowRight } from 'lucide-react';

import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/Button';
import DynamicFlowingRibbons from '@/components/dynamic/DynamicFlowingRibbons';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import SEOSchema from '@/components/SEOSchema';

import type { Metadata } from 'next';

export const dynamic = 'force-static';
export const revalidate = 60 * 60 * 24;

// Get canonical URL from environment with fallback
const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Over Ons | De #1 Webstudio voor Premium 3D Experiences',
  description: 'ProWeb Studio is de Nederlandse marktleider in high-end 3D webdesign. Wij combineren technische perfectie met ongekende creativiteit voor merken die willen domineren.',
  alternates: {
    canonical: '/over-ons',
    languages: {
      'nl-NL': '/over-ons',
      'x-default': '/over-ons'
    },
  },
  openGraph: {
    title: 'Over Ons | De #1 Webstudio voor Premium 3D Experiences',
    description: 'ProWeb Studio is de Nederlandse marktleider in high-end 3D webdesign. Wij combineren technische perfectie met ongekende creativiteit voor merken die willen domineren.',
    url: `${SITE_URL}/over-ons`,
    type: 'website',
    locale: 'nl_NL',
  },
};

export default function OverOnsPage() {
  return (
    <main className="min-h-screen relative pt-20 md:pt-24 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pb-20 lg:pb-32 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>

        <div className="container relative z-10 mx-auto max-w-6xl">
          <Breadcrumbs />

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mt-12">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
                <Trophy className="w-4 h-4" />
                <span>De Nieuwe Standaard in Webdesign</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight text-white tracking-tight">
                Architecten van de <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 animate-gradient-x">
                  Digitale Toekomst
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-xl mb-10">
                Wij nemen geen genoegen met &apos;goed genoeg&apos;. ProWeb Studio is opgericht met één doel: het definiëren van de absolute top in het Nederlandse digitale landschap. Wij bouwen niet zomaar websites; wij smeden digitale dominantie.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button href="/contact" variant="primary" size="large" className="!bg-gradient-to-r !from-indigo-600 !to-cyan-600 !text-white !shadow-lg hover:!shadow-cyan-500/30">
                  Start Uw Transformatie
                </Button>
                <div className="flex items-center gap-4 px-6 py-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-[#030014]" />
                    ))}
                  </div>
                  <div className="text-sm">
                    <span className="block text-white font-bold">Het A-Team</span>
                    <span className="text-slate-400 text-xs">Excellence Only</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[400px] lg:h-[600px] w-full rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-md shadow-2xl shadow-indigo-500/20 group hover:shadow-indigo-500/30 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <ErrorBoundary>
                <DynamicFlowingRibbons />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </section>

      {/* Values Bento Grid */}
      <section className="py-24 px-4 sm:px-6 relative bg-cosmic-900/30 backdrop-blur-sm border-y border-white/5">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Gedreven door <span className="text-cyan-400">Perfectie</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Onze kernwaarden zijn geen loze kreten, maar de fundering van elk pixel en regel code die wij opleveren.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Card 1: Innovation - Large */}
            <div className="md:col-span-2 row-span-1 relative group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 hover:border-indigo-500/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400 border border-indigo-500/30">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Onstuitbare Innovatie</h3>
                  <p className="text-slate-400 leading-relaxed max-w-lg">
                    Wij wachten niet op de toekomst; wij bouwen hem. Van WebGL tot AI-integraties, wij implementeren vandaag wat uw concurrenten volgend jaar pas ontdekken.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium">
                  <span>Ontdek onze stack</span> <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              {/* Decorative bg element */}
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />
            </div>

            {/* Card 2: Quality - Tall */}
            <div className="md:col-span-1 row-span-1 relative group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 hover:border-emerald-500/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Hollandse Kwaliteit</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Geen outsourcing, geen compromissen. Elk detail wordt in-house ontwikkeld met obsessieve aandacht voor kwaliteit en stabiliteit.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Performance */}
            <div className="md:col-span-1 row-span-1 relative group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 hover:border-amber-500/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 via-transparent to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-6 text-amber-400 border border-amber-500/30">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Extreme Performance</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Snelheid is geen feature, het is een vereiste. Wij optimaliseren voor milliseconden, want elke seconde telt voor uw conversie.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4: Partnership - Wide */}
            <div className="md:col-span-2 row-span-1 relative group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 hover:border-cyan-500/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-6 text-cyan-400 border border-cyan-500/30">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
                    Since 2024
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Partners, Geen Leveranciers</h3>
                  <p className="text-slate-400 leading-relaxed max-w-lg">
                    Wij zoeken geen eenmalige klussen, maar langdurige synergie. Uw groei is onze groei. Wij denken mee als mede-ondernemers, niet als uitvoerders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Statement Section */}
      <section className="py-32 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <Sparkles className="w-12 h-12 text-indigo-400 mx-auto mb-8 animate-pulse" />
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-10 leading-tight">
            Wij bouwen niet voor vandaag. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Wij bouwen voor het decennium.</span>
          </h2>
          <p className="text-xl text-slate-300 leading-relaxed mb-12">
            De digitale wereld verandert razendsnel. Wat vandaag hip is, is morgen verouderd. ProWeb Studio creëert tijdloze fundamenten die schaalbaar, flexibel en toekomstbestendig zijn. Investeer in kwaliteit die blijft renderen.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-12">
            <div>
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest">In-House</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest">Monitoring</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">3D</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest">Expertise</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">#1</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest">Ambitie</div>
            </div>
          </div>
        </div>
      </section>

      <SEOSchema
        pageType="over-ons"
        pageTitle={metadata.title as string}
        pageDescription={metadata.description as string}
      />
    </main>
  );
}
