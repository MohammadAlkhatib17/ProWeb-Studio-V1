/**
 * Dutch Content Generators
 * 
 * Pure functions for generating unique Dutch content for city-service pages.
 * All content is localized for nl-NL and aims for ≥70% uniqueness per page.
 * 
 * @module lib/content/generators
 */

import type { City, Service, CityService } from '../../../cms/schema';
import { formatCurrency, formatNumber } from './dutch-format';

/**
 * Content variation templates for generating unique text
 */
const INTRO_TEMPLATES = [
  (city: string, service: string) => 
    `Zoekt u een professionele partner voor ${service.toLowerCase()} in ${city}? Onze ervaren specialisten begrijpen de lokale markt en weten precies wat ondernemers in ${city} nodig hebben om online succesvol te zijn.`,
  
  (city: string, service: string) => 
    `${service} in ${city} vraagt om lokale expertise en technische kennis. Wij combineren jarenlange ervaring met de nieuwste technieken om bedrijven in ${city} te helpen groeien in de digitale wereld.`,
  
  (city: string, service: string) => 
    `Als onderneming in ${city} wilt u een partner die begrijpt hoe de lokale markt werkt. Onze ${service.toLowerCase()}-diensten zijn specifiek afgestemd op de behoeften van bedrijven in ${city} en omstreken.`,
  
  (city: string, service: string) => 
    `De digitale wereld biedt kansen voor elke onderneming in ${city}. Met onze ${service.toLowerCase()}-oplossingen helpen wij lokale bedrijven om hun online aanwezigheid te versterken en meer klanten te bereiken.`,
  
  (city: string, service: string) => 
    `${city} is een dynamische stad met veel ondernemers die hun bedrijf online willen laten groeien. Onze ${service.toLowerCase()}-diensten zijn ontwikkeld om aan deze lokale vraag te voldoen met maatwerk en vakmanschap.`,
];

const WHY_LOCAL_TEMPLATES = [
  (city: string) => 
    `Werken met een lokale partner in ${city} betekent snelle communicatie, persoonlijk contact en begrip van de regionale markt. Wij kennen de uitdagingen en kansen die specifiek voor ${city} gelden.`,
  
  (city: string) => 
    `De kracht van lokale samenwerking zit in het begrip van de ${city}se ondernemersgeest. Wij spreken dezelfde taal, kennen de lokale concurrentie en weten wat werkt in deze regio.`,
  
  (city: string) => 
    `Als specialist in ${city} begrijpen wij de lokale economie, de doelgroep en de specifieke behoeften van bedrijven hier. Dit vertalen we naar oplossingen die echt resultaat opleveren.`,
  
  (city: string) => 
    `${city} heeft een unieke zakelijke cultuur. Door onze lokale aanwezigheid en ervaring kunnen wij inspelen op wat bedrijven hier echt nodig hebben om te slagen in de digitale wereld.`,
];

const PROCESS_INTRO_TEMPLATES = [
  (service: string) => 
    `Ons ${service.toLowerCase()}-proces is transparant en efficiënt ingericht. Van eerste kennismaking tot oplevering werken wij volgens een bewezen aanpak die resultaat garandeert.`,
  
  (service: string) => 
    `Wij hanteren een gestructureerde werkwijze voor ${service.toLowerCase()} die zorgt voor duidelijkheid en kwaliteit. Elk project doorloopt zorgvuldig geplande fases.`,
  
  (service: string) => 
    `Onze methodiek voor ${service.toLowerCase()} combineert creativiteit met technische precisie. Stap voor stap werken wij toe naar een oplossing die perfect bij uw bedrijf past.`,
];

const BENEFITS_INTRO_TEMPLATES = [
  () => 
    `Kiezen voor onze diensten betekent kiezen voor kwaliteit, betrouwbaarheid en resultaat. Wij onderscheiden ons door:`,
  
  () => 
    `Wat maakt samenwerken met ons waardevol? Deze voordelen ervaren onze klanten:`,
  
  () => 
    `Uw succes is ons doel. Daarom bieden wij:`,
];

const CTA_TEMPLATES = [
  (city: string, service: string) => 
    `Klaar om te starten met ${service.toLowerCase()} in ${city}? Neem vandaag nog contact op voor een vrijblijvend gesprek over uw wensen en mogelijkheden.`,
  
  (city: string) => 
    `Benieuwd wat wij voor uw bedrijf in ${city} kunnen betekenen? Vraag een offerte aan of plan een kennismaking om de mogelijkheden te bespreken.`,
  
  (city: string, service: string) => 
    `Laten we samen kijken hoe ${service.toLowerCase()} uw bedrijf in ${city} verder kan helpen. Contact opnemen is de eerste stap naar online succes.`,
];

