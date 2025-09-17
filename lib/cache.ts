import { unstable_cache } from 'next/cache';

// Cache configuration constants
export const CACHE_TAGS = {
  portfolio: 'portfolio',
  blog: 'blog',
  services: 'services',
} as const;

export const CACHE_DURATIONS = {
  static: 31536000, // 1 year
  dynamic: 3600, // 1 hour
  api: 60, // 1 minute
} as const;

// Wrapper for cached data fetching with stale-while-revalidate
export const getCachedData = unstable_cache(
  async (key: string, fetcher: () => Promise<any>) => {
    return await fetcher();
  },
  ['cached-data'],
  {
    revalidate: CACHE_DURATIONS.dynamic,
    tags: ['data'],
  }
);

// Helper to generate cache headers
export const getCacheHeaders = (type: 'static' | 'dynamic' | 'api' = 'dynamic') => {
  switch (type) {
    case 'static':
      return {
        'Cache-Control': `public, max-age=${CACHE_DURATIONS.static}, immutable`,
      };
    case 'api':
      return {
        'Cache-Control': `s-maxage=${CACHE_DURATIONS.api}, stale-while-revalidate=86400`,
      };
    case 'dynamic':
    default:
      return {
        'Cache-Control': `public, s-maxage=${CACHE_DURATIONS.dynamic}, stale-while-revalidate=86400`,
      };
  }
};

// Function to trigger on-demand revalidation
export async function revalidateCache(path?: string, tag?: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/revalidate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-revalidate-secret': process.env.REVALIDATION_SECRET || '',
    },
    body: JSON.stringify({ path, tag }),
  });
  
  return response.json();
}
