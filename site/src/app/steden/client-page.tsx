'use client';

import { useState, useMemo } from 'react';

import Link from 'next/link';

import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/Button';
import ContentSuggestions from '@/components/ContentSuggestions';
import { DutchBusinessInfo } from '@/components/local-seo';
import { steden, getPopularSteden, getstedenByRegion } from '@/config/steden.config';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');
const canonicalUrl = `${SITE_URL}/steden`;

export default function StedenClientPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const popularSteden = getPopularSteden(5);
  const regions = Array.from(new Set(steden.map(s => s.region)));

  // Filter cities based on search and region
  const filteredSteden = useMemo(() => {
    let filtered = steden;

    if (selectedRegion !== 'all') {
      filtered = getstedenByRegion(selectedRegion);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(stad => 
        stad.name.toLowerCase().includes(query) ||
        stad.province.toLowerCase().includes(query) ||
        stad.region.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedRegion]);

  // JSON-LD Schema
  const stedenSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${canonicalUrl}#steden`,
    inLanguage: 'nl-NL',
    name: 'ProWeb Studio Serviceregio\'s Nederland',
    description: 'Webdesign en website ontwikkeling diensten in Nederlandse steden',
    itemListElement: steden.map((stad, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Place',
        '@id': `${SITE_URL}/steden/${stad.slug}`,
        name: stad.name,
        description: stad.shortDescription,
        address: {
          '@type': 'PostalAddress',
          addressRegion: stad.province,
          addressCountry: 'NL',
        },
      },
    })),
  };

  return (
    <main className="pt-20 md:pt-24 relative overflow-hidden">
      <Breadcrumbs />
      
      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(stedenSchema),
        }}
      />

      {/* Hero Section */}
      <section className="relative py-section-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Website Laten Maken
            </span>
            {' '}in Nederland
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Lokale webdesign expertise in {steden.length} Nederlandse steden. 
            Van Amsterdam tot Groningen, van Rotterdam tot Nijmegen - 
            professionele websites voor ondernemers in heel Nederland.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/contact"
              variant="primary"
              size="large"
            >
              Start Uw Project →
            </Button>
            <Button
              href="/diensten"
              variant="secondary"
              size="large"
            >
              Bekijk Diensten
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-12 bg-cosmic-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Populaire Steden
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              De meest gevraagde locaties voor professionele webdesign diensten
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {popularSteden.map((stad) => (
              <Link
                key={stad.slug}
                href={`/steden/${stad.slug}`}
                className="group bg-cosmic-800/30 border border-cosmic-700/50 rounded-lg p-6 hover:border-cyan-400/50 transition-all duration-300 hover:bg-cosmic-800/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {stad.name}
                  </h3>
                  <span className="text-2xl">🏛️</span>
                </div>
                <p className="text-sm text-slate-400 mb-2">{stad.province}</p>
                <p className="text-xs text-slate-500">
                  {stad.population.toLocaleString('nl-NL')} inwoners
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Alle Serviceregio&apos;s
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Zoek uw stad of filter op regio voor lokale webdesign expertise
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-8 space-y-4">
            {/* Search Input */}
            <div className="max-w-2xl mx-auto">
              <input
                type="search"
                placeholder="Zoek op stad, provincie of regio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 bg-cosmic-800/30 border border-cosmic-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50 transition-colors"
                aria-label="Zoek steden"
              />
            </div>

            {/* Region Filter */}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setSelectedRegion('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedRegion === 'all'
                    ? 'bg-cyan-500 text-cosmic-900'
                    : 'bg-cosmic-800/30 text-slate-400 hover:bg-cosmic-800/50 hover:text-white'
                }`}
              >
                Alle Regio&apos;s ({steden.length})
              </button>
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedRegion === region
                      ? 'bg-cyan-500 text-cosmic-900'
                      : 'bg-cosmic-800/30 text-slate-400 hover:bg-cosmic-800/50 hover:text-white'
                  }`}
                >
                  {region} ({getstedenByRegion(region).length})
                </button>
              ))}
            </div>
          </div>

          {/* Cities Grid */}
          {filteredSteden.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSteden.map((stad) => (
                <Link
                  key={stad.slug}
                  href={`/steden/${stad.slug}`}
                  className="group bg-cosmic-800/30 border border-cosmic-700/50 rounded-lg p-5 hover:border-cyan-400/50 transition-all duration-300 hover:bg-cosmic-800/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors mb-1">
                        {stad.name}
                      </h3>
                      <p className="text-xs text-slate-400">{stad.province}</p>
                    </div>
                    <span className="text-xl">📍</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    {stad.population.toLocaleString('nl-NL')} inwoners
                  </p>
                  <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                    {stad.shortDescription}
                  </p>
                  <div className="mt-4 flex items-center text-cyan-300 text-xs font-medium">
                    5 diensten beschikbaar
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg mb-4">
                Geen steden gevonden voor &quot;{searchQuery}&quot;
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRegion('all');
                }}
                className="text-cyan-300 hover:text-cyan-200 font-medium"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Local Section */}
      <section className="py-section bg-cosmic-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Waarom Lokale Webdesign Expertise?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🗺️</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Lokale SEO Optimalisatie
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Word gevonden door klanten in uw regio met geoptimaliseerde 
                lokale zoekwoorden en Google My Business integratie.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Persoonlijke Service
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Directe communicatie in het Nederlands, begrip van lokale markt 
                en bedrijfscultuur in uw regio.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Snelle Reactietijd
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Nederlandse kantooruren, snelle support en mogelijkheid voor 
                persoonlijke afspraken in uw regio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Info Section */}
      <section className="py-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Neem Contact Op
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Klaar om uw online aanwezigheid te versterken? 
              Neem contact op voor een vrijblijvend gesprek.
            </p>
          </div>
          
          <DutchBusinessInfo 
            variant="compact"
            showAddress={true}
            showOpeningHours={true}
            showContact={true}
            showRegistration={true}
            className="max-w-xl mx-auto"
          />
        </div>
      </section>

      <ContentSuggestions 
        customSuggestions={[
          { title: 'Bekijk Onze Diensten', href: '/diensten', description: 'Ontdek wat wij voor uw bedrijf kunnen betekenen' },
          { title: 'Portfolio Bekijken', href: '/portfolio', description: 'Zie voorbeelden van ons werk voor Nederlandse bedrijven' },
          { title: 'Onze Werkwijze', href: '/werkwijze', description: 'Hoe wij samen tot het beste resultaat komen' }
        ]}
      />
    </main>
  );
}
