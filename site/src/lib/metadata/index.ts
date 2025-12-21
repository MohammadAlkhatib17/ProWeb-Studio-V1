/**
 * Metadata utilities - Minimal module with only used exports
 */

import { siteConfig } from '@/config/site.config';

import type { Metadata } from 'next';

// Site URL export
export const SITE_URL = siteConfig.url;

// Dutch metadata defaults
export const dutchMetadataDefaults = {
    locale: 'nl_NL',
    language: 'nl-NL',
};

// Page-specific metadata configurations
const pageMetadata: Record<string, Metadata> = {
    home: {
        title: `${siteConfig.name} - ${siteConfig.tagline}`,
        description: siteConfig.description,
    },
    diensten: {
        title: 'Onze Diensten | ProWeb Studio',
        description: 'Ontdek onze professionele webdesign diensten: websites, webshops, SEO en meer.',
    },
    contact: {
        title: 'Contact | ProWeb Studio',
        description: 'Neem contact op voor een vrijblijvend gesprek over uw project.',
    },
};

/**
 * Generate page metadata
 */
export function generatePageMetadata(page: string): Metadata {
    return pageMetadata[page] || {
        title: siteConfig.name,
        description: siteConfig.description,
    };
}

/**
 * Generate metadata utility (alias for dienst pages)
 */
export function generateMetadata(options: {
    title: string;
    description: string;
    keywords?: string[];
    path?: string;
}): Metadata {
    return {
        title: options.title,
        description: options.description,
        keywords: options.keywords,
        openGraph: {
            title: options.title,
            description: options.description,
            locale: dutchMetadataDefaults.locale,
            url: options.path ? `${SITE_URL}${options.path}` : undefined,
        },
    };
}
