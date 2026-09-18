// Dream Catchers Foundation - Mohamed Yunus A Service Worker
const CACHE_NAME = "dream-catchers-mohamed-yunus-v1";

const ASSETS_TO_CACHE = [
  "./",
  "index.html",
  "style.css",
  "script.js",
  "manifest.json",
  "mohamed-yunus.vcf",
  "assets/dream-catchers-logo.jpg",
  "assets/mohamed-yunus.jpg"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request).catch(() => cachedResponse);
    })
  );
});
