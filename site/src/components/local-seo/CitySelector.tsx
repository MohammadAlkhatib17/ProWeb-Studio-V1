/**
 * CitySelector Component
 * 
 * Interactive dropdown/grid selector for choosing cities/locations
 * served by the business. Helps with local SEO and user navigation.
 * 
 * All text is in Dutch for the Dutch market.
 * Size: ~2.5 KB gzipped
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export interface City {
  name: string;
  slug: string;
  province: string;
  popular?: boolean;
}

export interface CitySelectorProps {
  /**
   * List of cities to display
   */
  cities: City[];
  
  /**
   * Display variant
   * - 'dropdown': Classic dropdown selector
   * - 'grid': Grid layout with all cities visible
   * - 'compact': Minimal version for mobile
   */
  variant?: 'dropdown' | 'grid' | 'compact';
  
  /**
   * Current selected city (if any)
   */
  currentCity?: string;
  
  /**
   * Callback when city is selected
   */
  onCitySelect?: (city: City) => void;
  
  /**
   * Show popular cities first
   */
  highlightPopular?: boolean;
  
  /**
   * Base URL for city links (default: /locaties/)
   */
  basePath?: string;
  
  /**
   * Custom class names
   */
  className?: string;
  
  /**
   * Label/title for the selector
   */
  label?: string;
}

export default function CitySelector({
  cities,
  variant = 'dropdown',
  currentCity,
  onCitySelect,
  highlightPopular = true,
  basePath = '/locaties',
  className = '',
  label = 'Kies uw locatie',
}: CitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Filter and sort cities
  const filteredCities = cities
    .filter(city => 
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.province.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (highlightPopular) {
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
      }
      return a.name.localeCompare(b.name, 'nl');
    });

  const currentCityData = cities.find(c => c.slug === currentCity);

  // Grid variant - all cities visible in a grid
  if (variant === 'grid') {
    const popularCities = cities.filter(c => c.popular);
    const otherCities = cities.filter(c => !c.popular);

    return (
      <div className={`space-y-6 ${className}`}>
        <div>
          <h3 className="text-xl font-bold text-white mb-4">{label}</h3>
          
          {highlightPopular && popularCities.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-cyan-300 font-semibold mb-3 uppercase tracking-wider">
                Populaire Locaties
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {popularCities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`${basePath}/${city.slug}`}
                    onClick={() => onCitySelect?.(city)}
                    className={`
                      group relative p-4 rounded-lg border transition-all duration-200
                      ${currentCity === city.slug 
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' 
                        : 'bg-cosmic-800/30 border-cosmic-700/50 hover:border-cyan-500/50 text-slate-300 hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{city.name}</p>
                        <p className="text-xs text-slate-500 mt-1">{city.province}</p>
                      </div>
                      {currentCity === city.slug && (
                        <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {otherCities.length > 0 && (
            <div>
              {highlightPopular && popularCities.length > 0 && (
                <p className="text-sm text-slate-400 font-semibold mb-3 uppercase tracking-wider">
                  Alle Locaties
                </p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {otherCities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`${basePath}/${city.slug}`}
                    onClick={() => onCitySelect?.(city)}
                    className={`
                      p-3 rounded-lg text-sm transition-all duration-200 text-center
                      ${currentCity === city.slug 
                        ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-300' 
                        : 'bg-cosmic-800/20 border border-cosmic-700/30 hover:border-cyan-500/50 text-slate-400 hover:text-white'
                      }
                    `}
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Compact variant - minimal mobile-friendly version
  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <Link
          href="/locaties"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {currentCityData ? currentCityData.name : 'Kies locatie'}
        </Link>
      </div>
    );
  }

  // Dropdown variant - default interactive dropdown
  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-cosmic-800/30 border border-cosmic-700/50 rounded-lg hover:border-cyan-500/50 transition-all duration-200 text-left"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={label}
      >
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div>
            <p className="text-xs text-slate-500">{label}</p>
            <p className="text-sm font-semibold text-white">
              {currentCityData ? currentCityData.name : 'Alle locaties'}
            </p>
          </div>
        </div>
        <svg 
          className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-cosmic-800 border border-cosmic-700 rounded-lg shadow-2xl shadow-black/50 z-50 max-h-96 flex flex-col">
          {/* Search input */}
          <div className="p-3 border-b border-cosmic-700">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Zoek stad of provincie..."
                className="w-full px-4 py-2 pl-10 bg-cosmic-900/50 border border-cosmic-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                aria-label="Zoek locatie"
              />
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Cities list */}
          <div className="overflow-y-auto flex-1 p-2">
            {filteredCities.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">
                Geen locaties gevonden
              </p>
            ) : (
              <div className="space-y-1">
                {filteredCities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`${basePath}/${city.slug}`}
                    onClick={() => {
                      onCitySelect?.(city);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`
                      block px-3 py-2 rounded-lg text-sm transition-all duration-150
                      ${currentCity === city.slug 
                        ? 'bg-cyan-500/20 text-cyan-300' 
                        : 'hover:bg-cosmic-700/50 text-slate-300 hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{city.name}</span>
                        {city.popular && (
                          <span className="ml-2 text-xs text-cyan-400">★</span>
                        )}
                        <span className="ml-2 text-xs text-slate-500">
                          {city.province}
                        </span>
                      </div>
                      {currentCity === city.slug && (
                        <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* View all link */}
          <div className="p-3 border-t border-cosmic-700">
            <Link
              href="/locaties"
              className="block text-center text-sm text-cyan-300 hover:text-cyan-200 font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Bekijk alle locaties →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
