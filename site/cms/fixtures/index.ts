/**
 * CMS Fixtures Index
 * 
 * Central export point for all CMS fixtures.
 * 
 * @module cms/fixtures
 */

// City fixtures
export {
  cityFixtures,
  getCityBySlug,
  getCityById,
  getFeaturedCities,
  getCitiesByProvince,
} from './cities';

// Service fixtures
export {
  serviceFixtures,
  getServiceBySlug,
  getServiceById,
  getFeaturedServices,
  getServicesByPricingModel,
} from './services';

// CityService fixtures
export {
  cityServiceFixtures,
  getCityServiceBySlug,
  getServicesForCity,
  getCitiesForService,
  getFeaturedCityServices,
} from './city-services';
