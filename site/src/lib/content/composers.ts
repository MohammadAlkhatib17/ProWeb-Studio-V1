/**
 * Content Composition Helpers
 * 
 * Pure functions for composing complete city-service page content.
 * Combines city data, service data, and cityService overrides into
 * unified, SEO-optimized content for Dutch market.
 * 
 * @module lib/content/composers
 */

import { generateCityServiceContent, calculateWordCount, validateContent } from './generators';
import {
  cityFixtures,
  serviceFixtures,
  cityServiceFixtures,
  getCityBySlug,
  getServiceBySlug,
  getCityServiceBySlug,
} from '../../../cms/fixtures';

import type { City, Service, CityService } from '../../../cms/schema';

/**
 * Compose complete page content for a city-service combination
 * 
 * @param citySlug - City slug (e.g., "amsterdam")
 * @param serviceSlug - Service slug (e.g., "website-laten-maken")
 * @returns Complete page content object or null if not found
 */
export function composeCityServicePage(
  citySlug: string,
  serviceSlug: string
): {
  content: string;
  metadata: {
    city: City;
    service: Service;
    cityService?: CityService;
    wordCount: number;
    isValid: boolean;
    validationErrors: string[];
  };
} | null {
  // Get city data
  const city = getCityBySlug(citySlug);
  if (!city) {
    return null;
  }
  
  // Get service data
  const service = getServiceBySlug(serviceSlug);
  if (!service) {
    return null;
  }
  
  // Get city-service overrides (optional)
  const cityService = getCityServiceBySlug(citySlug, serviceSlug);
  
  // Check availability
  if (cityService && !cityService.isAvailable) {
    return null;
  }
  
  // Add timestamps to make fixtures compatible with full types
  const now = new Date();
  const fullCity = { ...city, createdAt: now, updatedAt: now };
  const fullService = { ...service, createdAt: now, updatedAt: now };
  const fullCityService = cityService ? { ...cityService, createdAt: now, updatedAt: now } : undefined;
  
  // Generate content
  const content = generateCityServiceContent(fullCity, fullService, fullCityService);
  
  // Calculate metrics
  const wordCount = calculateWordCount(content);
  const validation = validateContent(content);
  
  return {
    content,
    metadata: {
      city: fullCity,
      service: fullService,
      cityService: fullCityService,
      wordCount,
      isValid: validation.isValid,
      validationErrors: validation.errors,
    },
  };
}

/**
 * Get all available city-service combinations
 * 
 * @returns Array of available combinations with metadata
 */
export function getAllCityServiceCombinations(): Array<{
  citySlug: string;
  serviceSlug: string;
  cityName: string;
  serviceName: string;
  featured: boolean;
  priority: number;
  isAvailable: boolean;
}> {
  return cityServiceFixtures
    .filter(cs => cs.isAvailable)
    .map(cs => ({
      citySlug: cs.citySlug,
      serviceSlug: cs.serviceSlug,
      cityName: cityFixtures.find(c => c.slug === cs.citySlug)?.name || cs.citySlug,
      serviceName: serviceFixtures.find(s => s.slug === cs.serviceSlug)?.name || cs.serviceSlug,
      featured: cs.featured,
      priority: cs.priority,
      isAvailable: cs.isAvailable,
    }))
    .sort((a, b) => {
      // Sort by featured first, then priority
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.priority - a.priority;
    });
}

/**
 * Get featured city-service combinations
 * 
 * @param limit - Maximum number of results (default: 6)
 * @returns Array of featured combinations
 */
export function getFeaturedCityServices(limit: number = 6): ReturnType<typeof getAllCityServiceCombinations> {
  return getAllCityServiceCombinations()
    .filter(cs => cs.featured)
    .slice(0, limit);
}

/**
 * Get all combinations for a specific city
 * 
 * @param citySlug - City slug
 * @returns Array of service combinations for the city
 */
export function getServicesForCity(citySlug: string): ReturnType<typeof getAllCityServiceCombinations> {
  return getAllCityServiceCombinations()
    .filter(cs => cs.citySlug === citySlug);
}

/**
 * Get all combinations for a specific service
 * 
 * @param serviceSlug - Service slug
 * @returns Array of city combinations for the service
 */
export function getCitiesForService(serviceSlug: string): ReturnType<typeof getAllCityServiceCombinations> {
  return getAllCityServiceCombinations()
    .filter(cs => cs.serviceSlug === serviceSlug);
}

