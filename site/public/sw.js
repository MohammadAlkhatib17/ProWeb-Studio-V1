// Advanced Service Worker for ProWeb Studio
// Version 2.1.0 - Robust caching with error handling

const CACHE_NAME = 'proweb-studio-v2.1';
const STATIC_CACHE_NAME = 'proweb-static-v2.1';
const DYNAMIC_CACHE_NAME = 'proweb-dynamic-v2.1';
const API_CACHE_NAME = 'proweb-api-v2.1';

// Static assets to cache - only essential files that definitely exist
const STATIC_ASSETS = [
  '/',
  '/manifest.json'
];

// Install event with robust error handling
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker v2.1');

  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(async (cache) => {
      // Cache each asset individually to handle failures gracefully
      const cachePromises = STATIC_ASSETS.map(async (url) => {
        try {
          const response = await fetch(url);
          if (response.ok) {
            await cache.put(url, response);
            console.log('[SW] Cached:', url);
          }
        } catch (error) {
          console.warn('[SW] Failed to cache:', url, error.message);
          // Don't throw - continue caching other assets
        }
      });

      await Promise.all(cachePromises);
      return self.skipWaiting();
    })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker v2.1');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old version caches
          if (!cacheName.includes('v2.1')) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip third-party requests (Vercel, Plausible, etc.)
  if (!url.origin.includes('prowebstudio.nl') && !url.origin.includes('localhost')) {
    return;
  }

  // Skip API requests that shouldn't be cached
  if (url.pathname.startsWith('/api/csp-report') ||
    url.pathname.startsWith('/api/monitoring')) {
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
  } else if (isStaticAsset(url)) {
    event.respondWith(handleStaticAsset(request));
  } else {
    event.respondWith(handlePageRequest(request));
  }
});

async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE_NAME);
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleStaticAsset(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn('[SW] Static asset fetch failed:', request.url);
    throw error;
  }
}

async function handlePageRequest(request) {
  // Network-first strategy for pages
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Fallback to cache if network fails
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page or error
    return new Response('Offline - Probeer later opnieuw', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

function isStaticAsset(url) {
  const staticExtensions = [
    '.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg',
    '.css', '.js', '.mjs', '.woff', '.woff2', '.ttf', '.eot', '.ico'
  ];

  return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

console.log('[SW] ProWeb Studio Service Worker v2.1 loaded');
