const CACHE_NAME = 'virenna-zertifikat-v1';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './favicon-32x32.png',
  './favicon-16x16.png',
  './apple-touch-icon.png',
  './site.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});