const CACHE_NAME = 'ehrenzertifikat-v4';
const urlsToCache = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './favicon-16x16.png',
  './favicon-32x32.png',
  './favicon-192x192.png',
  './favicon-512x512.png',
  './apple-touch-icon.png',
  './VIRENNA_Siegel.PNG'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
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
          return cached || caches.match('./offline.html');
        });
      })
  );
});
