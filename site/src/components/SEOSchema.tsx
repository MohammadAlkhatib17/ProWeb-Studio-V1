/**
 * SEOSchema Component
 * 
 * REFACTORED: This file now re-exports from the modular schemas directory.
 * The original 3017-line monolith has been decomposed into:
 * 
 * - schemas/utils.ts      - Shared utilities and types
 * - schemas/core.ts       - Website, Organization, LocalBusiness schemas
 * - schemas/dutch.ts      - KVK, SBI, compliance schemas for Dutch market
 * - schemas/services.ts   - Service-specific schemas
 * - schemas/breadcrumbs.ts - Breadcrumb generation
 * - schemas/content.ts    - FAQ, HowTo, Article schemas
 * - schemas/index.tsx     - Main composer component
 * 
 * @see /components/schemas/index.tsx for the main implementation
 */

export { default } from './schemas';
export type { SEOSchemaProps } from './schemas';
export { generateBreadcrumbs } from './schemas';
