const CACHE_NAME = 'wb-core-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/chapters.html',
  '/reader.html',
  '/characters.html',
  '/settings.html',
  '/src/main.js',
  '/src/style.css',
  '/chapters.json',
  '/manga_data.json',
  '/hero.png',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Stale-While-Revalidate for images
  if (event.request.destination === 'image' || url.pathname.includes('/manga/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchedResponse = fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }).catch(() => null);
          return cachedResponse || fetchedResponse;
        });
      })
    );
  } else {
    // Cache First for other assets
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});

// PERIODIC SYNC (PROMPT_10)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-new-missions') {
    event.waitUntil(checkForNewChapters());
  }
});

async function checkForNewChapters() {
  const cache = await caches.open(CACHE_NAME);
  const response = await fetch('/chapters.json');
  if (response.ok) {
    await cache.put('/chapters.json', response.clone());
  }
}
