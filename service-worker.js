const CACHE_NAME = 'zertifikat-cache-v1';
const OFFLINE_URL = 'offline.html';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll([
        'index.html',
        'offline.html',
        'VIRENNA_Siegel.PNG',
        'favicon-32x32.png',
        'apple-touch-icon.png',
        'manifest.json'
      ])
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then(response => response || caches.match(OFFLINE_URL))
    )
  );
});
