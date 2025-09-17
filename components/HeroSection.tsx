'use client';

import { OptimizedImage } from './OptimizedImage';
import { CalcomFacade } from './CalcomFacade';

export function HeroSection() {
  return (
    <section className="hero-section">
      {/* Critical hero text - renders immediately */}
      <h1 
        className="hero-title"
        style={{ 
          fontDisplay: 'swap',
          minHeight: '60px' // Prevent CLS
        }}
      >
        Your Hero Title Here
      </h1>
      
      {/* Hero image with explicit dimensions */}
      <OptimizedImage
        src="/hero-image.jpg"
        alt="Hero"
        width={1920}
        height={1080}
        priority={true}
        className="hero-image"
        sizes="100vw"
      />
      
      {/* Cal.com facade instead of direct embed */}
      <CalcomFacade
        calLink="your-cal-link"
        buttonText="Schedule a Consultation"
        className="hero-cta-button"
      />
    </section>
  );
}
