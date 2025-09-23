'use client';

import Link from 'next/link';
import { services, getRelatedServices } from '@/config/internal-linking.config';

interface RelatedServicesProps {
  currentService?: string;
  className?: string;
  showAll?: boolean;
  maxItems?: number;
}

export default function RelatedServices({ 
  currentService, 
  className = '',
  showAll = false,
  maxItems = 3 
}: RelatedServicesProps) {
  // Get related services based on current service, or show popular services
  const relatedServices = currentService 
    ? getRelatedServices(currentService)
    : services.slice(0, maxItems);

  if (relatedServices.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {currentService ? 'Gerelateerde Diensten' : 'Onze Populaire Diensten'}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {currentService 
              ? 'Ontdek andere diensten die perfect aansluiten bij uw behoeften'
              : 'Professionele webdiensten voor Nederlandse bedrijven'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <p className="text-gray-400 text-sm leading-relaxed flex-grow">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center text-cyan-400 text-sm font-medium">
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
export function RelatedServicesSchema({ relatedServices }: { relatedServices: any[] }) {
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}