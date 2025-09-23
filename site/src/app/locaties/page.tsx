import type { Metadata } from 'next';
import Link from 'next/link';
import { locations } from '@/config/internal-linking.config';
import Breadcrumbs from '@/components/Breadcrumbs';
import ContentSuggestions from '@/components/ContentSuggestions';
import { BackgroundImage } from '@/components/ui/responsive-image';

export const dynamic = 'force-static';
export const revalidate = 60 * 60 * 24;

const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Webdesign Locaties Nederland | ProWeb Studio in alle grote steden',
  description: 'ProWeb Studio biedt professionele webdesign diensten in heel Nederland. Van Amsterdam tot Rotterdam, Utrecht tot Den Haag - lokale expertise voor uw website project.',
  alternates: {
    canonical: '/locaties',
    languages: { 
      'nl-NL': '/locaties',
      'x-default': '/locaties'
    },
  },
  openGraph: {
    title: 'Webdesign Locaties Nederland | ProWeb Studio',
    description: 'Lokale webdesign expertise in alle grote Nederlandse steden. Maatwerk websites met persoonlijke service.',
    url: `${SITE_URL}/locaties`,
    type: 'website',
    locale: 'nl_NL',
  },
};

// Generate location schema
const locationsSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${SITE_URL}/locaties#locations`,
  inLanguage: 'nl-NL',
  name: 'ProWeb Studio Locaties Nederland',
  description: 'Webdesign en ontwikkeling diensten in Nederlandse steden',
  itemListElement: locations.map((location, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Place',
      '@id': `${SITE_URL}/locaties/${location.slug}`,
      name: location.name,
      description: location.description,
      address: {
        '@type': 'PostalAddress',
        addressRegion: location.region,
        addressCountry: 'NL',
      },
      containedInPlace: {
        '@type': 'Country',
        name: 'Netherlands',
      },
    },
  })),
};

export default function LocatiesPage() {
  // Group locations by region for better organization
  const locationsByRegion = locations.reduce((acc, location) => {
    if (!acc[location.region]) {
      acc[location.region] = [];
    }
    acc[location.region].push(location);
    return acc;
  }, {} as Record<string, typeof locations>);

  return (
    <main className="pt-20 md:pt-24 relative overflow-hidden">
      <Breadcrumbs />
      
      {/* Background */}
      <BackgroundImage
        src="/assets/nebula_services_background.avif"
        alt=""
        priority={true}
        quality={85}
        className="opacity-30 pointer-events-none -z-10"
      />

      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(locationsSchema),
        }}
      />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Webdesign Nederland
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Lokale expertise, nationale kwaliteit. ProWeb Studio biedt professionele 
            webdesign diensten in alle grote Nederlandse steden.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Uw Project
              <span className="ml-2">→</span>
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center px-8 py-4 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-cosmic-900 font-semibold rounded-lg transition-all duration-300"
            >
              Bekijk Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Onze Serviceregio&apos;s
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Van de Randstad tot Brabant, van Groningen tot Zeeland - 
              wij bieden lokale service met nationale expertise.
            </p>
          </div>

          {Object.entries(locationsByRegion).map(([region, regionLocations]) => (
            <div key={region} className="mb-12">
              <h3 className="text-2xl font-bold text-cyan-400 mb-6 text-center">
                {region}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regionLocations.map((location) => (
                  <Link
                    key={location.slug}
                    href={`/locaties/${location.slug}`}
                    className="group bg-cosmic-800/30 border border-cosmic-700/50 rounded-lg p-6 hover:border-cyan-400/50 transition-all duration-300 hover:bg-cosmic-800/50"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          {location.name}
                        </h4>
                        {location.population && (
                          <span className="text-xs text-gray-500 bg-cosmic-700/50 px-2 py-1 rounded">
                            {location.population.toLocaleString('nl-NL')} inw.
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-400 text-sm leading-relaxed flex-grow mb-4">
                        {location.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500 font-medium">
                          Beschikbare diensten:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {location.relatedServices.slice(0, 3).map((service) => (
                            <span
                              key={service}
                              className="text-xs bg-cyan-400/10 text-cyan-300 px-2 py-1 rounded border border-cyan-400/20"
                            >
                              {service.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                            </span>
                          ))}
                          {location.relatedServices.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{location.relatedServices.length - 3} meer
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center text-cyan-400 text-sm font-medium">
                        Bekijk diensten in {location.name}
                        <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-cosmic-900 to-cosmic-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Uw Stad Niet Gevonden?
          </h2>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Geen probleem! We werken met klanten door heel Nederland. 
            Dankzij moderne technologie en bewezen processen leveren we 
            overal dezelfde hoge kwaliteit.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Neem Contact Op
            <span className="ml-2">→</span>
          </Link>
        </div>
      </section>

      <ContentSuggestions 
        customSuggestions={[
          { title: 'Bekijk Onze Diensten', href: '/diensten', description: 'Ontdek wat wij voor uw bedrijf kunnen betekenen' },
          { title: 'Portfolio Bekijken', href: '/portfolio', description: 'Zie voorbeelden van ons werk voor Nederlandse bedrijven' },
          { title: 'Werkwijze Leren', href: '/werkwijze', description: 'Hoe wij samen tot het beste resultaat komen' }
        ]}
      />
    </main>
  );
}