'use strict'

const NetworkControl = (function() {
  const _object = {

    fetchFromNetwork(event) {
      console.log('network fetch')
      const url = event.request.url
      return fetch(url).catch(err => err)
    }
  }

  return _object
}())

export default NetworkControl