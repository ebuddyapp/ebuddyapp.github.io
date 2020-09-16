const CACHE_NAME = 'ebuddy-v1';
const urlsToCache = [
  '/',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          if(response.url.slice(-1) === '/'){
            var age = Date.now() - new Date(response.headers.get('Date'))
            if (age > 7200000 && navigator.onLine) { // 7200000
              return fetch(event.request).then(function(response) {
                return caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, response.clone());
                  return response
                })
              })
              .catch(e=>{
                return response
              })
            }
          }
          return response;
        }
        return fetch(event.request).then(function(response) {
          var ext = response.url.slice(-4)
          if(ext === '.jpg' || ext === '.png'){
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, response.clone());
              return response
            })
          } else {
            return response
          }
        })
      }
    )
  );
});
