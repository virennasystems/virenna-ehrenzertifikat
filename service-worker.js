const CACHE_NAME = 'ehrenzertifikat-v5';
const urlsToCache = [
  './',
  './index.html?v=5',
  './offline.html?v=5',
  './manifest.json?v=5',
  './favicon-16x16.png?v=5',
  './favicon-32x32.png?v=5',
  './favicon-192x192.png?v=5',
  './favicon-512x512.png?v=5',
  './apple-touch-icon.png?v=5',
  './VIRENNA_Siegel.PNG?v=5'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('🧹 Entferne alten Cache:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(cached => {
          return cached || caches.match('./offline.html?v=5');
        });
      })
  );
});
