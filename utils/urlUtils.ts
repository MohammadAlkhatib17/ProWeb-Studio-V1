export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://prowebstudio.nl';

export function normalizeUrl(url: string): string {
  // Convert to lowercase and replace underscores/spaces with hyphens
  return url
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-/]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getAbsoluteUrl(path: string): string {
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

export function isValidSlug(slug: string): boolean {
  // Check if URL follows proper format (lowercase, hyphens only)
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

export function generateCanonicalUrl(pathname: string): string {
  // Remove trailing slashes and query parameters for canonical
  const cleanPath = pathname.replace(/\/$/, '').split('?')[0];
  return getAbsoluteUrl(cleanPath);
}

export interface HreflangLink {
  lang: string;
  url: string;
}

export function generateHreflangLinks(pathname: string): HreflangLink[] {
  const basePath = pathname.replace(/^\/(nl|en)/, '');
  
  return [
    {
      lang: 'nl',
      url: getAbsoluteUrl(`${basePath}`)
    },
    {
      lang: 'en',
      url: getAbsoluteUrl(`/en${basePath}`)
    },
    {
      lang: 'x-default',
      url: getAbsoluteUrl(`${basePath}`)
    }
  ];
}
