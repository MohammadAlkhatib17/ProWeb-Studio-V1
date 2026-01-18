/**
 * Dutch Market Schemas
 * KVK, SBI codes, compliance, and Netherlands-specific structured data
 */

import { siteConfig } from '@/config/site.config';
import { SITE_URL } from './utils';

/**
 * Dutch Chamber of Commerce (KVK) Schema
 */
export function generateKVKSchema(kvkNumber?: string): Record<string, unknown> | null {
    const kvk = kvkNumber || siteConfig.company?.kvk;
    if (!kvk) return null;

    return {
        '@context': 'https://schema.org',
        '@type': 'GovernmentOrganization',
        '@id': `https://www.kvk.nl/orderstraat/product-kiezen/?kvknummer=${kvk}#kvk`,
        name: 'Kamer van Koophandel',
        alternateName: 'KVK',
        description: 'Nederlandse Kamer van Koophandel bedrijfsregistratie',
        url: `https://www.kvk.nl/orderstraat/product-kiezen/?kvknummer=${kvk}`,
        areaServed: {
            '@type': 'Country',
            name: 'Netherlands',
            identifier: 'NL',
        },
        identifier: {
            '@type': 'PropertyValue',
            name: 'KVK-nummer',
            value: kvk,
        },
    };
}

/**
 * Dutch Compliance Certifications Schema
 */
export function generateComplianceSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Certification',
        '@id': `${SITE_URL}#dutch-compliance`,
        name: 'Nederlandse compliance certificering',
        description: 'Certificering voor Nederlandse wetgeving en standaarden',
        certificationIdentification: [
            {
                '@type': 'DefinedTerm',
                name: 'AVG/GDPR Compliance',
                description: 'Algemene Verordening Gegevensbescherming compliance',
                inDefinedTermSet: 'https://autoriteitpersoonsgegevens.nl/',
            },
            {
                '@type': 'DefinedTerm',
                name: 'Nederlandse Toegankelijkheidsstandaard',
                description: 'EN 301 549 / WCAG 2.1 AA compliance',
                inDefinedTermSet: 'https://www.digitaleoverheid.nl/',
            },
        ],
        issuedBy: { '@id': `${SITE_URL}#organization` },
        validIn: {
            '@type': 'Country',
            name: 'Netherlands',
            identifier: 'NL',
        },
    };
}

/**
 * Professional Accreditation Schema
 */
export function generateProfessionalAccreditationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        '@id': `${SITE_URL}#professional-accreditation`,
        name: 'Nederlandse IT Professional Services',
        description: 'Professionele IT-dienstverlening conform Nederlandse standaarden',
        serviceType: 'Professional Web Development Services',
        provider: { '@id': `${SITE_URL}#organization` },
        areaServed: {
            '@type': 'Country',
            name: 'Netherlands',
            identifier: 'NL',
        },
    };
}

/**
 * SBI Business Classification Schema
 */
export function generateBusinessClassificationSchema(sbiCode: string = '62010') {
    return {
        '@context': 'https://schema.org',
        '@type': 'CategoryCode',
        '@id': `${SITE_URL}#business-classification`,
        name: 'Nederlandse Bedrijfsclassificatie',
        description: 'Standaard Bedrijfsindeling (SBI)',
        codeValue: sbiCode,
        inCodeSet: {
            '@type': 'CategoryCodeSet',
            name: 'Standaard Bedrijfsindeling (SBI) 2008',
            identifier: 'SBI2008',
            url: 'https://www.cbs.nl/nl-nl/onze-diensten/methoden/classificaties/activiteiten/standaard-bedrijfsindeling--sbi--',
        },
        about: { '@id': `${SITE_URL}#organization` },
    };
}

/**
 * Dutch Industry Compliance Schema
 */
export function generateIndustryComplianceSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Certification',
        '@id': `${SITE_URL}#industry-compliance`,
        name: 'Nederlandse IT Branche Compliance',
        description: 'Compliance met Nederlandse IT branche standaarden',
        certificationIdentification: [
            {
                '@type': 'DefinedTerm',
                name: 'KVK Handelsregistratie',
                description: 'Officiële bedrijfsregistratie bij Nederlandse Kamer van Koophandel',
                inDefinedTermSet: 'https://www.kvk.nl/',
            },
            {
                '@type': 'DefinedTerm',
                name: 'BTW-plichtig Nederland',
                description: 'Geregistreerd voor Nederlandse BTW administratie',
                inDefinedTermSet: 'https://www.belastingdienst.nl/',
            },
        ],
        recognizedBy: [
            {
                '@type': 'GovernmentOrganization',
                name: 'Nederlandse Belastingdienst',
                url: 'https://www.belastingdienst.nl/',
            },
            {
                '@type': 'GovernmentOrganization',
                name: 'Kamer van Koophandel Nederland',
                url: 'https://www.kvk.nl/',
            },
        ],
    };
}

/**
 * Dutch Service Areas Schema (Provinces and Cities)
 */
export function generateDutchServiceAreas() {
    return [
        {
            '@type': 'State',
            name: 'Noord-Holland',
            identifier: 'NH',
            addressCountry: 'NL',
            containsPlace: [
                { '@type': 'City', name: 'Amsterdam' },
                { '@type': 'City', name: 'Haarlem' },
                { '@type': 'City', name: 'Zaanstad' },
                { '@type': 'City', name: 'Alkmaar' },
            ],
        },
        {
            '@type': 'State',
            name: 'Zuid-Holland',
            identifier: 'ZH',
            addressCountry: 'NL',
            containsPlace: [
                { '@type': 'City', name: 'Rotterdam' },
                { '@type': 'City', name: 'Den Haag' },
                { '@type': 'City', name: 'Leiden' },
                { '@type': 'City', name: 'Delft' },
            ],
        },
        {
            '@type': 'State',
            name: 'Utrecht',
            identifier: 'UT',
            addressCountry: 'NL',
            containsPlace: [
                { '@type': 'City', name: 'Utrecht' },
                { '@type': 'City', name: 'Amersfoort' },
            ],
        },
        {
            '@type': 'State',
            name: 'Noord-Brabant',
            identifier: 'NB',
            addressCountry: 'NL',
            containsPlace: [
                { '@type': 'City', name: 'Eindhoven' },
                { '@type': 'City', name: 'Tilburg' },
                { '@type': 'City', name: 'Breda' },
            ],
        },
    ];
}

/**
 * Google Business Profile Schema (if configured)
 */
export function generateGoogleBusinessProfileSchema(): Record<string, unknown> | null {
    const gmb_place_id = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;
    const gmb_url = process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL;

    if (!gmb_place_id && !gmb_url) return null;

    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}#google-business-profile`,
        name: `${siteConfig.name} - Google Mijn Bedrijf`,
        ...(gmb_url && { url: gmb_url }),
        ...(gmb_place_id && {
            identifier: {
                '@type': 'PropertyValue',
                name: 'Google Place ID',
                value: gmb_place_id,
            },
        }),
    };
}
