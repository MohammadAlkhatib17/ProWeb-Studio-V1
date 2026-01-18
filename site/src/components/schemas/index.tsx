/**
 * SEOSchema - Modular Schema Composer
 * 
 * This component composes all schema modules into structured data scripts.
 * Refactored from monolithic 3017-line file into modular architecture.
 * 
 * @module components/schemas
 */

import Script from 'next/script';

// Core schemas
import {
    generateLogoSchema,
    generateWebsiteSchema,
    generateOrganizationSchema,
    generateLocalBusinessSchema,
    generateWebPageSchema,
} from './core';

// Dutch market schemas
import {
    generateKVKSchema,
    generateComplianceSchema,
    generateProfessionalAccreditationSchema,
    generateBusinessClassificationSchema,
    generateIndustryComplianceSchema,
    generateGoogleBusinessProfileSchema,
} from './dutch';

// Service schemas
import {
    generateWebsiteServiceSchema,
    generateWebshopServiceSchema,
    generateSEOServiceSchema,
    generate3DServiceSchema,
} from './services';

// Breadcrumb schemas
import { generateBreadcrumbs, generateBreadcrumbSchema } from './breadcrumbs';

// Content schemas
import {
    generateFAQSchema, generateHowToSchema
} from './content';

// Utilities
import { SEOSchemaProps, abs, getPagePath, getPageTitle } from './utils';

/**
 * SEOSchema Component
 * Renders all structured data as JSON-LD scripts
 */
export default function SEOSchema({
    pageType = 'generic',
    pageTitle,
    pageDescription,
    breadcrumbs = [],
    includeFAQ = false,
    nonce,
}: SEOSchemaProps) {
    // Derive current page info
    const currentPath = getPagePath(pageType);
    const currentUrl = abs(currentPath);
    const currentTitle = getPageTitle(pageType, pageTitle);
    const shouldIncludeFAQ = includeFAQ || pageType === 'services' || pageType === 'homepage';

    // Generate breadcrumbs if not provided
    const resolvedBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : generateBreadcrumbs(pageType);

    // Generate all schemas
    const schemas = {
        website: generateWebsiteSchema(),
        organization: generateOrganizationSchema(),
        localBusiness: generateLocalBusinessSchema(),
        webPage: generateWebPageSchema(pageType, currentUrl, currentTitle, pageDescription),
        logo: generateLogoSchema(),
        breadcrumb: generateBreadcrumbSchema(resolvedBreadcrumbs, currentUrl),
        // Services
        websiteService: generateWebsiteServiceSchema(),
        webshopService: generateWebshopServiceSchema(),
        seoService: generateSEOServiceSchema(),
        service3D: generate3DServiceSchema(),
        // Dutch market
        kvk: generateKVKSchema(),
        compliance: generateComplianceSchema(),
        professionalAccreditation: generateProfessionalAccreditationSchema(),
        businessClassification: generateBusinessClassificationSchema(),
        industryCompliance: generateIndustryComplianceSchema(),
        googleBusinessProfile: generateGoogleBusinessProfileSchema(),
        // Content (conditional)
        faq: shouldIncludeFAQ ? generateFAQSchema() : null,
        howToWebsite: generateHowToSchema('website'),
        howToSEO: generateHowToSchema('seo'),
    };

    // Render schema scripts
    const renderScript = (id: string, schema: object | null) => {
        if (!schema) return null;
        return (
            <Script
                key={id}
                id={id}
                type="application/ld+json"
                nonce={nonce}
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
        );
    };

    return (
        <>
            {renderScript('website-schema', schemas.website)}
            {renderScript('organization-schema', schemas.organization)}
            {renderScript('localbusiness-schema', schemas.localBusiness)}
            {renderScript('webpage-schema', schemas.webPage)}
            {renderScript('logo-schema', schemas.logo)}
            {renderScript('breadcrumb-schema', schemas.breadcrumb)}
            {renderScript('website-service-schema', schemas.websiteService)}
            {renderScript('webshop-service-schema', schemas.webshopService)}
            {renderScript('seo-service-schema', schemas.seoService)}
            {renderScript('3d-service-schema', schemas.service3D)}
            {renderScript('kvk-schema', schemas.kvk)}
            {renderScript('compliance-schema', schemas.compliance)}
            {renderScript('professional-accreditation-schema', schemas.professionalAccreditation)}
            {renderScript('business-classification-schema', schemas.businessClassification)}
            {renderScript('industry-compliance-schema', schemas.industryCompliance)}
            {renderScript('google-business-profile-schema', schemas.googleBusinessProfile)}
            {renderScript('faq-schema', schemas.faq)}
            {renderScript('howto-website-schema', schemas.howToWebsite)}
            {renderScript('howto-seo-schema', schemas.howToSEO)}
        </>
    );
}

// Re-export utilities and types for external use
export type { SEOSchemaProps } from './utils';
export { generateBreadcrumbs } from './breadcrumbs';
