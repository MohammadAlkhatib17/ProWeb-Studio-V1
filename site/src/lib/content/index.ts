/**
 * Content Generation Library
 * 
 * Central export point for all content generation, formatting, and composition utilities.
 * Provides pure, testable functions for creating unique Dutch (nl-NL) content for
 * city-service pages with ≥70% uniqueness target.
 * 
 * @module lib/content
 */

// Dutch formatting utilities
export {
  formatNumber,
  formatCurrency,
  formatPriceRange,
  formatDate,
  formatPercentage,
  formatLargeNumber,
  formatPhoneNumber,
  formatPostalCode,
  formatDuration,
  formatDistance,
} from './dutch-format';

// Content generators
export {
  generateIntroduction,
  generateWhyLocal,
  generateProcessSection,
  generatePricingSection,
  generateBenefitsSection,
  generateLocalExamples,
  generateLocalFAQs,
  generateTestimonialsSection,
  generateMarketInsights,
  generateCTA,
  generateCityServiceContent,
  calculateWordCount,
  validateContent,
} from './generators';

// Content composers
export {
  composeCityServicePage,
  getAllCityServiceCombinations,
  getFeaturedCityServices,
  getServicesForCity,
  getCitiesForService,
  getCityServiceSEO,
  getCityServiceBreadcrumbs,
  getCityServiceStructuredData,
  validateAllCityServiceContent,
} from './composers';

// Re-export fixtures for convenience
export {
  cityFixtures,
  serviceFixtures,
  cityServiceFixtures,
  getCityBySlug,
  getCityById,
  getFeaturedCities,
  getCitiesByProvince,
  getServiceBySlug,
  getServiceById,
  getFeaturedServices,
  getCityServiceBySlug,
  getServicesForCity as getServicesByCity,
  getCitiesForService as getCitiesByService,
} from '../../../cms/fixtures';

// Re-export types for convenience
export type {
  City,
  CityCreate,
  CityUpdate,
  Service,
  ServiceCreate,
  ServiceUpdate,
  CityService,
  CityServiceCreate,
  CityServiceUpdate,
  LocalTestimonial,
  LocalCaseStudy,
  LocalMarketInsights,
  PricingTier,
  FAQItem,
  ProcessStep,
} from '../../../cms/schema';
