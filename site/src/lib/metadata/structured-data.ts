// Structured snippet optimization for SERP features
export interface StructuredSnippetOptions {
  type:
    | "FAQ"
    | "HowTo"
    | "Product"
    | "Service"
    | "Organization"
    | "LocalBusiness"
    | "Article"
    | "BreadcrumbList";
  data: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

// FAQ structured data for SERP snippets
export function generateFAQStructuredData(
  faqs: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// HowTo structured data for step-by-step guides
export function generateHowToStructuredData(
  steps: Array<{ name: string; text: string; image?: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
    })),
  };
}

// Product structured data for services
export function generateProductStructuredData(product: {
  name: string;
  description: string;
  image: string;
  brand: string;
  offers: {
    price: string;
    priceCurrency: string;
    availability: string;
  };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      price: product.offers.price,
      priceCurrency: product.offers.priceCurrency,
      availability: `https://schema.org/${product.offers.availability}`,
    },
  };
}

// Local Business structured data
export function generateLocalBusinessStructuredData(business: {
  name: string;
  description: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    latitude: string;
    longitude: string;
  };
  contactPoint: {
    telephone: string;
    email: string;
  };
  sameAs: string[];
  openingHours: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.description,
    address: {
      "@type": "PostalAddress",
      ...business.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: business.contactPoint.telephone,
      email: business.contactPoint.email,
      contactType: "Customer Service",
    },
    sameAs: business.sameAs,
    openingHours: business.openingHours,
  };
}

// Article structured data for blog posts and content
export function generateArticleStructuredData(article: {
  headline: string;
  description: string;
  author: string;
  publisher: string;
  datePublished: string;
  dateModified: string;
  image: string;
  mainEntityOfPage: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: article.publisher,
    },
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    image: article.image,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.mainEntityOfPage,
    },
  };
}

// Breadcrumb structured data
export function generateBreadcrumbStructuredData(
  breadcrumbs: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

// Service structured data for professional services
export function generateServiceStructuredData(service: {
  name: string;
  description: string;
  provider: string;
  areaServed: string[];
  serviceType: string;
  offers: {
    price: string;
    priceCurrency: string;
    description: string;
  };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: service.provider,
    },
    areaServed: service.areaServed.map((area) => ({
      "@type": "Place",
      name: area,
    })),
    serviceType: service.serviceType,
    offers: {
      "@type": "Offer",
      price: service.offers.price,
      priceCurrency: service.offers.priceCurrency,
      description: service.offers.description,
    },
  };
}

// Organization structured data
export function generateOrganizationStructuredData(org: {
  name: string;
  url: string;
  logo: string;
  description: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint: {
    telephone: string;
    email: string;
  };
  sameAs: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: org.name,
    url: org.url,
    logo: org.logo,
    description: org.description,
    address: {
      "@type": "PostalAddress",
      ...org.address,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: org.contactPoint.telephone,
      email: org.contactPoint.email,
      contactType: "Customer Service",
    },
    sameAs: org.sameAs,
  };
}

// Enhanced meta tags for rich snippets
export function generateRichSnippetMeta(options: {
  type: string;
  data: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}): Record<string, string> {
  const meta: Record<string, string> = {};

  switch (options.type) {
    case "article":
      if (options.data.author) meta["article:author"] = options.data.author;
      if (options.data.publishedTime)
        meta["article:published_time"] = options.data.publishedTime;
      if (options.data.modifiedTime)
        meta["article:modified_time"] = options.data.modifiedTime;
      if (options.data.section) meta["article:section"] = options.data.section;
      if (options.data.tags) meta["article:tag"] = options.data.tags.join(",");
      break;

    case "product":
      if (options.data.price) meta["product:price:amount"] = options.data.price;
      if (options.data.currency)
        meta["product:price:currency"] = options.data.currency;
      if (options.data.availability)
        meta["product:availability"] = options.data.availability;
      if (options.data.brand) meta["product:brand"] = options.data.brand;
      break;

    case "business":
      if (options.data.phone)
        meta["business:contact_data:phone_number"] = options.data.phone;
      if (options.data.email)
        meta["business:contact_data:email"] = options.data.email;
      if (options.data.address)
        meta["business:contact_data:street_address"] = options.data.address;
      if (options.data.locality)
        meta["business:contact_data:locality"] = options.data.locality;
      if (options.data.region)
        meta["business:contact_data:region"] = options.data.region;
      if (options.data.postalCode)
        meta["business:contact_data:postal_code"] = options.data.postalCode;
      break;
  }

  return meta;
}

// Generate JSON-LD script tag content
export function generateJsonLd(data: Record<string, any>): string {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  return JSON.stringify(data, null, 0);
}

// Common Dutch service areas for local SEO
export const dutchServiceAreas = [
  "Amsterdam",
  "Rotterdam",
  "Den Haag",
  "Utrecht",
  "Eindhoven",
  "Groningen",
  "Tilburg",
  "Almere",
  "Breda",
  "Nijmegen",
  "Enschede",
  "Haarlem",
  "Arnhem",
  "Zaanstad",
  "Apeldoorn",
  "Nederland",
];

// Common Dutch service keywords for SEO
export const dutchServiceKeywords = {
  website: [
    "website laten maken",
    "website bouwen",
    "webdesign",
    "responsive website",
    "professionele website",
    "bedrijfswebsite",
    "website ontwikkeling",
  ],
  webshop: [
    "webshop laten maken",
    "webwinkel ontwikkeling",
    "e-commerce website",
    "online verkopen",
    "webshop bouwen",
    "ideal integratie",
  ],
  seo: [
    "seo optimalisatie",
    "hoger in google",
    "zoekmachine optimalisatie",
    "google ranking",
    "seo specialist",
    "online vindbaar",
  ],
};
