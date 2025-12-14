'use client';

import { useState, useCallback } from 'react';

import Link from 'next/link';

import { Button } from '@/components/Button';
import CookieSettingsButton from '@/components/cookies/CookieSettingsButton';
import Logo from '@/components/Logo';
import { footerLinkGroups } from '@/config/internal-linking.config';
import { siteConfig } from '@/config/site.config';
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
    <footer className="relative bg-cosmic-900/60 backdrop-blur-xl border-t border-white/5 py-12 sm:py-16 px-4 sm:px-6 overflow-hidden">
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12 border-b border-white/5 pb-12">
          <div className="lg:col-span-2">
            <div className="mb-4 transform hover:scale-105 transition-transform duration-300 origin-left">
              <Logo variant="full" size="lg" withGlow={true} animated={true} />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
              {siteConfig.tagline}
            </p>

            {/* Newsletter signup */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/5">
              <h4 className="font-bold mb-3 text-cyan-300 flex items-center gap-2">
                <span>✨</span> Digitale Magie in je Inbox
              </h4>
              <p className="text-slate-400 text-xs mb-4 leading-relaxed">
                Ontvang maandelijks onze nieuwste inzichten over webdesign, 3D-innovaties en digitale trends.
              </p>
              <form className="space-y-3" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3">
                  <label htmlFor="newsletter-email" className="sr-only">
                    E-mailadres voor nieuwsbrief
                  </label>
                  <input
                    type="email"
                    id="newsletter-email"
                    name="email"
                    placeholder="jouw@email.nl"
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 placeholder-slate-600"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'sending'}
                  />
                  <Button
                    as="button"
                    type="submit"
                    variant="primary"
                    className="w-full justify-center text-sm py-2.5"
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? 'Bezig...' : 'Inschrijven'}
                  </Button>
                </div>
                {status === 'success' && (
                  <p className="text-xs text-green-400 font-medium animate-fade-in">✓ {successMessage}</p>
                )}
                {status === 'error' && (
                  <p className="text-xs text-red-400 font-medium animate-fade-in">! {errorMessage}</p>
                )}
              </form>
            </div>
          </div>

          {/* Strategic Link Groups */}
          {footerLinkGroups.map((group) => (
            <div key={group.title} className="pt-2">
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">{group.title}</h4>
              <nav aria-label={`${group.title} navigation`}>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`text-sm block transition-all duration-200 hover:translate-x-1 ${link.priority === 'high'
                          ? 'text-slate-200 hover:text-cyan-300 font-medium'
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

        {/* Contact & Company Info - Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-0">

          {/* Copyright & Legal */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-xs text-slate-500 order-2 md:order-1">
            <span className="text-center md:text-left">&copy; {new Date().getFullYear()} {siteConfig.name}</span>
            <span className="hidden md:inline text-slate-700">•</span>
            <span className="text-center md:text-left flex items-center gap-1">
              Gemaakt met <span className="text-red-500 animate-pulse">❤</span> in Nederland
            </span>
          </div>

          {/* Socials / Contact Quick Links */}
          <div className="flex items-center gap-6 text-sm font-medium order-1 md:order-2">
            <a href={`mailto:${siteConfig.email}`} className="text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-2">
              <span>✉️</span> <span className="hidden sm:inline">{siteConfig.email}</span>
            </a>
            <a href={`tel:${siteConfig.phone}`} className="text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-2">
              <span>📞</span> <span className="hidden sm:inline">{siteConfig.phone}</span>
            </a>
          </div>

          {/* Settings */}
          <div className="order-3">
            <CookieSettingsButton />
          </div>
        </div>

        {/* Legal Details (KVK/BTW) - Subtle at very bottom */}
        {(process.env.NEXT_PUBLIC_KVK || process.env.NEXT_PUBLIC_BTW) && (
          <div className="mt-8 pt-8 border-t border-white/5 text-center md:text-left">
            <p className="text-[10px] uppercase tracking-widest text-slate-600 font-medium">
              {process.env.NEXT_PUBLIC_KVK && `KVK: ${process.env.NEXT_PUBLIC_KVK}`}
              {process.env.NEXT_PUBLIC_KVK && process.env.NEXT_PUBLIC_BTW && <span className="mx-2 opacity-30">|</span>}
              {process.env.NEXT_PUBLIC_BTW && `BTW: ${process.env.NEXT_PUBLIC_BTW}`}
            </p>
          </div>
        )}
      </div>
    </footer>
  );
}
