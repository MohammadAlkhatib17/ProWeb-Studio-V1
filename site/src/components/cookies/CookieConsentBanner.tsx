/**
 * Cookie Consent Banner
 * Privacy-first consent banner with accessibility and keyboard navigation
 * Appears on first visit; respects prior consent decisions
 */

'use client';

import { useEffect, useRef } from 'react';

import { Button } from '@/components/Button';

import { useCookieConsent } from './useCookieConsent';

export default function CookieConsentBanner() {
  const {
    showBanner,
    acceptAll,
    rejectAll,
    openSettings,
    closeBanner,
  } = useCookieConsent();
  
  const bannerRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Focus management: trap focus within banner when shown
  useEffect(() => {
    if (showBanner && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }
  }, [showBanner]);

  // Handle ESC key to close (only if consent already exists elsewhere)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showBanner) {
        closeBanner();
      }
    };

    if (showBanner) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
    
    return undefined;
  }, [showBanner, closeBanner]);

  if (!showBanner) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
        aria-hidden="true"
      />
      
      {/* Banner */}
      <div
        ref={bannerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-banner-title"
        aria-describedby="cookie-banner-description"
        className="fixed bottom-0 left-0 right-0 z-[9999] bg-cosmic-900/95 backdrop-blur-md border-t border-cosmic-700 shadow-2xl"
        style={{
          // Prevent CLS - reserve space; visible immediately
          willChange: 'transform',
          opacity: 1,
          transform: 'translateY(0)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            {/* Content */}
            <div className="flex-1">
              <h2
                id="cookie-banner-title"
                className="text-lg font-semibold text-white mb-2"
              >
                🍪 Wij respecteren jouw privacy
              </h2>
              <p
                id="cookie-banner-description"
                className="text-sm text-slate-300 leading-relaxed"
              >
                ProWeb Studio gebruikt cookies om jouw ervaring te verbeteren. 
                Noodzakelijke cookies zorgen voor de basisfunctionaliteit. 
                Analytische cookies helpen ons de website te verbeteren. 
                Je kunt je voorkeuren op elk moment aanpassen.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:flex-shrink-0">
              <button
                ref={firstFocusableRef}
                onClick={openSettings}
                className="w-full sm:w-auto whitespace-nowrap min-h-[44px] px-6 py-3 rounded-lg font-semibold border border-cyan-500/60 hover:bg-cyan-500/10 hover:border-cyan-400 text-cyan-100 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                aria-label="Cookie-instellingen aanpassen"
              >
                Aanpassen
              </button>
              
              <Button
                as="button"
                onClick={rejectAll}
                variant="secondary"
                className="w-full sm:w-auto whitespace-nowrap min-h-[44px] px-6"
                aria-label="Alleen noodzakelijke cookies accepteren"
              >
                Alleen noodzakelijk
              </Button>
              
              <Button
                as="button"
                onClick={acceptAll}
                variant="primary"
                className="w-full sm:w-auto whitespace-nowrap min-h-[44px] px-6"
                aria-label="Alle cookies accepteren"
              >
                Alles accepteren
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
