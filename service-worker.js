const CACHE_NAME = 'ehrenzertifikat-v1';
const urlsToCache = [
  './',
  './index.html',
  './favicon-32x32.png',
  './apple-touch-icon.png',
  './site.webmanifest',
  './VIRENNA_Siegel.PNG',
  './offline.html' // Optional – offline fallback Seite, falls vorhanden
];

// Installation – Assets cachen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Aktivierung – alte Caches löschen
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

// Anfragen abfangen – Cache zuerst, dann Netzwerk
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('./offline.html')) // Optionaler Offline-Fallback
  );
});
