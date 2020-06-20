const CACHE_NAME = "version-1";
const urlsToCashe = ['index.html', 'offline.html'];

const self = this;

//Install SW 
self.addEventListener('install', (event) => {
  event.waitUntil( //чтото is done 
    caches.open(CACHE_NAME)
        .then((cache) => {
          console.log('Open cache');

          return cache.addAll(urlsToCashe);
        })
  )
});

// Listen for requests 
self.addEventListener('fetch', (event) => {
  event.respondWith( //когда мы отправляем запрос и получаем ответ (respons)
    caches.match(event.request)
        .then(()=> {
          return fetch(event.request)
              .catch(() => caches.match('offline.html'))
        })
  )
});

//Active the SW 
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [];
  cacheWhitelist.push(CACHE_NAME);

  //проверяет наличие кэш нейма в блеклисте и удаляет из кеша если его там нет (версия кэша)
  event.waitUntil(
    caches.keys().then((casheNames)=> Promise.all(
      casheNames.map((cacheName) => {
          if(!cacheWhitelist.includes(cacheName)){
            return caches.delete(cacheName);
          }
      })
    ))
  )
});

