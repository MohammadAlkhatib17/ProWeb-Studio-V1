import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { locations, services, getNearbyLocations } from '@/config/internal-linking.config';
import { Button } from '@/components/Button';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedServices from '@/components/RelatedServices';
import ContentSuggestions from '@/components/ContentSuggestions';
import { generateMetadata as generateEnhancedMetadata, type LocationKey } from '@/lib/metadata';


export const dynamic = 'force-static';
export const revalidate = 60 * 60 * 24;

const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');

interface LocationPageProps {
  params: {
    location: string;
  };
}

// Generate static params for all locations
export async function generateStaticParams() {
  return locations.map((location) => ({
    location: location.slug,
  }));
}

// Generate metadata for each location using enhanced metadata system
export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const location = locations.find(l => l.slug === params.location);
  
  if (!location) {
    return {
      title: 'Locatie niet gevonden | ProWeb Studio',
      description: 'De opgevraagde locatie is niet gevonden.',
    };
  }

  const locationKey = params.location as LocationKey;
  
  return generateEnhancedMetadata(`/locaties/${params.location}`, {
    location: locationKey,
    pageType: 'location',
    lastModified: new Date().toISOString(),
    image: {
      url: `/og-location-${params.location}.png`,
      alt: `Website laten maken ${location.name} - ProWeb Studio`,
      width: 1200,
      height: 630,
    },
  });
}

export default function LocationPage({ params }: LocationPageProps) {
  const location = locations.find(l => l.slug === params.location);
  
  if (!location) {
    notFound();
  }

  const nearbyLocations = getNearbyLocations(location.slug);
  const locationServices = services.filter(service => 
    service.targetLocation?.includes(location.slug)
  );

  // Location-specific schema
  const locationSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/locaties/${location.slug}#business`,
    name: `ProWeb Studio ${location.name}`,
    description: location.description,
    url: `${SITE_URL}/locaties/${location.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: location.name,
      addressRegion: location.region,
      addressCountry: 'NL',
    },
    areaServed: {
      '@type': 'City',
      name: location.name,
      containedInPlace: {
        '@type': 'State',
        name: location.region,
        containedInPlace: {
          '@type': 'Country',
          name: 'Netherlands',
        },
      },
    },
    serviceType: location.relatedServices.map(service => 
      service.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase())
    ),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Webdesign Diensten ${location.name}`,
      itemListElement: locationServices.map((service, index) => ({
        '@type': 'OfferCatalogItem',
        position: index + 1,
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.description,
          areaServed: {
            '@type': 'City',
            name: location.name,
          },
        },
      })),
    },
    parentOrganization: {
      '@id': `${SITE_URL}#organization`,
    },
  };

  return (
    <main className="pt-20 md:pt-24 relative overflow-hidden">
      <Breadcrumbs />
      
      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(locationSchema),
        }}
      />

      {/* Hero Section */}
      <section className="relative py-section-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🏛️</span>
              <span className="text-cyan-300 font-medium">{location.region}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Website laten maken{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {location.name}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-200 mb-8 leading-relaxed">
              {location.description}
            </p>
            
            {location.population && (
              <div className="flex items-center gap-4 mb-8 text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  {location.population.toLocaleString('nl-NL')} inwoners
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  {location.relatedServices.length} beschikbare diensten
                </span>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                href="/contact"
                variant="primary"
                size="large"
              >
                Start Uw Project in {location.name} →
              </Button>
              <Button
                href="/portfolio"
                variant="secondary"
                size="large"
              >
                Bekijk Portfolio
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Local Services */}
      <section className="py-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Onze Diensten in {location.name}
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Professionele webdiensten speciaal afgestemd op de behoeften 
              van bedrijven in {location.name} en omgeving.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locationServices.map((service) => (
              <div
                key={service.href}
                className="bg-cosmic-800/30 border border-cosmic-700/50 rounded-lg p-6 hover:border-cyan-400/50 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  {service.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
                <Link
                  href={service.href}
                  className="inline-flex items-center text-cyan-300 font-medium hover:text-cyan-200 transition-colors"
                >
                  Meer informatie
                  <span className="ml-2">→</span>
                </Link>
              </div>
            ))}
          </div>

          {locationServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-6">
                Alle onze diensten zijn beschikbaar in {location.name}.
              </p>
              <Link
                href="/diensten"
                className="inline-flex items-center px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-cosmic-900 font-semibold rounded-lg transition-colors duration-200"
              >
                Bekijk Alle Diensten
                <span className="ml-2">→</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Nearby Locations */}
      {nearbyLocations.length > 0 && (
        <section className="py-section bg-cosmic-800/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ook Actief in de Omgeving
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Naast {location.name} bedienen wij ook graag andere steden in de regio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {nearbyLocations.map((nearbyLocation) => (
                <Link
                  key={nearbyLocation.slug}
                  href={`/locaties/${nearbyLocation.slug}`}
                  className="group bg-cosmic-800/30 border border-cosmic-700/50 rounded-lg p-6 hover:border-cyan-400/50 transition-all duration-300 hover:bg-cosmic-800/50"
                >
                  <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors mb-3">
                    {nearbyLocation.name}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    {nearbyLocation.description}
                  </p>
                  <div className="flex items-center text-cyan-300 text-sm font-medium">
                    Bekijk diensten in {nearbyLocation.name}
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Local SEO Content */}
      <section className="py-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
              Waarom Kiezen voor ProWeb Studio in {location.name}?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-cosmic-900 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Lokale Kennis, Nationale Expertise
                    </h3>
                    <p className="text-slate-400 text-sm">
                      We begrijpen de unieke karakteristieken van {location.name} 
                      en combineren dit met onze landelijke ervaring in webdesign.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-cosmic-900 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      SEO voor {location.name}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Lokale SEO-optimalisatie zorgt ervoor dat uw website 
                      goed vindbaar is voor klanten in {location.name} en omgeving.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-cosmic-900 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Persoonlijke Service
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Directe communicatie en persoonlijke aandacht. 
                      We zijn altijd bereikbaar voor vragen of aanpassingen.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-cosmic-900 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Bewezen Resultaten
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Tevreden klanten door heel Nederland, waaronder succesvolle 
                      projecten voor bedrijven in en rond {location.name}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RelatedServices showAll={true} maxItems={6} />
      
      <ContentSuggestions 
        customSuggestions={[
          { title: 'Plan Een Gesprek', href: '/contact', description: `Bespreek uw website project voor ${location.name}` },
          { title: 'Bekijk Onze Werkwijze', href: '/werkwijze', description: 'Ontdek hoe wij samen tot het beste resultaat komen' },
          { title: 'Portfolio Inzien', href: '/portfolio', description: 'Zie voorbeelden van onze professionele websites' }
        ]}
      />
    </main>
  );
}