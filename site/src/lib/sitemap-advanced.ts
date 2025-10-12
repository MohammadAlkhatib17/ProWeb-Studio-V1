import { execSync } from "child_process";
import { statSync, readdirSync, existsSync } from "fs";
import { join, extname } from "path";

/**
 * Advanced sitemap utilities for ProWeb Studio
 * Includes git-based lastmod, image scanning, video detection, and more
 */

export interface SitemapUrl {
  url: string;
  lastModified: Date;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
  alternates?: { hreflang: string; href: string }[];
}

export interface ImageSitemapEntry {
  url: string;
  images: Array<{
    loc: string;
    caption?: string;
    geoLocation?: string;
    title?: string;
    license?: string;
  }>;
  lastModified?: Date;
}

export interface VideoSitemapEntry {
  url: string;
  videos: Array<{
    thumbnailLoc: string;
    videoLoc: string;
    title: string;
    description?: string;
    contentLoc?: string;
    duration?: number;
    publicationDate?: Date;
    familyFriendly?: boolean;
    live?: boolean;
  }>;
  lastModified?: Date;
}

export interface NewsSitemapEntry {
  url: string;
  news: {
    publicationDate: Date;
    title: string;
    keywords?: string;
    stockTickers?: string;
  };
  lastModified?: Date;
}

const SITE_URL = (
  process.env.SITE_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://prowebstudio.nl"
).replace(/\/+$/, "");

/**
 * Get file modification date from git history or file system
 */
export function getLastModifiedDate(filePath: string): Date {
  try {
    // Try to get the last commit date for this file from git
    const gitDate = execSync(`git log -1 --format="%ci" -- "${filePath}"`, {
      encoding: "utf-8",
      cwd: process.cwd(),
    }).trim();

    if (gitDate) {
      return new Date(gitDate);
    }
  } catch {
    // Git command failed, fall back to file system
  }

  try {
    // Fallback to file system modification time
    const stats = statSync(join(process.cwd(), filePath));
    return stats.mtime;
  } catch {
    // File doesn't exist or can't be read
    return new Date();
  }
}

/**
 * Get the most recent modification date from multiple files
 */
export function getLatestModificationDate(filePaths: string[]): Date {
  let latestDate = new Date(0); // Start with epoch

  for (const filePath of filePaths) {
    const fileDate = getLastModifiedDate(filePath);
    if (fileDate > latestDate) {
      latestDate = fileDate;
    }
  }

  return latestDate > new Date(0) ? latestDate : new Date();
}

/**
 * Scan directory for images and extract metadata
 */
export function scanImagesInDirectory(
  dirPath: string,
  baseUrl: string = SITE_URL,
): ImageSitemapEntry[] {
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".avif",
    ".svg",
    ".gif",
  ];
  const entries: ImageSitemapEntry[] = [];

  function scanDirectory(currentPath: string, urlPath: string = ""): void {
    try {
      const items = readdirSync(currentPath, { withFileTypes: true });

      for (const item of items) {
        const itemPath = join(currentPath, item.name);
        const itemUrlPath = `${urlPath}/${item.name}`;

        if (item.isDirectory() && !item.name.startsWith(".")) {
          scanDirectory(itemPath, itemUrlPath);
        } else if (
          item.isFile() &&
          imageExtensions.includes(extname(item.name).toLowerCase())
        ) {
          // Find associated page for this image
          const pageUrl = findAssociatedPage(itemUrlPath);

          const imageEntry: ImageSitemapEntry = {
            url: pageUrl,
            images: [
              {
                loc: `${baseUrl}${itemUrlPath}`,
                title: generateImageTitle(item.name),
                caption: generateImageCaption(item.name, pageUrl),
                geoLocation: "Netherlands", // Default for ProWeb Studio
              },
            ],
            lastModified: getLastModifiedDate(
              itemPath.replace(process.cwd() + "/", ""),
            ),
          };

          // Check if we already have an entry for this page
          const existingEntry = entries.find((e) => e.url === pageUrl);
          if (existingEntry) {
            existingEntry.images.push(...imageEntry.images);
          } else {
            entries.push(imageEntry);
          }
        }
      }
    } catch (error) {
      console.warn(`Could not scan directory ${currentPath}:`, error);
    }
  }

  if (existsSync(dirPath)) {
    scanDirectory(dirPath);
  }

  return entries;
}

/**
 * Find the most appropriate page URL for an image based on its path
 */
function findAssociatedPage(imagePath: string): string {
  // Remove leading slash and file extension
  const pathParts = imagePath.replace(/^\/+/, "").split("/");

  // Map common directories to pages
  const directoryPageMap: Record<string, string> = {
    hero: "/",
    services: "/diensten",
    portfolio: "/portfolio",
    about: "/over-ons",
    contact: "/contact",
    icons: "/",
    screenshots: "/",
    assets: "/",
  };

  // Check for direct directory mapping
  for (const dir of pathParts) {
    if (directoryPageMap[dir]) {
      return `${SITE_URL}${directoryPageMap[dir]}`;
    }
  }

  // Default to homepage
  return SITE_URL + "/";
}

