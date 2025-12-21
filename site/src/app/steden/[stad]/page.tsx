import Link from 'next/link';
import { notFound } from 'next/navigation';

import { HeroCanvas, CityHeroScene } from '@/components/3d/ClientScene';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/Button';
import ContentSuggestions from '@/components/ContentSuggestions';
import { DutchBusinessInfo } from '@/components/local-seo';
import LocalMapEmbed from '@/components/LocalMapEmbed';
import SEOSchema from '@/components/SEOSchema';
import { Icon } from '@/components/ui/Icon';
import { getDienstBySlug } from '@/config/diensten.config';
import {
  getStadBySlug,
  getNearbySteden,
  getAllStadSlugs,
  getServicesForStad,
} from '@/config/steden.config';
import { generateStadMetadata, generateStadSchema } from '@/lib/seo/steden-metadata';

import type { Metadata } from 'next';

export const dynamic = 'force-static';
export const revalidate = 172800; // 48 hours ISR

interface StadPageProps {
  params: Promise<{
    stad: string;
  }>;
}

// Generate static params for all cities
export async function generateStaticParams() {
  return getAllStadSlugs().map((slug) => ({
    stad: slug,
  }));
}

// Generate metadata for each city
export async function generateMetadata({ params }: StadPageProps): Promise<Metadata> {
  const { stad: stadSlug } = await params;
  const stad = getStadBySlug(stadSlug);

  if (!stad) {
    return {
      title: 'Stad niet gevonden | ProWeb Studio',
      description: 'De opgevraagde stad is niet gevonden.',
    };
  }

  return generateStadMetadata({ stad });
}

