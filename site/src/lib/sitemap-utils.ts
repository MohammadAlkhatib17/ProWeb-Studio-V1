import { statSync } from 'fs';
import { join } from 'path';

/**
 * Maps route paths to their corresponding source files
 * This allows us to compute lastModified from actual file modification times
 */
export const ROUTE_TO_FILE_MAP: Record<string, string> = {
  '/': 'src/app/page.tsx',
  '/diensten': 'src/app/diensten/page.tsx',
  '/werkwijze': 'src/app/werkwijze/page.tsx',
  '/contact': 'src/app/contact/page.tsx',
  '/over-ons': 'src/app/over-ons/page.tsx',
  '/privacy': 'src/app/privacy/page.tsx',
  '/voorwaarden': 'src/app/voorwaarden/page.tsx',
  '/overzicht': 'src/app/overzicht/page.tsx',
};

/**
 * Additional service routes that use the diensten page as source
 */
export const SERVICE_ROUTES = [
  '/diensten/website-laten-maken',
  '/diensten/3d-website-ontwikkeling',
  '/diensten/seo-optimalisatie',
  '/diensten/webshop-laten-maken',
];

/**
 * Gets the file modification time for a given route
 * @param route - The route path (e.g., '/diensten')
 * @returns Date object with file mtime or null if unable to read
 */
export function getRouteMtime(route: string): Date | null {
  try {
    // Check if it's a service sub-route
    if (SERVICE_ROUTES.includes(route)) {
      route = '/diensten'; // Use diensten page as source for service routes
    }

    const filePath = ROUTE_TO_FILE_MAP[route];
    if (!filePath) {
      console.warn(`No file mapping found for route: ${route}`);
      return null;
    }

    // Get absolute path (assuming we're running from site directory)
    const absolutePath = join(process.cwd(), filePath);
    const stats = statSync(absolutePath);
    
    return stats.mtime;
  } catch (error) {
    console.warn(`Unable to read mtime for route ${route}:`, error);
    return null;
  }
}

/**
 * Gets the lastModified date for a route, with fallback logic
 * @param route - The route path
 * @param fallbackDate - Optional fallback date, defaults to current date
 * @returns Date object for lastModified field
 */
export function getRouteLastModified(route: string, fallbackDate?: Date): Date {
  const mtime = getRouteMtime(route);
  
  if (mtime) {
    return mtime;
  }
  
  // Fall back to provided date or current date
  return fallbackDate || new Date();
}

/**
 * Gets the most recent modification time from multiple related files
 * Useful for routes that depend on multiple source files
 * @param filePaths - Array of file paths relative to site directory
 * @returns Most recent mtime or null if none readable
 */
export function getLatestMtime(filePaths: string[]): Date | null {
  let latestMtime: Date | null = null;

  for (const filePath of filePaths) {
    try {
      const absolutePath = join(process.cwd(), filePath);
      const stats = statSync(absolutePath);
      
      if (!latestMtime || stats.mtime > latestMtime) {
        latestMtime = stats.mtime;
      }
    } catch (error) {
      console.warn(`Unable to read mtime for file ${filePath}:`, error);
    }
  }

  return latestMtime;
}

/**
 * Gets comprehensive mtime for a route considering all related files
 * For example, a page might depend on its main file plus shared components
 * @param route - The route path
 * @param additionalFiles - Additional files to check (e.g., shared components)
 * @returns Most recent modification date or null
 */
export function getComprehensiveRouteMtime(route: string, additionalFiles: string[] = []): Date | null {
  const mainFile = ROUTE_TO_FILE_MAP[route];
  if (!mainFile) {
    return null;
  }

  const allFiles = [mainFile, ...additionalFiles];
  return getLatestMtime(allFiles);
}