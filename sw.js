// Self-destructing worker.
//
// Earlier versions of this file cached the app shell, and one of them cached
// itself, which left devices serving a stale worker that could never be
// replaced. This version exists only to undo that: it clears every cache,
// unregisters itself, and reloads the pages it controls. Once it has run, the
// app has no service worker at all and always loads from the network.
self.addEventListener('install', function (e) { self.skipWaiting(); });

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) { return Promise.all(keys.map(function (k) { return caches.delete(k); })); })
      .then(function () { return self.registration.unregister(); })
      .then(function () { return self.clients.matchAll({ type: 'window' }); })
      .then(function (clients) { clients.forEach(function (c) { c.navigate(c.url); }); })
  );
});

// Never intercept anything while we wait to be removed.
self.addEventListener('fetch', function (e) { });
