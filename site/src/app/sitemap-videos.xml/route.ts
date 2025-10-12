import {
  scanVideosInDirectory,
  generateVideoSitemapXML,
  type VideoSitemapEntry,
} from "@/lib/sitemap-advanced";
import { existsSync } from "fs";
import { join } from "path";

// Remove edge runtime due to Node.js API requirements (fs/path)
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SITE_URL = (
  process.env.SITE_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://prowebstudio.nl"
).replace(/\/+$/, "");

export async function GET() {
  const baseUrl = SITE_URL;

  // Scan for video files in public directories
  const publicDir = join(process.cwd(), "public");
  let videoEntries: VideoSitemapEntry[] = [];

  if (existsSync(publicDir)) {
    videoEntries = scanVideosInDirectory(publicDir, baseUrl);
  }

  // Define manually curated video content with detailed metadata
  const curatedVideoEntries: VideoSitemapEntry[] = [
    // Demo/showcase videos
    {
      url: `${baseUrl}/`,
      videos: [
        {
          thumbnailLoc: `${baseUrl}/assets/video-thumbnails/hero-demo.jpg`,
          videoLoc: `${baseUrl}/assets/videos/hero-3d-demo.mp4`,
          title: "ProWeb Studio 3D Website Demo - Interactieve Web Experiences",
          description:
            "Ontdek onze innovatieve 3D website technologie. Bekijk hoe wij interactieve web experiences creëren die uw bezoekers boeien en converteren.",
          publicationDate: new Date("2025-01-15"),
          familyFriendly: true,
          live: false,
        },
      ],
      lastModified: new Date("2025-01-15"),
    },

    // Service demonstration videos
    {
      url: `${baseUrl}/diensten/3d-website-ervaringen`,
      videos: [
        {
          thumbnailLoc: `${baseUrl}/assets/video-thumbnails/3d-showcase.jpg`,
          videoLoc: `${baseUrl}/assets/videos/3d-website-showcase.webm`,
          title: "3D Website Showcase - ProWeb Studio Nederland",
          description:
            "Bekijk onze portfolio van geavanceerde 3D websites. Van immersive productpresentaties tot interactieve bedrijfservaringen.",
          publicationDate: new Date("2025-01-10"),
          familyFriendly: true,
          live: false,
          duration: 120, // 2 minutes
        },
        {
          thumbnailLoc: `${baseUrl}/assets/video-thumbnails/three-js-demo.jpg`,
          videoLoc: `${baseUrl}/assets/videos/three-js-implementation.mp4`,
          title: "Three.js Implementatie - Technische Showcase",
          description:
            "Technische demonstratie van onze Three.js expertise. Leer hoe wij cutting-edge 3D technologie integreren in webapplicaties.",
          publicationDate: new Date("2025-01-05"),
          familyFriendly: true,
          live: false,
          duration: 180, // 3 minutes
        },
      ],
      lastModified: new Date("2025-01-10"),
    },

    // Client testimonial videos
    {
      url: `${baseUrl}/portfolio`,
      videos: [
        {
          thumbnailLoc: `${baseUrl}/assets/video-thumbnails/client-testimonial.jpg`,
          videoLoc: `${baseUrl}/assets/videos/client-testimonials.mp4`,
          title: "Klant Testimonials - ProWeb Studio Projecten",
          description:
            "Hoor wat onze klanten zeggen over hun ervaring met ProWeb Studio. Ontdek hoe wij bedrijven helpen hun digitale doelen te bereiken.",
          publicationDate: new Date("2024-12-20"),
          familyFriendly: true,
          live: false,
          duration: 240, // 4 minutes
        },
      ],
      lastModified: new Date("2024-12-20"),
    },

    // Tutorial/educational videos
    {
      url: `${baseUrl}/blog/core-web-vitals-optimalisatie-2025`,
      videos: [
        {
          thumbnailLoc: `${baseUrl}/assets/video-thumbnails/cwv-tutorial.jpg`,
          videoLoc: `${baseUrl}/assets/videos/core-web-vitals-tutorial.mp4`,
          title: "Core Web Vitals Optimalisatie Tutorial - Performance Tips",
          description:
            "Leer hoe u Core Web Vitals kunt optimaliseren voor betere website performance en Google rankings. Praktische tips en technieken.",
          publicationDate: new Date("2025-01-15"),
          familyFriendly: true,
          live: false,
          duration: 600, // 10 minutes
        },
      ],
      lastModified: new Date("2025-01-15"),
    },

    // Company introduction video
    {
      url: `${baseUrl}/over-ons`,
      videos: [
        {
          thumbnailLoc: `${baseUrl}/assets/video-thumbnails/company-intro.jpg`,
          videoLoc: `${baseUrl}/assets/videos/proweb-studio-introduction.webm`,
          title: "ProWeb Studio - Ons Verhaal en Missie",
          description:
            "Maak kennis met het team achter ProWeb Studio. Ontdek onze passie voor innovatieve webtechnologie en onze missie om Nederlandse bedrijven digitaal te transformeren.",
          publicationDate: new Date("2024-12-01"),
          familyFriendly: true,
          live: false,
          duration: 300, // 5 minutes
        },
      ],
      lastModified: new Date("2024-12-01"),
    },
  ];

  // Merge curated entries with dynamically scanned ones
  const mergedEntries = [...curatedVideoEntries];

  for (const dynamicEntry of videoEntries) {
    const existingEntry = mergedEntries.find(
      (entry) => entry.url === dynamicEntry.url,
    );
    if (!existingEntry) {
      mergedEntries.push(dynamicEntry);
    } else {
      // Merge videos from dynamic scan with existing curated entry
      existingEntry.videos.push(...dynamicEntry.videos);
    }
  }

  // If no videos found, return empty sitemap
  if (
    mergedEntries.length === 0 ||
    mergedEntries.every((entry) => entry.videos.length === 0)
  ) {
    const emptyXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <!-- No videos found -->
</urlset>`;

    return new Response(emptyXml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  }

  // Generate XML using the advanced system
  const xml = generateVideoSitemapXML(mergedEntries);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400", // Cache for 24 hours
    },
  });
}

// Removed unused hasVideoContent function - logic moved to GET handler
