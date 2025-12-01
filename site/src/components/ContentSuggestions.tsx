'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { getContentSuggestions } from '@/config/internal-linking.config';

interface ContentSuggestionsProps {
  className?: string;
  customSuggestions?: Array<{title: string; href: string; description: string}>;
  title?: string;
}

export default function ContentSuggestions({ 
  className = '',
  customSuggestions,
  title = 'Volgende Stappen'
}: ContentSuggestionsProps) {
  const pathname = usePathname();
  
  // Use custom suggestions or get suggestions based on current page
  const suggestions = customSuggestions || getContentSuggestions(pathname);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 border-t border-cosmic-700/50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
            {title}
          </h2>
          <p className="text-slate-400">
            Ontdek meer over ProWeb Studio en onze mogelijkheden
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {suggestions.map((suggestion) => (
            <Link
              key={suggestion.href}
              href={suggestion.href}
              className="group bg-gradient-to-br from-cosmic-800/20 to-cosmic-800/40 border border-cosmic-700/30 rounded-lg p-6 hover:border-cyan-400/40 transition-all duration-300 hover:from-cosmic-800/30 hover:to-cosmic-800/60"
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {suggestion.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {suggestion.description}
                </p>
                <div className="inline-flex items-center text-cyan-300 text-sm font-medium">
                  Bekijken
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Alternative compact version for sidebars or smaller spaces
interface CompactContentSuggestionsProps {
  className?: string;
  maxItems?: number;
}

export function CompactContentSuggestions({ 
  className = '',
  maxItems = 3
}: CompactContentSuggestionsProps) {
  const pathname = usePathname();
  const suggestions = getContentSuggestions(pathname).slice(0, maxItems);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <aside className={`bg-cosmic-800/20 border border-cosmic-700/50 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">
        Aanbevolen voor U
      </h3>
      <nav>
        <ul className="space-y-3">
          {suggestions.map((suggestion) => (
            <li key={suggestion.href}>
              <Link
                href={suggestion.href}
                className="group block p-3 -m-3 rounded-md hover:bg-cosmic-700/30 transition-colors duration-200"
              >
                <div className="font-medium text-white group-hover:text-cyan-300 transition-colors mb-1">
                  {suggestion.title}
                </div>
                <div className="text-sm text-slate-400 leading-relaxed">
                  {suggestion.description}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}