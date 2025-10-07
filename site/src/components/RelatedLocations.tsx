'use client';

import Link from 'next/link';
import { 
  locations, 
  getSmartLocationSuggestions,
  getLocationsForService,
  type LocationPage 
} from '@/config/internal-linking.config';


interface RelatedLocationsProps {
  currentService?: string;
  currentLocation?: string;
  className?: string;
  showAll?: boolean;
  maxItems?: number;
  excludeSlugs?: string[];
  title?: string;
  description?: string;
}

export default function RelatedLocations({ 
  currentService, 
  currentLocation,
  className = '',
  showAll = false,
  maxItems = 6,
  excludeSlugs = [],
  title,
  description
}: RelatedLocationsProps) {
  // Get related locations based on context
  let relatedLocations: LocationPage[] = [];
  
  if (currentService) {
    // Show locations where this service is available
    const serviceKey = currentService.replace('/diensten/', '').replace('/', '');
    relatedLocations = getLocationsForService(serviceKey, maxItems);
  } else if (currentLocation) {
    // Show nearby locations and popular cities
    relatedLocations = getSmartLocationSuggestions(currentLocation, excludeSlugs, maxItems);
  } else {
    // Show popular locations by population
    relatedLocations = locations
      .filter(location => !excludeSlugs.includes(location.slug))
      .sort((a, b) => (b.population || 0) - (a.population || 0))
      .slice(0, maxItems);
  }

  if (relatedLocations.length === 0) {
    return null;
  }

  // Dynamic title and description based on context
  const defaultTitle = currentService 
    ? `Beschikbaar in Deze Steden`
    : currentLocation 
    ? 'Nabijgelegen Locaties'
    : 'Onze Populaire Locaties';

  const defaultDescription = currentService
    ? `Steden waar wij onze ${currentService.replace('/diensten/', '').replace('-', ' ')} diensten aanbieden`
    : currentLocation 
    ? `Ontdek onze diensten in andere steden nabij ${currentLocation.charAt(0).toUpperCase() + currentLocation.slice(1)}`
    : 'Professionele webdiensten in grote Nederlandse steden';

  return (
    <section className={`py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {title || defaultTitle}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {description || defaultDescription}
          </p>
        </div>

        <div className={`grid gap-6 ${
          relatedLocations.length >= 4 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {relatedLocations.map((location) => (
            <Link
              key={location.slug}
              href={`/locaties/${location.slug}`}
              className="group bg-cosmic-800/30 border border-cosmic-700/50 rounded-lg p-6 hover:border-cyan-400/50 transition-all duration-300 hover:bg-cosmic-800/50"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {location.name}
                  </h3>
                  <span className="text-xs text-slate-500 bg-cosmic-700/50 px-2 py-1 rounded">
                    {location.region}
                  </span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed flex-grow mb-4">
                  {location.description}
                </p>
                {location.population && (
                  <div className="text-xs text-slate-500 mb-3">
                    Inwoners: {location.population.toLocaleString('nl-NL')}
                  </div>
                )}
                <div className="mt-auto flex items-center text-cyan-300 text-sm font-medium">
                  Bekijk locatie
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {showAll && (
          <div className="text-center mt-8">
            <Link
              href="/locaties"
              className="inline-flex items-center px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-cosmic-900 font-semibold rounded-lg transition-colors duration-200"
            >
              Bekijk Alle Locaties
              <span className="ml-2">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

// Schema.org structured data for related locations
export function RelatedLocationsSchema({ relatedLocations }: { relatedLocations: LocationPage[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': '#related-locations',
    inLanguage: 'nl-NL',
    name: 'Gerelateerde Locaties',
    itemListElement: relatedLocations.map((location, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Place',
        '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://prowebstudio.nl'}/locaties/${location.slug}`,
        name: location.name,
        description: location.description,
        address: {
          '@type': 'PostalAddress',
          addressLocality: location.name,
          addressRegion: location.region,
          addressCountry: 'NL',
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}