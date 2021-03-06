const cacheStorageKey = 'minimal-pwa-2'

const cacheList = [
  '/',
  "index.html",
  'manifest.json',
  "src/css/index.css",
  "src/images/logo192.png",
  "src/images/logo512.png",
  "src/images/LOL英雄联盟符文之地传说 蛟龙.jpg"
]


self.addEventListener('install', function (e) {
  console.log('Cache event!')
  e.waitUntil(
    caches.open(cacheStorageKey).then(function (cache) {
      console.log('Adding to Cache:', cacheList)
      return cache.addAll(cacheList)
    }).then(function () {
      console.log('Skip waiting!')
      return self.skipWaiting()
    })
  )
})

self.addEventListener('activate', function (e) {
  console.log('Activate event')
  e.waitUntil(
    Promise.all(
      caches.keys().then(cacheNames => {
        return cacheNames.map(name => {
          if (name !== cacheStorageKey) {
            return caches.delete(name)
          }
        })
      })
    ).then(() => {
      console.log('Clients claims.')
      return self.clients.claim()
    })
  )
})

self.addEventListener('fetch', function (e) {
  // console.log('Fetch event:', e.request.url)
  e.respondWith(
    caches.match(e.request).then(function (response) {
      if (response != null) {
        console.log('Using cache for:', e.request.url)
        return response
      }
      console.log('Fallback to fetch:', e.request.url)
      return fetch(e.request.url)
    })
  )
})