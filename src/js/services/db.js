'use strict'

const _db = new Promise((resolve, reject) => {
  const request = window.indexedDB.open('rrdb')

  request.onerror = (event) => {
    console.log(`error: ${event}`);
  };
   
  request.onsuccess = (event) => {
    resolve(request.result)
  };

  request.onupgradeneeded = function(e) {

    var db = e.target.result;

    if (db.objectStoreNames.contains('rrdb')) {
      db.deleteObjectStore('rrdb')
    }

    // Create a new datastore.
    var store = db.createObjectStore('rrdb', {
      keyPath: 'timestamp'
    })
  }
})

const DB = {

  saveReview(data) {

    return new Promise((resolve, reject) => {
      
      // Initiate a new transaction.
      // var transaction = _db.transaction([id], 'readwrite')
      _db.then((db) => {
        const transaction = db.transaction(['rrdb'], 'readwrite')
        const objStore = transaction.objectStore('rrdb')

        const timestamp = new Date().getTime()
        data().time(Math.floor(timestamp / 1000))

        const review = {
          payload: JSON.stringify(data()),
          timestamp
        }

        const req = objStore.put(review)

        req.onsuccess = function(e) {
          resolve(review)
        }

        req.onerror = (e) => {
          console.log(e)
        }
      }).catch(err => {
        console.dir(err)
      })
    })
  },

  getReviews() {
    return new Promise((resolve, reject) => {
      _db.then((db) => {

        const transaction = db.transaction(['rrdb'], 'readwrite')
        const objStore = transaction.objectStore('rrdb')

        const keyRange = IDBKeyRange.lowerBound(0)
        const cursorRequest = objStore.openCursor(keyRange)

        const reviews = []

        transaction.oncomplete = function(e) {
          // Execute the callback function.
          // callback(todos);
          resolve(reviews)
        }

        cursorRequest.onsuccess = function(e) {
          const review = e.target.result

          if (!!review == false) {
            return
          }

          reviews.push(review.value)

          review.continue()
        }

        cursorRequest.onerror = (e) => {
          console.log(e)
        }
      })
    })
  }

}

export default DB
