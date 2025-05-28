const CACHE_VERSION = 'v3'; // jedes Mal erhöhen bei Änderung
const CACHE_NAME = `ehrenzertifikat-cache-${CACHE_VERSION}`;
const OFFLINE_URL = './offline.html';

const urlsToCache = [
  './',
  './index.html',
  './favicon-32x32.png',
  './VIRENNA_Siegel.PNG',
  './manifest.json',
  './apple-touch-icon.png',
  OFFLINE_URL
];

// Installation – initiales Caching
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Aktivierung – alte Caches löschen
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

// Netzwerkabfragen – Cache-first + Offline-Fallback
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(response => 
      response || fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    )
  );
});
