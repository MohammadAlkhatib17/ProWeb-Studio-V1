import React from 'react';
import Link from 'next/link';
import { SemanticSection, SemanticHeading } from '../layout/SemanticLayout';
import { locations, services } from '@/config/internal-linking.config';

interface InternalLinkingStrategyProps {
  currentPage?: 'service' | 'location' | 'home';
  currentSlug?: string;
  className?: string;
}

export function InternalLinkingStrategy({ 
  currentPage = 'home', 
  currentSlug,
  className = '' 
}: InternalLinkingStrategyProps) {
  
  // Get related content based on current page
  const getRelatedContent = () => {
    if (currentPage === 'service' && currentSlug) {
      const currentService = services.find(s => s.href.includes(currentSlug));
      return {
        services: services.filter(s => s.href !== currentService?.href),
        locations: locations.filter(l => 
          currentService?.targetLocation?.includes(l.slug) || false
        ),
        currentService
      };
    }
    
    if (currentPage === 'location' && currentSlug) {
      const currentLocation = locations.find(l => l.slug === currentSlug);
      return {
        services: services.filter(s => 
          currentLocation?.relatedServices.some(rs => s.href.includes(rs)) || false
        ),
        locations: locations.filter(l => 
          currentLocation?.nearbyLocations.includes(l.slug) || false
        ),
        currentLocation
      };
    }
    
    // Homepage - show top services and locations
    return {
      services: services.slice(0, 3),
      locations: locations.slice(0, 6)
    };
  };

  const { services: relatedServices, locations: relatedLocations, currentService, currentLocation } = getRelatedContent();

  return (
    <div className={className}>
      {/* Breadcrumb navigation */}
      <nav aria-label="Breadcrumb navigatie" className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-slate-400">
          <li>
            <Link href="/" className="hover:text-cyan-300 transition-colors duration-200">
              ProWeb Studio
            </Link>
          </li>
          {currentPage === 'service' && currentService && (
            <>
              <li className="flex items-center">
                <span className="mx-2">→</span>
                <Link href="/diensten" className="hover:text-cyan-300 transition-colors duration-200">
                  Diensten
                </Link>
              </li>
              <li className="flex items-center">
                <span className="mx-2">→</span>
                <span className="text-cyan-300 font-medium">{currentService.title}</span>
              </li>
            </>
          )}
          {currentPage === 'location' && currentLocation && (
            <>
              <li className="flex items-center">
                <span className="mx-2">→</span>
                <Link href="/locaties" className="hover:text-cyan-300 transition-colors duration-200">
                  Locaties
                </Link>
              </li>
              <li className="flex items-center">
                <span className="mx-2">→</span>
                <span className="text-cyan-300 font-medium">Webdesign {currentLocation.name}</span>
              </li>
            </>
          )}
        </ol>
      </nav>

      {/* Related services section */}
      {relatedServices.length > 0 && (
        <SemanticSection 
          as="section" 
          className="mb-12"
          aria-label="Gerelateerde webdesign diensten"
        >
          <SemanticHeading level={2} className="text-2xl font-bold mb-6 text-cyan-300">
            {currentPage === 'location' ? `Onze Diensten in ${currentLocation?.name}` : 'Onze Webdesign Diensten'}
          </SemanticHeading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedServices.map((service, index) => (
              <article key={index} className="bg-cosmic-800/40 p-6 rounded-xl border border-cosmic-700/60 hover:border-cosmic-600/80 transition-all duration-300">
                <SemanticHeading level={3} className="text-lg font-semibold mb-3 text-cyan-300">
                  {service.title}
                  {currentLocation && ` ${currentLocation.name}`}
                </SemanticHeading>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                  {service.description}
                  {currentLocation && ` Speciaal voor bedrijven in ${currentLocation.name} en omgeving.`}
                </p>
                <Link 
                  href={service.href}
                  className="inline-flex items-center text-cyan-300 hover:text-cyan-400 transition-colors duration-200 text-sm font-medium"
                  title={`${service.title} ${currentLocation ? `in ${currentLocation.name}` : ''}`}
                >
                  Meer over {service.title} →
                </Link>
              </article>
            ))}
          </div>
        </SemanticSection>
      )}

      {/* Related locations section */}
      {relatedLocations.length > 0 && (
        <SemanticSection 
          as="section" 
          className="mb-12"
          aria-label="Webdesign diensten in Nederlandse steden"
        >
          <SemanticHeading level={2} className="text-2xl font-bold mb-6 text-cyan-300">
            {currentPage === 'service' 
              ? `${currentService?.title} in Nederlandse Steden`
              : currentLocation 
                ? `Webdesign in de Buurt van ${currentLocation.name}`
                : 'Webdesign in Nederlandse Steden'
            }
          </SemanticHeading>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {relatedLocations.map((location, index) => (
              <Link 
                key={index}
                href={`/locaties/${location.slug}`}
                className="block p-4 bg-cosmic-800/40 rounded-lg border border-cosmic-700/60 hover:border-cosmic-600/80 transition-all duration-300 text-center group"
                title={`${currentService?.title || 'Webdesign'} ${location.name}`}
              >
                <div className="text-2xl mb-2">🏙️</div>
                <div className="text-sm font-medium text-cyan-300 group-hover:text-cyan-400 transition-colors duration-200">
                  {location.name}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {location.region}
                </div>
              </Link>
            ))}
          </div>
        </SemanticSection>
      )}

      {/* Content suggestions */}
      <SemanticSection 
        as="aside" 
        className="bg-cosmic-800/20 p-8 rounded-2xl border border-cosmic-700/60"
        aria-label="Aanbevolen content en volgende stappen"
      >
        <SemanticHeading level={2} className="text-xl font-bold mb-4 text-cyan-300">
          Volgende Stappen
        </SemanticHeading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-slate-200">Ontdek Meer</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/werkwijze" 
                  className="text-cyan-300 hover:text-cyan-400 transition-colors duration-200 text-sm"
                >
                  Ons Webdesign Proces →
                </Link>
              </li>
              <li>
                <Link 
                  href="/portfolio" 
                  className="text-cyan-300 hover:text-cyan-400 transition-colors duration-200 text-sm"
                >
                  Nederlandse Website Voorbeelden →
                </Link>
              </li>
              <li>
                <Link 
                  href="/over-ons" 
                  className="text-cyan-300 hover:text-cyan-400 transition-colors duration-200 text-sm"
                >
                  Waarom ProWeb Studio? →
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-slate-200">Start Uw Project</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/contact" 
                  className="text-cyan-300 hover:text-cyan-400 transition-colors duration-200 text-sm"
                >
                  Gratis Webdesign Advies →
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact?service=offerte" 
                  className="text-cyan-300 hover:text-cyan-400 transition-colors duration-200 text-sm"
                >
                  Vrijblijvende Offerte →
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact?service=consultation" 
                  className="text-cyan-300 hover:text-cyan-400 transition-colors duration-200 text-sm"
                >
                  Strategisch Consult →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </SemanticSection>
    </div>
  );
}