/**
 * Generate a unique hash from a string (simple implementation)
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Select a template variant based on city and service slugs (deterministic)
 */
function selectTemplate<T>(templates: T[], citySlug: string, serviceSlug: string): T {
  const hash = hashString(`${citySlug}-${serviceSlug}`);
  return templates[hash % templates.length];
}

/**
 * Generate introductory paragraph for city-service page
 */
export function generateIntroduction(
  city: City,
  service: Service,
  cityService?: CityService
): string {
  const template = selectTemplate(INTRO_TEMPLATES, city.slug, service.slug);
  let intro = template(city.name, service.name);
  
  // Add local context if available
  if (cityService?.descriptionOverride) {
    intro += ` ${cityService.descriptionOverride}`;
  } else {
    // Add generic local context
    const population = city.stats?.population;
    const businesses = city.stats?.businesses;
    
    if (population && businesses) {
      intro += ` Met ${formatNumber(population)} inwoners en meer dan ${formatNumber(businesses)} bedrijven is ${city.name} een belangrijke economische regio waar online zichtbaarheid essentieel is.`;
    }
  }
  
  return intro;
}

/**
 * Generate "Why choose local" section
 */
export function generateWhyLocal(
  city: City,
  service: Service,
  cityService?: CityService
): string {
  const template = selectTemplate(WHY_LOCAL_TEMPLATES, city.slug, service.slug);
  let content = `## Waarom kiezen voor ${service.name} in ${city.name}?\n\n`;
  content += template(city.name);
  
  // Add specific local benefits if available
  if (cityService?.localBenefits && cityService.localBenefits.length > 0) {
    content += '\n\n**Lokale voordelen:**\n\n';
    cityService.localBenefits.forEach(benefit => {
      content += `- ${benefit}\n`;
    });
  }
  
  // Add city characteristics
  if (city.localCharacteristics && city.localCharacteristics.length > 0) {
    const chars = city.localCharacteristics.slice(0, 3);
    content += `\n\n${city.name} kenmerkt zich door ${chars.join(', ').toLowerCase()}. `;
    content += `Deze lokale kenmerken nemen wij mee in onze aanpak om oplossingen te creëren die perfect aansluiten bij de ${city.name}se markt.`;
  }
  
  return content;
}

/**
 * Generate service process section
 */
export function generateProcessSection(
  service: Service
): string {
  const template = selectTemplate(PROCESS_INTRO_TEMPLATES, 'process', service.slug);
  let content = `## Ons werkproces\n\n`;
  content += template(service.name);
  content += '\n\n';
  
  // Add process steps
  if (service.processSteps && service.processSteps.length > 0) {
    service.processSteps.forEach((step, index) => {
      content += `### ${index + 1}. ${step.title}\n\n`;
      content += `${step.description}\n\n`;
      if (step.duration) {
        content += `**Doorlooptijd:** ${step.duration}\n\n`;
      }
    });
  }
  
  return content;
}

/**
 * Generate pricing section with local context
 */
export function generatePricingSection(
  city: City,
  service: Service,
  cityService?: CityService
): string {
  let content = `## Wat kost ${service.name} in ${city.name}?\n\n`;
  
  // Add local pricing context if available
  if (cityService?.marketInsights?.averageProjectValue) {
    const avgValue = cityService.marketInsights.averageProjectValue;
    content += `In ${city.name} ligt de gemiddelde investering voor ${service.name.toLowerCase()} rond ${formatCurrency(avgValue)}. `;
    content += `De uiteindelijke investering hangt af van uw specifieke wensen, functionaliteiten en de complexiteit van het project.\n\n`;
  }
  
  // Add pricing tiers
  if (service.pricingTiers && service.pricingTiers.length > 0) {
    content += '### Onze pakketten\n\n';
    
    service.pricingTiers.forEach(tier => {
      content += `**${tier.name}** - ${formatCurrency(tier.price)}\n\n`;
      content += `${tier.priceLabel || 'Vast tarief'} - Oplevering binnen ${tier.deliveryTime}\n\n`;
      if (tier.features && tier.features.length > 0) {
        content += '**Inclusief:**\n';
        tier.features.forEach(feature => {
          content += `- ${feature}\n`;
        });
        content += '\n';
      }
    });
  }
  
  // Add value proposition
  content += `\n**Transparante prijzen zonder verrassingen**. Wij werken met vaste offertes zodat u precies weet waar u aan toe bent. `;
  content += `Alle kosten worden vooraf helder gecommuniceerd en er zijn geen verborgen tarieven.\n`;
  
  return content;
}

