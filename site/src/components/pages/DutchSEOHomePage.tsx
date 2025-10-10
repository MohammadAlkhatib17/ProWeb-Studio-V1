import React from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// SEO-optimized imports
import { SemanticSection } from '@/components/layout/SemanticLayout';
import { DutchSEOHeroSection, DutchBusinessServicesSection, DutchTrustSignalsSection, DutchTestimonialsSection } from '@/components/sections/DutchSEOSections';
import { InternalLinkingStrategy } from '@/components/navigation/InternalLinkingStrategy';
import { WebsiteLatenMakenCluster } from '@/components/content/ContentClusters';
import VoiceOptimizedFAQ from '@/components/sections/VoiceOptimizedFAQ';
import { Button } from '@/components/Button';
import { KeywordDensityOptimizer } from '@/components/seo/DutchKeywordOptimization';

// Dynamic imports for performance
const HeroCanvas = dynamic(() => import('@/components/HeroCanvas'), {
  ssr: false,
  loading: () => null,
});

interface DutchSEOHomePageProps {
  cityName?: string;
  serviceFocus?: string;
}

export function generateDutchSEOMetadata(cityName?: string, serviceFocus?: string): Metadata {
  const baseTitle = 'Website Laten Maken Nederland | Webdesign & Webshop Ontwikkeling';
  const locationSuffix = cityName ? ` ${cityName}` : '';
  const serviceSuffix = serviceFocus ? ` - ${serviceFocus}` : '';
  
  const title = `${baseTitle}${locationSuffix}${serviceSuffix} – ProWeb Studio`;
  const description = cityName 
    ? `Website laten maken in ${cityName} door Nederlandse webdesign experts. Professionele websites, webshops en 3D ervaringen voor MKB bedrijven in ${cityName}. Transparante prijzen, snelle oplevering.`
    : 'Website laten maken door Nederlandse webdesign experts. Professionele websites, webshops en 3D ervaringen voor MKB, startups en enterprise. Van Amsterdam tot Eindhoven - transparante prijzen, snelle oplevering, Nederlandse kwaliteit.';

  return {
    title,
    description,
    keywords: [
      'website laten maken',
      cityName ? `website laten maken ${cityName}` : 'website maken Nederland',
      'webdesign Nederland',
      'webshop laten maken',
      'professionele website',
      'Nederlandse webdesigner',
      cityName ? `webdesign ${cityName}` : 'lokale webdesign',
      'MKB website',
      'responsive website',
      'SEO geoptimaliseerd',
      '3D website Nederland',
      'iDEAL integratie',
      'AVG compliant',
      'Nederlandse hosting'
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'nl_NL',
      siteName: 'ProWeb Studio - Website laten maken Nederland'
    },
    twitter: {
      card: 'summary_large_image',
      title: `Website Laten Maken${locationSuffix} | ProWeb Studio`,
      description
    },
    alternates: {
      canonical: cityName ? `/locaties/${cityName.toLowerCase()}` : '/',
      languages: {
        'nl-NL': cityName ? `/locaties/${cityName.toLowerCase()}` : '/',
        'x-default': cityName ? `/locaties/${cityName.toLowerCase()}` : '/'
      }
    }
  };
}

