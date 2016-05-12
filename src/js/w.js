'use strict'

import CacheControl from '../js/services/cache.js'
import NetworkControl from '../js/services/network.js'

const staticCacheName = CacheControl.getCacheName()
// const CacheControl = new CC(staticCacheName)

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/css/main.css',
        '/js/index.js',
        '/data/',
        '/?/',
        '/?/index.html',
        '/?/css/main.css',
        '/?/js/index.js',
        '?/data/'
      ]).catch((e) => console.log(e))
    })
  )
})

self.addEventListener('waiting', (event) => {
  console.log('yeah waiting man')
})

self.addEventListener('redundant', (event) => {
  console.log(event)
  console.log('yeah waiting')
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName.startsWith('restaurant-') &&
                 cacheName !== staticCacheName
        }).map((cacheName) => {
          return caches.delete(cacheName)
        })
      )
      // .then(_ => console.log('thats not true, its only triggered after install, actually next time the client has let go of the previeous controlling worker!'))
    })
  )
})

self.addEventListener('fetch', (event) => {

  // console.log('FETCH EVENT')

  const url = new URL(event.request.url)
  const pathname = url.pathname
  const endpoint = pathname.split('/')[1]

  // console.log(endpoint)

  switch (endpoint) {
    case 'data':
      // getFromCache accepts event / event.request and callbackFunction in case there is no data in in the cache
      event.respondWith(
        CacheControl.get(event, NetworkControl.fetchFromNetwork.bind(null, event))
        )
      break
    case 'browser-sync':
    case 'sockjs-node':
      break
    default:
      // event.respondWith(CacheControl.get(event, NetworkControl.fetchFromNetwork.bind(null, event)))
      // // event.respondWith(CacheControl.getFromCache(event, NetworkControl.fetchFromNetwork.bind(null, event)))
      // event.respondWith(CacheControl.getFromCache(event, NetworkControl.fetchFromNetwork.bind(null, event, false)))
      break
  }
})
