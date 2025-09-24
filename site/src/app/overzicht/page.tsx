import type { Metadata } from 'next';

export const dynamic = 'force-static';
export const revalidate = 60 * 60 * 24;

// Get canonical URL from environment with fallback
const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Site-overzicht – Alle pagina\'s van ProWeb Studio',
  description: 'Overzicht van alle pagina\'s en secties op de ProWeb Studio website voor eenvoudige navigatie.',
  alternates: {
    canonical: '/overzicht',
    languages: { 
      'nl-NL': '/overzicht',
      'x-default': '/overzicht'
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Site-overzicht – Alle pagina\'s van ProWeb Studio',
    description: 'Overzicht van alle pagina\'s en secties op de ProWeb Studio website voor eenvoudige navigatie.',
    url: `${SITE_URL}/overzicht`,
    type: 'website',
    locale: 'nl_NL',
  },
};

export default function SiteOverzichtPage() {
  return (
    <main className="container mx-auto px-6 md:px-8 lg:px-12 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-magenta-400 bg-clip-text text-transparent">
            Site-overzicht
          </h1>
          <p className="text-xl text-slate-200 leading-relaxed">
            Alle pagina&apos;s en secties van onze website op één plek voor eenvoudige navigatie.
          </p>
        </header>

        <div className="space-y-8">
          {/* Main Pages */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-cyan-300">Hoofdpagina&apos;s</h2>
            <nav>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <li>
                  <a 
                    href="/" 
                    className="block p-4 rounded-lg bg-cosmic-900/50 border border-white/10 hover:border-cyan-400/50 hover:bg-white/5 transition-all duration-200"
                  >
                    <span className="font-medium text-white">Home</span>
                    <p className="text-sm text-slate-400 mt-1">Startpagina en introductie</p>
                  </a>
                </li>
                <li>
                  <a 
                    href="/diensten" 
                    className="block p-4 rounded-lg bg-cosmic-900/50 border border-white/10 hover:border-cyan-400/50 hover:bg-white/5 transition-all duration-200"
                  >
                    <span className="font-medium text-white">Diensten</span>
                    <p className="text-sm text-slate-400 mt-1">Onze webdevelopment services</p>
                  </a>
                </li>
                <li>
                  <a 
                    href="/portfolio" 
                    className="block p-4 rounded-lg bg-cosmic-900/50 border border-white/10 hover:border-cyan-400/50 hover:bg-white/5 transition-all duration-200"
                  >
                    <span className="font-medium text-white">Portfolio</span>
                    <p className="text-sm text-slate-400 mt-1">Onze gerealiseerde projecten</p>
                  </a>
                </li>
                <li>
                  <a 
                    href="/werkwijze" 
                    className="block p-4 rounded-lg bg-cosmic-900/50 border border-white/10 hover:border-cyan-400/50 hover:bg-white/5 transition-all duration-200"
                  >
                    <span className="font-medium text-white">Werkwijze</span>
                    <p className="text-sm text-slate-400 mt-1">Hoe wij projecten aanpakken</p>
                  </a>
                </li>
                <li>
                  <a 
                    href="/over-ons" 
                    className="block p-4 rounded-lg bg-cosmic-900/50 border border-white/10 hover:border-cyan-400/50 hover:bg-white/5 transition-all duration-200"
                  >
                    <span className="font-medium text-white">Over ons</span>
                    <p className="text-sm text-slate-400 mt-1">Ons verhaal en team</p>
                  </a>
                </li>
                <li>
                  <a 
                    href="/contact" 
                    className="block p-4 rounded-lg bg-cosmic-900/50 border border-white/10 hover:border-cyan-400/50 hover:bg-white/5 transition-all duration-200"
                  >
                    <span className="font-medium text-white">Contact</span>
                    <p className="text-sm text-slate-400 mt-1">Neem contact met ons op</p>
                  </a>
                </li>
              </ul>
            </nav>
          </section>

          {/* Service Sections */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-cyan-300">Diensten secties</h2>
            <nav>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <li>
                  <a 
                    href="/diensten#website" 
                    className="block p-4 rounded-lg bg-cosmic-900/50 border border-white/10 hover:border-cyan-400/50 hover:bg-white/5 transition-all duration-200"
                  >
                    <span className="font-medium text-white">Website laten maken</span>
                    <p className="text-sm text-slate-400 mt-1">Professionele website ontwikkeling</p>
                  </a>
                </li>
                <li>
                  <a 
                    href="/diensten#webshop" 
                    className="block p-4 rounded-lg bg-cosmic-900/50 border border-white/10 hover:border-cyan-400/50 hover:bg-white/5 transition-all duration-200"
                  >
                    <span className="font-medium text-white">Webshop ontwikkeling</span>
                    <p className="text-sm text-slate-400 mt-1">E-commerce oplossingen</p>
                  </a>
                </li>
                <li>
                  <a 
                    href="/diensten#seo" 
                    className="block p-4 rounded-lg bg-cosmic-900/50 border border-white/10 hover:border-cyan-400/50 hover:bg-white/5 transition-all duration-200"
                  >
                    <span className="font-medium text-white">SEO optimalisatie</span>
                    <p className="text-sm text-slate-400 mt-1">Zoekmachine optimalisatie</p>
                  </a>
                </li>
              </ul>
            </nav>
          </section>

          {/* Legal Pages */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-cyan-300">Juridische pagina&apos;s</h2>
            <nav>
              <ul className="grid gap-3 sm:grid-cols-2">
                <li>
                  <a 
                    href="/privacy" 
                    className="block p-4 rounded-lg bg-cosmic-900/50 border border-white/10 hover:border-cyan-400/50 hover:bg-white/5 transition-all duration-200"
                  >
                    <span className="font-medium text-white">Privacy</span>
                    <p className="text-sm text-slate-400 mt-1">Privacyverklaring en gegevensbescherming</p>
                  </a>
                </li>
                <li>
                  <a 
                    href="/voorwaarden" 
                    className="block p-4 rounded-lg bg-cosmic-900/50 border border-white/10 hover:border-cyan-400/50 hover:bg-white/5 transition-all duration-200"
                  >
                    <span className="font-medium text-white">Voorwaarden</span>
                    <p className="text-sm text-slate-400 mt-1">Algemene voorwaarden</p>
                  </a>
                </li>
              </ul>
            </nav>
          </section>
        </div>

        <footer className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-slate-400">
            Heeft u vragen over onze website? {' '}
            <a 
              href="/contact" 
              className="text-cyan-300 hover:text-cyan-300 transition-colors"
            >
              Neem contact met ons op
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}