/**
 * Generate descriptive title for image based on filename
 */
function generateImageTitle(filename: string): string {
  const nameWithoutExt = filename.replace(/\.[^.]+$/, "");
  const words = nameWithoutExt
    .replace(/[-_]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));

  return `${words.join(" ")} - ProWeb Studio`;
}

/**
 * Generate SEO-optimized caption for image
 */
function generateImageCaption(filename: string, pageUrl: string): string {
  const title = generateImageTitle(filename);

  if (pageUrl.includes("/diensten")) {
    return `${title} - Professionele webdiensten Nederland`;
  } else if (pageUrl.includes("/portfolio")) {
    return `${title} - Portfolio webprojecten ProWeb Studio`;
  } else if (pageUrl.includes("/contact")) {
    return `${title} - Contact ProWeb Studio Nederland`;
  }

  return `${title} - Website laten maken Nederland`;
}

/**
 * Scan for video files and extract metadata
 */
export function scanVideosInDirectory(
  dirPath: string,
  baseUrl: string = SITE_URL,
): VideoSitemapEntry[] {
  const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv", ".m4v"];
  const entries: VideoSitemapEntry[] = [];

  function scanDirectory(currentPath: string, urlPath: string = ""): void {
    try {
      const items = readdirSync(currentPath, { withFileTypes: true });

      for (const item of items) {
        const itemPath = join(currentPath, item.name);
        const itemUrlPath = `${urlPath}/${item.name}`;

        if (item.isDirectory() && !item.name.startsWith(".")) {
          scanDirectory(itemPath, itemUrlPath);
        } else if (
          item.isFile() &&
          videoExtensions.includes(extname(item.name).toLowerCase())
        ) {
          const pageUrl = findAssociatedPage(itemUrlPath);

          const videoEntry: VideoSitemapEntry = {
            url: pageUrl,
            videos: [
              {
                videoLoc: `${baseUrl}${itemUrlPath}`,
                thumbnailLoc:
                  findVideoThumbnail(itemPath) ||
                  `${baseUrl}/assets/video-thumbnail-default.jpg`,
                title: generateVideoTitle(item.name),
                description: generateVideoDescription(item.name),
                publicationDate: getLastModifiedDate(
                  itemPath.replace(process.cwd() + "/", ""),
                ),
                familyFriendly: true,
                live: false,
              },
            ],
            lastModified: getLastModifiedDate(
              itemPath.replace(process.cwd() + "/", ""),
            ),
          };

          entries.push(videoEntry);
        }
      }
    } catch (error) {
      console.warn(`Could not scan directory ${currentPath}:`, error);
    }
  }

  if (existsSync(dirPath)) {
    scanDirectory(dirPath);
  }

  return entries;
}

/**
 * Find thumbnail for video file
 */
function findVideoThumbnail(videoPath: string): string | null {
  const basePath = videoPath.replace(/\.[^.]+$/, "");
  const thumbnailExtensions = [".jpg", ".jpeg", ".png", ".webp"];

  for (const ext of thumbnailExtensions) {
    const thumbnailPath = `${basePath}${ext}`;
    if (existsSync(thumbnailPath)) {
      return thumbnailPath.replace(process.cwd() + "/public", "");
    }
  }

  return null;
}

/**
 * Generate video title from filename
 */
function generateVideoTitle(filename: string): string {
  const nameWithoutExt = filename.replace(/\.[^.]+$/, "");
  const words = nameWithoutExt
    .replace(/[-_]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));

  return `${words.join(" ")} - ProWeb Studio Nederland`;
}

/**
 * Generate video description
 */
function generateVideoDescription(filename: string): string {
  const title = generateVideoTitle(filename);
  return `${title} - Bekijk onze professionele webdiensten en 3D website ervaringen. ProWeb Studio levert cutting-edge weboplossingen voor Nederlandse bedrijven.`;
}

/**
 * Split sitemap entries into chunks to respect 50k URL limit
 */
export function chunkSitemapEntries<T>(
  entries: T[],
  maxPerSitemap: number = 50000,
): T[][] {
  const chunks: T[][] = [];

  for (let i = 0; i < entries.length; i += maxPerSitemap) {
    chunks.push(entries.slice(i, i + maxPerSitemap));
  }

  return chunks;
}

/**
 * Generate sitemap XML with proper formatting
 */