/**
 * Generate benefits section
 */
export function generateBenefitsSection(
  service: Service
): string {
  const template = selectTemplate(BENEFITS_INTRO_TEMPLATES, 'benefits', service.slug);
  let content = `## Voordelen van onze aanpak\n\n`;
  content += template();
  content += '\n\n';
  
  if (service.benefits && service.benefits.length > 0) {
    service.benefits.forEach(benefit => {
      content += `- **${benefit}**\n`;
    });
  }
  
  return content;
}

/**
 * Generate local examples section
 */
export function generateLocalExamples(
  city: City,
  service: Service,
  cityService?: CityService
): string {
  let content = `## ${service.name} voorbeelden in ${city.name}\n\n`;
  
  // Add local case studies if available
  if (cityService?.caseStudies && cityService.caseStudies.length > 0) {
    cityService.caseStudies.forEach((caseStudy, index) => {
      content += `### Project ${index + 1}: ${caseStudy.title}\n\n`;
      content += `**Klant:** ${caseStudy.client}\n\n`;
      content += `**Branche:** ${caseStudy.industry}\n\n`;
      content += `**Uitdaging:** ${caseStudy.challenge}\n\n`;
      content += `**Oplossing:** ${caseStudy.solution}\n\n`;
      
      if (caseStudy.results && caseStudy.results.length > 0) {
        content += '**Resultaten:**\n';
        caseStudy.results.forEach((result: string) => {
          content += `- ${result}\n`;
        });
        content += '\n';
      }
    });
  } else {
    // Generic examples based on city characteristics
    content += `In ${city.name} hebben wij diverse projecten gerealiseerd voor verschillende branches. `;
    content += `Van lokale detailhandel tot professionele dienstverlening, elk bedrijf heeft unieke wensen en uitdagingen.\n\n`;
    
    if (cityService?.projectCount) {
      content += `Tot nu toe hebben wij ${cityService.projectCount} succesvolle ${service.name.toLowerCase()}-projecten afgerond in ${city.name}. `;
      content += `Deze ervaring stelt ons in staat om snel en effectief te werken, met oog voor lokale specificaties.\n`;
    }
  }
  
  return content;
}

/**
 * Generate FAQ section with local context
 */
export function generateLocalFAQs(
  city: City,
  service: Service,
  cityService?: CityService
): string {
  let content = `## Veelgestelde vragen over ${service.name} in ${city.name}\n\n`;
  
  // Use local FAQs if available
  const faqs = cityService?.localFaqs || service.faqs || [];
  
  if (faqs.length > 0) {
    faqs.forEach((faq: { question: string; answer: string }, index: number) => {
      content += `### ${index + 1}. ${faq.question}\n\n`;
      content += `${faq.answer}\n\n`;
    });
  }
  
  // Add generic local FAQ
  content += `### Werken jullie alleen in ${city.name}?\n\n`;
  content += `Hoewel wij gespecialiseerd zijn in ${city.name} en omstreken, kunnen wij ook bedrijven in de hele regio van dienst zijn. `;
  content += `Dankzij onze lokale kennis van ${city.name} begrijpen wij de markt goed, maar onze expertise reikt verder.\n\n`;
  
  return content;
}

/**
 * Generate testimonials section
 */
export function generateTestimonialsSection(
  city: City,
  cityService?: CityService
): string {
  if (!cityService?.testimonials || cityService.testimonials.length === 0) {
    return '';
  }
  
  let content = `## Wat klanten in ${city.name} zeggen\n\n`;
  
  cityService.testimonials.forEach((testimonial: {
    text: string;
    author: string;
    company?: string;
    location?: string;
    rating: number;
  }) => {
    content += `> "${testimonial.text}"\n>\n`;
    content += `> **${testimonial.author}**`;
    if (testimonial.company) {
      content += ` - ${testimonial.company}`;
    }
    if (testimonial.location) {
      content += `, ${testimonial.location}`;
    }
    content += '\n';
    if (testimonial.rating) {
      const stars = '⭐'.repeat(testimonial.rating);
      content += `> ${stars}\n`;
    }
    content += '\n';
  });
  
  return content;
}

/**
 * Generate market insights section
 */