// Component for service-to-location cross-linking
export function ServiceLocationCrossLinks({ 
  serviceName, 
  serviceSlug 
}: { 
  serviceName: string; 
  serviceSlug: string; 
}) {
  const relevantLocations = locations.filter(location => 
    location.relatedServices.includes(serviceSlug)
  );

  return (
    <SemanticSection 
      as="section" 
      className="py-12 bg-cosmic-800/20 rounded-2xl"
      aria-label={`${serviceName} in Nederlandse steden`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SemanticHeading level={2} className="text-3xl font-bold text-center mb-12">
          {serviceName} in{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magenta-400">
            Nederlandse Steden
          </span>
        </SemanticHeading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relevantLocations.map((location, index) => (
            <article key={index} className="bg-cosmic-800/40 p-6 rounded-xl border border-cosmic-700/60 hover:border-cosmic-600/80 transition-all duration-300">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🏙️</span>
                <SemanticHeading level={3} className="text-xl font-semibold text-cyan-300">
                  {location.name}
                </SemanticHeading>
              </div>
              
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                {serviceName} in {location.name} - {location.description}
              </p>
              
              <div className="text-xs text-slate-400 mb-4">
                <strong>Regio:</strong> {location.region} | <strong>Inwoners:</strong> {location.population?.toLocaleString('nl-NL')}
              </div>
              
              <Link 
                href={`/locaties/${location.slug}`}
                className="inline-flex items-center text-cyan-300 hover:text-cyan-400 transition-colors duration-200 text-sm font-medium"
                title={`${serviceName} ${location.name} - Lokale webdesign expertise`}
              >
                {serviceName} {location.name} →
              </Link>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-slate-300 mb-4">
            Wij bedienen bedrijven door heel Nederland met lokale expertise en persoonlijke service.
          </p>
          <Link 
            href="/locaties"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-magenta-500 text-white font-semibold rounded-full hover:from-cyan-600 hover:to-magenta-600 transition-all duration-300"
          >
            Bekijk Alle Locaties →
          </Link>
        </div>
      </div>
    </SemanticSection>
  );
}

// Location-to-service cross-linking component
export function LocationServiceCrossLinks({ 
  cityName, 
  citySlug 
}: { 
  cityName: string; 
  citySlug: string; 
}) {
  const currentLocation = locations.find(l => l.slug === citySlug);
  const relevantServices = currentLocation 
    ? services.filter(service => 
        currentLocation.relatedServices.some(rs => service.href.includes(rs))
      )
    : [];

  return (
    <SemanticSection 
      as="section" 
      className="py-12 bg-cosmic-800/20 rounded-2xl"
      aria-label={`Webdesign diensten in ${cityName}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SemanticHeading level={2} className="text-3xl font-bold text-center mb-12">
          Professionele Webdesign Diensten in{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magenta-400">
            {cityName}
          </span>
        </SemanticHeading>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {relevantServices.map((service, index) => (
            <article key={index} className="bg-cosmic-800/40 p-8 rounded-xl border border-cosmic-700/60 hover:border-cosmic-600/80 transition-all duration-300">
              <SemanticHeading level={3} className="text-2xl font-semibold mb-4 text-cyan-300">
                {service.title} {cityName}
              </SemanticHeading>
              
              <p className="text-slate-300 mb-6 leading-relaxed">
                {service.description} Speciaal voor bedrijven in {cityName} bieden wij 
                lokale expertise gecombineerd met Nederlandse webdesign kwaliteit.
              </p>
              
              {currentLocation && (
                <div className="bg-cosmic-900/40 p-4 rounded-lg mb-6">
                  <h4 className="text-sm font-semibold text-cyan-300 mb-2">
                    Perfect voor {cityName} bedrijven:
                  </h4>
                  <div className="text-xs text-slate-400">
                    {currentLocation.keyIndustries.map((industry: string) => (
                      <span key={industry} className="inline-block bg-cosmic-700/40 px-2 py-1 rounded mr-2 mb-1">
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <Link 
                href={service.href}
                className="inline-flex items-center text-cyan-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
                title={`${service.title} ${cityName} - Lokale webdesign expertise`}
              >
                Meer over {service.title} {cityName} →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </SemanticSection>
  );
}