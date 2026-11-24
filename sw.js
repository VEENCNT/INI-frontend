/* Сгенерировано scripts/build-sw.mjs — не редактировать вручную. */
const PRECACHE = [
  "/INI-frontend/",
  "/INI-frontend/assets/index-DNMTBQ_L.css",
  "/INI-frontend/assets/index-cjeIpZmC.js",
  "/INI-frontend/favicon.svg",
  "/INI-frontend/icons/apple-touch-icon.png",
  "/INI-frontend/icons/icon-192.png",
  "/INI-frontend/icons/icon-512.png",
  "/INI-frontend/icons/maskable-512.png",
  "/INI-frontend/index.html",
  "/INI-frontend/manifest.json"
];
const CACHE = 'ini-frontend-650af4e517a6';
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

  // Видео отдаём напрямую браузеру: Range-запросы (206 Partial Content)
  // нельзя класть в Cache API, иначе service worker падает с ошибкой.
  if (request.headers.has('range') || /\.(mp4|webm|mov|m4v)$/i.test(url.pathname)) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => (
        (await caches.match(INDEX, { ignoreSearch: true })) ||
        (await caches.match("/INI-frontend/")) ||
        Response.error()
      )),
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      if (cached) return cached;

      try {
        const response = await fetch(request);
        if (
          response.status === 200 &&
          response.type === 'basic' &&
          !response.headers.has('Content-Range')
        ) {
          const copy = response.clone();
          caches.open(CACHE)
            .then((cache) => cache.put(request, copy))
            .catch(() => undefined);
        }
        return response;
      } catch {
        return (await caches.match(request)) || Response.error();
      }
    })(),
  );
});
