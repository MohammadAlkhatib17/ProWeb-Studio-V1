// Enhanced Service Worker for Perfect Core Web Vitals
// Version 3.0.0 - Optimized for Dutch users with advanced caching strategies

const CACHE_VERSION = '3.0.0';
const STATIC_CACHE_NAME = `proweb-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `proweb-dynamic-v${CACHE_VERSION}`;
const API_CACHE_NAME = `proweb-api-v${CACHE_VERSION}`;
const IMAGE_CACHE_NAME = `proweb-images-v${CACHE_VERSION}`;
const FONT_CACHE_NAME = `proweb-fonts-v${CACHE_VERSION}`;

// Cache expiration times (in milliseconds)
const CACHE_EXPIRES = {
  STATIC: 365 * 24 * 60 * 60 * 1000, // 1 year
  DYNAMIC: 7 * 24 * 60 * 60 * 1000,  // 1 week
  API: 5 * 60 * 1000,                 // 5 minutes
  IMAGES: 30 * 24 * 60 * 60 * 1000,   // 30 days
  FONTS: 365 * 24 * 60 * 60 * 1000,   // 1 year
};

// Critical static assets to cache immediately (for LCP optimization)
const CRITICAL_STATIC_ASSETS = [
  '/',
  '/diensten',
  '/werkwijze',
  '/contact',
  '/speeltuin',
  '/manifest.json',
  '/icons/favicon-32.png',
  '/icons/favicon-16.png',
  '/offline.html',
];

// Precache strategy for next.js pages
const ROUTE_PREFETCH_ASSETS = [
  '/_next/static/css/',
  '/_next/static/chunks/',
];

// Network request patterns
const PATTERNS = {
  API: /^https:\/\/api\./,
  IMAGES: /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i,
  FONTS: /\.(woff|woff2|ttf|eot)$/i,
  STATIC_ASSETS: /\.(css|js|json)$/i,
  EXTERNAL_ANALYTICS: /^https:\/\/(plausible\.io|vitals\.vercel-insights\.com)/,
};

// Utility functions for cache management
function isExpired(cachedResponse) {
  if (!cachedResponse) return true;
  
  const cachedDate = cachedResponse.headers.get('sw-cached-date');
  if (!cachedDate) return true;
  
  const cacheTime = parseInt(cachedDate);
  const now = Date.now();
  const maxAge = cachedResponse.headers.get('sw-max-age') || CACHE_EXPIRES.DYNAMIC;
  
  return (now - cacheTime) > parseInt(maxAge);
}

function addTimestampToResponse(response, maxAge) {
  const responseClone = response.clone();
  const headers = new Headers(responseClone.headers);
  headers.set('sw-cached-date', Date.now().toString());
  headers.set('sw-max-age', maxAge.toString());
  
  return new Response(responseClone.body, {
    status: responseClone.status,
    statusText: responseClone.statusText,
    headers: headers
  });
}

// Enhanced install event with critical resource caching
self.addEventListener('install', (event) => {
  console.log(`[SW] Installing service worker v${CACHE_VERSION}`);
  
  event.waitUntil(
    Promise.all([
      // Cache critical static assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        return cache.addAll(CRITICAL_STATIC_ASSETS);
      }),
      // Prefetch critical resources
      caches.open(FONT_CACHE_NAME).then((cache) => {
        const fontUrls = [
          'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
          'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2',
        ];
        return Promise.allSettled(
          fontUrls.map(url => 
            fetch(url).then(response => 
              response.ok ? cache.put(url, response) : Promise.resolve()
            ).catch(() => Promise.resolve())
          )
        );
      })
    ]).then(() => {
      console.log('[SW] Installation complete, skipping waiting');
      return self.skipWaiting();
    })
  );
});

// Enhanced activate event with cleanup
self.addEventListener('activate', (event) => {
  console.log(`[SW] Activating service worker v${CACHE_VERSION}`);
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheName.includes(CACHE_VERSION)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all open pages
      self.clients.claim()
    ]).then(() => {
      return self.clients.claim();
    })
  );
});

// Advanced fetch event handler with multiple caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests with appropriate strategies
  if (PATTERNS.EXTERNAL_ANALYTICS.test(url.href)) {
    // Analytics: Network first with no cache fallback
    event.respondWith(handleAnalyticsRequest(request));
  } else if (url.pathname.startsWith('/api/')) {
    // API: Network first with stale-while-revalidate
    event.respondWith(handleApiRequest(request));
  } else if (PATTERNS.IMAGES.test(url.pathname)) {
    // Images: Cache first with network fallback
    event.respondWith(handleImageRequest(request));
  } else if (PATTERNS.FONTS.test(url.pathname)) {
    // Fonts: Cache first (long-term)
    event.respondWith(handleFontRequest(request));
  } else if (PATTERNS.STATIC_ASSETS.test(url.pathname) || url.pathname.includes('/_next/static/')) {
    // Static assets: Cache first with network fallback
    event.respondWith(handleStaticAsset(request));
  } else {
    // Pages: Stale-while-revalidate with offline fallback
    event.respondWith(handlePageRequest(request));
  }
});

// Analytics requests - Network only
async function handleAnalyticsRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    // Fail silently for analytics
    return new Response('', { status: 204 });
  }
}

// API requests - Network first with cache fallback and expiry
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const timestampedResponse = addTimestampToResponse(networkResponse, CACHE_EXPIRES.API);
      await cache.put(request, timestampedResponse.clone());
      return timestampedResponse;
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse && !isExpired(cachedResponse)) {
      return cachedResponse;
    }
    throw error;
  }
}

// Image requests - Cache first with long-term storage
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse && !isExpired(cachedResponse)) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const timestampedResponse = addTimestampToResponse(networkResponse, CACHE_EXPIRES.IMAGES);
      await cache.put(request, timestampedResponse.clone());
      return timestampedResponse;
    }
    return networkResponse;
  } catch (error) {
    return cachedResponse || new Response('Image not found', { status: 404 });
  }
}

// Font requests - Cache first with very long-term storage
async function handleFontRequest(request) {
  const cache = await caches.open(FONT_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const timestampedResponse = addTimestampToResponse(networkResponse, CACHE_EXPIRES.FONTS);
      await cache.put(request, timestampedResponse.clone());
      return timestampedResponse;
    }
    return networkResponse;
  } catch (error) {
    throw error;
  }
}

// Static assets - Cache first with network fallback
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse && !isExpired(cachedResponse)) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const timestampedResponse = addTimestampToResponse(networkResponse, CACHE_EXPIRES.STATIC);
      await cache.put(request, timestampedResponse.clone());
      return timestampedResponse;
    }
    return networkResponse;
  } catch (error) {
    return cachedResponse || new Response('Asset not found', { status: 404 });
  }
}

// Page requests - Stale-while-revalidate with offline fallback
async function handlePageRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Always try to fetch fresh content in the background
  const fetchPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const timestampedResponse = addTimestampToResponse(networkResponse, CACHE_EXPIRES.DYNAMIC);
      await cache.put(request, timestampedResponse.clone());
      return timestampedResponse;
    }
    return networkResponse;
  }).catch(() => null);
  
  // Return cached version immediately if available
  if (cachedResponse) {
    // Update cache in background
    fetchPromise.catch(() => {});
    return cachedResponse;
  }
  
  // If no cache, wait for network or return offline page
  try {
    return await fetchPromise;
  } catch (error) {
    const offlineResponse = await cache.match('/offline.html');
    return offlineResponse || new Response('Offline', { 
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('[SW] Performing background sync');
  // Implement any background sync logic here
}

// Message handling for cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'CACHE_UPDATE') {
    event.waitUntil(updateCaches());
  }
});

async function updateCaches() {
  console.log('[SW] Updating caches');
  const cache = await caches.open(STATIC_CACHE_NAME);
  return cache.addAll(CRITICAL_STATIC_ASSETS);
}

console.log(`[SW] ProWeb Studio Service Worker v${CACHE_VERSION} loaded with advanced caching strategies`);
