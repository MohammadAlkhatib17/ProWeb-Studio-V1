/**
 * Content Schemas
 * FAQ, HowTo, Article schemas
 */

import { siteConfig } from '@/config/site.config';
import { SITE_URL } from './utils';

/**
 * FAQ Schema for Dutch market
 */
export function generateFAQSchema() {
    const faqs = [
        {
            question: 'Hoeveel kost een professionele website laten maken?',
            answer: 'De kosten voor een professionele website variëren van €2.500 voor een starter website tot €25.000+ voor een enterprise maatwerk oplossing. Dit is afhankelijk van functionaliteiten, design complexiteit en integraties.',
        },
        {
            question: 'Hoe lang duurt het om een website te laten maken?',
            answer: 'Een gemiddelde website ontwikkeling duurt 4-8 weken, afhankelijk van de scope. Complexe webshops of 3D websites kunnen 8-12 weken duren.',
        },
        {
            question: 'Werken jullie met Nederlandse bedrijven?',
            answer: 'Ja, wij zijn een Nederlands webbureau geregistreerd bij de KVK. We werken uitsluitend met Nederlandse bedrijven en facturen inclusief Nederlandse BTW.',
        },
        {
            question: 'Welke betaalmethoden ondersteunen jullie webshops?',
            answer: 'Wij integreren alle populaire Nederlandse betaalmethoden: iDEAL, creditcard, PayPal, Apple Pay, en Bancontact via Mollie of Adyen.',
        },
        {
            question: 'Is mijn website AVG/GDPR compliant?',
            answer: 'Ja, alle websites worden gebouwd met privacy-by-design principes en voldoen aan de AVG/GDPR wetgeving. Inclusief cookie consent, privacy statement en verwerkersovereenkomst.',
        },
    ];

    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${SITE_URL}#faq`,
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}

/**
 * Dutch HowTo Guide Schema
 */
export function generateHowToSchema(
    guideType: 'website' | 'seo' | 'webshop' = 'website'
) {
    const guides = {
        website: {
            name: 'Stap-voor-stap gids: Website laten maken in Nederland',
            description: 'Complete handleiding voor professionele website ontwikkeling conform Nederlandse standaarden',
            steps: [
                { name: 'Plan uw website', description: 'Bepaal doelgroep, functionaliteiten en compliance vereisten.' },
                { name: 'Kies hosting en domein', description: 'Selecteer Nederlandse hosting en registreer .nl domein bij SIDN.' },
                { name: 'Implementeer AVG compliance', description: 'Zorg voor privacy statements en cookie consent.' },
                { name: 'Optimaliseer voor SEO', description: 'Gebruik Nederlandse zoektermen en lokale SEO.' },
            ],
        },
        seo: {
            name: 'SEO Optimalisatie voor Nederlandse websites',
            description: 'Gids voor zoekmachine optimalisatie specifiek voor de Nederlandse markt',
            steps: [
                { name: 'Keyword onderzoek', description: 'Analyseer Nederlandse zoektermen en zoekvolume.' },
                { name: 'Technische SEO', description: 'Optimaliseer Core Web Vitals en site structuur.' },
                { name: 'Content optimalisatie', description: 'Schrijf kwalitatieve Nederlandse content.' },
                { name: 'Lokale SEO', description: 'Optimaliseer voor Google Mijn Bedrijf.' },
            ],
        },
        webshop: {
            name: 'Webshop laten maken: Complete gids',
            description: 'Handleiding voor e-commerce ontwikkeling met Nederlandse betaalmethoden',
            steps: [
                { name: 'E-commerce platform kiezen', description: 'Selecteer geschikt platform voor uw producten.' },
                { name: 'Betaalmethoden integreren', description: 'Koppel iDEAL, Mollie en andere Nederlandse PSPs.' },
                { name: 'Juridische compliance', description: 'Voldoe aan consumentenrecht en retourbeleid.' },
                { name: 'Launch en marketing', description: 'Start verkoop met conversie-optimalisatie.' },
            ],
        },
    };

    const guide = guides[guideType];

    return {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        '@id': `${SITE_URL}#howto-${guideType}`,
        name: guide.name,
        description: guide.description,
        inLanguage: 'nl-NL',
        author: { '@id': `${SITE_URL}#organization` },
        step: guide.steps.map((step, index) => ({
            '@type': 'HowToStep',
            name: step.name,
            text: step.description,
            position: index + 1,
        })),
    };
}

/**
 * Article Schema for Dutch content
 */
export function generateArticleSchema(
    title: string,
    description: string,
    datePublished?: string
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `${SITE_URL}/kennisbank#article`,
        headline: title,
        description: description,
        inLanguage: 'nl-NL',
        author: {
            '@type': 'Organization',
            '@id': `${SITE_URL}#organization`,
            name: siteConfig.name,
        },
        publisher: { '@id': `${SITE_URL}#organization` },
        datePublished: datePublished || new Date().toISOString(),
        dateModified: new Date().toISOString(),
    };
}
