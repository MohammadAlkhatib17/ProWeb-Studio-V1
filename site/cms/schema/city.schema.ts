/**
 * City Schema Definition
 * 
 * Defines the structure and validation for City entities in the CMS.
 * Cities represent geographical locations where services are offered.
 * 
 * @module cms/schema/city.schema
 */

import { z } from 'zod';

/**
 * Coordinates schema for geographical positioning
 */
export const CoordinatesSchema = z.object({
  lat: z.number().min(-90).max(90).describe('Latitude'),
  lng: z.number().min(-180).max(180).describe('Longitude'),
});

/**
 * Local business hours schema
 */
export const BusinessHoursSchema = z.object({
  monday: z.string().optional().describe('Openingstijden maandag'),
  tuesday: z.string().optional().describe('Openingstijden dinsdag'),
  wednesday: z.string().optional().describe('Openingstijden woensdag'),
  thursday: z.string().optional().describe('Openingstijden donderdag'),
  friday: z.string().optional().describe('Openingstijden vrijdag'),
  saturday: z.string().optional().describe('Openingstijden zaterdag'),
  sunday: z.string().optional().describe('Openingstijden zondag'),
});

/**
 * Local statistics schema
 */
export const LocalStatsSchema = z.object({
  population: z.number().positive().describe('Bevolking'),
  businesses: z.number().positive().optional().describe('Aantal bedrijven'),
  avgIncome: z.number().positive().optional().describe('Gemiddeld inkomen in EUR'),
  internetPenetration: z.number().min(0).max(100).optional().describe('Internet penetratie percentage'),
});

/**
 * Main City Schema
 * 
 * Represents a Dutch city with all relevant information for content generation
 * and SEO optimization.
 */
export const CitySchema = z.object({
  id: z.string().uuid().describe('Unieke identificatie'),
  name: z.string().min(2).max(100).describe('Officiële stadsnaam'),
  slug: z.string().regex(/^[a-z0-9-]+$/).describe('URL-vriendelijke slug'),
  region: z.string().min(2).max(100).describe('Regio (bijv. Randstad, Brabant)'),
  province: z.string().min(2).max(100).describe('Provincie'),
  
  // Descriptions for SEO and content
  description: z.string().min(100).max(500).describe('Uitgebreide beschrijving'),
  shortDescription: z.string().min(50).max(200).describe('Korte beschrijving'),
  metaDescription: z.string().min(120).max(160).describe('Meta description voor SEO'),
  
  // Geographical data
  coordinates: CoordinatesSchema.optional().describe('GPS coördinaten'),
  postalCodes: z.array(z.string().regex(/^\d{4}[A-Z]{2}$/)).optional().describe('Postcodes'),
  
  // Local information
  stats: LocalStatsSchema.describe('Lokale statistieken'),
  neighborhoods: z.array(z.string()).optional().describe('Bekende wijken/buurten'),
  landmarks: z.array(z.string()).optional().describe('Bekende locaties/landmarks'),
  
  // Business data
  businessHours: BusinessHoursSchema.optional().describe('Lokale kantooruren'),
  localPhonePrefix: z.string().regex(/^0\d{2,3}$/).optional().describe('Lokaal netnummer'),
  
  // Relations
  relatedServices: z.array(z.string()).describe('Beschikbare diensten (slugs)'),
  nearbySteden: z.array(z.string()).describe('Nabijgelegen steden (slugs)'),
  
  // SEO
  keywords: z.array(z.string()).min(3).max(20).describe('SEO zoekwoorden'),
  featured: z.boolean().default(false).describe('Featured/populaire stad'),
  
  // Content generation hints
  localCharacteristics: z.array(z.string()).optional().describe('Lokale karakteristieken voor content'),
  targetIndustries: z.array(z.string()).optional().describe('Belangrijkste industrieën in de stad'),
  
  // Metadata
  createdAt: z.date().default(() => new Date()).describe('Aanmaakdatum'),
  updatedAt: z.date().default(() => new Date()).describe('Laatste wijziging'),
  isActive: z.boolean().default(true).describe('Actieve status'),
});

/**
 * TypeScript type derived from schema
 */
export type City = z.infer<typeof CitySchema>;

/**
 * Partial city schema for updates
 */
export const CityUpdateSchema = CitySchema.partial().required({ id: true });
export type CityUpdate = z.infer<typeof CityUpdateSchema>;

/**
 * City creation schema (without auto-generated fields)
 */
export const CityCreateSchema = CitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CityCreate = z.infer<typeof CityCreateSchema>;
