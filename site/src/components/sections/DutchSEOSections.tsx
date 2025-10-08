import React from 'react';
import Link from 'next/link';
import { SemanticSection, SemanticHeading, DutchContentWrapper } from '../layout/SemanticLayout';
import { DUTCH_TRUST_SIGNALS } from '@/config/dutch-seo.config';

interface DutchSEOHomeSectionProps {
  cityName?: string;
  className?: string;
}

export function DutchSEOHeroSection({ cityName, className = '' }: DutchSEOHomeSectionProps) {
  const locationText = cityName ? ` in ${cityName}` : ' in Nederland';
  
  return (
    <DutchContentWrapper 
      cityName={cityName}
      serviceName="website laten maken"
      className={className}
      includeLocalSchema={!!cityName}
    >
      <SemanticSection as="main" className="min-h-screen flex items-center justify-center relative">
        <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <SemanticHeading 
            level={1} 
            className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-white to-magenta-400 bg-clip-text text-transparent leading-tight"
            keywords={['website laten maken', 'webdesign', 'professionele website']}
          >
            Website Laten Maken{locationText}
            <span className="block text-2xl sm:text-3xl lg:text-4xl mt-4 text-slate-200">
              Professionele Nederlandse Webdesign Experts
            </span>
          </SemanticHeading>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Van <strong>website laten maken</strong> tot complete <strong>digitale transformatie</strong> - 
            ProWeb Studio is uw betrouwbare <strong>Nederlandse webdesign partner</strong>. 
            Wij bouwen <strong>professionele websites</strong> en <strong>webshops</strong> die 
            converteren en groeien met uw bedrijf.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-cosmic-800/40 p-6 rounded-xl border border-cosmic-700/60 hover:border-cosmic-600/80 transition-all duration-300">
              <SemanticHeading level={3} className="text-xl font-semibold mb-3 text-cyan-300">
                🏆 Nederlandse Kwaliteit
              </SemanticHeading>
              <p className="text-slate-300 text-sm">
                <strong>KvK geregistreerd</strong> webdesign bureau met lokale ondersteuning 
                en <strong>Nederlandse hosting</strong> voor optimale prestaties.
              </p>
            </div>
            
            <div className="bg-cosmic-800/40 p-6 rounded-xl border border-cosmic-700/60 hover:border-cosmic-600/80 transition-all duration-300">
              <SemanticHeading level={3} className="text-xl font-semibold mb-3 text-cyan-300">
                💳 iDEAL & AVG Compliant
              </SemanticHeading>
              <p className="text-slate-300 text-sm">
                Volledige naleving van <strong>Nederlandse wetgeving</strong>, 
                <strong>iDEAL betalingen</strong> en <strong>AVG compliance</strong> standaard inbegrepen.
              </p>
            </div>
            
            <div className="bg-cosmic-800/40 p-6 rounded-xl border border-cosmic-700/60 hover:border-cosmic-600/80 transition-all duration-300">
              <SemanticHeading level={3} className="text-xl font-semibold mb-3 text-cyan-300">
                🚀 MKB Specialist
              </SemanticHeading>
              <p className="text-slate-300 text-sm">
                Gespecialiseerd in <strong>MKB websites</strong>, <strong>ZZP-ers</strong> en 
                <strong>startups</strong> met transparante prijzen en snelle oplevering.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 text-white font-semibold rounded-full hover:from-cyan-600 hover:to-magenta-600 transition-all duration-300 transform hover:scale-105"
            >
              Website Laten Maken - Gratis Advies
            </Link>
            <Link 
              href="/portfolio"
              className="inline-flex items-center px-8 py-4 border border-cyan-500 text-cyan-400 font-semibold rounded-full hover:bg-cyan-500 hover:text-white transition-all duration-300"
            >
              Bekijk Onze Nederlandse Websites
            </Link>
          </div>
        </article>
      </SemanticSection>
    </DutchContentWrapper>
  );
}

