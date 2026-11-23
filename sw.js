/* Сгенерировано scripts/build-sw.mjs — не редактировать вручную. */
const PRECACHE = [
  "/INI-frontend/",
  "/INI-frontend/assets/index-DNMTBQ_L.css",
  "/INI-frontend/assets/index-tIqWWZOI.js",
  "/INI-frontend/favicon.svg",
  "/INI-frontend/icons/apple-touch-icon.png",
  "/INI-frontend/icons/icon-192.png",
  "/INI-frontend/icons/icon-512.png",
  "/INI-frontend/icons/maskable-512.png",
  "/INI-frontend/index.html",
  "/INI-frontend/manifest.json"
];
const CACHE = 'ini-frontend-3e91add1315e';
const INDEX = "/INI-frontend/index.html";

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => Promise.all(PRECACHE.map((url) => cache.add(new Request(url, { cache: 'reload' })).catch(() => undefined))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(INDEX, { ignoreSearch: true }).then((cached) => cached || caches.match("/INI-frontend/")),
      ),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }).catch(() => caches.match(INDEX, { ignoreSearch: true })),
  );
});