export default async function StadPage({ params }: StadPageProps) {
  const { stad: stadSlug } = await params;
  const stad = getStadBySlug(stadSlug);

  if (!stad) {
    notFound();
  }

  // Get available services for this city
  const availableDiensten = getServicesForStad()
    .map(slug => getDienstBySlug(slug))
    .filter((dienst): dienst is NonNullable<typeof dienst> => dienst !== undefined);

  const nearbySteden = getNearbySteden(stadSlug);
  const stadSchema = generateStadSchema(stad);

  return (
    <main className="relative content-safe-top pt-20 md:pt-24 overflow-hidden">
      <SEOSchema
        pageType="local"
        pageTitle={`Website Laten Maken ${stad.name}`}
        pageDescription={stad.description}
        cityName={stad.name}
      />

      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(stadSchema),
        }}
      />

      <Breadcrumbs />

      {/* Hero Section with 3D Background */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-section-lg">
        {/* 3D Scene Layer */}
        <div className="absolute inset-0 z-0">
          <HeroCanvas>
            <CityHeroScene citySlug={stad.slug} />
          </HeroCanvas>
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-cosmic-900/40 via-cosmic-900/60 to-transparent pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-sm font-medium mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.2)] animate-fade-in">
            <Icon name="📍" className="w-4 h-4" />
            <span className="uppercase tracking-wide text-xs">{stad.province} • {stad.region}</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight tracking-tight drop-shadow-2xl">
            Website laten maken{' '}
            <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x p-2">
              {stad.name}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-100 mb-10 leading-relaxed max-w-3xl mx-auto drop-shadow-lg font-light">
            {stad.description}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-black/40 border border-white/10 backdrop-blur-lg hover:border-cyan-500/50 transition-colors duration-300">
              <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee] animate-pulse"></div>
              <span className="text-slate-200 font-medium">{stad.population.toLocaleString('nl-NL')} inwoners</span>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-black/40 border border-white/10 backdrop-blur-lg hover:border-purple-500/50 transition-colors duration-300">
              <div className="w-2.5 h-2.5 bg-purple-400 rounded-full shadow-[0_0_10px_#c084fc]"></div>
              <span className="text-slate-200 font-medium">{availableDiensten.length} premium diensten</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Button
              href="/contact"
              variant="primary"
              size="large"
              className="shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] transform hover:-translate-y-1 transition-all duration-300"
            >
              Start Project in {stad.name}
            </Button>
            <Button
              href="#diensten"
              variant="secondary"
              size="large"
              className="backdrop-blur-xl bg-white/5 border-white/10 hover:bg-white/10"
            >
              Ontdek Onze Diensten
            </Button>
          </div>
        </div>
      </section>

      {/* Available Services - Genius Grid */}
      <section id="diensten" className="py-section relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Digitale Oplossingen voor <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">{stad.name}</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Wij leveren geen websites, wij leveren groei. Kies uw dienst.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableDiensten.map((dienst) => (
              <Link
                key={dienst.slug}
                href={`/steden/${stad.slug}/${dienst.slug}`}
                className="group relative flex flex-col bg-cosmic-900/40 border border-white/5 rounded-3xl p-8 hover:border-cyan-500/50 transition-all duration-500 hover:bg-cosmic-800/60 hover:shadow-[0_10px_40px_-10px_rgba(6,182,212,0.2)] hover:-translate-y-2 overflow-hidden"
              >
                {/* Hover Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-black border border-gray-700 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:border-cyan-500/30 text-cyan-400">
                  <Icon name={dienst.icon} className="w-8 h-8" />
                </div>

                <h3 className="relative z-10 text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors duration-300">
                  {dienst.name}
                </h3>

                <p className="relative z-10 text-slate-400 text-base leading-relaxed mb-8 flex-grow group-hover:text-slate-300 transition-colors">
                  {dienst.shortDescription}
                </p>

                <div className="relative z-10 pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Investering vanaf</span>
                    <span className="text-cyan-300 font-bold font-mono text-lg shadow-cyan-900/50 text-shadow-sm">
                      {dienst.pricing.from}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black group-hover:border-cyan-400 transition-all duration-300 shadow-lg">
                    <span className="transform group-hover:translate-x-1 transition-transform font-bold">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Modernized & Localized */}
      <section className="py-section bg-black/20 backdrop-blur-sm border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* NEW: Digital Economy & Local Impact */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/30 border border-cyan-500/30 text-cyan-300 text-sm font-medium mb-6">
                <span className="animate-pulse">●</span>
                Digitale Economie {stad.name}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Wij Begrijpen de <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Markt in {stad.name}</span>
              </h2>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                {stad.digitalEconomy || `Als ondernemer in ${stad.name} weet u dat de concurrentie niet stilzit. De digitale lat ligt hoog. Wij helpen u niet alleen aan een website, maar aan een strategisch voordeel.`}
              </p>

              {/* USP Box */}
              <div className="bg-gradient-to-br from-cosmic-800 to-black p-6 rounded-2xl border-l-4 border-cyan-500 shadow-lg">
                <h4 className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
                  <Icon name="💡" className="w-5 h-5" /> Onze Belofte aan {stad.name}
                </h4>
                <p className="text-slate-300 italic">
                  &quot;{stad.uniqueSellingPoint || `Wij leveren websites die net zo hard werken als u. Geen jargon, wel resultaat.`}&quot;
                </p>
              </div>

              {/* Industries Tags */}
              {stad.localIndustries && stad.localIndustries.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-sm uppercase tracking-wider text-slate-500 mb-4 font-semibold">Wij zijn gespecialiseerd in:</h4>
                  <div className="flex flex-wrap gap-2">
                    {stad.localIndustries.map((industry, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-colors cursor-default">
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Map Component */}
            <div className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl shadow-cyan-900/20 border border-white/10">
              <LocalMapEmbed
                cityName={stad.name}
                lat={stad.coordinates?.lat}
                lng={stad.coordinates?.lng}
              />
            </div>
          </div>

          {/* Standard Benefits Grid (Retained but refined) */}
          <div className="text-center mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              De ProWeb Studio Standaard
            </h3>
            <p className="text-slate-400">Universele kwaliteit, lokaal toegepast.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Lokale SEO Expert',
                desc: `Nummer 1 posities in ${stad.region}`,
                icon: '🚀'
              },
              {
                title: 'Razendsnel',
                desc: 'Websites die laden in < 0.5s',
                icon: '⚡'
              },
              {
                title: '3D & Interactief',
                desc: 'Onderscheid u van de massa',
                icon: '🎮'
              },
              {
                title: 'Transparant',
                desc: 'Vaste prijzen, geen verrassingen',
                icon: '💎'
              }
            ].map((item, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-cosmic-800/20 border border-white/5 hover:bg-cosmic-800/60 hover:border-cyan-500/30 transition-all duration-300 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-cyan-900/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Icon name={item.icon} className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Cities */}
      {nearbySteden.length > 0 && (
        <section className="py-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ook Actief in de Omgeving van {stad.name}
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Naast {stad.name} bedienen wij ook graag andere steden in {stad.region}.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {nearbySteden.map((nearbyStad) => (
                <Link
                  key={nearbyStad.slug}
                  href={`/steden/${nearbyStad.slug}`}
                  className="group bg-cosmic-800/30 border border-cosmic-700/50 rounded-lg p-6 hover:border-cyan-400/50 transition-all duration-300 hover:bg-cosmic-800/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {nearbyStad.name}
                    </h3>
                    <Icon name="📍" className="w-5 h-5 text-cyan-400" />
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{nearbyStad.province}</p>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    {nearbyStad.shortDescription}
                  </p>
                  <div className="flex items-center text-cyan-300 text-sm font-medium">
                    Bekijk diensten in {nearbyStad.name}
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/steden"
                className="inline-flex items-center text-cyan-300 hover:text-cyan-200 font-medium"
              >
                Bekijk alle steden waar wij actief zijn
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Business Info Section */}
      <section className="py-section bg-cosmic-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Neem Contact Op voor Website Project in {stad.name}
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Klaar om uw online aanwezigheid in {stad.name} te versterken?
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

      <ContentSuggestions
        customSuggestions={[
          {
            title: 'Plan Een Gesprek',
            href: '/contact',
            description: `Bespreek uw website project voor ${stad.name}`
          },
          {
            title: 'Bekijk Onze Werkwijze',
            href: '/werkwijze',
            description: 'Ontdek hoe wij samen tot het beste resultaat komen'
          },
          {
            title: 'Portfolio Inzien',
            href: '/portfolio',
            description: 'Zie voorbeelden van onze professionele websites'
          }
        ]}
      />
    </main>
  );
}