export function DutchBusinessServicesSection() {
  return (
    <SemanticSection 
      as="section" 
      className="py-20 bg-gradient-to-b from-cosmic-900 to-cosmic-800"
      aria-label="Nederlandse webdesign diensten"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <SemanticHeading 
            level={2} 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            keywords={['webdesign diensten', 'website laten maken', 'Nederlandse webdesigner']}
          >
            Professionele Webdesign Diensten voor{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magenta-400">
              Nederlandse Ondernemers
            </span>
          </SemanticHeading>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Van eenvoudige <strong>bedrijfswebsites</strong> tot complexe <strong>webshops</strong> en 
            innovatieve <strong>3D website ervaringen</strong> - wij realiseren uw digitale ambities.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article className="bg-cosmic-800/40 p-8 rounded-2xl border border-cosmic-700/60 hover:border-cosmic-600/80 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 rounded-full flex items-center justify-center mb-6 text-3xl">
              🌐
            </div>
            <SemanticHeading level={3} className="text-2xl font-bold mb-4 text-cyan-300">
              Website Laten Maken
            </SemanticHeading>
            <p className="text-slate-300 mb-6 leading-relaxed">
              <strong>Professionele websites</strong> die perfect aansluiten bij uw bedrijf. 
              Responsive design, <strong>SEO geoptimaliseerd</strong> en <strong>Nederlandse hosting</strong> 
              voor optimale prestaties.
            </p>
            <div className="space-y-2 text-sm text-slate-400 mb-6">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                Moderne responsive websites
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                SEO geoptimaliseerd voor Nederland
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                Snelle Nederlandse hosting
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                AVG compliant en veilig
              </div>
            </div>
            <Link 
              href="/diensten/website-laten-maken"
              className="inline-flex items-center text-cyan-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
            >
              Meer over Website Laten Maken →
            </Link>
          </article>

          <article className="bg-cosmic-800/40 p-8 rounded-2xl border border-cosmic-700/60 hover:border-cosmic-600/80 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 rounded-full flex items-center justify-center mb-6 text-3xl">
              🛒
            </div>
            <SemanticHeading level={3} className="text-2xl font-bold mb-4 text-cyan-300">
              Webshop Laten Maken
            </SemanticHeading>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Complete <strong>e-commerce oplossingen</strong> met <strong>iDEAL integratie</strong>, 
              voorraadbeheeer en koppelingen met Nederlandse systemen. Perfect voor <strong>MKB ondernemers</strong>.
            </p>
            <div className="space-y-2 text-sm text-slate-400 mb-6">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                iDEAL en Nederlandse betaalmethoden
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                Voorraad- en orderbeheer
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                Nederlandse wetgeving compliant
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                Mobile-first design
              </div>
            </div>
            <Link 
              href="/diensten/webshop-laten-maken"
              className="inline-flex items-center text-cyan-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
            >
              Meer over Webshop Laten Maken →
            </Link>
          </article>

          <article className="bg-cosmic-800/40 p-8 rounded-2xl border border-cosmic-700/60 hover:border-cosmic-600/80 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 rounded-full flex items-center justify-center mb-6 text-3xl">
              🎯
            </div>
            <SemanticHeading level={3} className="text-2xl font-bold mb-4 text-cyan-300">
              SEO Optimalisatie
            </SemanticHeading>
            <p className="text-slate-300 mb-6 leading-relaxed">
              <strong>Lokale SEO</strong> en <strong>nationale vindbaarheid</strong> in Google. 
              Nederlandse zoekwoorden, <strong>Google My Business</strong> optimalisatie en 
              regionale content strategie.
            </p>
            <div className="space-y-2 text-sm text-slate-400 mb-6">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                Lokale SEO voor Nederlandse steden
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                Google My Business optimalisatie
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                Nederlandse zoekwoorden research
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                Technische SEO audit
              </div>
            </div>
            <Link 
              href="/diensten/seo-optimalisatie"
              className="inline-flex items-center text-cyan-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
            >
              Meer over SEO Optimalisatie →
            </Link>
          </article>
        </div>
      </div>
    </SemanticSection>
  );
}

export function DutchTrustSignalsSection() {
  return (
    <SemanticSection 
      as="section" 
      className="py-16 bg-cosmic-800/20"
      aria-label="Nederlandse vertrouwenssignalen en certificeringen"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SemanticHeading 
          level={2} 
          className="text-3xl font-bold text-center mb-12"
          keywords={['Nederlandse webdesign', 'vertrouwenssignalen', 'certificeringen']}
        >
          Waarom Nederlandse Ondernemers Kiezen voor ProWeb Studio
        </SemanticHeading>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {DUTCH_TRUST_SIGNALS.certifications.map((cert, index) => (
            <div key={index} className="text-center p-6 bg-cosmic-800/40 rounded-xl border border-cosmic-700/60">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 rounded-full flex items-center justify-center text-2xl">
                {cert.name === 'KvK Registratie' ? '🏢' : cert.name === 'AVG Compliant' ? '🔒' : '🇳🇱'}
              </div>
              <SemanticHeading level={3} className="text-lg font-semibold mb-2 text-cyan-300">
                {cert.name}
              </SemanticHeading>
              <p className="text-slate-300 text-sm">
                {cert.description}
                {'number' in cert && cert.number && (
                  <span className="block mt-2 text-cyan-400 font-mono">
                    KvK: {cert.number}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-cosmic-800/40 p-8 rounded-2xl border border-cosmic-700/60">
          <SemanticHeading level={3} className="text-2xl font-bold mb-6 text-center">
            Nederlandse Betaalmethoden
          </SemanticHeading>
          <div className="flex justify-center items-center gap-8">
            {DUTCH_TRUST_SIGNALS.payments.map((payment, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{payment.icon}</div>
                <div className="text-sm text-slate-300">{payment.name}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-300 mt-4">
            Wij accepteren alle gangbare Nederlandse betaalmethoden voor uw gemak
          </p>
        </div>
      </div>
    </SemanticSection>
  );
}

export function DutchTestimonialsSection() {
  return (
    <SemanticSection 
      as="section" 
      className="py-20 bg-gradient-to-b from-cosmic-800 to-cosmic-900"
      aria-label="Nederlandse klantbeoordelingen en testimonials"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <SemanticHeading 
            level={2} 
            className="text-3xl sm:text-4xl font-bold mb-6"
            keywords={['Nederlandse klanten', 'testimonials', 'webdesign reviews']}
          >
            Wat Nederlandse Ondernemers Zeggen Over{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magenta-400">
              ProWeb Studio
            </span>
          </SemanticHeading>
          <p className="text-xl text-slate-300">
            Ontdek waarom meer dan 500 Nederlandse bedrijven hun website door ons lieten maken
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DUTCH_TRUST_SIGNALS.testimonials.map((testimonial, index) => (
            <article key={index} className="bg-cosmic-800/40 p-8 rounded-2xl border border-cosmic-700/60 hover:border-cosmic-600/80 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <div className="font-semibold text-cyan-300">{testimonial.name}</div>
                  <div className="text-sm text-slate-400">
                    {testimonial.company} - {testimonial.location}
                  </div>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">⭐</span>
                ))}
              </div>
              
              <blockquote className="text-slate-300 italic leading-relaxed">
                "{testimonial.text}"
              </blockquote>
              
              <div className="mt-4 text-xs text-cyan-400 uppercase tracking-wide">
                {testimonial.service.replace('-', ' ')}
              </div>
            </article>
          ))}
        </div>
      </div>
    </SemanticSection>
  );
}