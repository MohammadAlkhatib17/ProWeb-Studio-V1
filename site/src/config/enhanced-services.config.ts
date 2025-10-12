/**
 * Enhanced Services Configuration
 * Professional, creative, and comprehensive service offerings for all Dutch cities
 * Emphasizes online-first approach with remote consultation capabilities
 */

export interface EnhancedService {
  title: string;
  slug: string;
  href: string;
  description: string;
  detailedDescription: string;
  benefits: string[];
  process: string[];
  deliverables: string[];
  relatedServices: string[];
  targetAudience: string[];
  pricing: {
    startingFrom: string;
    description: string;
  };
  timeline: string;
  seoKeywords: string[];
}

/**
 * Complete service portfolio - Available in ALL cities
 * No fictional information, all services are genuinely provided online
 */
export const enhancedServices: EnhancedService[] = [
  {
    title: "Website Laten Maken",
    slug: "website-laten-maken",
    href: "/diensten/website-laten-maken",
    description:
      "Professionele website ontwikkeling met moderne technologieën en razendsnelle performance",
    detailedDescription:
      "Wij creëren websites die niet alleen visueel imponeren, maar ook technisch excelleren. Onze online-first benadering betekent dat we volledig op afstand kunnen werken, met videocalls en digitale samenwerking als basis. Van concept tot lancering, alles wordt professioneel begeleid zonder fysieke ontmoetingen te vereisen.",
    benefits: [
      "Volledig responsive design voor alle apparaten",
      "Bliksemsnelle laadtijden (Core Web Vitals optimized)",
      "SEO-geoptimaliseerd voor maximale vindbaarheid",
      "Gebruiksvriendelijke content management systemen",
      "Moderne 3D elementen en interactieve features",
      "Nederlandse hosting met GDPR compliance",
      "Professionele ondersteuning via video calls",
      "Transparante ontwikkeling met real-time updates",
    ],
    process: [
      "Online kennismakingsgesprek via videocall",
      "Digitale intake en requirements analyse",
      "Visueel ontwerp met online feedback rondes",
      "Technische ontwikkeling met live preview",
      "Uitgebreide testing op alle apparaten",
      "Lancering met volledige documentatie",
      "Overdracht en training via screensharing",
    ],
    deliverables: [
      "Volledig functionele website",
      "Responsive design voor mobile/tablet/desktop",
      "Content Management Systeem (CMS)",
      "SEO basis-optimalisatie",
      "SSL certificaat en beveiliging",
      "Google Analytics setup",
      "Gebruikershandleiding en training",
      "30 dagen gratis support na lancering",
    ],
    relatedServices: [
      "webshop-laten-maken",
      "seo-optimalisatie",
      "3d-website-ervaringen",
      "onderhoud-support",
    ],
    targetAudience: [
      "Startende ondernemers",
      "Gevestigde bedrijven die willen vernieuwen",
      "E-commerce bedrijven",
      "Professionals en consultants",
      "Creatieve industrieën",
      "Technische dienstverleners",
    ],
    pricing: {
      startingFrom: "€2.495",
      description:
        "Inclusief ontwerp, ontwikkeling, CMS, SSL, hosting setup en 30 dagen support",
    },
    timeline: "2-4 weken afhankelijk van complexiteit",
    seoKeywords: [
      "website laten maken",
      "webdesign",
      "website ontwikkeling",
      "responsieve website",
      "CMS website",
    ],
  },
  {
    title: "Webshop Laten Maken",
    slug: "webshop-laten-maken",
    href: "/diensten/webshop-laten-maken",
    description:
      "Complete e-commerce platformen met Nederlandse betaalmethoden en juridische compliance",
    detailedDescription:
      "Onze webshops zijn gebouwd voor Nederlandse ondernemers die online willen verkopen. We integreren alle populaire betaalmethoden zoals iDEAL, PayPal en creditcards, zorgen voor GDPR-compliance en Nederlandse wetgeving. De volledige ontwikkeling gebeurt online met regelmatige demo's via videocalls.",
    benefits: [
      "iDEAL, PayPal en creditcard integraties",
      "Automatische BTW berekeningen voor Nederland",
      "GDPR-compliant klantgegevens verwerking",
      "Geavanceerd voorraadbeheersysteem",
      "SEO-geoptimaliseerde productpagina's",
      "Mobile-first shopping experience",
      "Koppeling met populaire verzendpartners",
      "Uitgebreide analytics en rapportages",
      "Online training en support via videocalls",
    ],
    process: [
      "E-commerce consultatie via videocall",
      "Productcatalogus en betaalstromen analyse",
      "Custom webshop ontwerp met UX focus",
      "Technische ontwikkeling met live testing",
      "Betaalmethoden configuratie en testing",
      "Producten upload en catalogus optimalisatie",
      "Lancering met volledig werkende checkout",
      "Online training voor dagelijks beheer",
    ],
    deliverables: [
      "Volledig functionele webshop",
      "Betaalgateway integraties (iDEAL, PayPal, etc.)",
      "Voorraadbeheersysteem",
      "Klantaccounts en orderhistorie",
      "Verzendkosten calculator",
      "BTW-correcte factuurverwerking",
      "SEO-basis voor alle productpagina's",
      "Beheerderspaneel training en documentatie",
    ],
    relatedServices: [
      "website-laten-maken",
      "seo-optimalisatie",
      "onderhoud-support",
      "3d-website-ervaringen",
    ],
    targetAudience: [
      "Retailers die online willen verkopen",
      "B2B leveranciers met catalogus",
      "Creatieve ondernemers (kunst, design)",
      "Lokale winkels met online uitbreiding",
      "Groothandel met klantportalen",
      "Service providers met online boekingen",
    ],
    pricing: {
      startingFrom: "€4.995",
      description:
        "Inclusief ontwerp, ontwikkeling, betaalintegraties, producten setup en 60 dagen support",
    },
    timeline: "4-6 weken afhankelijk van productcatalogus grootte",
    seoKeywords: [
      "webshop laten maken",
      "e-commerce website",
      "online winkel",
      "webwinkel ontwikkeling",
      "iDEAL webshop",
    ],
  },
  {
    title: "SEO Optimalisatie",
    slug: "seo-optimalisatie",
    href: "/diensten/seo-optimalisatie",
    description:
      "Lokale en nationale SEO voor maximale vindbaarheid in Google Nederland",
    detailedDescription:
      "Onze SEO-expertise is volledig gefocust op de Nederlandse markt. We optimaliseren voor lokale zoektermen, Nederlandse taalpatronen en culturele context. Alle SEO-werkzaamheden worden online uitgevoerd met maandelijkse rapportages en strategische videocalls.",
    benefits: [
      "Lokale SEO voor Nederlandse steden en regio's",
      "Nederlandse keyword research en concurrentieanalyse",
      "Google My Business optimalisatie (indien van toepassing)",
      "Technische SEO en Core Web Vitals optimalisatie",
      "Content strategie voor Nederlandse doelgroepen",
      "Link building met Nederlandse websites",
      "Maandelijks rapportages en performance tracking",
      "Strategische SEO consultatie via videocalls",
    ],
    process: [
      "SEO audit en concurrentieanalyse",
      "Nederlandse keyword research en strategie",
      "On-page optimalisatie implementatie",
      "Technische SEO verbeteringen",
      "Content planning en optimalisatie",
      "Link building campagne opzet",
      "Maandelijkse monitoring en bijsturing",
      "Kwartaal strategiesessies via videocall",
    ],
    deliverables: [
      "Uitgebreide SEO audit rapportage",
      "Nederlandse keyword strategie document",
      "On-page optimalisatie implementatie",
      "Technische SEO verbeteringen",
      "Content kalender en optimalisatie gids",
      "Maandelijkse ranking rapportages",
      "Google Analytics en Search Console setup",
      "SEO handleiding voor intern team",
    ],
    relatedServices: [
      "website-laten-maken",
      "webshop-laten-maken",
      "onderhoud-support",
      "content-marketing",
    ],
    targetAudience: [
      "Lokale bedrijven in Nederlandse steden",
      "Nationale e-commerce ondernemingen",
      "B2B dienstverleners",
      "Professionals (advocaten, accountants, etc.)",
      "Horecaondernemers",
      "Technische specialisten",
    ],
    pricing: {
      startingFrom: "€895/maand",
      description:
        "Inclusief keyword research, on-page optimalisatie, technische SEO en maandelijkse rapportages",
    },
    timeline: "Doorlopend, eerste resultaten binnen 3-6 maanden",
    seoKeywords: [
      "SEO optimalisatie",
      "lokale SEO",
      "Google ranking",
      "zoekmachine optimalisatie",
      "SEO Nederland",
    ],
  },
  {
    title: "3D Website Ervaringen",
    slug: "3d-website-ervaringen",
    href: "/diensten/3d-website-ervaringen",
    description:
      "Interactieve 3D visualisaties en immersieve digitale ervaringen",
    detailedDescription:
      "Wij specialiseren ons in cutting-edge 3D webtechnologieën die uw bezoekers een onvergetelijke ervaring bieden. Van productconfigurators tot interactieve showrooms, we ontwikkelen alles online met 3D previews en demo's via screensharing sessies.",
    benefits: [
      "Interactieve 3D productvisualisaties",
      "Immersieve website ervaringen",
      "WebGL-gebaseerde 3D graphics",
      "Mobile-vriendelijke 3D implementaties",
      "Custom 3D animaties en overgangen",
      "Virtuele showrooms en product configurators",
      "Performance-geoptimaliseerde 3D rendering",
      "Online demo's en ontwikkeling feedback",
    ],
    process: [
      "3D concept ontwikkeling via videocall",
      "3D modeling en asset creatie",
      "Interactieve prototype ontwikkeling",
      "Web-geoptimaliseerde 3D implementatie",
      "Performance testing op verschillende apparaten",
      "User experience testing en optimalisatie",
      "Integratie met bestaande website",
      "Live demo en training via screensharing",
    ],
    deliverables: [
      "Custom 3D web applicatie",
      "Interactieve product configurator",
      "3D assets en animaties",
      "Mobile-responsive 3D ervaring",
      "Performance optimalisatie",
      "Browser compatibility testing",
      "Gebruikershandleiding voor beheer",
      "Source code en documentatie",
    ],
    relatedServices: [
      "website-laten-maken",
      "webshop-laten-maken",
      "onderhoud-support",
      "ui-ux-design",
    ],
    targetAudience: [
      "E-commerce met complexe producten",
      "Architectuur en vastgoed",
      "Automotive industrie",
      "Meubelindustrie en interieur",
      "Technische producten en machinery",
      "Entertainment en gaming",
    ],
    pricing: {
      startingFrom: "€3.495",
      description:
        "Inclusief 3D ontwerp, ontwikkeling, optimalisatie en integratie met bestaande website",
    },
    timeline: "3-5 weken afhankelijk van 3D complexiteit",
    seoKeywords: [
      "3D website",
      "interactieve visualisatie",
      "3D product configurator",
      "WebGL ontwikkeling",
      "3D web ervaring",
    ],
  },
  {
    title: "Website Onderhoud & Support",
    slug: "onderhoud-support",
    href: "/diensten/onderhoud-support",
    description:
      "Doorlopend technisch onderhoud, updates en professionele website support",
    detailedDescription:
      "Onze onderhoudsservice zorgt ervoor dat uw website altijd up-to-date, veilig en optimaal blijft presteren. We bieden verschillende support pakketten met snelle responstijden via online kanalen, proactieve monitoring en regelmatige updates.",
    benefits: [
      "Proactieve website monitoring 24/7",
      "Automatische security updates en patches",
      "Performance optimalisatie en snelheidscontroles",
      "Content updates en wijzigingen",
      "Technical support via ticket systeem",
      "Maandelijkse website backups",
      "SSL certificaat beheer en vernieuwing",
      "Snelle support via chat, email of videocall",
    ],
    process: [
      "Website audit en monitoring setup",
      "Onderhoudsplan opstelling en afspraken",
      "Proactieve monitoring implementatie",
      "Maandelijkse maintenance taken",
      "Security updates en patches",
      "Performance optimalisatie checks",
      "Incident response en troubleshooting",
      "Maandelijkse status rapportages",
    ],
    deliverables: [
      "24/7 website monitoring",
      "Maandelijkse security updates",
      "Performance optimalisatie raporten",
      "Backup systeem met restore mogelijkheden",
      "Priority support ticket systeem",
      "SSL certificaat management",
      "Maandelijkse status overzichten",
      "Emergency response binnen 4 uur",
    ],
    relatedServices: [
      "website-laten-maken",
      "webshop-laten-maken",
      "seo-optimalisatie",
      "hosting-services",
    ],
    targetAudience: [
      "Bedrijven met bedrijfskritieke websites",
      "E-commerce ondernemers",
      "Professionals zonder technische kennis",
      "Agencies die white-label support zoeken",
      "Ondernemers die focus willen op hun business",
      "Websites met hoge traffic volumes",
    ],
    pricing: {
      startingFrom: "€195/maand",
      description:
        "Inclusief monitoring, updates, backups, support tickets en maandelijkse rapportages",
    },
    timeline: "Doorlopende service vanaf eerste werkdag",
    seoKeywords: [
      "website onderhoud",
      "website support",
      "technisch beheer",
      "website maintenance",
      "WordPress onderhoud",
    ],
  },
  {
    title: "Content Marketing & Copywriting",
    slug: "content-marketing",
    href: "/diensten/content-marketing",
    description:
      "Professionele Nederlandse content die converteert en rankt in Google",
    detailedDescription:
      "Onze content specialisten creëren hoogwaardige Nederlandse teksten die zowel uw doelgroep aanspreken als Google helpen uw website beter te ranken. Van blog artikelen tot productbeschrijvingen, alles wordt online ontwikkeld met focus op Nederlandse taal en cultuur.",
    benefits: [
      "SEO-geoptimaliseerde Nederlandse content",
      "Conversie-gerichte copywriting",
      "Blog artikelen en nieuws content",
      "Productbeschrijvingen voor webshops",
      "Social media content planning",
      "Email marketing campaigns",
      "Nederlandse tone-of-voice ontwikkeling",
      "Content strategie en planning",
    ],
    process: [
      "Content audit en strategie sessie",
      "Doelgroep analyse en persona ontwikkeling",
      "Content kalender en planning",
      "Professioneel schrijfwerk en revisie",
      "SEO optimalisatie van alle content",
      "Content publicatie en distributie",
      "Performance monitoring en optimalisatie",
      "Maandelijkse content evaluatie",
    ],
    deliverables: [
      "Content strategie document",
      "Maandelijkse blog artikelen (4-8 stuks)",
      "Website copy optimalisatie",
      "Social media content kalender",
      "Email marketing templates",
      "SEO-geoptimaliseerde meta descriptions",
      "Content performance rapportages",
      "Editorial guidelines en tone-of-voice gids",
    ],
    relatedServices: [
      "seo-optimalisatie",
      "website-laten-maken",
      "social-media-marketing",
      "email-marketing",
    ],
    targetAudience: [
      "Bedrijven zonder interne marketing afdeling",
      "E-commerce met uitgebreide productcatalogi",
      "B2B dienstverleners",
      "Thought leaders en industry experts",
      "Lokale bedrijven met nationale ambities",
      "Startups die hun online aanwezigheid willen opbouwen",
    ],
    pricing: {
      startingFrom: "€695/maand",
      description:
        "Inclusief 4 blog artikelen, SEO optimalisatie, content planning en maandelijkse rapportage",
    },
    timeline: "Doorlopend, eerste artikelen binnen 1 week na start",
    seoKeywords: [
      "content marketing",
      "copywriting Nederland",
      "blog artikelen",
      "SEO content",
      "Nederlandse copywriter",
    ],
  },
  {
    title: "UI/UX Design Services",
    slug: "ui-ux-design",
    href: "/diensten/ui-ux-design",
    description:
      "Gebruiksvriendelijke interface design en optimale user experience",
    detailedDescription:
      "Onze UI/UX designers creëren intuïtieve en visueel aantrekkelijke interfaces die gebruikers leiden naar conversie. We werken volledig online met design tools, prototype demo's en gebruikerstests via remote sessies.",
    benefits: [
      "User research en doelgroep analyse",
      "Wireframing en prototype ontwikkeling",
      "Visual design en branding integratie",
      "Usability testing en optimalisatie",
      "Mobile-first design approach",
      "Conversie-geoptimaliseerde user flows",
      "Accessibility (a11y) compliance",
      "Design system ontwikkeling",
    ],
    process: [
      "User research en requirements gathering",
      "Information architecture en wireframing",
      "Visual design en style guide creatie",
      "Interactive prototype ontwikkeling",
      "Usability testing met echte gebruikers",
      "Design iteratie en optimalisatie",
      "Developer handoff met design specs",
      "Post-launch UX monitoring en verbeteringen",
    ],
    deliverables: [
      "User research en persona documentatie",
      "Complete wireframe set",
      "High-fidelity visual designs",
      "Interactive clickable prototype",
      "Design system en component library",
      "Developer handoff pakket",
      "Usability testing rapportage",
      "UX guidelines en best practices",
    ],
    relatedServices: [
      "website-laten-maken",
      "3d-website-ervaringen",
      "conversion-optimalisatie",
      "branding-services",
    ],
    targetAudience: [
      "E-commerce met lage conversie rates",
      "SaaS platforms en web applicaties",
      "Bedrijven met complexe user journeys",
      "Mobile apps en progressive web apps",
      "B2B platforms en dashboards",
      "Startups met nieuwe producten",
    ],
    pricing: {
      startingFrom: "€2.195",
      description:
        "Inclusief user research, wireframes, visual design, prototype en developer handoff",
    },
    timeline: "3-4 weken afhankelijk van project scope",
    seoKeywords: [
      "UI UX design",
      "interface design",
      "user experience",
      "wireframe ontwerp",
      "usability testing",
    ],
  },
  {
    title: "Conversion Rate Optimalisatie",
    slug: "conversion-optimalisatie",
    href: "/diensten/conversion-optimalisatie",
    description:
      "Data-gedreven optimalisatie voor meer bezoekers naar klanten conversie",
    detailedDescription:
      "We analyseren uw website data om te ontdekken waarom bezoekers niet converteren en implementeren bewezen optimalisaties. Alle testing en analyse gebeurt online met regelmatige rapportages en strategische videocalls voor resultaatbespreking.",
    benefits: [
      "Comprehensive conversion audit",
      "A/B testing en multivariate testing",
      "Heat mapping en user behavior analyse",
      "Checkout optimalisatie voor webshops",
      "Landing page optimalisatie",
      "Call-to-action optimalisatie",
      "Form optimalisatie en lead generation",
      "Data-driven besluitvorming",
    ],
    process: [
      "Conversion audit en data analyse",
      "User behavior research en heat mapping",
      "Hypothese ontwikkeling voor tests",
      "A/B test setup en implementatie",
      "Test monitoring en data verzameling",
      "Statistische analyse en conclusies",
      "Winning varianten implementatie",
      "Continuous testing en optimalisatie",
    ],
    deliverables: [
      "Uitgebreide conversion audit",
      "User behavior analysis rapportage",
      "A/B testing strategie en planning",
      "Test implementatie en monitoring",
      "Statistical significance rapportages",
      "Optimalisatie aanbevelingen",
      "Performance dashboards",
      "Monthly optimization rapportages",
    ],
    relatedServices: [
      "ui-ux-design",
      "seo-optimalisatie",
      "webshop-laten-maken",
      "analytics-setup",
    ],
    targetAudience: [
      "E-commerce met traffic maar lage conversie",
      "SaaS bedrijven met free-trial signups",
      "Lead generation websites",
      "Service providers met online offertes",
      "B2B bedrijven met lange sales cycles",
      "Membership en subscription services",
    ],
    pricing: {
      startingFrom: "€1.495/maand",
      description:
        "Inclusief conversion audit, A/B testing setup, monitoring en maandelijkse optimalisaties",
    },
    timeline: "Doorlopend programma, eerste tests binnen 2 weken",
    seoKeywords: [
      "conversion optimalisatie",
      "A/B testing",
      "conversie verbetering",
      "landing page optimalisatie",
      "checkout optimalisatie",
    ],
  },
];

