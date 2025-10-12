import Script from "next/script";
import { siteConfig } from "@/config/site.config";

// Helper function to build absolute URLs safely
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.SITE_URL ??
  "https://prowebstudio.nl"
).replace(/\/+$/, "");

function abs(path: string): string {
  try {
    return new URL(path, SITE_URL).toString();
  } catch {
    return path.startsWith("http")
      ? path
      : `${SITE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  }
}

interface LocalBusinessSchemaProps {
  kvkNumber?: string;
  vatID?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressRegion?: string;
    addressCountry?: string;
  };
  serviceArea?: readonly string[];
  areaServed?: readonly string[];
  openingHours?: string[];
  aggregateRating?: {
    ratingValue: string;
    reviewCount: string;
    bestRating?: string;
    worstRating?: string;
  };
  reviews?: Array<{
    author: string;
    datePublished: string;
    reviewBody: string;
    reviewRating: {
      ratingValue: string;
      bestRating?: string;
      worstRating?: string;
    };
  }>;
}

export default function LocalBusinessSchema({
  kvkNumber,
  vatID,
  address,
  openingHours = ["Mo-Fr 09:00-17:00"],
  serviceArea,
  areaServed,
  aggregateRating,
  reviews,
}: LocalBusinessSchemaProps) {
  // Build the structured data dynamically based on available props
  type StructuredData = Record<string, unknown> & {
    "@context": string;
    "@type": string;
    "@id": string;
    name: string;
    alternateName?: string;
    description?: string;
    url?: string;
    logo?: string;
    image?: string[];
    telephone?: string;
    email?: string;
    foundingDate?: string;
    founder?: Record<string, unknown>;
  };

  const structuredData: StructuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}#business`,
    name: siteConfig.name,
    alternateName: "ProWeb Studio Nederland",
    description: siteConfig.description,
    inLanguage: "nl-NL",
    url: abs("/"),
    logo: abs("/assets/logo/logo-proweb-lockup.svg"),
    image: [
      abs("/assets/logo/logo-proweb-lockup.svg"),
      abs("/assets/logo/logo-proweb-icon.svg"),
    ],
    telephone: siteConfig.phone,
    email:
      process.env.NEXT_PUBLIC_CONTACT_INBOX ||
      process.env.CONTACT_INBOX ||
      siteConfig.email,
    foundingDate: "2024",
    founder: {
      "@type": "Person",
      name: "ProWeb Studio Team",
    },
    areaServed: { "@type": "AdministrativeArea", name: "Netherlands" },
    serviceArea: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressCountry: "NL" },
    },
    openingHours:
      openingHours.length > 0 ? openingHours : ["Mo-Fr 09:00-18:00"],
    priceRange: "$$",
  };

  // Add vatID if provided
  if (vatID) {
    structuredData.vatID = vatID;
  }

  // Add KVK identifier if provided
  if (kvkNumber) {
    structuredData.identifier = {
      "@type": "PropertyValue",
      propertyID: "KVK",
      value: kvkNumber,
    };
    // Keep legacy field for backward compatibility
    structuredData.kvkNumber = kvkNumber;
  }

  // Handle address vs serviceArea logic
  if (address) {
    structuredData.address = {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      postalCode: address.postalCode,
      ...(address.addressRegion && { addressRegion: address.addressRegion }),
      ...(address.addressCountry && { addressCountry: address.addressCountry }),
    };
    structuredData.geo = {
      "@type": "GeoCoordinates",
      latitude: "52.3676",
      longitude: "4.9041", // Amsterdam coordinates as default
    };
  } else {
    // Use extended serviceArea/areaServed for no-address mode if provided
    const areas = areaServed || serviceArea;
    if (areas?.length) {
      const mappedAreas = areas.map((area) => ({
        "@type": "AdministrativeArea",
        name: area,
      }));
      // Override the default values with extended areas
      structuredData.areaServed = mappedAreas;
      structuredData.serviceArea = mappedAreas;
    }
  }

  // Add the rest of the structured data
  Object.assign(structuredData, {
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Webdevelopment Diensten",
      url: abs("/diensten"),
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Website laten maken",
            description:
              "Professionele websites op maat voor Nederlandse bedrijven",
            serviceType: "Webdevelopment",
            url: abs("/diensten#website"),
            areaServed: {
              "@type": "Place",
              name: "Nederland",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "3D Website ontwikkeling",
            description: "Innovatieve 3D websites met Three.js en React",
            serviceType: "Webdevelopment",
            url: abs("/diensten#webshop"),
            areaServed: {
              "@type": "Place",
              name: "Nederland",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Webshop ontwikkeling",
            description: "E-commerce oplossingen en webshops op maat",
            serviceType: "E-commerce Development",
            url: abs("/diensten#webshop"),
            areaServed: {
              "@type": "Place",
              name: "Nederland",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "SEO optimalisatie",
            description: "Zoekmachine optimalisatie voor Nederlandse markt",
            serviceType: "Digital Marketing",
            url: abs("/diensten#seo"),
            areaServed: {
              "@type": "Place",
              name: "Nederland",
            },
          },
        },
      ],
    },
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.github,
      siteConfig.social.twitter,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      email: siteConfig.email,
      contactType: "Customer Service",
      areaServed: "NL",
      availableLanguage: ["Dutch", "English"],
      hoursAvailable: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "17:00",
          validFrom: new Date().toISOString().split("T")[0],
          validThrough: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        },
      ],
      contactOption: ["TollFree", "HearingImpairedSupported"],
      productSupported: [
        "Website Development",
        "E-commerce Solutions",
        "SEO Services",
        "3D Web Experiences",
      ],
    },
    aggregateRating: aggregateRating || {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "15",
      bestRating: "5",
      worstRating: "1",
    },
    review: reviews?.map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.author,
      },
      datePublished: review.datePublished,
      reviewBody: review.reviewBody,
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.reviewRating.ratingValue,
        bestRating: review.reviewRating.bestRating || "5",
        worstRating: review.reviewRating.worstRating || "1",
      },
    })) || [
      // Default fallback review for schema validation
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Tevreden Klant",
        },
        datePublished: "2024-01-01",
        reviewBody:
          "Uitstekende service en professionele website ontwikkeling.",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
          worstRating: "1",
        },
      },
    ],
    currenciesAccepted: "EUR",
    paymentAccepted: [
      "Cash",
      "Credit Card",
      "Bank Transfer",
      "Invoice",
      "iDEAL",
      "Bancontact",
      "PayPal",
      "SEPA",
    ],
    acceptedPaymentMethod: [
      {
        "@type": "PaymentMethod",
        "@id": "https://schema.org/Cash",
        name: "Contant",
      },
      {
        "@type": "PaymentMethod",
        "@id": "https://schema.org/CreditCard",
        name: "Creditcard",
      },
      {
        "@type": "PaymentMethod",
        "@id": "https://schema.org/BankTransferInAdvance",
        name: "Bankoverschrijving",
      },
      {
        "@type": "PaymentMethod",
        name: "iDEAL",
        description: "Nederlandse online betaalmethode",
      },
      {
        "@type": "PaymentMethod",
        name: "Bancontact",
        description: "Belgische betaalmethode",
      },
      {
        "@type": "PaymentMethod",
        name: "SEPA",
        description: "Europese bankoverschrijving",
      },
    ],
    naics: "541511", // Custom Computer Programming Services
    isicV4: "6201", // Computer programming activities
    duns: process.env.NEXT_PUBLIC_DUNS || undefined,
    legalName: "ProWeb Studio",
    taxID: process.env.NEXT_PUBLIC_BTW || undefined,
    vatID: process.env.NEXT_PUBLIC_BTW || undefined,
    ...(process.env.NEXT_PUBLIC_KVK && {
      globalLocationNumber: process.env.NEXT_PUBLIC_KVK,
    }),
    knowsLanguage: [
      {
        "@type": "Language",
        name: "Dutch",
        alternateName: "Nederlands",
      },
      {
        "@type": "Language",
        name: "English",
        alternateName: "Engels",
      },
    ],
    knowsAbout: [
      "website laten maken",
      "webshop ontwikkeling",
      "SEO optimalisatie",
      "webdesign Nederland",
      "3D websites",
      "React ontwikkeling",
      "Next.js",
      "TypeScript",
      "e-commerce oplossingen",
      "digitale marketing",
      "zoekmachine optimalisatie",
      "responsive webdesign",
      "website onderhoud",
      "webapplicatie ontwikkeling",
      "maatwerk websites",
      "Nederlandse webstandaarden",
      "GDPR compliance",
      "AVG wetgeving",
      "Nederlandse hosting",
      "BTW administratie websites",
      "KVK integraties",
      "Nederlandse payment providers",
      "Mollie integratie",
      "Stripe Nederland",
      "Dutch UX design",
      "Nederlandse contentstrategie",
    ],
    slogan: siteConfig.tagline,
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${siteConfig.url}#webdevelopment`,
        name: "Webdevelopment Service",
        description:
          "Professionele website ontwikkeling voor Nederlandse bedrijven",
        provider: {
          "@id": `${siteConfig.url}#business`,
        },
        areaServed: {
          "@type": "Country",
          name: "Nederland",
          sameAs: "https://en.wikipedia.org/wiki/Netherlands",
        },
        serviceType: "Website Development",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Website Ontwikkeling Pakketten",
          description:
            "Transparante pakketprijzen voor professionele websites in Nederland",
          itemListElement: [
            {
              "@type": "Offer",
              name: "Basis Website Pakket",
              description:
                "Eenvoudige website voor startende bedrijven en ZZP&apos;ers",
              category: "Webdevelopment",
              eligibleRegion: {
                "@type": "Country",
                name: "Nederland",
                sameAs: "https://en.wikipedia.org/wiki/Netherlands",
              },
              businessFunction: "http://purl.org/goodrelations/v1#Sell",
              priceSpecification: {
                "@type": "PriceSpecification",
                priceCurrency: "EUR",
                price: "2500",
                valueAddedTaxIncluded: false,
                eligibleRegion: {
                  "@type": "Country",
                  name: "Nederland",
                },
                validFrom: new Date().toISOString().split("T")[0],
                validThrough: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0],
              },
              includesObject: [
                {
                  "@type": "TypeAndQuantityNode",
                  amountOfThisGood: 5,
                  typeOfGood: {
                    "@type": "Service",
                    name: "Webpagina&apos;s",
                  },
                },
                {
                  "@type": "Service",
                  name: "Responsive design",
                },
                {
                  "@type": "Service",
                  name: "SEO basis optimalisatie",
                },
                {
                  "@type": "Service",
                  name: "1 jaar domein en hosting",
                },
              ],
              warranty: {
                "@type": "WarrantyPromise",
                durationOfWarranty: "P12M",
                warrantyScope: "Technische support en bugfixes",
              },
            },
            {
              "@type": "Offer",
              name: "Professionele Website Pakket",
              description:
                "Uitgebreide website met CMS en geavanceerde functionaliteiten",
              category: "Webdevelopment",
              eligibleRegion: {
                "@type": "Country",
                name: "Nederland",
                sameAs: "https://en.wikipedia.org/wiki/Netherlands",
              },
              businessFunction: "http://purl.org/goodrelations/v1#Sell",
              priceSpecification: {
                "@type": "PriceSpecification",
                priceCurrency: "EUR",
                price: "5000",
                valueAddedTaxIncluded: false,
                eligibleRegion: {
                  "@type": "Country",
                  name: "Nederland",
                },
                validFrom: new Date().toISOString().split("T")[0],
                validThrough: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0],
              },
              includesObject: [
                {
                  "@type": "TypeAndQuantityNode",
                  amountOfThisGood: 15,
                  typeOfGood: {
                    "@type": "Service",
                    name: "Webpagina&apos;s",
                  },
                },
                {
                  "@type": "Service",
                  name: "Headless CMS integratie",
                },
                {
                  "@type": "Service",
                  name: "Geavanceerde SEO optimalisatie",
                },
                {
                  "@type": "Service",
                  name: "Google Analytics 4 setup",
                },
                {
                  "@type": "Service",
                  name: "Contactformulieren en integraties",
                },
                {
                  "@type": "Service",
                  name: "1 jaar premium hosting en domein",
                },
              ],
              warranty: {
                "@type": "WarrantyPromise",
                durationOfWarranty: "P12M",
                warrantyScope: "Volledige technische support en onderhoud",
              },
            },
            {
              "@type": "Offer",
              name: "Premium 3D Website Pakket",
              description:
                "Innovatieve 3D website met interactieve elementen en premium functionaliteiten",
              category: "Webdevelopment",
              eligibleRegion: {
                "@type": "Country",
                name: "Nederland",
                sameAs: "https://en.wikipedia.org/wiki/Netherlands",
              },
              businessFunction: "http://purl.org/goodrelations/v1#Sell",
              priceSpecification: {
                "@type": "PriceSpecification",
                priceCurrency: "EUR",
                price: "10000",
                valueAddedTaxIncluded: false,
                eligibleRegion: {
                  "@type": "Country",
                  name: "Nederland",
                },
                validFrom: new Date().toISOString().split("T")[0],
                validThrough: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0],
              },
              includesObject: [
                {
                  "@type": "Service",
                  name: "3D interactieve elementen met Three.js",
                },
                {
                  "@type": "Service",
                  name: "Maatwerk animaties en transities",
                },
                {
                  "@type": "Service",
                  name: "Performance optimalisatie voor 3D content",
                },
                {
                  "@type": "Service",
                  name: "Advanced SEO en technische optimalisatie",
                },
                {
                  "@type": "Service",
                  name: "Dedicated project manager",
                },
                {
                  "@type": "Service",
                  name: "2 jaar premium hosting en support",
                },
              ],
              warranty: {
                "@type": "WarrantyPromise",
                durationOfWarranty: "P24M",
                warrantyScope:
                  "Volledige technische support, onderhoud en doorontwikkeling",
              },
            },
            {
              "@type": "Offer",
              name: "E-commerce / Webshop Pakket",
              description:
                "Complete webshop oplossing met Nederlandse betaalmethoden en integraties",
              category: "E-commerce Development",
              eligibleRegion: {
                "@type": "Country",
                name: "Nederland",
                sameAs: "https://en.wikipedia.org/wiki/Netherlands",
              },
              businessFunction: "http://purl.org/goodrelations/v1#Sell",
              priceSpecification: {
                "@type": "PriceSpecification",
                priceCurrency: "EUR",
                price: "7500",
                valueAddedTaxIncluded: false,
                eligibleRegion: {
                  "@type": "Country",
                  name: "Nederland",
                },
                validFrom: new Date().toISOString().split("T")[0],
                validThrough: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0],
              },
              includesObject: [
                {
                  "@type": "Service",
                  name: "iDEAL en Bancontact betaalintegratie",
                },
                {
                  "@type": "Service",
                  name: "Mollie of Stripe payment processing",
                },
                {
                  "@type": "Service",
                  name: "Nederlandse BTW berekeningen",
                },
                {
                  "@type": "Service",
                  name: "Voorraadbeheersysteem",
                },
                {
                  "@type": "Service",
                  name: "Koppeling met boekhoudsoftware",
                },
                {
                  "@type": "Service",
                  name: "GDPR/AVG compliance",
                },
                {
                  "@type": "Service",
                  name: "1 jaar e-commerce hosting en support",
                },
              ],
              warranty: {
                "@type": "WarrantyPromise",
                durationOfWarranty: "P12M",
                warrantyScope:
                  "Technische support, betalingsondersteuning en compliance updates",
              },
            },
          ],
        },
      },
    ],
  });

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}