/**
 * Get SEO metadata for a city-service page
 * 
 * @param citySlug - City slug
 * @param serviceSlug - Service slug
 * @returns SEO metadata object or null
 */
export function getCityServiceSEO(
  citySlug: string,
  serviceSlug: string
): {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
} | null {
  const city = getCityBySlug(citySlug);
  const service = getServiceBySlug(serviceSlug);
  const cityService = getCityServiceBySlug(citySlug, serviceSlug);
  
  if (!city || !service) {
    return null;
  }
  
  // Use override if available
  const title = cityService?.titleOverride || 
    `${service.name} in ${city.name} | Professionele Dienstverlening`;
  
  const description = cityService?.metaDescriptionOverride || 
    `${service.shortDescription} Specialist in ${city.name}. ${city.shortDescription}`;
  
  // Combine keywords
  const keywords = [
    ...service.keywords,
    ...city.keywords,
    ...(cityService?.additionalKeywords || []),
  ];
  
  const canonical = `/diensten/${serviceSlug}/${citySlug}`;
  
  return {
    title,
    description,
    keywords,
    canonical,
  };
}

/**
 * Generate breadcrumb data for city-service page
 * 
 * @param citySlug - City slug
 * @param serviceSlug - Service slug
 * @returns Breadcrumb array
 */
export function getCityServiceBreadcrumbs(
  citySlug: string,
  serviceSlug: string
): Array<{ label: string; href: string }> {
  const city = getCityBySlug(citySlug);
  const service = getServiceBySlug(serviceSlug);
  
  if (!city || !service) {
    return [];
  }
  
  return [
    { label: 'Home', href: '/' },
    { label: 'Diensten', href: '/diensten' },
    { label: service.name, href: `/diensten/${serviceSlug}` },
    { label: city.name, href: `/diensten/${serviceSlug}/${citySlug}` },
  ];
}

/**
 * Get structured data (JSON-LD) for city-service page
 * 
 * @param citySlug - City slug
 * @param serviceSlug - Service slug
 * @returns JSON-LD structured data object
 */
export function getCityServiceStructuredData(
  citySlug: string,
  serviceSlug: string
): Record<string, unknown> | null {
  const city = getCityBySlug(citySlug);
  const service = getServiceBySlug(serviceSlug);
  const cityService = getCityServiceBySlug(citySlug, serviceSlug);
  
  if (!city || !service) {
    return null;
  }
  
  const lowestPrice = service.pricingTiers?.[0]?.price || 0;
  const highestPrice = service.pricingTiers?.[service.pricingTiers.length - 1]?.price || 0;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${service.name} in ${city.name}`,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: 'ProWeb Studio',
      address: {
        '@type': 'PostalAddress',
        addressLocality: city.name,
        addressRegion: city.province,
        addressCountry: 'NL',
      },
    },
    areaServed: {
      '@type': 'City',
      name: city.name,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: lowestPrice,
      priceRange: highestPrice > lowestPrice ? `€${lowestPrice}-€${highestPrice}` : undefined,
    },
    aggregateRating: cityService?.testimonials && cityService.testimonials.length > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: (
        cityService.testimonials.reduce((sum, t) => sum + t.rating, 0) / 
        cityService.testimonials.length
      ).toFixed(1),
      reviewCount: cityService.testimonials.length,
    } : undefined,
  };
}

/**
 * Validate all city-service content meets quality requirements
 * 
 * @returns Validation summary
 */
export function validateAllCityServiceContent(): {
  total: number;
  valid: number;
  invalid: number;
  details: Array<{
    citySlug: string;
    serviceSlug: string;
    isValid: boolean;
    wordCount: number;
    errors: string[];
  }>;
} {
  const combinations = getAllCityServiceCombinations();
  const details = combinations.map(combo => {
    const page = composeCityServicePage(combo.citySlug, combo.serviceSlug);
    
    if (!page) {
      return {
        citySlug: combo.citySlug,
        serviceSlug: combo.serviceSlug,
        isValid: false,
        wordCount: 0,
        errors: ['Failed to generate content'],
      };
    }
    
    return {
      citySlug: combo.citySlug,
      serviceSlug: combo.serviceSlug,
      isValid: page.metadata.isValid,
      wordCount: page.metadata.wordCount,
      errors: page.metadata.validationErrors,
    };
  });
  
  const valid = details.filter(d => d.isValid).length;
  
  return {
    total: combinations.length,
    valid,
    invalid: combinations.length - valid,
    details,
  };
}
