'use strict'

import m from 'mithril'
import _ from 'lodash'

import PhotosComponent from './desktop_photos_component'
import InfoComponent from './desktop_info_component'
import ContentComponent from './content_component.js'


//helpers
import dimensionsHelper from '../helpers/screen-dimensions.js'
import DB from '../services/db.js'
import loadIndexedDBreviews from '../helpers/load-indexed-db-reviews.js'

//styles
import style from '../../css/desktop-details.scss'

import fab from 'polythene/fab/fab'
import editIcon from 'mmsvg/google/msvg/editor/mode-edit'
import doneIcon from 'mmsvg/google/msvg/action/done'
import clearIcon from 'mmsvg/google/msvg/content/clear'

const closeWritingSection = function() {
  const ctrl = this

  if(ctrl.review().valid()) {
    const review = JSON.stringify(ctrl.review().props())
    const arr = ctrl.indexDBReviews()
    arr.push(JSON.parse(review))
    ctrl.indexDBReviews(arr)
  }
  
  ctrl.review().valid(false)
  ctrl.review().props().author_name('')
  ctrl.review().props().text('')
  ctrl.review().props().time('')
  ctrl.review().props().rating('')

//   console.log(ctrl.review().valid())
//   console.log(ctrl.review().props().author_name())
//   console.log(ctrl.review().props().text())
//   console.log(ctrl.review().props().time())
//   console.log(ctrl.review().props().rating())

  ctrl.writingActive(false)

  m.redraw()  
}

const captureElement = function(namespace, el, init) {
  if(!init) {
    dimensionsHelper.setElement(namespace, el)
    dimensionsHelper.setDimensions(namespace)
  }
}

const handleClearClick = function() {
  const ctrl = this

  ctrl.closeWritingSection()
}

const handleWritingFabClick = function(type) {
  const ctrl = this

  // if edit -> do something
  if (type === 'edit') {
    if (dimensionsHelper.isDesktop()) {
      dimensionsHelper.scrollTop('desktop-details-container')  
    }
    ctrl.writingActive(true)
  } else {
    // post reveiw to indexDB
    DB.saveReview(ctrl.review().props).then(_ => {
      ctrl.closeWritingSection()
    }).catch(err => {

      console.log('YO BRO, NO GOOD!')
      console.log(err)

    })
  }
}

const writingMainActionButton = function(type) {
  const ctrl = this

  const icon = (type === 'edit') ? editIcon : doneIcon
  
  return m.component(fab, {
    icon: {
      msvg: icon
    },
    class: [style['writing-action-button'], style[type]].join(' '),
    events: {
      onclick: handleWritingFabClick.bind(ctrl, type)
    }
  })
}

const cancelButtonConfig = (el, inited) => {
  if(!inited) {
    el.style.transition = 'opacity .3s ease-in-out'
    setTimeout(() => {
      el.style.opacity = 1
    }, 500)
  }
}

const cancelActionButton = function() {
  const ctrl = this
  return m.component(fab, {
    icon: {
      msvg: clearIcon
    },
    mini: true,
    class: style['cancel-action-button-mini'],
    events: {
      onclick: handleClearClick.bind(ctrl)
    }
  })
}



const DD = {


  controller( { restaurant } ) {
    const indexDBReviews = m.prop([])

    loadIndexedDBreviews(restaurant, indexDBReviews)
    // DB.getReviews()
    //   .then((reviews) => {
    //     _.forEach(reviews, (r) => {
    //       const review = JSON.parse(r.payload)
    //       if(review.place_id === restaurant.place_id) {
    //         const newArr = indexDBReviews()
    //         newArr.push(review)
    //         indexDBReviews(newArr)
    //       }
    //     })
    //     // indexDBReviews()
    //     m.redraw()
    //   })

    return {
      writingActive: m.prop(false),
      review: m.prop({
        props: m.prop({
          author_name: m.prop(''),
          text: m.prop(''),
          time: m.prop(''),
          rating: m.prop(''),
          place_id: restaurant.place_id
        }),
        valid: m.prop(false)
      }),
      closeWritingSection,
      indexDBReviews,
      currentPlaceID: m.prop(restaurant.place_id)
    }
  },
  view(ctrl, { restaurant }) {

    console.log(restaurant.place_id)
    console.log(ctrl.currentPlaceID)
    if (restaurant.place_id !== ctrl.currentPlaceID()) {
      //reloadIndexedDBReviews()
      ctrl.currentPlaceID(restaurant.place_id)
      loadIndexedDBreviews(restaurant, ctrl.indexDBReviews)
    }

    return m(`.${style['desktop-details-container']}`,
      {
        config: captureElement.bind(null, 'desktop-details-container'),
        style: {
          // overflowY: ctrl.writingActive() ? 'hidden' : 'scroll'
        }
      },
      [
        m(PhotosComponent, {
          photo: restaurant.photos[0],
          rating: restaurant.rating
        }),
        m(InfoComponent, {
          address: restaurant.address,
          openingHours: restaurant.opening_hours,
          priceTier: restaurant.priceTier,
          categories: restaurant.categories
        }),
        m(ContentComponent, {
          restaurant,
          writingActive: ctrl.writingActive,
          review: ctrl.review,
          indexDBReviews: ctrl.indexDBReviews
        }),
        m(`.${style['fab-button']}`,
          {
            style: {
              right: `${dimensionsHelper.getDimensions('list-container').width() + 24}px`
            }
          },
          [
            ctrl.review().valid() ? writingMainActionButton.call(ctrl, 'done') : writingMainActionButton.call(ctrl, 'edit'),
            // cancel fab is displaying with little delay, 
            // set in config
            ctrl.writingActive() ? m(`.${style['desktop-cancel-writing']}`, { config: cancelButtonConfig, style: { opacity: 0 } }, cancelActionButton.call(ctrl)) : ''
          ]
        )
      ]
    )
  }
}

export default DD
