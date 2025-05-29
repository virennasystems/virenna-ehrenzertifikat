const CACHE_NAME = 'ehrenzertifikat-v2';

const urlsToCache = [
  './',
  './index.html',
  './favicon-32x32.png',
  './apple-touch-icon.png',
  './VIRENNA_Siegel.PNG',
  './manifest.json',
  './offline.html'
];

// INSTALLATION – Ressourcen im Cache speichern
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// AKTIVIERUNG – alte Caches entfernen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH – Ressourcen zuerst aus Cache laden, sonst aus dem Netz
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return (
        cachedResponse ||
        fetch(event.request).catch(() =>
          caches.match('./offline.html')
        )
      );
    })
  );
});
