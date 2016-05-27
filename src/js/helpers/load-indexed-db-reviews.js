'use strict'

import m from 'mithril'
import _ from 'lodash'
import DB from '../services/db.js'

const loadIndexedDBreviews = (restaurant, indexDBReviews) => {
  DB.getReviews()
    .then((reviews) => {
      const newArr = []
      _.forEach(reviews, (r) => {
        const review = JSON.parse(r.payload)
        if(review.place_id === restaurant.place_id) {
          newArr.push(review)
        }
      })
      indexDBReviews(newArr)
      m.redraw()
    })
}

export default loadIndexedDBreviews
