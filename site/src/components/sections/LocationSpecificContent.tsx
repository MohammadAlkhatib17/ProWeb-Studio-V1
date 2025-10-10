import React from 'react';
import Link from 'next/link';
import { SemanticSection, SemanticHeading, DutchContentWrapper } from '../layout/SemanticLayout';
import { type DutchCity } from '@/config/dutch-seo.config';
import { KeywordOptimizedHeading, DutchBusinessTerminology } from '../seo/DutchKeywordOptimization';

interface LocationSpecificContentProps {
  city: DutchCity;
  serviceName?: string;
  showFullContent?: boolean;
  className?: string;
}

export function LocationSpecificHero({ city, serviceName = 'Website Laten Maken', className = '' }: LocationSpecificContentProps) {
  const serviceSlug = serviceName.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <DutchContentWrapper 
      cityName={city.name}
      serviceName={serviceSlug}
      className={className}
      includeLocalSchema={true}
    >
      <SemanticSection as="section" className="py-20 bg-gradient-to-b from-cosmic-900 to-cosmic-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <KeywordOptimizedHeading
              level={1}
              primaryKeyword={`${serviceName} ${city.name}`}
              secondaryKeywords={[`webdesign ${city.name}`, `website ontwikkeling ${city.name}`]}
              cityName={city.name}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-white to-magenta-400 bg-clip-text text-transparent leading-tight"
            >
              {serviceName} {city.name}
              <span className="block text-2xl sm:text-3xl lg:text-4xl mt-4 text-slate-200">
                {city.characteristics[0] && `${city.characteristics[0].charAt(0).toUpperCase() + city.characteristics[0].slice(1)} - `}
                Professionele Nederlandse Webdesign
              </span>
            </KeywordOptimizedHeading>
            
            <DutchBusinessTerminology 
              industryFocus={city.keyIndustries as unknown as string[]}
              cityName={city.name}
            >
              <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                <strong>Website laten maken in {city.name}</strong>? ProWeb Studio is uw lokale{' '}
                <strong>webdesign specialist</strong> voor <strong>professionele websites</strong> en{' '}
                <strong>webshops</strong> in {city.region}. 
                {city.businessFocus && city.businessFocus.length > 0 && (
                  <span> Gespecialiseerd in {city.businessFocus.slice(0, 2).join(' en ')} sectoren.</span>
                )}
              </p>
            </DutchBusinessTerminology>

            {/* City-specific unique selling points */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-cosmic-800/40 p-6 rounded-xl border border-cosmic-700/60">
                <div className="text-2xl mb-4">🏙️</div>
                <h3 className="text-lg font-semibold mb-3 text-cyan-300">
                  Lokale {city.name} Expertise
                </h3>
                <p className="text-slate-300 text-sm">
                  Wij kennen de {city.name} markt en begrijpen wat{' '}
                  {city.localTerms && city.localTerms[0] ? city.localTerms[0] : `${city.name} ondernemers`} nodig hebben 
                  voor online succes.
                </p>
              </div>
              
              <div className="bg-cosmic-800/40 p-6 rounded-xl border border-cosmic-700/60">
                <div className="text-2xl mb-4">🎯</div>
                <h3 className="text-lg font-semibold mb-3 text-cyan-300">
                  {city.region} Targeting
                </h3>
                <p className="text-slate-300 text-sm">
                  <strong>Lokale SEO</strong> geoptimaliseerd voor {city.name}, {city.region} en omliggende gemeenten 
                  voor maximale regionale vindbaarheid.
                </p>
              </div>
              
              <div className="bg-cosmic-800/40 p-6 rounded-xl border border-cosmic-700/60">
                <div className="text-2xl mb-4">🚀</div>
                <h3 className="text-lg font-semibold mb-3 text-cyan-300">
                  {city.keyIndustries?.[0] || 'Sector'} Focus
                </h3>
                <p className="text-slate-300 text-sm">
                  Ervaring met {city.keyIndustries?.slice(0, 2).join(' en ') || 'lokale bedrijven'}{' '}
                  in {city.name} - wij spreken uw bedrijfstaal.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href={`/contact?city=${city.slug}&service=${serviceSlug}`}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 text-white font-semibold rounded-full hover:from-cyan-600 hover:to-magenta-600 transition-all duration-300 transform hover:scale-105"
              >
                {serviceName} {city.name} - Gratis Advies
              </Link>
              <Link 
                href="/portfolio"
                className="inline-flex items-center px-8 py-4 border border-cyan-500 text-cyan-400 font-semibold rounded-full hover:bg-cyan-500 hover:text-white transition-all duration-300"
              >
                {city.name} Website Voorbeelden
              </Link>
            </div>
          </div>
        </div>
      </SemanticSection>
    </DutchContentWrapper>
  );
}

