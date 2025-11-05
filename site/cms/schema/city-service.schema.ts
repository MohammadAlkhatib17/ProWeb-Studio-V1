/**
 * CityService Schema Definition
 * 
 * Defines the structure for City-Service relationship and overrides.
 * This schema allows for city-specific customization of service content,
 * pricing, and other attributes.
 * 
 * @module cms/schema/city-service.schema
 */

import { z } from 'zod';
import { PricingTierSchema, FAQItemSchema } from './service.schema';

/**
 * Local testimonial/review schema
 */
export const LocalTestimonialSchema = z.object({
  author: z.string().min(2).max(100).describe('Naam klant'),
  company: z.string().optional().describe('Bedrijfsnaam'),
  role: z.string().optional().describe('Functie'),
  text: z.string().min(50).max(500).describe('Testimonial tekst'),
  rating: z.number().min(1).max(5).describe('Rating (1-5)'),
  date: z.date().optional().describe('Datum review'),
  location: z.string().optional().describe('Locatie binnen stad'),
});

/**
 * Local case study schema
 */
export const LocalCaseStudySchema = z.object({
  title: z.string().min(10).max(100).describe('Case study titel'),
  client: z.string().min(2).max(100).describe('Klant naam'),
  industry: z.string().describe('Branche'),
  challenge: z.string().min(50).max(300).describe('Uitdaging'),
  solution: z.string().min(50).max(300).describe('Oplossing'),
  results: z.array(z.string()).min(1).describe('Resultaten'),
  location: z.string().optional().describe('Specifieke locatie in stad'),
});

/**
 * Local market insights schema
 */
export const LocalMarketInsightsSchema = z.object({
  competitionLevel: z.enum(['low', 'medium', 'high']).describe('Concurrentieniveau'),
  averageProjectValue: z.number().positive().optional().describe('Gemiddelde projectwaarde'),
  popularServices: z.array(z.string()).optional().describe('Populaire diensten in gebied'),
  seasonality: z.string().optional().describe('Seizoensinvloeden'),
  localTrends: z.array(z.string()).optional().describe('Lokale trends'),
});

/**
 * Main CityService Schema
 * 
 * Represents the relationship between a City and a Service with
 * city-specific overrides and customizations.
 */
export const CityServiceSchema = z.object({
  id: z.string().uuid().describe('Unieke identificatie'),
  cityId: z.string().uuid().describe('City ID'),
  citySlug: z.string().describe('City slug voor referentie'),
  serviceId: z.string().uuid().describe('Service ID'),
  serviceSlug: z.string().describe('Service slug voor referentie'),
  
  // Content overrides
  titleOverride: z.string().min(10).max(150).optional().describe('Stad-specifieke titel'),
  descriptionOverride: z.string().min(100).max(1000).optional().describe('Stad-specifieke beschrijving'),
  metaDescriptionOverride: z.string().min(120).max(160).optional().describe('Stad-specifieke meta description'),
  
  // Pricing overrides
  pricingOverrides: z.array(PricingTierSchema).optional().describe('Stad-specifieke prijzen'),
  discountPercentage: z.number().min(0).max(100).optional().describe('Korting percentage'),
  
  // Local content
  localBenefits: z.array(z.string()).optional().describe('Lokale voordelen'),
  localFeatures: z.array(z.string()).optional().describe('Lokale features'),
  localExamples: z.array(z.string()).optional().describe('Lokale voorbeelden'),
  
  // Local FAQs (city-specific questions)
  localFaqs: z.array(FAQItemSchema).optional().describe('Stad-specifieke FAQs'),
  
  // Social proof
  testimonials: z.array(LocalTestimonialSchema).optional().describe('Lokale testimonials'),
  caseStudies: z.array(LocalCaseStudySchema).optional().describe('Lokale case studies'),
  projectCount: z.number().min(0).optional().describe('Aantal projecten in stad'),
  
  // Market insights
  marketInsights: LocalMarketInsightsSchema.optional().describe('Lokale marktinzichten'),
  
  // Availability
  isAvailable: z.boolean().default(true).describe('Beschikbaar in deze stad'),
  waitingList: z.boolean().default(false).optional().describe('Wachtlijst actief'),
  estimatedWaitTime: z.string().optional().describe('Geschatte wachttijd'),
  
  // Local keywords (in addition to base keywords)
  additionalKeywords: z.array(z.string()).optional().describe('Extra lokale zoekwoorden'),
  
  // Content generation hints
  localAngle: z.string().optional().describe('Lokale invalshoek voor content'),
  citySpecificChallenges: z.array(z.string()).optional().describe('Stad-specifieke uitdagingen'),
  localCompetitors: z.array(z.string()).optional().describe('Lokale concurrenten'),
  
  // Display priority
  priority: z.number().min(0).max(100).default(50).describe('Display prioriteit (hoger = belangrijker)'),
  featured: z.boolean().default(false).describe('Featured in deze stad'),
  
  // Metadata
  createdAt: z.date().default(() => new Date()).describe('Aanmaakdatum'),
  updatedAt: z.date().default(() => new Date()).describe('Laatste wijziging'),
});

/**
 * TypeScript type derived from schema
 */
export type CityService = z.infer<typeof CityServiceSchema>;

/**
 * Local testimonial type
 */
export type LocalTestimonial = z.infer<typeof LocalTestimonialSchema>;

/**
 * Local case study type
 */
export type LocalCaseStudy = z.infer<typeof LocalCaseStudySchema>;

/**
 * Local market insights type
 */
export type LocalMarketInsights = z.infer<typeof LocalMarketInsightsSchema>;

/**
 * Partial CityService schema for updates
 */
export const CityServiceUpdateSchema = CityServiceSchema.partial().required({ id: true });
export type CityServiceUpdate = z.infer<typeof CityServiceUpdateSchema>;

/**
 * CityService creation schema (without auto-generated fields)
 */
export const CityServiceCreateSchema = CityServiceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CityServiceCreate = z.infer<typeof CityServiceCreateSchema>;
