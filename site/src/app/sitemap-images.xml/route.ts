import {
  scanImagesInDirectory,
  generateImageSitemapXML,
  type ImageSitemapEntry,
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

  // Dynamically scan for images in public directories
  const publicDir = join(process.cwd(), "public");
  let allImageEntries: ImageSitemapEntry[] = [];

  if (existsSync(publicDir)) {
    allImageEntries = scanImagesInDirectory(publicDir, baseUrl);
  }

  // Add manually curated key images with detailed metadata
  const curatedImageEntries: ImageSitemapEntry[] = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      images: [
        {
          loc: `${baseUrl}/assets/hero/nebula_helix.avif`,
          caption:
            "ProWeb Studio - Revolutionaire webontwikkeling met kosmische precisie in Nederland",
          title: "Hero achtergrond - Nebula Helix - Website laten maken",
          geoLocation: "Netherlands",
        },
        {
          loc: `${baseUrl}/assets/hero/nebula_helix.webp`,
          caption:
            "ProWeb Studio - Revolutionaire webontwikkeling met kosmische precisie in Nederland",
          title: "Hero achtergrond - Nebula Helix (WebP) - Webdesign Nederland",
          geoLocation: "Netherlands",
        },
        {
          loc: `${baseUrl}/assets/hero_portal_background.avif`,
          caption:
            "ProWeb Studio portaal - Toegang tot digitale transformatie voor Nederlandse bedrijven",
          title: "Hero Portal achtergrond - Website ontwikkeling",
          geoLocation: "Netherlands",
        },
        {
          loc: `${baseUrl}/assets/logo/logo-proweb-lockup.svg`,
          caption:
            "ProWeb Studio logo - Professionele webontwikkeling Amsterdam Rotterdam Utrecht",
          title: "ProWeb Studio Logo Lockup - Webdesign Bureau Nederland",
          geoLocation: "Netherlands",
        },
        {
          loc: `${baseUrl}/assets/logo/logo-proweb-icon.svg`,
          caption: "ProWeb Studio icoon - Nederlandse webdesign specialist",
          title: "ProWeb Studio Icoon - Website maken Nederland",
          geoLocation: "Netherlands",
        },
      ],
    },
    {
      url: `${baseUrl}/diensten`,
      lastModified: new Date("2025-09-20"),
      images: [
        {
          loc: `${baseUrl}/assets/nebula_services_background.avif`,
          caption:
            "Onze diensten - Webontwikkeling, design en digitale strategieën",
          title: "Services achtergrond - Nebula",
        },
        {
          loc: `${baseUrl}/assets/nebula_services_background.webp`,
          caption:
            "Onze diensten - Webontwikkeling, design en digitale strategieën",
          title: "Services achtergrond - Nebula (WebP)",
        },
        {
          loc: `${baseUrl}/assets/logo/logo-proweb-lockup.svg`,
          caption: "ProWeb Studio - Professionele webdiensten",
          title: "ProWeb Studio Logo",
        },
      ],
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date("2025-09-15"),
      images: [
        {
          loc: `${baseUrl}/assets/glowing_beacon_contact.avif`,
          caption:
            "Contact ProWeb Studio - Laat uw digitale visie werkelijkheid worden",
          title: "Contact achtergrond - Glowing Beacon",
          geoLocation: "Netherlands", // Contact page is location-relevant
        },
        {
          loc: `${baseUrl}/assets/logo/logo-proweb-lockup.svg`,
          caption: "ProWeb Studio contact - Neem contact op voor uw project",
          title: "ProWeb Studio Logo",
        },
      ],
    },
    {
      url: `${baseUrl}/over-ons`,
      lastModified: new Date("2025-09-05"),
      images: [
        {
          loc: `${baseUrl}/assets/team_core_star.webp`,
          caption: "Over ProWeb Studio - Ons expertteam en visie",
          title: "Team Core Star achtergrond",
        },
        {
          loc: `${baseUrl}/assets/team_core_star.png`,
          caption: "Over ProWeb Studio - Ons expertteam en visie",
          title: "Team Core Star achtergrond (PNG)",
        },
        {
          loc: `${baseUrl}/assets/logo/logo-proweb-lockup.svg`,
          caption: "ProWeb Studio team - Kennismaking met onze experts",
          title: "ProWeb Studio Logo",
        },
      ],
    },
    {
      url: `${baseUrl}/werkwijze`,
      lastModified: new Date("2025-09-10"),
      images: [
        {
          loc: `${baseUrl}/assets/logo/logo-proweb-lockup.svg`,
          caption: "ProWeb Studio werkwijze - Onze methodologie en proces",
          title: "ProWeb Studio Logo",
        },
      ],
    },
  ];

  // Merge curated entries with dynamically scanned ones
  // Avoid duplicates by preferring curated entries over dynamic ones
  const mergedEntries = [...curatedImageEntries];

  for (const dynamicEntry of allImageEntries) {
    const existingEntry = mergedEntries.find(
      (entry) => entry.url === dynamicEntry.url,
    );
    if (!existingEntry) {
      mergedEntries.push(dynamicEntry);
    }
  }

  // Generate XML using the advanced system
  const xml = generateImageSitemapXML(mergedEntries);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400", // Cache for 24 hours
    },
  });
}
