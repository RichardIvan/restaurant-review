'use strict'

import m from 'mithril'

import PhotosComponent from './desktop_photos_component'
import InfoComponent from './desktop_info_component'
import ReviewsComponent from './desktop_reivews_component'

//helpers
import dimensionsHelper from '../helpers/screen-dimensions.js'

//styles
import style from '../../css/desktop-details.scss'




const captureElement = function(namespace, el, init) {
  if(!init) {
    dimensionsHelper.setElement(namespace, el)
    dimensionsHelper.setDimensions(namespace)
  }
}

const DD = {
  controller({ restaurant }) {

  },
  view(ctrl, { restaurant }) {
    return m(`.${style['desktop-details-container']}`,
      {
        config: captureElement.bind(null, 'desktop-details-container')
      },
      [
        console.log(restaurant),
        m(PhotosComponent, {
          photo: restaurant.photos[0],
          address: restaurant.address,
          rating: restaurant.rating
        }),
        m(InfoComponent, {
          openingHours: restaurant.opening_hours,
          priceTier: restaurant.priceTier,
          categories: restaurant.categories
        }),
        m(ReviewsComponent, {
          reivews: restaurant.reivews
        })

      ]
    )
  }
}

export default DD
