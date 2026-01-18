/**
 * Breadcrumb Schema Generator
 */

import { abs } from './utils';

/**
 * Generate breadcrumbs based on pageType
 */
export function generateBreadcrumbs(pageType: string): Array<{ name: string; url: string; position: number }> {
    const home = { name: 'Home', url: abs('/'), position: 1 };

    const breadcrumbMap: Record<string, Array<{ name: string; url: string; position: number }>> = {
        homepage: [home],
        services: [home, { name: 'Diensten', url: abs('/diensten'), position: 2 }],
        werkwijze: [home, { name: 'Werkwijze', url: abs('/werkwijze'), position: 2 }],
        'over-ons': [home, { name: 'Over Ons', url: abs('/over-ons'), position: 2 }],
        contact: [home, { name: 'Contact', url: abs('/contact'), position: 2 }],
        privacy: [home, { name: 'Privacybeleid', url: abs('/privacy'), position: 2 }],
        voorwaarden: [home, { name: 'Algemene Voorwaarden', url: abs('/voorwaarden'), position: 2 }],
        portfolio: [home, { name: 'Portfolio', url: abs('/portfolio'), position: 2 }],
        engineering: [home, { name: 'Engineering', url: abs('/engineering'), position: 2 }],
        'website-laten-maken': [
            home,
            { name: 'Diensten', url: abs('/diensten'), position: 2 },
            { name: 'Website laten maken', url: abs('/diensten/website-laten-maken'), position: 3 },
        ],
        'webshop-laten-maken': [
            home,
            { name: 'Diensten', url: abs('/diensten'), position: 2 },
            { name: 'Webshop laten maken', url: abs('/diensten/webshop-laten-maken'), position: 3 },
        ],
        'seo-optimalisatie': [
            home,
            { name: 'Diensten', url: abs('/diensten'), position: 2 },
            { name: 'SEO optimalisatie', url: abs('/diensten/seo-optimalisatie'), position: 3 },
        ],
        '3d-website-ervaringen': [
            home,
            { name: 'Diensten', url: abs('/diensten'), position: 2 },
            { name: '3D Website Ervaringen', url: abs('/diensten/3d-website-ervaringen'), position: 3 },
        ],
    };

    return breadcrumbMap[pageType] || [home];
}

/**
 * Generate BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(
    breadcrumbs: Array<{ name: string; url: string; position?: number }>,
    currentUrl: string
) {
    if (!breadcrumbs || breadcrumbs.length === 0) return null;

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        '@id': `${currentUrl}#breadcrumb`,
        itemListElement: breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: crumb.position || index + 1,
            name: crumb.name,
            item: crumb.url,
        })),
    };
}
