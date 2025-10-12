import { localBusinessData, type DutchCity } from "@/config/local-seo.config";

interface LocalBusinessSchemaProps {
  city: DutchCity;
  customData?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function LocalBusinessSchema({
  city,
  customData,
}: LocalBusinessSchemaProps) {
  const businessData = customData || localBusinessData;

  // Create location-specific business data
  const locationBusinessData = {
    ...businessData,
    address: {
      ...businessData.address,
      addressLocality: city.name,
      postalCode: city.postalCodes[0],
      addressRegion: city.province,
    },
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://prowebstudio.nl/locatie/${city.slug}#LocalBusiness`,
    name: businessData.name,
    legalName: businessData.legalName,
    url: `https://prowebstudio.nl/locatie/${city.slug}`,
    logo: "https://prowebstudio.nl/logo.png",
    image: `https://prowebstudio.nl/og-images/city-${city.slug}.jpg`,
    description: `Professionele website ontwikkeling en webdesign services in ${city.name}, ${city.province}. 3D-websites die scoren in Google en converteren.`,
    telephone: businessData.phone,
    email: businessData.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: locationBusinessData.address.streetAddress,
      addressLocality: city.name,
      postalCode: city.postalCodes[0],
      addressRegion: city.province,
      addressCountry: "NL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: city.coordinates.lat,
      longitude: city.coordinates.lng,
    },
    openingHours: ["Mo-Fr 09:00-17:00"],
    sameAs: [
      "https://linkedin.com/company/proweb-studio",
      "https://github.com/proweb-studio",
      "https://twitter.com/prowebstudio_nl",
    ],
    priceRange: "€€",
    paymentAccepted: "Cash, Credit Card, Invoice, Bank Transfer",
    currenciesAccepted: "EUR",
    areaServed: [
      {
        "@type": "City",
        name: city.name,
        addressRegion: city.province,
        addressCountry: "NL",
      },
      {
        "@type": "State",
        name: city.province,
        addressCountry: "NL",
      },
      {
        "@type": "Country",
        name: "Nederland",
      },
    ],
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: city.coordinates.lat,
        longitude: city.coordinates.lng,
      },
      geoRadius: "50000",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Web Development Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `Website Ontwikkeling ${city.name}`,
            description: `Professionele website ontwikkeling voor bedrijven in ${city.name}`,
            areaServed: city.name,
            serviceType: "Website Development",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `Webdesign ${city.name}`,
            description: `Modern webdesign en gebruikersinterface ontwerp in ${city.name}`,
            areaServed: city.name,
            serviceType: "Web Design",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `E-commerce ${city.name}`,
            description: `Webshop ontwikkeling en e-commerce oplossingen voor ${city.name}`,
            areaServed: city.name,
            serviceType: "E-commerce Development",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `SEO Services ${city.name}`,
            description: `Zoekmachine optimalisatie voor betere vindbaarheidtegen ${city.name}`,
            areaServed: city.name,
            serviceType: "SEO Services",
          },
        },
      ],
    },
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `https://prowebstudio.nl/contact?city=${city.slug}`,
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
      result: {
        "@type": "Reservation",
        name: "Website Consultation",
      },
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://prowebstudio.nl#Organization",
    name: businessData.name,
    legalName: businessData.legalName,
    url: "https://prowebstudio.nl",
    logo: "https://prowebstudio.nl/logo.png",
    image: "https://prowebstudio.nl/og-image.jpg",
    description:
      "ProWeb Studio ontwikkelt snelle, veilige en schaalbare 3D-websites die scoren in Google en converteren.",
    telephone: businessData.phone,
    email: businessData.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: businessData.address.streetAddress,
      addressLocality: businessData.address.addressLocality,
      postalCode: businessData.address.postalCode,
      addressRegion: businessData.address.addressRegion,
      addressCountry: businessData.address.addressCountry,
    },
    vatID: businessData.vatNumber,
    taxID: businessData.kvkNumber,
    foundingDate: "2023",
    sameAs: [
      "https://linkedin.com/company/proweb-studio",
      "https://github.com/proweb-studio",
      "https://twitter.com/prowebstudio_nl",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: businessData.phone,
        contactType: "customer service",
        email: businessData.email,
        availableLanguage: ["Dutch", "English"],
        areaServed: "NL",
        hoursAvailable: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "17:00",
          },
        ],
      },
    ],
    areaServed: {
      "@type": "Country",
      name: "Nederland",
    },
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `https://prowebstudio.nl/locatie/${city.slug}#WebPage`,
    url: `https://prowebstudio.nl/locatie/${city.slug}`,
    name: `Website Laten Maken ${city.name} | ProWeb Studio`,
    description: `Professionele website laten maken in ${city.name}? ✓ Snelle 3D-websites ✓ SEO geoptimaliseerd ✓ Responsive design ✓ Lokale service ${city.province}.`,
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://prowebstudio.nl#WebSite",
    },
    about: [
      {
        "@type": "Thing",
        name: `Website Development ${city.name}`,
        sameAs: `https://en.wikipedia.org/wiki/${city.name.replace(" ", "_")}`,
      },
    ],
    mainEntity: {
      "@id": `https://prowebstudio.nl/locatie/${city.slug}#LocalBusiness`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://prowebstudio.nl",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Locaties",
          item: "https://prowebstudio.nl/locaties",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: city.name,
          item: `https://prowebstudio.nl/locatie/${city.slug}`,
        },
      ],
    },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://prowebstudio.nl/locatie/${city.slug}#Service`,
    name: `Website Ontwikkeling ${city.name}`,
    description: `Professionele website ontwikkeling en webdesign services voor bedrijven in ${city.name}, ${city.province}. Van concept tot lancering.`,
    provider: {
      "@id": "https://prowebstudio.nl#Organization",
    },
    areaServed: [
      {
        "@type": "City",
        name: city.name,
        addressRegion: city.province,
        addressCountry: "NL",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Web Services ${city.name}`,
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom Website Development",
            description:
              "Volledig op maat gemaakte websites met 3D elementen en moderne technologieën",
          },
          priceCurrency: "EUR",
          eligibleRegion: {
            "@type": "Country",
            name: "NL",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "E-commerce Development",
            description:
              "Webshops met Nederlandse betaalmethoden en volledige integratie",
          },
          priceCurrency: "EUR",
          eligibleRegion: {
            "@type": "Country",
            name: "NL",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "SEO Optimization",
            description:
              "Lokale en nationale zoekmachine optimalisatie voor betere vindbaarheidtegen",
          },
          priceCurrency: "EUR",
          eligibleRegion: {
            "@type": "Country",
            name: "NL",
          },
        },
      ],
    },
  };

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [
      localBusinessSchema,
      organizationSchema,
      webPageSchema,
      serviceSchema,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(combinedSchema, null, 2),
      }}
    />
  );
}
