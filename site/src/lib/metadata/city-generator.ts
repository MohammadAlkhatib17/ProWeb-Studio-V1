import { Metadata } from 'next';

interface CityMetadataParams {
    city: string;
    service?: string;
    path: string;
}

const DEFAULT_SERVICE = "Website laten maken";

/**
 * Generates SEO-optimized metadata for city landing pages
 * targeting Dutch "local business" search intent.
 */
export function generateCityMetadata({ city, service = DEFAULT_SERVICE, path }: CityMetadataParams): Metadata {
    const title = `${service} ${city} | #1 Webdesign Bureau`;
    const description = `Wilt u een professionele ${service.toLowerCase()} in ${city}? ProWeb Studio levert razendsnelle 3D websites die scoren in Google. Vraag nu een gratis offerte aan!`;
    const canonicalUrl = `https://prowebstudio.nl${path}`;

    return {
        title: title,
        description: description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: title,
            description: description,
            url: canonicalUrl,
            locale: 'nl_NL',
            type: 'website',
            siteName: 'ProWeb Studio',
        },
        keywords: [
            `${service.toLowerCase()} ${city.toLowerCase()}`,
            `webdesign ${city.toLowerCase()}`,
            `internetbureau ${city.toLowerCase()}`,
            `website bouwen ${city.toLowerCase()}`,
            '3d website laten maken',
            'next.js specialist'
        ],
    };
}

export const CITIES_NL = [
    'Amsterdam', 'Rotterdam', 'Den Haag', 'Utrecht',
    'Eindhoven', 'Groningen', 'Tilburg', 'Almere',
    'Breda', 'Nijmegen', 'Apeldoorn', 'Haarlem',
    'Enschede', 'Arnhem', 'Amersfoort', 'Zaanstad',
    'Den Bosch', 'Zwolle', 'Zoetermeer', 'Leiden',
    'Maastricht', 'Dordrecht'
];
