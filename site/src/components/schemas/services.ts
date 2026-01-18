/**
 * Service Schemas
 * Website, Webshop, SEO, 3D services structured data
 */

import { SITE_URL, abs } from './utils';

/**
 * Website Development Service Schema
 */
export function generateWebsiteServiceSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${SITE_URL}#website-service`,
        name: 'Website Laten Maken',
        alternateName: ['Website Ontwikkeling', 'Webdesign'],
        description: 'Professionele website ontwikkeling met Next.js, React en moderne technologieën',
        provider: { '@id': `${SITE_URL}#organization` },
        url: abs('/diensten/website-laten-maken'),
        areaServed: {
            '@type': 'Country',
            name: 'Netherlands',
            identifier: 'NL',
        },
        serviceType: 'Web Development',
        category: 'IT Services',
        offers: {
            '@type': 'Offer',
            priceSpecification: {
                '@type': 'PriceSpecification',
                priceCurrency: 'EUR',
                minPrice: 2500,
                maxPrice: 25000,
            },
            availability: 'https://schema.org/InStock',
        },
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Website Ontwikkeling Pakketten',
            itemListElement: [
                {
                    '@type': 'Offer',
                    name: 'Starter Website',
                    description: 'Professionele website voor starters en ZZP',
                },
                {
                    '@type': 'Offer',
                    name: 'Business Website',
                    description: 'Uitgebreide website voor MKB',
                },
                {
                    '@type': 'Offer',
                    name: 'Enterprise Website',
                    description: 'Maatwerk oplossing voor grote organisaties',
                },
            ],
        },
    };
}

/**
 * Webshop Service Schema
 */
export function generateWebshopServiceSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${SITE_URL}#webshop-service`,
        name: 'Webshop Laten Maken',
        alternateName: ['E-commerce Ontwikkeling', 'Online Winkel'],
        description: 'Professionele webshop ontwikkeling met iDEAL, Mollie en Nederlandse betaalmethoden',
        provider: { '@id': `${SITE_URL}#organization` },
        url: abs('/diensten/webshop-laten-maken'),
        areaServed: {
            '@type': 'Country',
            name: 'Netherlands',
            identifier: 'NL',
        },
        serviceType: 'E-commerce Development',
        category: 'IT Services',
        offers: {
            '@type': 'Offer',
            priceSpecification: {
                '@type': 'PriceSpecification',
                priceCurrency: 'EUR',
                minPrice: 5000,
                maxPrice: 50000,
            },
        },
    };
}

/**
 * SEO Service Schema
 */
export function generateSEOServiceSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${SITE_URL}#seo-service`,
        name: 'SEO Optimalisatie',
        alternateName: ['Zoekmachine Optimalisatie', 'Search Engine Optimization'],
        description: 'Technische SEO, Core Web Vitals optimalisatie en lokale SEO voor Nederlandse markt',
        provider: { '@id': `${SITE_URL}#organization` },
        url: abs('/diensten/seo-optimalisatie'),
        areaServed: {
            '@type': 'Country',
            name: 'Netherlands',
            identifier: 'NL',
        },
        serviceType: 'SEO Services',
        category: 'Digital Marketing',
    };
}

/**
 * 3D Website Service Schema
 */
export function generate3DServiceSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${SITE_URL}#3d-service`,
        name: '3D Website Ervaringen',
        alternateName: ['WebGL Development', 'Three.js Websites'],
        description: 'Interactieve 3D web experiences met Three.js, React Three Fiber en WebGL',
        provider: { '@id': `${SITE_URL}#organization` },
        url: abs('/diensten/3d-website-ervaringen'),
        areaServed: {
            '@type': 'Country',
            name: 'Netherlands',
            identifier: 'NL',
        },
        serviceType: '3D Web Development',
        category: 'Interactive Media',
    };
}
