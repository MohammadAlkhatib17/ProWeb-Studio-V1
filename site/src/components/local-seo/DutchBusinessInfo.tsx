/**
 * DutchBusinessInfo Component
 * 
 * Displays NAP (Name, Address, Phone) information consistently
 * for local SEO purposes. Includes KVK/VAT placeholders, address,
 * opening hours, and contact information.
 * 
 * All text is in Dutch for the Dutch market.
 * Size: ~3 KB gzipped
 */

'use client';

import { siteConfig } from '@/config/site.config';
import Link from 'next/link';

export interface DutchBusinessInfoProps {
  /**
   * Display variant
   * - 'full': Complete business information with all details
   * - 'compact': Condensed version for sidebars/footers
   * - 'inline': Single-line minimal version
   */
  variant?: 'full' | 'compact' | 'inline';
  
  /**
   * Show/hide specific sections
   */
  showAddress?: boolean;
  showOpeningHours?: boolean;
  showContact?: boolean;
  showRegistration?: boolean;
  
  /**
   * Custom class names for styling
   */
  className?: string;
}

/**
 * Business information constants
 * These should match the data in LocalBusinessSchema exactly (NAP consistency)
 */
const BUSINESS_INFO = {
  name: 'ProWeb Studio',
  legalName: 'ProWeb Studio',
  // Placeholders - replace with actual values
  kvk: process.env.NEXT_PUBLIC_KVK || 'KVK: [In aanvraag]',
  vat: process.env.NEXT_PUBLIC_BTW || 'BTW: NL[nummer]B01',
  address: {
    street: 'Voorbeeldstraat 123',
    postalCode: '1234 AB',
    city: 'Amsterdam',
    country: 'Nederland',
  },
  phone: siteConfig.phone,
  email: siteConfig.email,
  openingHours: [
    { days: 'Maandag - Vrijdag', hours: '09:00 - 17:00' },
    { days: 'Weekend', hours: 'Op afspraak' },
  ],
} as const;

export default function DutchBusinessInfo({
  variant = 'full',
  showAddress = true,
  showOpeningHours = true,
  showContact = true,
  showRegistration = true,
  className = '',
}: DutchBusinessInfoProps) {
  // Inline variant - minimal single line
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-4 text-sm ${className}`}>
        <span className="font-semibold text-white">{BUSINESS_INFO.name}</span>
        <span className="text-slate-400">|</span>
        <a 
          href={`tel:${BUSINESS_INFO.phone.replace(/\s/g, '')}`}
          className="text-cyan-300 hover:text-cyan-200 transition-colors"
          aria-label="Bel ons"
        >
          {BUSINESS_INFO.phone}
        </a>
        <span className="text-slate-400">|</span>
        <a 
          href={`mailto:${BUSINESS_INFO.email}`}
          className="text-cyan-300 hover:text-cyan-200 transition-colors"
          aria-label="Email ons"
        >
          {BUSINESS_INFO.email}
        </a>
      </div>
    );
  }

  // Compact variant - sidebar/footer style
  if (variant === 'compact') {
    return (
      <div className={`space-y-4 ${className}`}>
        <div>
          <h3 className="text-lg font-bold text-white mb-2">
            {BUSINESS_INFO.name}
          </h3>
          <p className="text-sm text-slate-400">{siteConfig.tagline}</p>
        </div>

        {showAddress && (
          <div className="text-sm text-slate-300">
            <p className="font-semibold text-white mb-1">Adres</p>
            <address className="not-italic leading-relaxed text-slate-400">
              {BUSINESS_INFO.address.street}<br />
              {BUSINESS_INFO.address.postalCode} {BUSINESS_INFO.address.city}
            </address>
          </div>
        )}

        {showContact && (
          <div className="text-sm space-y-2">
            <p className="font-semibold text-white">Contact</p>
            <div className="space-y-1 text-slate-400">
              <a 
                href={`tel:${BUSINESS_INFO.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 hover:text-cyan-300 transition-colors"
                aria-label="Bel ons"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {BUSINESS_INFO.phone}
              </a>
              <a 
                href={`mailto:${BUSINESS_INFO.email}`}
                className="flex items-center gap-2 hover:text-cyan-300 transition-colors"
                aria-label="Email ons"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {BUSINESS_INFO.email}
              </a>
            </div>
          </div>
        )}

        {showOpeningHours && (
          <div className="text-sm">
            <p className="font-semibold text-white mb-2">Openingstijden</p>
            <div className="space-y-1 text-slate-400">
              {BUSINESS_INFO.openingHours.map((schedule, index) => (
                <div key={index} className="flex justify-between gap-4">
                  <span>{schedule.days}</span>
                  <span className="text-slate-500">{schedule.hours}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {showRegistration && (
          <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-700">
            <p>{BUSINESS_INFO.kvk}</p>
            <p>{BUSINESS_INFO.vat}</p>
          </div>
        )}
      </div>
    );
  }

  // Full variant - detailed business card style
  return (
    <div className={`bg-cosmic-800/30 border border-cosmic-700/50 rounded-lg p-6 md:p-8 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {BUSINESS_INFO.name}
        </h2>
        <p className="text-slate-400">{siteConfig.tagline}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {showAddress && (
            <div>
              <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wider mb-3">
                Adres
              </h3>
              <address className="not-italic text-slate-300 leading-relaxed">
                <span className="block font-semibold text-white">{BUSINESS_INFO.legalName}</span>
                <span className="block mt-2">{BUSINESS_INFO.address.street}</span>
                <span className="block">{BUSINESS_INFO.address.postalCode} {BUSINESS_INFO.address.city}</span>
                <span className="block">{BUSINESS_INFO.address.country}</span>
              </address>
            </div>
          )}

          {showRegistration && (
            <div>
              <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wider mb-3">
                Registratie
              </h3>
              <div className="text-slate-300 space-y-1">
                <p className="flex items-start gap-2">
                  <span className="text-slate-500 min-w-[60px]">KVK:</span>
                  <span>{BUSINESS_INFO.kvk.replace('KVK: ', '')}</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-slate-500 min-w-[60px]">BTW-ID:</span>
                  <span>{BUSINESS_INFO.vat.replace('BTW: ', '')}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {showContact && (
            <div>
              <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wider mb-3">
                Contact
              </h3>
              <div className="space-y-3">
                <a 
                  href={`tel:${BUSINESS_INFO.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 text-slate-300 hover:text-cyan-300 transition-colors group"
                  aria-label="Bel ons"
                >
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Telefoon</p>
                    <p className="font-medium">{BUSINESS_INFO.phone}</p>
                  </div>
                </a>
                
                <a 
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="flex items-center gap-3 text-slate-300 hover:text-cyan-300 transition-colors group"
                  aria-label="Email ons"
                >
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="font-medium">{BUSINESS_INFO.email}</p>
                  </div>
                </a>
              </div>
            </div>
          )}

          {showOpeningHours && (
            <div>
              <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wider mb-3">
                Openingstijden
              </h3>
              <div className="space-y-2 text-slate-300">
                {BUSINESS_INFO.openingHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="font-medium">{schedule.days}</span>
                    <span className="text-slate-400">{schedule.hours}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-3 italic">
                Ook buiten openingstijden bereikbaar via email
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-8 pt-6 border-t border-cosmic-700/50">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <p className="text-sm text-slate-400">
            Klaar om uw digitale project te starten?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-cosmic-900 font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/20"
          >
            Neem Contact Op
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
