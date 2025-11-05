/**
 * CMS Schema Index
 * 
 * Central export point for all CMS schemas and types.
 * 
 * @module cms/schema
 */

// City schema
export {
  CitySchema,
  CityUpdateSchema,
  CityCreateSchema,
  CoordinatesSchema,
  BusinessHoursSchema,
  LocalStatsSchema,
} from './city.schema';

export type {
  City,
  CityUpdate,
  CityCreate,
} from './city.schema';

// Service schema
export {
  ServiceSchema,
  ServiceUpdateSchema,
  ServiceCreateSchema,
  PricingTierSchema,
  FAQItemSchema,
  ProcessStepSchema,
} from './service.schema';

export type {
  Service,
  ServiceUpdate,
  ServiceCreate,
  PricingTier,
  FAQItem,
  ProcessStep,
} from './service.schema';

// CityService schema
export {
  CityServiceSchema,
  CityServiceUpdateSchema,
  CityServiceCreateSchema,
  LocalTestimonialSchema,
  LocalCaseStudySchema,
  LocalMarketInsightsSchema,
} from './city-service.schema';

export type {
  CityService,
  CityServiceUpdate,
  CityServiceCreate,
  LocalTestimonial,
  LocalCaseStudy,
  LocalMarketInsights,
} from './city-service.schema';
