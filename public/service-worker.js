
const cacheName = 'cache-v1';
  const filesToCache = [
    '/index.html',
    '/favicon.ico',
    '/manifest.json',
    '/robots.txt',
    '/icons/icon_128x128.png',
    '/icons/icon_144x144.png',
    '/icons/icon_152x152.png',
    '/icons/icon_192x192.png',
    '/icons/icon_256x256.png',
    '/icons/icon_512X512.png',
    '/css/style.css',
    '/webfonts/fa-solid-900.eot',
    '/webfonts/fa-solid-900.svg',
    '/webfonts/fa-solid-900.ttf',
    '/webfonts/fa-solid-900.woff',
    '/webfonts/fa-solid-900.woff2',
    '/main.js',
    '/requestAPI.js'
  ];


self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(cacheName)
    .then(cache => {
       cache.addAll(filesToCache)
       .then(()=> console.log('files added'))
       .catch(error=> console.log(error))
    })
    // .catch(error=> console.log(error))
  );
});

self.addEventListener('fetch', event => {
  console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      console.log(response)
      return response || fetch(event.request);
    })
    .catch(error => {
    })
  );
});

