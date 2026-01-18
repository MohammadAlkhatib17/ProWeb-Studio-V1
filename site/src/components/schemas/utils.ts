/**
 * SEO Schema Utilities
 * Shared helper functions for schema generation
 */

import { siteConfig } from '@/config/site.config';

// Build absolute URLs safely
export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    'https://prowebstudio.nl'
).replace(/\/+$/, '');

/**
 * Convert relative path to absolute URL
 */
export function abs(path: string): string {
    try {
        return new URL(path, SITE_URL).toString();
    } catch {
        return path.startsWith('http') ? path : `${SITE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    }
}

/**
 * Get social media profiles from config and environment
 */
export function getSocialProfiles(): string[] {
    const profiles = [
        siteConfig.social.linkedin,
        siteConfig.social.github,
        siteConfig.social.twitter,
        process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN,
        process.env.NEXT_PUBLIC_SOCIAL_GITHUB,
        process.env.NEXT_PUBLIC_SOCIAL_TWITTER,
        process.env.NEXT_PUBLIC_SOCIAL_BEHANCE,
        process.env.NEXT_PUBLIC_SOCIAL_DRIBBBLE,
        process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE,
        process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK,
        process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM,
    ];

    return [...new Set(profiles.filter((profile): profile is string => Boolean(profile)))];
}

/**
 * Get page path based on pageType
 */
export function getPagePath(pageType: string): string {
    const pathMap: Record<string, string> = {
        homepage: '/',
        services: '/diensten',
        werkwijze: '/werkwijze',
        'over-ons': '/over-ons',
        contact: '/contact',
        privacy: '/privacy',
        voorwaarden: '/voorwaarden',
    };
    return pathMap[pageType] || '/';
}

/**
 * Get page title based on pageType
 */
export function getPageTitle(pageType: string, customTitle?: string): string {
    if (customTitle) return customTitle;

    const titleMap: Record<string, string> = {
        homepage: `${siteConfig.name} - ${siteConfig.tagline}`,
        services: 'Diensten - Webdesign, 3D websites & SEO',
        werkwijze: 'Werkwijze - Van intake tot launch',
        'over-ons': 'Over ons - ProWeb Studio team',
        contact: 'Contact - Neem contact op met ProWeb Studio',
        privacy: 'Privacy - Privacybeleid ProWeb Studio',
        voorwaarden: 'Voorwaarden - Algemene voorwaarden ProWeb Studio',
    };
    return titleMap[pageType] || `${siteConfig.name} - ${siteConfig.tagline}`;
}

/**
 * Schema Props Interface
 */
export interface SEOSchemaProps {
    pageType?: 'homepage' | 'services' | 'werkwijze' | 'contact' | 'over-ons' | 'privacy' | 'voorwaarden' | 'generic' | 'local';
    pageTitle?: string;
    pageDescription?: string;
    cityName?: string;
    breadcrumbs?: Array<{ name: string; url: string; position?: number }>;
    includeFAQ?: boolean;
    nonce?: string;
}
