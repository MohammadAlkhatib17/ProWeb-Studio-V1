'use client';

import Link from 'next/link';
import { 
  services, 
  getSmartServiceSuggestions,
  getServicesForLocation,
  type ServiceLink 
} from '@/config/internal-linking.config';


interface RelatedServicesProps {
  currentService?: string;
  currentLocation?: string;
  className?: string;
  showAll?: boolean;
  maxItems?: number;
  excludeHrefs?: string[];
  title?: string;
  description?: string;
}

export default function RelatedServices({ 
  currentService, 
  currentLocation,
  className = '',
  showAll = false,
  maxItems = 6,
  excludeHrefs = [],
  title,
  description
}: RelatedServicesProps) {
  // Get related services based on context
  let relatedServices: ServiceLink[] = [];
  
  if (currentLocation) {
    // Show services available in this location
    relatedServices = getServicesForLocation(currentLocation, maxItems, excludeHrefs);
  } else if (currentService) {
    // Show related services for current service
    relatedServices = getSmartServiceSuggestions(currentService, excludeHrefs, maxItems);
  } else {
    // Show popular services
    relatedServices = services
      .filter(service => !excludeHrefs.includes(service.href))
      .slice(0, maxItems);
  }

  if (relatedServices.length === 0) {
    return null;
  }

  // Dynamic title and description based on context
  const defaultTitle = currentLocation 
    ? `Onze Diensten in ${currentLocation.charAt(0).toUpperCase() + currentLocation.slice(1)}`
    : currentService 
    ? 'Gerelateerde Diensten'
    : 'Onze Populaire Diensten';

  const defaultDescription = currentLocation
    ? `Professionele webdiensten beschikbaar in ${currentLocation.charAt(0).toUpperCase() + currentLocation.slice(1)}`
    : currentService 
    ? 'Ontdek andere diensten die perfect aansluiten bij uw behoeften'
    : 'Professionele webdiensten voor Nederlandse bedrijven';

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
          relatedServices.length >= 4 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {relatedServices.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="group bg-cosmic-800/30 border border-cosmic-700/50 rounded-lg p-6 hover:border-cyan-400/50 transition-all duration-300 hover:bg-cosmic-800/50"
            >
              <div className="flex flex-col h-full">
                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-grow">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center text-cyan-300 text-sm font-medium">
                  Meer informatie
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
  );
}

// Schema.org structured data for related services
export function RelatedServicesSchema({ relatedServices }: { relatedServices: ServiceLink[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': '#related-services',
    inLanguage: 'nl-NL',
    name: 'Gerelateerde Diensten',
    itemListElement: relatedServices.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://prowebstudio.nl'}${service.href}`,
        name: service.title,
        description: service.description,
        provider: {
          '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://prowebstudio.nl'}#organization`,
        },
        areaServed: {
          '@type': 'Place',
          name: 'Netherlands',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'NL',
          },
        },
      },
    })),
  };

  // Note: Since this is a client component, we'll use standard approach
  // The CSP nonce will be handled by the parent server component or middleware
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}