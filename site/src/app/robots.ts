import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const SITE_URL = (
    process.env.SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://prowebstudio.nl"
  ).replace(/\/+$/, "");
  const base = SITE_URL; // Already normalized
  const isPreview = process.env.VERCEL_ENV === "preview";

  if (isPreview) {
    // For preview deployments: block all crawlers completely
    return {
      rules: [
        {
          userAgent: "*",
          disallow: ["/"],
        },
      ],
      sitemap: [], // No sitemap for preview
    };
  }

  // Production robots.txt with optimized crawling directives
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/diensten/",
          "/diensten/website-laten-maken",
          "/diensten/webshop-laten-maken",
          "/diensten/seo-optimalisatie",
          "/diensten/3d-website-ervaringen",
          "/diensten/onderhoud-support",
          "/contact/",
          "/werkwijze/",
          "/portfolio/",
          "/over-ons/",
          "/locaties/",
          "/privacy/",
          "/voorwaarden/",
          "/sitemap*.xml", // Allow all sitemap files
          "/robots.txt",
        ],
        disallow: [
          "/speeltuin/", // Playground area - not for public indexing
          "/_next/", // Next.js internal files
          "/api/", // API routes
          "/admin/", // Admin areas if any
          "*.json$", // JSON files
          "/sw.js", // Service worker
          "/offline.html", // Offline page
          "/overzicht-site/", // Internal site overview
          "/.well-known/", // Hidden directories except sitemap
          "/manifest.json", // PWA manifest
        ],
        crawlDelay: 1, // Be respectful to servers
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/diensten/",
          "/diensten/website-laten-maken",
          "/diensten/webshop-laten-maken",
          "/diensten/seo-optimalisatie",
          "/diensten/3d-website-ervaringen",
          "/diensten/onderhoud-support",
          "/contact/",
          "/werkwijze/",
          "/portfolio/",
          "/over-ons/",
          "/locaties/",
          "/privacy/",
          "/voorwaarden/",
          "/sitemap*.xml",
          "/robots.txt",
        ],
        disallow: [
          "/speeltuin/",
          "/_next/",
          "/api/",
          "/admin/",
          "/overzicht-site/",
        ],
        // No crawl delay for Googlebot as it's well-behaved
      },
      {
        userAgent: "Bingbot",
        allow: [
          "/",
          "/diensten/",
          "/diensten/website-laten-maken",
          "/diensten/webshop-laten-maken",
          "/diensten/seo-optimalisatie",
          "/diensten/3d-website-ervaringen",
          "/diensten/onderhoud-support",
          "/contact/",
          "/werkwijze/",
          "/portfolio/",
          "/over-ons/",
          "/locaties/",
          "/privacy/",
          "/voorwaarden/",
        ],
        disallow: [
          "/speeltuin/",
          "/_next/",
          "/api/",
          "/admin/",
          "/overzicht-site/",
        ],
        crawlDelay: 2, // Slightly more conservative for Bing
      },
      {
        userAgent: "facebookexternalhit",
        allow: ["/"], // Allow Facebook for social sharing
        disallow: ["/speeltuin/", "/_next/", "/api/", "/admin/"],
      },
      {
        userAgent: "Twitterbot",
        allow: ["/"], // Allow Twitter for social sharing
        disallow: ["/speeltuin/", "/_next/", "/api/", "/admin/"],
      },
      {
        userAgent: "LinkedInBot",
        allow: ["/"], // Allow LinkedIn for professional sharing
        disallow: ["/speeltuin/", "/_next/", "/api/", "/admin/"],
      },
    ],
    sitemap: [
      `${base}/sitemap-index.xml`, // Main sitemap index for better crawl management
      `${base}/sitemap.xml`, // Core pages sitemap
      `${base}/sitemap-services.xml`, // Dedicated services sitemap
      `${base}/sitemap-locations.xml`, // Dedicated locations sitemap
      `${base}/sitemap-images.xml`, // Existing images sitemap
    ],
    host: "prowebstudio.nl",
  };
}
