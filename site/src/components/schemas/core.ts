/**
 * Core Schemas - Website, Organization, LocalBusiness
 */

import { siteConfig } from '@/config/site.config';
import { SITE_URL, abs, getSocialProfiles } from './utils';

/**
 * Logo ImageObject Schema
 */
export function generateLogoSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'ImageObject',
        '@id': `${SITE_URL}#logo`,
        url: abs('/assets/logo/logo-proweb-lockup.svg'),
        contentUrl: abs('/assets/logo/logo-proweb-lockup.svg'),
        caption: `${siteConfig.name} logo`,
        description: `${siteConfig.name} - Digitale innovatie met kosmische impact`,
        name: `${siteConfig.name} logo`,
    };
}

/**
 * WebSite Schema
 */
export function generateWebsiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}#website`,
        name: siteConfig.name,
        alternateName: [
            'ProWeb Studio Nederland',
            'ProwWeb Studio',
            'ProWeb',
        ],
        description: siteConfig.description,
        url: abs('/'),
        inLanguage: 'nl-NL',
        publisher: { '@id': `${SITE_URL}#organization` },
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${SITE_URL}/zoeken?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
        sameAs: getSocialProfiles(),
    };
}

/**
 * Organization Schema
 */
export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${SITE_URL}#organization`,
        name: siteConfig.name,
        alternateName: 'ProWeb Studio',
        url: abs('/'),
        email: siteConfig.email,
        ...(siteConfig.phone && { telephone: siteConfig.phone }),
        description: siteConfig.description,
        slogan: siteConfig.tagline,
        foundingDate: '2024',
        logo: { '@id': `${SITE_URL}#logo` },
        sameAs: getSocialProfiles(),
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'NL',
            addressLocality: 'Netherlands',
            addressRegion: 'NL',
        },
        areaServed: {
            '@type': 'Country',
            name: 'Netherlands',
            identifier: 'NL',
        },
        contactPoint: [
            {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                email: siteConfig.email,
                ...(siteConfig.phone && { telephone: siteConfig.phone }),
                url: abs('/contact'),
                availableLanguage: ['nl', 'en'],
                areaServed: 'NL',
            },
        ],
        knowsAbout: [
            'Website Development',
            'Webdesign Nederland',
            '3D Websites',
            'E-commerce',
            'SEO Optimization',
            'Next.js Development',
            'React Development',
            'Three.js',
            'WebGL',
        ],
        ...(siteConfig.company?.kvk && {
            taxID: siteConfig.company.btw,
            vatID: siteConfig.company.btw,
            identifier: {
                '@type': 'PropertyValue',
                name: 'KVK-nummer',
                value: siteConfig.company.kvk,
            },
        }),
    };
}

/**
 * LocalBusiness Schema - Enhanced for Dutch market
 */
export function generateLocalBusinessSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': ['LocalBusiness', 'ProfessionalService'],
        '@id': `${SITE_URL}#localbusiness`,
        name: siteConfig.name,
        alternateName: 'ProWeb Studio Nederland',
        description: siteConfig.description,
        url: abs('/'),
        email: siteConfig.email,
        ...(siteConfig.phone && { telephone: siteConfig.phone }),
        logo: { '@id': `${SITE_URL}#logo` },
        image: abs('/assets/hero/nebula_helix.webp'),
        priceRange: '€€€',
        currenciesAccepted: 'EUR',
        paymentAccepted: ['iDEAL', 'Bank Transfer', 'Credit Card', 'PayPal'],
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'NL',
            addressLocality: 'Nederland',
        },
        areaServed: {
            '@type': 'Country',
            name: 'Netherlands',
            identifier: 'NL',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 52.3676,
            longitude: 4.9041,
        },
        sameAs: getSocialProfiles(),
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'ProWeb Studio Diensten',
            itemListElement: [
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Website Laten Maken',
                        description: 'Professionele website ontwikkeling',
                    },
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Webshop Ontwikkeling',
                        description: 'E-commerce website ontwikkeling',
                    },
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: '3D Website Ervaringen',
                        description: 'Interactive 3D web experiences',
                    },
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'SEO Optimalisatie',
                        description: 'Zoekmachine optimalisatie diensten',
                    },
                },
            ],
        },
    };
}

/**
 * WebPage Schema
 */
export function generateWebPageSchema(
    pageType: string,
    currentUrl: string,
    currentTitle: string,
    pageDescription?: string
) {
    return {
        '@context': 'https://schema.org',
        '@type': pageType === 'contact' ? 'ContactPage' : 'WebPage',
        '@id': `${currentUrl}#webpage`,
        url: currentUrl,
        name: currentTitle,
        description: pageDescription || siteConfig.description,
        inLanguage: 'nl-NL',
        isPartOf: { '@id': `${SITE_URL}#website` },
        about: { '@id': `${SITE_URL}#organization` },
        primaryImageOfPage: pageType === 'homepage' ? { '@id': `${currentUrl}#primaryimage` } : undefined,
        datePublished: '2024-01-01',
        dateModified: new Date().toISOString(),
        breadcrumb: { '@id': `${currentUrl}#breadcrumb` },
    };
}
