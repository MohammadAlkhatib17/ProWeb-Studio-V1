'use client';

import { Button } from '@/components/Button';
import Image from 'next/image';

interface StaticHeroBaselineProps {
  className?: string;
}

/**
 * Static hero baseline component that renders immediately with:
 * - Headline and CTA buttons
 * - Static poster image as background
 * - No JavaScript dependencies
 * - Optimized for Core Web Vitals (LCP)
 */
export default function StaticHeroBaseline({ className = '' }: StaticHeroBaselineProps) {
  return (
    <section
      aria-label="Hero"
      className={`homepage-hero relative min-h-[92vh] grid place-items-center overflow-hidden ${className}`}
    >
      {/* Static Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/hero_portal_background.avif"
          alt=""
          fill
          priority
          quality={85}
          className="object-cover object-center"
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Top gradient fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/20 to-transparent z-10" />

      {/* Hero content with enhanced typography */}
      <div className="relative z-20 text-center max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto py-section">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-extrabold text-shadow-sharp tracking-tight leading-tight mb-8 motion-safe:animate-fade-in">
          Website Laten Maken die Indruk Maakt. En Converteert.
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-100 mb-12 max-w-4xl mx-auto motion-safe:animate-slide-up">
          In het digitale tijdperk is uw website meer dan een visitekaartje — het is uw universum. Daarom transformeren wij uw idee tot een razendsnelle, interactieve
          ervaring die uw merk tot leven brengt. Van corporate websites en webshops tot meeslepende 3D-ervaringen — wij architectureren digitale 
          platforms die uw bezoekers boeien en uw bedrijf laten groeien. Met onze bewezen ontwikkelmethodiek realiseren we websites die niet alleen mooi zijn, maar ook daadwerkelijk presteren.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            href="/contact"
            variant="primary"
            size="large"
          >
            Start jouw digitale transformatie
          </Button>
          <Button
            href="/werkwijze"
            variant="secondary"
            size="large"
          >
            Zo maken wij dit mogelijk →
          </Button>
        </div>

        {/* Limited Time Promotional Banner */}
        <div className="mt-8 motion-safe:animate-fade-in-delayed">
          <div className="relative mx-auto max-w-md">
            {/* Animated glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-magenta-500 to-cyan-500 rounded-lg blur opacity-75 animate-pulse"></div>
            
            {/* Main promotional banner */}
            <div className="relative bg-gradient-to-r from-cyan-500/20 to-magenta-500/20 backdrop-blur-sm border border-cyan-300/30 rounded-lg px-6 py-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-yellow-400 text-sm font-bold">🎉 BEPERKTE TIJD</span>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-bounce">HOT</span>
              </div>
              
              <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-magenta-300 mb-1">
                30% KORTING
              </div>
              
              <p className="text-sm text-cyan-200 font-medium mb-2">
                Op alle website projecten
              </p>
              
              <div className="flex items-center justify-center gap-2 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Geldig 6 maanden
                </span>
                <span className="text-slate-400">•</span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Geen verborgen kosten
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}