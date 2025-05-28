const CACHE_NAME = 'ehrenzertifikat-v2';
const urlsToCache = [
  './',
  './index.html',
  './favicon-32x32.png',
  './VIRENNA_Siegel.PNG',
  './site.webmanifest.json',
  './apple-touch-icon.png'
  './offline.html' // Nur falls du eine eigene Offline-Seite anbieten möchtest
];

// Installation – Dateien cachen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
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

// Abruf – Cache zuerst, dann Netzwerk
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        // return caches.match('./offline.html'); // Nur aktivieren, wenn du die Datei hast
      });
    })
  );
});