/**
 * Service availability matrix - ALL services available in ALL cities
 * This function returns all services for any city (no restrictions)
 */
export function getServicesForCity(): EnhancedService[] {
  // Return all services as they're all available online for every city
  return enhancedServices;
}

/**
 * Get service by slug
 */
export function getServiceBySlug(slug: string): EnhancedService | undefined {
  return enhancedServices.find((service) => service.slug === slug);
}

/**
 * Get related services for a specific service
 */
export function getRelatedServices(
  currentServiceSlug: string,
): EnhancedService[] {
  const currentService = getServiceBySlug(currentServiceSlug);
  if (!currentService) return [];

  return enhancedServices.filter(
    (service) =>
      currentService.relatedServices.includes(service.slug) &&
      service.slug !== currentServiceSlug,
  );
}

/**
 * Get all service categories for navigation
 */
export const serviceCategories = [
  {
    name: "Website Ontwikkeling",
    services: [
      "website-laten-maken",
      "webshop-laten-maken",
      "3d-website-ervaringen",
    ],
  },
  {
    name: "Marketing & SEO",
    services: [
      "seo-optimalisatie",
      "content-marketing",
      "conversion-optimalisatie",
    ],
  },
  {
    name: "Design & Support",
    services: ["ui-ux-design", "onderhoud-support"],
  },
];
