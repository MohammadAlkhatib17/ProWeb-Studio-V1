'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { siteConfig } from '@/config/site.config';
import { Button } from '@/components/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// Note: metadata export doesn't work in error.tsx due to 'use client'
// SEO headers are handled via middleware for error routes

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service if needed
    console.error('Application error:', error);
  }, [error]);

  const troubleshootingSteps = [
    'Ververs de pagina (F5 of Ctrl+R)',
    'Controleer uw internetverbinding',
    'Probeer het over een paar minuten opnieuw',
    'Schakel eventuele browser extensies uit',
  ];

  const helpfulLinks = [
    { href: '/', label: 'Home', description: 'Terug naar de hoofdpagina' },
    { href: '/contact', label: 'Contact', description: 'Meld dit probleem aan ons' },
    { href: '/diensten', label: 'Diensten', description: 'Bekijk onze diensten' },
  ];

  return (
    <html lang="nl">
      <head>
        <title>Er is iets misgegaan | {siteConfig.name}</title>
        <meta name="description" content="Er is een onverwachte fout opgetreden. Probeer het opnieuw of neem contact met ons op." />
        <meta name="robots" content="noindex, nofollow, nocache, nosnippet, noarchive, noimageindex" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-cosmic-900 flex flex-col">
        {/* Background Layer */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.15)_0%,rgba(220,38,38,0.05)_50%,transparent_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(239,68,68,0.1)_0%,rgba(220,38,38,0.1)_50%,rgba(185,28,28,0.1)_100%)]" />
        </div>

        {/* Top Vignette */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cosmic-900/80 to-transparent pointer-events-none z-10" />

        {/* Header */}
        <header className="relative z-20 px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <Link 
              href="/" 
              className="inline-block transform hover:scale-105 transition-transform duration-300"
              aria-label="Terug naar home"
            >
              <Logo size="lg" />
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* Error Icon */}
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 flex items-center justify-center">
                <svg 
                  className="w-12 h-12 text-red-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text-error leading-tight">
                Oeps!
              </h1>
            </div>

            {/* Error Message */}
            <div className="mb-12 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Er is iets misgegaan
              </h2>
              <p className="text-lg text-slate-200 max-w-md mx-auto leading-relaxed">
                Er is een onverwachte fout opgetreden. 
                Dit kan tijdelijk zijn - probeer het opnieuw.
              </p>
              {error.digest && (
                <p className="text-sm text-slate-400 font-mono bg-cosmic-800/30 px-3 py-2 rounded border border-cosmic-700/30 inline-block">
                  Fout ID: {error.digest}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                as="button"
                onClick={reset}
                variant="primary"
                size="large"
              >
                Probeer opnieuw
              </Button>
              
              <button
                onClick={() => window.location.reload()}
                className="text-slate-200 hover:text-primary-300 transition-colors font-medium"
              >
                Of ververs de pagina →
              </button>
            </div>

            {/* Troubleshooting */}
            <div className="mb-8 text-left bg-cosmic-800/20 border border-cosmic-700/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                💡 Probeer deze stappen:
              </h3>
              <ul className="space-y-2">
                {troubleshootingSteps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary-400 mr-3 mt-1">•</span>
                    <span className="text-slate-200">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Helpful Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {helpfulLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative p-4 bg-cosmic-800/30 border border-cosmic-700/30 rounded-xl hover:bg-cosmic-700/40 hover:border-primary-500/50 transition-all duration-300 text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <h4 className="text-md font-semibold text-white mb-1 group-hover:text-primary-300 transition-colors">
                      {link.label}
                    </h4>
                    <p className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
                      {link.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>

        {/* Footer Info */}
        <footer className="relative z-20 px-4 sm:px-6 lg:px-8 py-8 text-center">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm text-slate-400">
              Probleem blijft bestaan? Neem contact op:{' '}
              <a 
                href={`tel:${siteConfig.phone}`}
                className="text-primary-300 hover:text-primary-200 transition-colors"
              >
                {siteConfig.phone}
              </a>
              {' '}of{' '}
              <a 
                href={`mailto:${siteConfig.email}`}
                className="text-primary-300 hover:text-primary-200 transition-colors"
              >
                {siteConfig.email}
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}