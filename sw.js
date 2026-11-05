/*
 * Service worker: makes the app installable and playable on flaky networks.
 * Strategy: network-first for same-origin GETs (so deploys show up immediately),
 * falling back to the cache when offline. Cross-origin requests (AI APIs, fonts) are untouched.
 */
const CACHE = "kd-shell-v6";

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(["/", "/index.html", "/manifest.json", "/kanken_data.json"])));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then(hit => hit || caches.match("/index.html")))
  );
});
