self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('geo-notes-cache').then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './style.css',
        './script.js',
        './manifest.json',
        './icon-512.png',
        'https://unpkg.com/leaflet/dist/leaflet.css',
        'https://unpkg.com/leaflet/dist/leaflet.js',
        'https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css',
        'https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
