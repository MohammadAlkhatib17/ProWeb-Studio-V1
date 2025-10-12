"use client";

import React, { useState } from "react";
import { getNearestCities, type DutchCity } from "@/config/local-seo.config";

interface NearMeSearchProps {
  currentCity: DutchCity;
  className?: string;
}

interface LocationState {
  userLocation: { lat: number; lng: number } | null;
  nearbyCity: DutchCity | null;
  nearestCities: DutchCity[];
  isLoading: boolean;
  error: string | null;
}

export default function NearMeSearch({
  currentCity,
  className = "",
}: NearMeSearchProps) {
  const [locationState, setLocationState] = useState<LocationState>({
    userLocation: null,
    nearbyCity: null,
    nearestCities: [],
    isLoading: false,
    error: null,
  });

  const requestLocation = () => {
    setLocationState((prev) => ({ ...prev, isLoading: true, error: null }));

    if (!navigator.geolocation) {
      setLocationState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Geolocatie wordt niet ondersteund door uw browser.",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const nearestCities = getNearestCities(userLocation, 5);
        const nearbyCity = nearestCities[0] || null;

        setLocationState({
          userLocation,
          nearbyCity,
          nearestCities,
          isLoading: false,
          error: null,
        });
      },
      (error) => {
        let errorMessage = "Kon uw locatie niet bepalen.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Locatietoegang geweigerd. Schakel locatiediensten in om nabijgelegen steden te vinden.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Locatie-informatie is niet beschikbaar.";
            break;
          case error.TIMEOUT:
            errorMessage = "Locatieverzoek is verlopen.";
            break;
        }

        setLocationState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    );
  };

  // Get nearby cities based on current city if no geolocation
  const suggestedCities =
    locationState.nearestCities.length > 0
      ? locationState.nearestCities
      : getNearestCities(currentCity.coordinates, 5).filter(
          (city) => city.slug !== currentCity.slug,
        );

  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-5 h-5 text-blue-600 dark:text-blue-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Dichtbij Mij
        </h3>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
        Vind de dichtstbijzijnde stad waar wij onze webdesign diensten
        aanbieden.
      </p>

      {!locationState.userLocation && !locationState.error && (
        <div className="mb-6">
          <button
            onClick={requestLocation}
            disabled={locationState.isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {locationState.isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Locatie Bepalen...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                Vind Dichtsbijzijnde Stad
              </>
            )}
          </button>
        </div>
      )}

      {locationState.error && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {locationState.error}
              </p>
            </div>
          </div>
        </div>
      )}

      {locationState.nearbyCity && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-4 h-4 text-green-600 dark:text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              Dichtstbijzijnde Stad Gevonden
            </span>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300 mb-3">
            Wij bieden onze diensten aan in{" "}
            <strong>{locationState.nearbyCity.name}</strong>,{" "}
            {locationState.nearbyCity.province}
          </p>
          <a
            href={`/locatie/${locationState.nearbyCity.slug}`}
            className="inline-flex items-center gap-1 text-sm text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 font-medium"
          >
            Bekijk {locationState.nearbyCity.name} →
          </a>
        </div>
      )}

      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm">
          {locationState.nearestCities.length > 0
            ? "Andere Nabijgelegen Steden"
            : "Steden in de Buurt"}
        </h4>
        <div className="space-y-2">
          {suggestedCities.slice(0, 4).map((city) => (
            <a
              key={city.slug}
              href={`/locatie/${city.slug}`}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            >
              <div>
                <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {city.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {city.province} • {city.population.toLocaleString("nl-NL")}{" "}
                  inwoners
                </div>
              </div>
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Wij bedienen heel Nederland
          </p>
          <a
            href="/locaties"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            Alle locaties bekijken →
          </a>
        </div>
      </div>
    </div>
  );
}

// Compact version for use in headers/navigation
export function CompactNearMeSearch({
  currentCity,
  className = "",
}: NearMeSearchProps) {
  const [nearbyCity, setNearbyCity] = useState<DutchCity | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const detectLocation = () => {
    setIsDetecting(true);

    if (!navigator.geolocation) {
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const nearest = getNearestCities(userLocation, 1)[0];
        setNearbyCity(nearest);
        setIsDetecting(false);
      },
      () => {
        setIsDetecting(false);
      },
    );
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        onClick={detectLocation}
        disabled={isDetecting}
        className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 disabled:opacity-50 transition-colors"
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
        {isDetecting ? "Zoeken..." : "Dichtbij mij"}
      </button>

      {nearbyCity && nearbyCity.slug !== currentCity.slug && (
        <a
          href={`/locatie/${nearbyCity.slug}`}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          → {nearbyCity.name}
        </a>
      )}
    </div>
  );
}
