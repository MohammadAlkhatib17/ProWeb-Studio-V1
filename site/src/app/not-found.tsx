import type { Metadata } from 'next';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { siteConfig } from '@/config/site.config';

export const metadata: Metadata = {
  title: 'Pagina niet gevonden',
  description: 'De pagina die u zocht kon niet worden gevonden.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    nosnippet: true,
    noarchive: true,
    noimageindex: true,
  },
};

export default function NotFound() {
  const mainLinks = [
    { href: '/', label: 'Home', description: 'Terug naar de hoofdpagina' },
    { href: '/diensten', label: 'Diensten', description: 'Onze webdevelopment diensten' },
    { href: '/over-ons', label: 'Over Ons', description: 'Leer meer over ProWeb Studio' },
    { href: '/contact', label: 'Contact', description: 'Neem contact met ons op' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-cosmic-900 flex flex-col">
      {/* Background Layer */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.15)_0%,rgba(79,70,229,0.05)_50%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(147,51,234,0.1)_0%,rgba(79,70,229,0.1)_50%,rgba(236,72,153,0.1)_100%)]" />
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
          {/* Error Code */}
          <div className="mb-8">
            <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-bold gradient-text-404 leading-none">
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-12 space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Pagina niet gevonden
            </h2>
            <p className="text-lg text-slate-200 max-w-md mx-auto leading-relaxed">
              De pagina die u zocht bestaat niet of is verplaatst. 
              Geen zorgen, we helpen u graag verder.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative p-6 bg-cosmic-800/30 border border-cosmic-700/30 rounded-xl hover:bg-cosmic-700/40 hover:border-primary-500/50 transition-all duration-300 text-left"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-300 transition-colors">
                    {link.label}
                  </h3>
                  <p className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
                    {link.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Back Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="group relative px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-lg hover:from-primary-500 hover:to-secondary-500 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span className="relative z-10">← Terug naar home</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-secondary-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            
            <Link
              href="/contact"
              className="text-slate-200 hover:text-primary-300 transition-colors font-medium"
            >
              Of neem contact op →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-20 px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-slate-400">
            Hulp nodig? Bel ons op{' '}
            <a 
              href={`tel:${siteConfig.phone}`}
              className="text-primary-300 hover:text-primary-200 transition-colors"
            >
              {siteConfig.phone}
            </a>
            {' '}of mail naar{' '}
            <a 
              href={`mailto:${siteConfig.email}`}
              className="text-primary-300 hover:text-primary-200 transition-colors"
            >
              {siteConfig.email}
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}