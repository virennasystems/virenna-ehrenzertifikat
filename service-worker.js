const CACHE_NAME = 'ehrenzertifikat-v1';
const urlsToCache = [
  './',
  './index.html',
  './favicon-32x32.png',
  './apple-touch-icon.png',
  './manifest.json',
  './offline.html',
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
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => caches.match('./offline.html'));
    })
  );
});