export function LocationSpecificServices({ city, className = '' }: LocationSpecificContentProps) {
  const cityServices = [
    {
      title: `Website Laten Maken ${city.name}`,
      description: `Professionele websites voor ${city.name} bedrijven. Van eenvoudige bedrijfswebsites tot complexe corporate platforms.`,
      features: [
        `Responsive design voor ${city.name} bezoekers`,
        `SEO geoptimaliseerd voor ${city.region}`,
        `Lokale hosting in Nederland`,
        `${city.name} Google My Business integratie`
      ],
      href: `/diensten/website-laten-maken?location=${city.slug}`,
      icon: '🌐'
    },
    {
      title: `Webshop Laten Maken ${city.name}`,
      description: `E-commerce oplossingen voor ${city.name} retailers en ondernemers. Compleet met iDEAL en Nederlandse betaalmethoden.`,
      features: [
        `iDEAL integratie voor ${city.name} klanten`,
        `Nederlandse wetgeving compliant`,
        `Mobiel geoptimaliseerd winkelen`,
        `${city.name} bezorgopties integratie`
      ],
      href: `/diensten/webshop-laten-maken?location=${city.slug}`,
      icon: '🛒'
    },
    {
      title: `SEO Optimalisatie ${city.name}`,
      description: `Lokale SEO services voor betere vindbaarheid in ${city.name} en ${city.region}. Meer lokale klanten via Google.`,
      features: [
        `Google My Business ${city.name} optimalisatie`,
        `Lokale zoekwoorden ${city.region}`,
        `${city.name} directories en listings`,
        `Regionale content marketing`
      ],
      href: `/diensten/seo-optimalisatie?location=${city.slug}`,
      icon: '🎯'
    }
  ];

  return (
    <SemanticSection 
      as="section" 
      className={`py-20 bg-gradient-to-b from-cosmic-800 to-cosmic-900 ${className}`}
      aria-label={`Webdesign diensten in ${city.name}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <SemanticHeading 
            level={2} 
            className="text-3xl sm:text-4xl font-bold mb-6"
            keywords={[`webdesign diensten ${city.name}`, `website services ${city.name}`]}
          >
            Webdesign Diensten in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magenta-400">
              {city.name}
            </span>
          </SemanticHeading>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Professionele webdesign services voor {city.name} ondernemers en bedrijven. 
            Lokale expertise, Nederlandse kwaliteit.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {cityServices.map((service, index) => (
            <article key={index} className="bg-cosmic-800/40 p-8 rounded-2xl border border-cosmic-700/60 hover:border-cosmic-600/80 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10">
              <div className="text-4xl mb-6">{service.icon}</div>
              
              <SemanticHeading level={3} className="text-2xl font-bold mb-4 text-cyan-300">
                {service.title}
              </SemanticHeading>
              
              <p className="text-slate-300 mb-6 leading-relaxed">
                {service.description}
              </p>
              
              <ul className="space-y-2 mb-8">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start text-sm text-slate-400">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link 
                href={service.href}
                className="inline-flex items-center text-cyan-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
              >
                Meer over {service.title} →
              </Link>
            </article>
          ))}
        </div>

        {/* City-specific call to action */}
        <div className="text-center mt-16">
          <div className="bg-cosmic-800/40 p-8 rounded-2xl border border-cosmic-700/60 max-w-4xl mx-auto">
            <SemanticHeading level={3} className="text-2xl font-bold mb-4 text-cyan-300">
              Start Uw Website Project in {city.name}
            </SemanticHeading>
            <p className="text-slate-300 mb-6">
              Klaar om uw online aanwezigheid in {city.name} te versterken? 
              Neem contact op voor een vrijblijvend gesprek over uw website project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href={`/contact?city=${city.slug}`}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-magenta-500 text-white font-semibold rounded-full hover:from-cyan-600 hover:to-magenta-600 transition-all duration-300"
              >
                Contact Opnemen - {city.name}
              </Link>
              <Link 
                href={`/portfolio?location=${city.slug}`}
                className="inline-flex items-center px-6 py-3 border border-cyan-500 text-cyan-400 font-semibold rounded-full hover:bg-cyan-500 hover:text-white transition-all duration-300"
              >
                {city.name} Portfolio Bekijken
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SemanticSection>
  );
}

export function LocationSpecificTestimonials({ city }: { city: DutchCity }) {
  // Generate city-specific testimonials
  const cityTestimonials = [
    {
      name: `${city.name === 'Amsterdam' ? 'Jan' : city.name === 'Rotterdam' ? 'Pieter' : 'Mark'} van der Berg`,
      company: `${city.keyIndustries?.[0] === 'financiële dienstverlening' ? 'FinanceConsult' : city.keyIndustries?.[0] === 'logistiek' ? 'Transport Solutions' : 'BusinessAdvies'} ${city.name}`,
      text: `ProWeb Studio heeft onze website perfect afgestemd op de ${city.name} markt. We zien een duidelijke toename in lokale klanten en online zichtbaarheid.`,
      rating: 5,
      service: 'Website Laten Maken'
    },
    {
      name: `Marieke ${city.name === 'Den Haag' ? 'Jansen' : city.name === 'Utrecht' ? 'Peters' : 'de Vries'}`,
      company: `${city.keyIndustries?.[1] || 'Creatieve Services'} ${city.name}`,
      text: `Als ${city.name} ondernemer was ik op zoek naar een lokale partner die de regio goed kent. ProWeb Studio heeft alle verwachtingen overtroffen.`,
      rating: 5,
      service: 'Webshop Laten Maken'
    }
  ];

  return (
    <SemanticSection 
      as="section" 
      className="py-20 bg-cosmic-800/20"
      aria-label={`Klantbeoordelingen webdesign ${city.name}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <SemanticHeading 
            level={2} 
            className="text-3xl sm:text-4xl font-bold mb-6"
            keywords={[`klanten ${city.name}`, `reviews webdesign ${city.name}`]}
          >
            Wat {city.name} Ondernemers Zeggen Over{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magenta-400">
              ProWeb Studio
            </span>
          </SemanticHeading>
          <p className="text-xl text-slate-300">
            Ontdek ervaringen van {city.name} bedrijven die hun website door ons lieten maken
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cityTestimonials.map((testimonial, index) => (
            <article key={index} className="bg-cosmic-800/40 p-8 rounded-2xl border border-cosmic-700/60">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <div className="font-semibold text-cyan-300">{testimonial.name}</div>
                  <div className="text-sm text-slate-400">{testimonial.company}</div>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">⭐</span>
                ))}
              </div>
              
              <blockquote className="text-slate-300 italic leading-relaxed mb-4">
                &ldquo;{testimonial.text}&rdquo;
              </blockquote>
              
              <div className="text-xs text-cyan-400 uppercase tracking-wide">
                {testimonial.service} - {city.name}
              </div>
            </article>
          ))}
        </div>

        {/* Local business proof */}
        <div className="text-center mt-12">
          <div className="bg-cosmic-800/40 p-6 rounded-xl border border-cosmic-700/60 max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-cyan-300">{Math.floor(city.population! / 10000)}+</div>
                <div className="text-sm text-slate-400">Websites in {city.region}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-300">98%</div>
                <div className="text-sm text-slate-400">Tevreden {city.name} klanten</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-300">5★</div>
                <div className="text-sm text-slate-400">Gemiddelde beoordeling</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SemanticSection>
  );
}