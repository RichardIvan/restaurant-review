'use strict'

const cachemanager = (function() {

  const staticCacheName = 'restaurant-static-v2'

  const _object = {

    getCacheName: function() {
      return staticCacheName
    },
    put: function(event, response) {
      caches.open(staticCacheName).then((cache) => {
        // console.log('Putting response in in Cache')
        cache.put(event.request, response)
      }).catch(err => {
        // console.error('Putting into Cache failed:', err)
        throw err
      })
    },
    get(event, callback) {
      return caches.match(event.request).then((response) => {
        if (response && response.clone().ok) {
          return response
        }
        return callback()
          .then(resp => {
            // cachemanager.putIntoCache(event, resp.clone())
            return resp
          })
          .catch(err => console.log(err))
      })
    }
  }

  return _object

})()

export default cachemanager
