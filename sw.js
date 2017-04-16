(function () {
  "use strict";

  var cacheNameStatic = 'cloudinary-pwa-react-v1';

  var currentCacheNames = [ cacheNameStatic ];

  var cachedUrls = [
    // 3rd party CDN
    'https://unpkg.com/babel-core@5.8.38/browser.min.js',
    'https://unpkg.com/lodash@4.17.4/lodash.js',
    'https://unpkg.com/react@15.3.1/dist/react.min.js',
    'https://unpkg.com/react-dom@15.3.1/dist/react-dom.min.js',
    'https://unpkg.com/react-router-dom/umd/react-router-dom.min.js',
    'https://unpkg.com/cloudinary-core@2.3.0/cloudinary-core.js',
    'https://unpkg.com/cloudinary-react@1.0.3/dist/cloudinary-react.js',
    'https://unpkg.com/axios/dist/axios.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.2/css/materialize.min.css',
    // Local assets
    '/style.css',
    // Fake API
    '/images.json'
  ];

  // A new ServiceWorker has been registered
  self.addEventListener("install", function (event) {
    event.waitUntil(
      caches.delete(cacheNameStatic).then(function() {
        return caches.open(cacheNameStatic);
      }).then(function (cache) {
        return cache.addAll(cachedUrls);
      }).catch(function(e) {
      })
    );
  });

  // A new ServiceWorker is now active
  self.addEventListener("activate", function (event) {
    event.waitUntil(
      caches.keys()
        .then(function (cacheNames) {
          return Promise.all(
            cacheNames.map(function (cacheName) {
              if (currentCacheNames.indexOf(cacheName) === -1) {
                return caches.delete(cacheName);
              }
            })
          );
        })
    );
  });

  // Save thing to cache in process of use
  self.addEventListener("fetch", function (event) {
    event.respondWith(
      caches.open(cacheNameStatic).then(function(cache) {
        return cache.match(event.request).then(function(response) {
          var fetchPromise = fetch(event.request).then(function(networkResponse) {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
          return response || fetchPromise;
        })
      })
    );
  });

})();