export function generateMarketInsights(
  city: City,
  service: Service,
  cityService?: CityService
): string {
  if (!cityService?.marketInsights) {
    return '';
  }
  
  const insights = cityService.marketInsights;
  let content = `## De markt voor ${service.name} in ${city.name}\n\n`;
  
  // Competition level
  const competitionLevels: Record<'low' | 'medium' | 'high', string> = {
    low: 'relatief beperkte concurrentie',
    medium: 'gezonde concurrentie',
    high: 'hoge concurrentie',
  };
  
  content += `${city.name} kent ${competitionLevels[insights.competitionLevel]} op het gebied van ${service.name.toLowerCase()}. `;
  
  // Add market context
  if (insights.localTrends && insights.localTrends.length > 0) {
    content += `Belangrijke trends zijn: ${insights.localTrends.join(', ').toLowerCase()}. `;
  }
  
  content += `Dit betekent dat er volop kansen zijn voor bedrijven die investeren in hun online aanwezigheid.\n\n`;
  
  // Popular services
  if (insights.popularServices && insights.popularServices.length > 0) {
    content += `**Populaire diensten in ${city.name}:**\n\n`;
    insights.popularServices.forEach((svc: string) => {
      content += `- ${svc}\n`;
    });
    content += '\n';
  }
  
  return content;
}

/**
 * Generate call-to-action section
 */
export function generateCTA(
  city: City,
  service: Service
): string {
  const template = selectTemplate(CTA_TEMPLATES, city.slug, service.slug);
  let content = `## Start vandaag nog\n\n`;
  content += template(city.name, service.name);
  content += '\n\n';
  
  content += `**Contact opnemen kan via:**\n\n`;
  content += `- Telefoon of WhatsApp\n`;
  content += `- E-mail voor uitgebreide vragen\n`;
  content += `- Online contactformulier\n\n`;
  
  content += `Wij reageren binnen één werkdag met een reactie op maat voor uw situatie in ${city.name}.\n`;
  
  return content;
}

/**
 * Generate complete city-service page content
 * 
 * Combines all sections into a comprehensive page of minimum 350 words.
 * Content is unique per city-service combination (≥70% uniqueness target).
 * 
 * @param city - City entity
 * @param service - Service entity  
 * @param cityService - Optional CityService overrides
 * @returns Complete page content in Dutch
 */
export function generateCityServiceContent(
  city: City,
  service: Service,
  cityService?: CityService
): string {
  const sections: string[] = [];
  
  // Introduction (required)
  sections.push(generateIntroduction(city, service, cityService));
  sections.push('\n\n');
  
  // Why local (required)
  sections.push(generateWhyLocal(city, service, cityService));
  sections.push('\n\n');
  
  // Process (required)
  sections.push(generateProcessSection(service));
  sections.push('\n\n');
  
  // Pricing (required)
  sections.push(generatePricingSection(city, service, cityService));
  sections.push('\n\n');
  
  // Benefits (required)
  sections.push(generateBenefitsSection(service));
  sections.push('\n\n');
  
  // Local examples (required)
  sections.push(generateLocalExamples(city, service, cityService));
  sections.push('\n\n');
  
  // FAQs (required)
  sections.push(generateLocalFAQs(city, service, cityService));
  sections.push('\n\n');
  
  // Testimonials (optional)
  const testimonials = generateTestimonialsSection(city, cityService);
  if (testimonials) {
    sections.push(testimonials);
    sections.push('\n\n');
  }
  
  // Market insights (optional)
  const insights = generateMarketInsights(city, service, cityService);
  if (insights) {
    sections.push(insights);
    sections.push('\n\n');
  }
  
  // CTA (required)
  sections.push(generateCTA(city, service));
  
  return sections.join('');
}

/**
 * Calculate approximate word count of content
 */
export function calculateWordCount(content: string): number {
  // Remove markdown syntax for accurate count
  const cleaned = content
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .replace(/[>\-\n]/g, ' '); // Remove blockquotes, bullets, newlines
  
  const words = cleaned.split(/\s+/).filter(word => word.length > 0);
  return words.length;
}

/**
 * Validate content meets minimum requirements
 */
export function validateContent(content: string): {
  isValid: boolean;
  wordCount: number;
  errors: string[];
} {
  const errors: string[] = [];
  const wordCount = calculateWordCount(content);
  
  if (wordCount < 350) {
    errors.push(`Content too short: ${wordCount} words (minimum 350 required)`);
  }
  
  // Check for required sections
  const requiredSections = [
    'Waarom kiezen',
    'werkproces',
    'Wat kost',
    'Voordelen',
    'voorbeelden',
    'Veelgestelde vragen',
    'Start vandaag',
  ];
  
  requiredSections.forEach(section => {
    if (!content.includes(section)) {
      errors.push(`Missing required section: ${section}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    wordCount,
    errors,
  };
}
