/**
 * DutchBusinessInfo Component
 * 
 * Displays NAP (Name, Address, Phone) information consistently
 * for local SEO purposes. Includes KVK/VAT, address (when available),
 * opening hours, and contact information.
 * 
 * All text is in Dutch for the Dutch market.
 * Size: ~3 KB gzipped
 * 
 * IMPORTANT:
 * - All company data comes from centralized companyInfo config
 * - Address is only shown when ALL address env vars are present
 * - No hardcoded placeholder data - fields are hidden when data is missing
 */

'use client';

import Link from 'next/link';

import { companyInfo } from '@/config/company.config';
import { siteConfig } from '@/config/site.config';

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
   * Note: Address will only display when address data is available in env vars
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

export default function DutchBusinessInfo({
  variant = 'full',
  showAddress = true,
  showOpeningHours = true,
  showContact = true,
  showRegistration = true,
  className = '',
}: DutchBusinessInfoProps) {
  // Determine if we have address data available
  const hasAddress = !!companyInfo.address;
  const shouldShowAddress = showAddress && hasAddress;

  // Inline variant - minimal single line
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-4 text-sm ${className}`}>
        <span className="font-semibold text-white">{companyInfo.name}</span>
        <span className="text-slate-400">|</span>
        <a 
          href={`tel:${companyInfo.phone.replace(/\s/g, '')}`}
          className="text-cyan-300 hover:text-cyan-200 transition-colors"
          aria-label="Bel ons"
        >
          {companyInfo.phone}
        </a>
        <span className="text-slate-400">|</span>
        <a 
          href={`mailto:${companyInfo.email}`}
          className="text-cyan-300 hover:text-cyan-200 transition-colors"
          aria-label="Email ons"
        >
          {companyInfo.email}
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
            {companyInfo.name}
          </h3>
          <p className="text-sm text-slate-400">{siteConfig.tagline}</p>
        </div>

        {shouldShowAddress && companyInfo.address && (
          <div className="text-sm text-slate-300">
            <p className="font-semibold text-white mb-1">Adres</p>
            <address className="not-italic leading-relaxed text-slate-400">
              {companyInfo.address.street}<br />
              {companyInfo.address.zip} {companyInfo.address.city}
            </address>
          </div>
        )}

        {showContact && (
          <div className="text-sm space-y-2">
            <p className="font-semibold text-white">Contact</p>
            <div className="space-y-1 text-slate-400">
              <a 
                href={`tel:${companyInfo.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 hover:text-cyan-300 transition-colors"
                aria-label="Bel ons"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {companyInfo.phone}
              </a>
              <a 
                href={`mailto:${companyInfo.email}`}
                className="flex items-center gap-2 hover:text-cyan-300 transition-colors"
                aria-label="Email ons"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {companyInfo.email}
              </a>
            </div>
          </div>
        )}

        {showOpeningHours && (
          <div className="text-sm">
            <p className="font-semibold text-white mb-2">Openingstijden</p>
            <div className="space-y-1 text-slate-400">
              {companyInfo.openingHours.map((schedule, index) => (
                <div key={index} className="flex justify-between gap-4">
                  <span>{schedule.days}</span>
                  <span className="text-slate-500">{schedule.hours}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {showRegistration && (companyInfo.kvk || companyInfo.vat) && (
          <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-700">
            {companyInfo.kvk && <p>KVK: {companyInfo.kvk}</p>}
            {companyInfo.vat && <p>BTW: {companyInfo.vat}</p>}
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
          {companyInfo.name}
        </h2>
        <p className="text-slate-400">{siteConfig.tagline}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {shouldShowAddress && companyInfo.address && (
            <div>
              <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wider mb-3">
                Adres
              </h3>
              <address className="not-italic text-slate-300 leading-relaxed">
                <span className="block font-semibold text-white">{companyInfo.legalName}</span>
                <span className="block mt-2">{companyInfo.address.street}</span>
                <span className="block">{companyInfo.address.zip} {companyInfo.address.city}</span>
                <span className="block">{companyInfo.address.country}</span>
              </address>
            </div>
          )}

          {showRegistration && (companyInfo.kvk || companyInfo.vat) && (
            <div>
              <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wider mb-3">
                Registratie
              </h3>
              <div className="text-slate-300 space-y-1">
                {companyInfo.kvk && (
                  <p className="flex items-start gap-2">
                    <span className="text-slate-500 min-w-[60px]">KVK:</span>
                    <span>{companyInfo.kvk}</span>
                  </p>
                )}
                {companyInfo.vat && (
                  <p className="flex items-start gap-2">
                    <span className="text-slate-500 min-w-[60px]">BTW-ID:</span>
                    <span>{companyInfo.vat}</span>
                  </p>
                )}
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
                  href={`tel:${companyInfo.phone.replace(/\s/g, '')}`}
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
                    <p className="font-medium">{companyInfo.phone}</p>
                  </div>
                </a>
                
                <a 
                  href={`mailto:${companyInfo.email}`}
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
                    <p className="font-medium">{companyInfo.email}</p>
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
                {companyInfo.openingHours.map((schedule, index) => (
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
