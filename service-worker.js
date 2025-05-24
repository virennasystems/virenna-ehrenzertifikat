const CACHE_NAME = 'ehrenzertifikat-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon-32x32.png',
  '/VIRENNA_Siegel.PNG',
  '/site.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
