'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site.config';
import { footerLinkGroups } from '@/config/internal-linking.config';
import Logo from '@/components/Logo';
import { Button } from '@/components/Button';
import CookieSettingsButton from '@/components/cookies/CookieSettingsButton';
import { useDebounce } from '@/hooks/useDebounce';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Debounce email validation to reduce unnecessary re-renders
  const debouncedEmail = useDebounce(email, 300);

  // Memoized validation to avoid re-creating on every render
  const isEmailValid = useCallback((emailValue: string) => {
    return emailValue && /^\S+@\S+\.\S+$/.test(emailValue);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');
    setSuccessMessage('');

    // Use debounced value for submission
    if (!isEmailValid(debouncedEmail)) {
      setErrorMessage('Voer een geldig e-mailadres in.');
      setStatus('error');
      return;
    }

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: debouncedEmail }),
      });

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Handle non-JSON responses (e.g., plain text error messages)
        const text = await response.text();
        data = { error: text };
      }

      if (!response.ok) {
        throw new Error(data.error || 'Er is iets misgegaan.');
      }

      setStatus('success');
      setSuccessMessage(data.message || 'Bedankt voor je inschrijving!');
      setEmail(''); // Clear input on success
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Onbekende fout.');
    }
  };

  return (
    <footer className="bg-cosmic-800/20 border-t border-cosmic-700 py-section px-4 sm:px-6">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="mb-3 transform hover:scale-105 transition-transform duration-300">
              <Logo variant="full" size="lg" withGlow={true} animated={true} />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed -mt-1 mb-6">
              {siteConfig.tagline}
            </p>
            
            {/* Newsletter signup */}
            <div>
              <h4 className="font-semibold mb-4 text-cyan-300">
                Digitale Magie Direct in je Inbox
              </h4>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Wil je weten hoe de toekomst van het web eruitziet? Ontvang maandelijks 
                onze nieuwste inzichten over webdesign, 3D-innovaties en digitale trends 
                die jouw business vooruit helpen. Geen spam, alleen waardevolle kennis.
              </p>
              <form className="space-y-3" onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <label htmlFor="newsletter-email" className="sr-only">
                    E-mailadres voor nieuwsbrief
                  </label>
                  <input
                    type="email"
                    id="newsletter-email"
                    name="email"
                    placeholder="jouw@email.nl"
                    className="sm:flex-1 px-4 py-3 min-h-[44px] bg-cosmic-800/60 border border-cosmic-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 placeholder-gray-500"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'sending'}
                  />
                  <Button
                    as="button"
                    type="submit"
                    variant="primary"
                    className="whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed sm:min-w-[140px]"
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? 'Bezig...' : 'Inschrijven'}
                  </Button>
                </div>
                {status === 'success' && (
                  <p className="text-xs text-green-400">{successMessage}</p>
                )}
                {status === 'error' && (
                  <p className="text-xs text-red-400">{errorMessage}</p>
                )}
                {status === 'idle' && (
                  <p className="text-xs text-gray-500">
                    We respecteren je inbox. Uitschrijven doe je met één klik.
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Strategic Link Groups */}
          {footerLinkGroups.map((group) => (
            <div key={group.title}>
              <h4 className="font-semibold mb-4">{group.title}</h4>
              <nav aria-label={`${group.title} navigation`}>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`text-sm min-h-[44px] inline-flex items-center py-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic-900 rounded ${
                          link.priority === 'high' 
                            ? 'text-white hover:text-cyan-300 font-medium' 
                            : 'text-slate-400 hover:text-cyan-300'
                        }`}
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          ))}
        </div>

        {/* Legal & Company Information Section */}
        <div className="mt-8 pt-8 border-t border-cosmic-700/50">
          {/* Legal Links */}
          <nav aria-label="Juridische informatie" className="mb-6">
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-slate-400 hover:text-cyan-300 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic-900 rounded underline-offset-4 hover:underline"
                >
                  Privacybeleid
                </Link>
              </li>
              <li aria-hidden="true" className="text-cosmic-600">•</li>
              <li>
                <Link
                  href="/cookiebeleid"
                  className="text-slate-400 hover:text-cyan-300 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic-900 rounded underline-offset-4 hover:underline"
                >
                  Cookiebeleid
                </Link>
              </li>
              <li aria-hidden="true" className="text-cosmic-600">•</li>
              <li>
                <Link
                  href="/voorwaarden"
                  className="text-slate-400 hover:text-cyan-300 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic-900 rounded underline-offset-4 hover:underline"
                >
                  Algemene voorwaarden
                </Link>
              </li>
              <li aria-hidden="true" className="text-cosmic-600">•</li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-400 hover:text-cyan-300 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic-900 rounded underline-offset-4 hover:underline"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact & Company Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-slate-400">
              <a
                href={`mailto:${siteConfig.email}`}
                className="hover:text-cyan-300 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic-900 rounded"
              >
                {siteConfig.email}
              </a>
              <span className="hidden sm:inline text-cosmic-600">•</span>
              <a
                href={`tel:${siteConfig.phone}`}
                className="hover:text-cyan-300 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic-900 rounded"
              >
                {siteConfig.phone}
              </a>
            </div>
          </div>

          {/* Dutch Company Registration Info - Only show when env vars are present */}
          {(process.env.NEXT_PUBLIC_KVK || process.env.NEXT_PUBLIC_BTW) && (
            <div 
              className="mt-4 text-xs text-slate-500"
              data-testid="company-registration-info"
            >
              <p className="flex flex-wrap gap-x-3 gap-y-1">
                {process.env.NEXT_PUBLIC_KVK && (
                  <span data-testid="kvk-info">
                    <strong>KVK:</strong> {process.env.NEXT_PUBLIC_KVK}
                  </span>
                )}
                {process.env.NEXT_PUBLIC_KVK && process.env.NEXT_PUBLIC_BTW && (
                  <span aria-hidden="true">•</span>
                )}
                {process.env.NEXT_PUBLIC_BTW && (
                  <span data-testid="btw-info">
                    <strong>BTW/VAT:</strong> {process.env.NEXT_PUBLIC_BTW}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/70">
          <span>&copy; {new Date().getFullYear()} {siteConfig.name}. Met trots gemaakt in Nederland.</span>
          <span aria-hidden>•</span>
          <span>Gebouwd met passie voor de digitale toekomst ❤️</span>
          <span aria-hidden>•</span>
          <CookieSettingsButton />
        </div>
      </div>
    </footer>
  );
}
