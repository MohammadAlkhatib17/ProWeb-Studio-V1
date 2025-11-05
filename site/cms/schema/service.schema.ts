/**
 * Service Schema Definition
 * 
 * Defines the structure and validation for Service entities in the CMS.
 * Services represent the offerings provided by the business across different cities.
 * 
 * @module cms/schema/service.schema
 */

import { z } from 'zod';

/**
 * Pricing tier schema
 */
export const PricingTierSchema = z.object({
  name: z.string().min(2).max(50).describe('Naam van het pakket'),
  price: z.number().positive().describe('Prijs in EUR'),
  priceLabel: z.string().optional().describe('Prijslabel (bijv. "vanaf", "per maand")'),
  features: z.array(z.string()).min(1).describe('Inbegrepen features'),
  popular: z.boolean().default(false).describe('Populairste optie'),
  deliveryTime: z.string().describe('Levertijd'),
});

/**
 * FAQ item schema
 */
export const FAQItemSchema = z.object({
  question: z.string().min(10).max(200).describe('FAQ vraag'),
  answer: z.string().min(50).max(1000).describe('FAQ antwoord'),
});

/**
 * Process step schema
 */
export const ProcessStepSchema = z.object({
  step: z.number().positive().describe('Stap nummer'),
  title: z.string().min(5).max(100).describe('Stap titel'),
  description: z.string().min(20).max(300).describe('Stap beschrijving'),
  duration: z.string().optional().describe('Geschatte duur'),
});

/**
 * Main Service Schema
 * 
 * Represents a business service with all information needed for
 * content generation, pricing, and SEO optimization.
 */
export const ServiceSchema = z.object({
  id: z.string().uuid().describe('Unieke identificatie'),
  name: z.string().min(5).max(100).describe('Service naam'),
  slug: z.string().regex(/^[a-z0-9-]+$/).describe('URL-vriendelijke slug'),
  title: z.string().min(5).max(150).describe('Marketing titel'),
  
  // Descriptions
  shortDescription: z.string().min(50).max(200).describe('Korte beschrijving'),
  description: z.string().min(100).max(1000).describe('Uitgebreide beschrijving'),
  metaDescription: z.string().min(120).max(160).describe('Meta description voor SEO'),
  
  // Service details
  features: z.array(z.string()).min(3).max(20).describe('Belangrijkste features'),
  benefits: z.array(z.string()).min(3).max(15).describe('Voordelen voor klant'),
  useCases: z.array(z.string()).min(2).max(10).describe('Use cases / voorbeelden'),
  
  // Pricing
  pricingTiers: z.array(PricingTierSchema).min(1).max(5).describe('Prijsopties'),
  pricingModel: z.enum(['fixed', 'hourly', 'subscription', 'custom']).describe('Prijsmodel'),
  
  // Process
  processSteps: z.array(ProcessStepSchema).optional().describe('Proces stappen'),
  averageDeliveryTime: z.string().describe('Gemiddelde levertijd'),
  
  // Target audience
  targetAudience: z.array(z.string()).min(2).max(10).describe('Doelgroep'),
  targetIndustries: z.array(z.string()).optional().describe('Doelbranches'),
  
  // Technical details
  technologies: z.array(z.string()).optional().describe('Gebruikte technologieën'),
  requirements: z.array(z.string()).optional().describe('Vereisten van klant'),
  
  // Relations
  relatedServices: z.array(z.string()).describe('Gerelateerde diensten (slugs)'),
  requiredServices: z.array(z.string()).optional().describe('Vereiste basis diensten (slugs)'),
  
  // SEO
  keywords: z.array(z.string()).min(5).max(30).describe('SEO zoekwoorden'),
  
  // FAQs
  faqs: z.array(FAQItemSchema).optional().describe('Veelgestelde vragen'),
  
  // Content hints
  commonChallenges: z.array(z.string()).optional().describe('Veelvoorkomende uitdagingen'),
  successMetrics: z.array(z.string()).optional().describe('Succes metrics'),
  
  // Display
  icon: z.string().optional().describe('Icon emoji of naam'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().describe('Brand kleur (hex)'),
  featured: z.boolean().default(false).describe('Featured service'),
  
  // Metadata
  createdAt: z.date().default(() => new Date()).describe('Aanmaakdatum'),
  updatedAt: z.date().default(() => new Date()).describe('Laatste wijziging'),
  isActive: z.boolean().default(true).describe('Actieve status'),
});

/**
 * TypeScript type derived from schema
 */
export type Service = z.infer<typeof ServiceSchema>;

/**
 * Pricing tier type
 */
export type PricingTier = z.infer<typeof PricingTierSchema>;

/**
 * FAQ item type
 */
export type FAQItem = z.infer<typeof FAQItemSchema>;

/**
 * Process step type
 */
export type ProcessStep = z.infer<typeof ProcessStepSchema>;

/**
 * Partial service schema for updates
 */
export const ServiceUpdateSchema = ServiceSchema.partial().required({ id: true });
export type ServiceUpdate = z.infer<typeof ServiceUpdateSchema>;

/**
 * Service creation schema (without auto-generated fields)
 */
export const ServiceCreateSchema = ServiceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type ServiceCreate = z.infer<typeof ServiceCreateSchema>;
