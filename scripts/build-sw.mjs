/**
 * Собирает dist/sw.js после vite build.
 *
 * В precache попадают app shell, manifest, иконки и хэшированные JS/CSS из
 * index.html, поэтому приложение работает офлайн сразу после первой загрузки.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const DIST = 'dist';

const rawBase = process.env.VITE_BASE_PATH || '/';
const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

const indexHtml = readFileSync(join(DIST, 'index.html'), 'utf8');
const precache = new Set();

for (const match of indexHtml.matchAll(/(?:src|href)="([^"]+)"/g)) {
  const url = match[1];
  if (!url || url.startsWith('http') || url.startsWith('data:') || url.startsWith('//')) continue;
  if (!/\.(?:js|css|svg|png|webmanifest)$/.test(url)) continue;
  precache.add(url);
}

for (const extra of [
  'index.html',
  'manifest.json',
  'favicon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/maskable-512.png',
  'icons/apple-touch-icon.png',
]) {
  precache.add(`${base}${extra}`);
}
precache.add(base);

const urls = [...precache].sort();
const version = createHash('sha256').update(urls.join('|')).digest('hex').slice(0, 12);

const sw = `/* Сгенерировано scripts/build-sw.mjs — не редактировать вручную. */
const PRECACHE = ${JSON.stringify(urls, null, 2)};
const CACHE = 'ini-frontend-${version}';
const INDEX = ${JSON.stringify(`${base}index.html`)};

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
        caches.match(INDEX, { ignoreSearch: true }).then((cached) => cached || caches.match(${JSON.stringify(base)})),
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
`;

writeFileSync(join(DIST, 'sw.js'), sw, 'utf8');
console.log(`sw.js generated: ${urls.length} precached files, cache ${version}`);