export default function DutchSEOHomePage({ cityName, serviceFocus }: DutchSEOHomePageProps) {
  // Calculate content for keyword density optimization
  const pageContent = `
    Website laten maken in Nederland door professionele webdesign experts. 
    ProWeb Studio bouwt websites, webshops en 3D ervaringen voor Nederlandse bedrijven.
    Webdesign Nederland met lokale expertise en Nederlandse kwaliteit. 
    Professionele website ontwikkeling met SEO optimalisatie en responsive design.
    MKB website specialist met transparante prijzen en snelle oplevering.
    Nederlandse webdesigner met iDEAL integratie en AVG compliance.
    Website laten bouwen door ervaren developers en designers.
    Webshop laten maken met Nederlandse betaalmethoden en hosting.
    Lokale webdesign diensten door heel Nederland beschikbaar.
    Website specialist voor moderne, snelle en veilige websites.
  `;

  const targetKeywords = [
    'website laten maken',
    'webdesign Nederland', 
    'professionele website',
    'Nederlandse webdesigner',
    'webshop laten maken',
    'lokale webdesign'
  ];

  return (
    <KeywordDensityOptimizer
      content={pageContent}
      targetKeywords={targetKeywords}
      optimalDensity={1.5}
      maxDensity={2.0}
    >
      <main className="relative content-safe-top overflow-hidden">
        
        {/* Hero Section with 3D Background */}
        <SemanticSection as="section" className="relative min-h-screen">
          {/* 3D Canvas Background */}
          <div className="absolute inset-0 z-0">
            <HeroCanvas>
              <div />
            </HeroCanvas>
          </div>
          
          {/* SEO-optimized Hero Content */}
          <div className="relative z-10">
            <DutchSEOHeroSection cityName={cityName} />
          </div>
        </SemanticSection>

        {/* Services Section */}
        <DutchBusinessServicesSection />

        {/* Trust Signals & Certifications */}
        <DutchTrustSignalsSection />

        {/* Location-based or General Internal Linking */}
        <SemanticSection as="section" className="py-16 bg-cosmic-800/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <InternalLinkingStrategy 
              currentPage={cityName ? 'location' : 'home'}
              currentSlug={cityName?.toLowerCase()}
            />
          </div>
        </SemanticSection>

        {/* Website Laten Maken Content Cluster */}
        <WebsiteLatenMakenCluster showRelatedClusters={true} />

        {/* Voice Search Optimized FAQ */}
        <VoiceOptimizedFAQ 
          cityName={cityName}
          serviceName={serviceFocus}
          showAll={false}
        />

        {/* Testimonials Section */}
        <DutchTestimonialsSection />

        {/* Call to Action Section */}
        <SemanticSection as="section" className="py-20 bg-gradient-to-b from-cosmic-800 to-cosmic-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Klaar om Uw{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magenta-400">
                Website te Laten Maken{cityName ? ` in ${cityName}` : ''}?
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Start vandaag nog met uw professionele website project. 
              Onze Nederlandse webdesign experts staan klaar om uw online ambities waar te maken.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Button 
                href={`/contact${cityName ? `?city=${cityName.toLowerCase()}` : ''}${serviceFocus ? `&service=${serviceFocus}` : ''}`}
                variant="primary"
                size="large"
              >
                Gratis Website Advies{cityName ? ` ${cityName}` : ''}
              </Button>
              <Button 
                href="/portfolio"
                variant="secondary"
                size="large"
              >
                Bekijk Nederlandse Website Voorbeelden
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-sm text-slate-400">
              <div className="flex items-center justify-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                KvK Geregistreerd Webdesign Bureau
              </div>
              <div className="flex items-center justify-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                iDEAL & Nederlandse Betaalmethoden
              </div>
              <div className="flex items-center justify-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                AVG Compliant & Veilige Hosting
              </div>
            </div>
          </div>
        </SemanticSection>

        {/* Structured Data for Local Business (if city specified) */}
        {cityName && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'LocalBusiness',
                '@id': `https://prowebstudio.nl/locaties/${cityName.toLowerCase()}#business`,
                name: `ProWeb Studio - Website Laten Maken ${cityName}`,
                description: `Professionele webdesign en website ontwikkeling in ${cityName}. Nederlandse expertise voor lokale bedrijven.`,
                url: `https://prowebstudio.nl/locaties/${cityName.toLowerCase()}`,
                telephone: '+31-20-123-4567',
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: cityName,
                  addressCountry: 'NL'
                },
                geo: {
                  '@type': 'GeoCoordinates',
                  latitude: '52.3676',
                  longitude: '4.9041'
                },
                areaServed: {
                  '@type': 'City',
                  name: cityName
                },
                serviceArea: {
                  '@type': 'GeoCircle',
                  geoMidpoint: {
                    '@type': 'GeoCoordinates',
                    latitude: '52.3676',
                    longitude: '4.9041'
                  },
                  geoRadius: '50000'
                },
                hasOfferCatalog: {
                  '@type': 'OfferCatalog',
                  name: `Webdesign Diensten ${cityName}`,
                  itemListElement: [
                    {
                      '@type': 'Offer',
                      itemOffered: {
                        '@type': 'Service',
                        name: `Website Laten Maken ${cityName}`,
                        description: `Professionele website ontwikkeling voor bedrijven in ${cityName}`
                      }
                    },
                    {
                      '@type': 'Offer', 
                      itemOffered: {
                        '@type': 'Service',
                        name: `Webshop Laten Maken ${cityName}`,
                        description: `E-commerce oplossingen voor retailers in ${cityName}`
                      }
                    }
                  ]
                },
                sameAs: [
                  'https://www.linkedin.com/company/prowebstudio',
                  'https://twitter.com/prowebstudio_nl'
                ]
              })
            }}
          />
        )}
      </main>
    </KeywordDensityOptimizer>
  );
}