export function generateSitemapXML(
  entries: SitemapUrl[],
  includeHreflang: boolean = true,
): string {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>`;
  const urlsetOpen = includeHreflang
    ? `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`
    : `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastModified.toISOString().split("T")[0];
      let urlXml = `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>`;

      if (includeHreflang && entry.alternates) {
        for (const alternate of entry.alternates) {
          urlXml += `\n    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${alternate.href}" />`;
        }
      } else if (includeHreflang) {
        // Default hreflang for Dutch site
        urlXml += `\n    <xhtml:link rel="alternate" hreflang="nl-NL" href="${entry.url}" />`;
        urlXml += `\n    <xhtml:link rel="alternate" hreflang="nl" href="${entry.url}" />`;
      }

      urlXml += `\n  </url>`;
      return urlXml;
    })
    .join("\n");

  return `${xmlHeader}\n${urlsetOpen}\n${urls}\n</urlset>`;
}

/**
 * Generate image sitemap XML
 */
export function generateImageSitemapXML(entries: ImageSitemapEntry[]): string {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>`;
  const urlsetOpen = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastModified
        ? entry.lastModified.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      let urlXml = `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${lastmod}</lastmod>`;

      for (const image of entry.images) {
        urlXml += `\n    <image:image>
      <image:loc>${image.loc}</image:loc>`;

        if (image.caption) {
          urlXml += `\n      <image:caption><![CDATA[${image.caption}]]></image:caption>`;
        }

        if (image.title) {
          urlXml += `\n      <image:title><![CDATA[${image.title}]]></image:title>`;
        }

        if (image.geoLocation) {
          urlXml += `\n      <image:geo_location>${image.geoLocation}</image:geo_location>`;
        }

        if (image.license) {
          urlXml += `\n      <image:license>${image.license}</image:license>`;
        }

        urlXml += `\n    </image:image>`;
      }

      urlXml += `\n  </url>`;
      return urlXml;
    })
    .join("\n");

  return `${xmlHeader}\n${urlsetOpen}\n${urls}\n</urlset>`;
}

/**
 * Generate video sitemap XML
 */
export function generateVideoSitemapXML(entries: VideoSitemapEntry[]): string {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>`;
  const urlsetOpen = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;

  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastModified
        ? entry.lastModified.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      let urlXml = `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${lastmod}</lastmod>`;

      for (const video of entry.videos) {
        urlXml += `\n    <video:video>
      <video:thumbnail_loc>${video.thumbnailLoc}</video:thumbnail_loc>
      <video:title><![CDATA[${video.title}]]></video:title>`;

        if (video.description) {
          urlXml += `\n      <video:description><![CDATA[${video.description}]]></video:description>`;
        }

        if (video.contentLoc) {
          urlXml += `\n      <video:content_loc>${video.contentLoc}</video:content_loc>`;
        } else {
          urlXml += `\n      <video:player_loc>${video.videoLoc}</video:player_loc>`;
        }

        if (video.duration) {
          urlXml += `\n      <video:duration>${video.duration}</video:duration>`;
        }

        if (video.publicationDate) {
          urlXml += `\n      <video:publication_date>${video.publicationDate.toISOString()}</video:publication_date>`;
        }

        if (video.familyFriendly !== undefined) {
          urlXml += `\n      <video:family_friendly>${video.familyFriendly ? "yes" : "no"}</video:family_friendly>`;
        }

        if (video.live !== undefined) {
          urlXml += `\n      <video:live>${video.live ? "yes" : "no"}</video:live>`;
        }

        urlXml += `\n    </video:video>`;
      }

      urlXml += `\n  </url>`;
      return urlXml;
    })
    .join("\n");

  return `${xmlHeader}\n${urlsetOpen}\n${urls}\n</urlset>`;
}

/**
 * Generate news sitemap XML
 */
export function generateNewsSitemapXML(entries: NewsSitemapEntry[]): string {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>`;
  const urlsetOpen = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">`;

  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastModified
        ? entry.lastModified.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      let urlXml = `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <news:news>
      <news:publication>
        <news:name>ProWeb Studio Blog</news:name>
        <news:language>nl</news:language>
      </news:publication>
      <news:publication_date>${entry.news.publicationDate.toISOString()}</news:publication_date>
      <news:title><![CDATA[${entry.news.title}]]></news:title>`;

      if (entry.news.keywords) {
        urlXml += `\n      <news:keywords>${entry.news.keywords}</news:keywords>`;
      }

      if (entry.news.stockTickers) {
        urlXml += `\n      <news:stock_tickers>${entry.news.stockTickers}</news:stock_tickers>`;
      }

      urlXml += `\n    </news:news>
  </url>`;
      return urlXml;
    })
    .join("\n");

  return `${xmlHeader}\n${urlsetOpen}\n${urls}\n</urlset>`;
}

/**
 * Generate sitemap index XML
 */
export function generateSitemapIndexXML(
  sitemaps: Array<{ loc: string; lastmod?: Date }>,
): string {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>`;
  const sitemapindexOpen = `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  const sitemapEntries = sitemaps
    .map((sitemap) => {
      const lastmod = sitemap.lastmod
        ? sitemap.lastmod.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      return `  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`;
    })
    .join("\n");

  return `${xmlHeader}\n${sitemapindexOpen}\n${sitemapEntries}\n</sitemapindex>`;
}
