"use client";

import Script from "next/script";
import { siteConfig } from "@/config/site.config";

export default function PortfolioSchema() {
  const portfolioSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ProWeb Studio Portfolio - Nederlandse Web Development Projecten",
    description:
      "Portfolio van innovatieve websites, webshops en mobiele applicaties ontwikkeld voor Nederlandse bedrijven. Van 3D interactieve ervaringen tot prestatie-geoptimaliseerde e-commerce platforms.",
    url: `${siteConfig.url}/portfolio`,
    numberOfItems: 3,
    itemListElement: [
      {
        "@type": "CreativeWork",
        "@id": `${siteConfig.url}/portfolio#dutch-fashion-brand`,
        name: "E-commerce Platform voor Nederlandse Fashion Brand",
        description:
          "Complete rebranding en e-commerce platform voor een gevestigde Nederlandse fashion brand met 340% conversie verbetering.",
        creator: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
          location: {
            "@type": "Place",
            addressLocality: "Nederland",
            addressCountry: "NL",
          },
        },
        dateCreated: "2024",
        keywords: [
          "e-commerce",
          "fashion",
          "webshop",
          "nederland",
          "3D design",
          "responsive",
        ],
        workExample: {
          "@type": "WebPage",
          name: "Amsterdam Fashion House E-commerce",
          description:
            "Modern 3D e-commerce platform met interactieve product showcase",
          url: `${siteConfig.url}/portfolio#dutch-fashion-brand`,
        },
        audience: {
          "@type": "Audience",
          geographicArea: {
            "@type": "Country",
            name: "Nederland",
          },
        },
      },
      {
        "@type": "CreativeWork",
        "@id": `${siteConfig.url}/portfolio#tech-startup-platform`,
        name: "SaaS Platform voor Nederlandse Tech Startup",
        description:
          "Complexe data visualisatie platform met real-time analytics voor Nederlandse tech bedrijven met 89% gebruikers retentie verbetering.",
        creator: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
          location: {
            "@type": "Place",
            addressLocality: "Nederland",
            addressCountry: "NL",
          },
        },
        dateCreated: "2024",
        keywords: [
          "saas",
          "data visualization",
          "tech startup",
          "nederland",
          "real-time",
          "analytics",
        ],
        workExample: {
          "@type": "SoftwareApplication",
          name: "InnovateTech Rotterdam Platform",
          description:
            "Interactive 3D dashboard met WebGL visualisaties en real-time data streams",
          url: `${siteConfig.url}/portfolio#tech-startup-platform`,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web Browser",
        },
        audience: {
          "@type": "Audience",
          geographicArea: {
            "@type": "Country",
            name: "Nederland",
          },
        },
      },
      {
        "@type": "CreativeWork",
        "@id": `${siteConfig.url}/portfolio#restaurant-chain-app`,
        name: "Mobile App voor Nederlandse Restaurant Keten",
        description:
          "Progressive Web App met locatie-based services en real-time bestellingen voor restaurant keten met 156% app adoptie verbetering.",
        creator: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
          location: {
            "@type": "Place",
            addressLocality: "Nederland",
            addressCountry: "NL",
          },
        },
        dateCreated: "2024",
        keywords: [
          "mobile app",
          "pwa",
          "restaurant",
          "nederland",
          "geolocation",
          "food ordering",
        ],
        workExample: {
          "@type": "MobileApplication",
          name: "De Smaak van Nederland App",
          description:
            "PWA met geolocation, push notifications en offline functionaliteit",
          url: `${siteConfig.url}/portfolio#restaurant-chain-app`,
          applicationCategory: "LifestyleApplication",
          operatingSystem: "Progressive Web App",
        },
        audience: {
          "@type": "Audience",
          geographicArea: {
            "@type": "Country",
            name: "Nederland",
          },
        },
      },
    ],
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      description:
        "Nederlandse web development studio gespecialiseerd in 3D websites, e-commerce platforms en mobiele applicaties",
      url: siteConfig.url,
      email: siteConfig.email,
      telephone: siteConfig.phone,
      address: {
        "@type": "PostalAddress",
        addressCountry: "NL",
        addressLocality: "Nederland",
      },
      sameAs: [
        siteConfig.social.linkedin,
        siteConfig.social.github,
        siteConfig.social.twitter,
      ],
      areaServed: {
        "@type": "Country",
        name: "Nederland",
      },
      serviceType: [
        "Web Development",
        "E-commerce Development",
        "Mobile App Development",
        "3D Web Design",
        "Brand Identity Design",
      ],
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description:
      "Nederlandse web development studio gespecialiseerd in 3D websites, e-commerce platforms en mobiele applicaties",
    url: siteConfig.url,
    logo: `${siteConfig.url}/assets/logo/logo-proweb-icon.svg`,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      addressCountry: "NL",
      addressLocality: "Nederland",
    },
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.github,
      siteConfig.social.twitter,
    ],
    areaServed: {
      "@type": "Country",
      name: "Nederland",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Web Development Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "3D Website Development",
            description:
              "Interactieve 3D websites met Three.js en React voor Nederlandse bedrijven",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "E-commerce Development",
            description:
              "Prestatie-geoptimaliseerde webshops en e-commerce platforms",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Mobile App Development",
            description: "Progressive Web Apps en mobiele applicaties",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Brand Identity Design",
            description:
              "Complete brand identity en huisstijl voor Nederlandse bedrijven",
          },
        },
      ],
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Portfolio",
        item: `${siteConfig.url}/portfolio`,
      },
    ],
  };

  return (
    <>
      <Script
        id="portfolio-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(portfolioSchema),
        }}
      />
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  );
}
