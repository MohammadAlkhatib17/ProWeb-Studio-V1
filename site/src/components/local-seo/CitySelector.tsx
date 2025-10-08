import React from 'react';
import { dutchCities, type DutchCity } from '@/config/local-seo.config';

interface CitySelectorProps {
  currentCity: DutchCity;
  className?: string;
}

export default function CitySelector({ currentCity, className = '' }: CitySelectorProps) {
  // Group cities by province for better organization
  const citiesByProvince = dutchCities.reduce((acc, city) => {
    if (!acc[city.province]) {
      acc[city.province] = [];
    }
    acc[city.province].push(city);
    return acc;
  }, {} as Record<string, DutchCity[]>);

  // Sort provinces alphabetically
  const sortedProvinces = Object.keys(citiesByProvince).sort();

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg ${className}`}>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Kies Uw Locatie
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
        Selecteer uw stad om locatie-specifieke informatie en diensten te bekijken.
      </p>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {sortedProvinces.map(province => (
          <div key={province}>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm border-b border-gray-200 dark:border-gray-700 pb-1">
              {province}
            </h4>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {citiesByProvince[province]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(city => (
                  <a
                    key={city.slug}
                    href={`/locatie/${city.slug}`}
                    className={`text-sm p-2 rounded transition-colors ${
                      city.slug === currentCity.slug
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {city.name}
                  </a>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Uw stad staat er niet bij?
          </p>
          <a
            href="/contact"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            Neem contact met ons op →
          </a>
        </div>
      </div>
    </div>
  );
}

// Alternative compact version for navigation
export function CompactCitySelector({ 
  currentCity, 
  className = '' 
}: CitySelectorProps) {
  return (
    <div className={`relative ${className}`}>
      <select 
        className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={currentCity.slug}
        onChange={(e) => {
          if (e.target.value) {
            window.location.href = `/locatie/${e.target.value}`;
          }
        }}
      >
        <option value="">Kies een stad...</option>
        {dutchCities
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(city => (
            <option key={city.slug} value={city.slug}>
              {city.name}, {city.province}
            </option>
          ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
  );
}