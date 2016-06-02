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

//services
import Aria from '../services/aria.js'

//styles
import style from '../../css/desktop-details.scss'

import fab from '../polythene/fab.js'

// import fab from 'polythene/fab/fab'
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

const desktopDetailsConfig = function(ariaObject, namespace, el, init) {
  if(!init) {
    Aria.register(ariaObject)
    Aria.tabIndexDir[ariaObject.ariaParent][ariaObject.ariaChild] = 0

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

const writingButtonConfig = function(ariaObject, el, inited) {
  if(!inited) {
    Aria.register(ariaObject)
    Aria.register({
      ariaParent: 'writing-section',
      ariaChild: 'edit-button'
    })
    Aria.register({
      ariaParent: 'writing-section',
      ariaChild: 'done'
    })
  }
}

const writingMainActionButton = function(type, ariaParent) {
  const ctrl = this

  const icon = (type === 'edit') ? editIcon : doneIcon
  const ariaChild = 'writing-section'

  let wActiveAriaParent
  let wActiveAriaChild

  if(ctrl.writingActive()) {
    wActiveAriaParent = 'writing-section'
    wActiveAriaChild = `${type}-button`
  }
  
  return m.component(fab, {
    icon: {
      msvg: icon
    },
    class: [style['writing-action-button'], style[type]].join(' '),
    events: {
      onclick: handleWritingFabClick.bind(ctrl, type),
      onkeyup: (e) => {
        if(e.keyCode === 13) {
          e.stopPropagation()
          handleWritingFabClick.call(ctrl, type)
          if ( wActiveAriaParent === undefined) {
            Aria.select(ariaParent, ariaChild, e)
            console.log(Aria.tabIndexDir)
          } else {
            Aria.back(wActiveAriaParent, wActiveAriaChild, e)
          }
        }
      }
    },
    config: writingButtonConfig.bind(ctrl,
      {
        ariaParent,
        ariaChild
      }
    ),
    customAttrs: {
      'data-aria-id': ctrl.writingActive() ? `${wActiveAriaParent} ${wActiveAriaChild}` : `${ariaParent} ${ariaChild}`,
      tabIndex: ctrl.writingActive() ? Aria.tabIndexDir[ariaParent] ? Aria.tabIndexDir[wActiveAriaParent][wActiveAriaChild] : -1 : Aria.tabIndexDir[ariaParent] ? Aria.tabIndexDir[ariaParent][ariaChild] : -1,
      role: 'button',
      'aria-label': ctrl.writingActive() ? wActiveAriaChild : ariaChild,
      title: ctrl.writingActive() ? wActiveAriaChild : ariaChild
    }
  })
}

const cancelButtonConfig = (el, inited) => {
  if(!inited) {

    //this is registration for clear button
    // this needs to be registered in the outer div, so it is
    // ready to have the tabIndex changed properly
    const ariaParent = 'writing-section'
    const ariaChild = 'clear-button'

    Aria.register({
      ariaParent,
      ariaChild
    })

    el.style.transition = 'opacity .3s ease-in-out'
    setTimeout(() => {
      el.style.opacity = 1
    }, 500)
  }
}

const cancelActionButton = function() {
  const ctrl = this

  const ariaParent = 'writing-section'
  const ariaChild = 'clear-button'

  return m.component(fab, {
    icon: {
      msvg: clearIcon
    },
    mini: true,
    class: style['cancel-action-button-mini'],
    events: {
      onclick: handleClearClick.bind(ctrl),
      onkeyup: (e) => {
        console.log('totally keyup')
        console.log(e)
        e.stopPropagation()
        if(e.keyCode === 13) {
          const evt = {
            keyCode: 27,
            target: {
              attributes: e.target.attributes
            }
          }
          handleClearClick.call(ctrl)
          Aria.handleAriaKeyPress(evt)
        }
      }
    },
    customAttrs: {
      'data-aria-id': `${ariaParent} ${ariaChild}`,
      tabIndex: 0
    }
  })
}

const desktopFabButtonConfig = function(ariaObject, el, init) {
  if(!init) {
    Aria.register(ariaObject)
  }
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
          place_id: m.prop(restaurant.place_id)
        }),
        valid: m.prop(false)
      }),
      closeWritingSection,
      indexDBReviews,
      currentPlaceID: m.prop(restaurant.place_id)
    }
  },
  view(ctrl, { restaurant, ariaParent, ariaChild }) {
    if (restaurant.place_id !== ctrl.currentPlaceID()) {
      ctrl.currentPlaceID(restaurant.place_id)
      ctrl.review().props().place_id(restaurant.place_id) 
      loadIndexedDBreviews(restaurant, ctrl.indexDBReviews)
    }

    return m(`.${style['desktop-details-container']}`,
      {
        config: desktopDetailsConfig.bind(null,
          {
            ariaParent,
            ariaChild
          },
          'desktop-details-container'
        ),

        'data-aria-id': `${ariaParent} ${ariaChild}`,
        tabIndex: Aria.tabIndexDir[ariaParent] ? Aria.tabIndexDir[ariaParent][ariaChild] : -1,
        role: 'main',
        'aria-label': `Restaurant Details of ${restaurant.name}, ${Aria.announcements.selectAnnouncement}, ${Aria.announcements.backAnnouncement}`,
        title: `Restaurant Details of ${restaurant.name}, ${Aria.announcements.selectAnnouncement}, ${Aria.announcements.backAnnouncement}`
        // onkeyup: Aria.handleAriaKeyPress.bind(ctrl, ariaParent, ariaChild)
      },
      [
        m(PhotosComponent, {
          photo: restaurant.photos[0],
          rating: restaurant.rating,
          ariaParent: ariaChild,
          ariaChild: 'desktop-photo-container'
        }),
        m(InfoComponent, {
          address: restaurant.address,
          openingHours: restaurant.opening_hours,
          priceTier: restaurant.priceTier,
          categories: restaurant.categories,

          ariaParent: ariaChild,
          ariaChild: 'info-container'
        }),
        m(ContentComponent, {
          restaurant,
          writingActive: ctrl.writingActive,
          review: ctrl.review,
          indexDBReviews: ctrl.indexDBReviews,

          ariaParent: ariaChild          
        }),
        m(`.${style['fab-button']}`,
          {
            style: {
              right: `${dimensionsHelper.getDimensions('list-container').width() + 44 }px`
            }
            // config: desktopFabButtonConfig.bind(null,
            //   {
            //     ariaParent: ariaChild,
            //     ariaChild: 'write-review-fab-button'
            //   }
            // ),
            // tabIndex: Aria.tabIndexDir[ariaChild] ? Aria.tabIndexDir[ariaChild]['write-review-fab-button'] : -1
          },
          [
            ctrl.review().valid() ? writingMainActionButton.call(ctrl, 'done', ariaChild) : writingMainActionButton.call(ctrl, 'edit', ariaChild),
            // cancel fab is displaying with little delay, 
            // set in config
            ctrl.writingActive() ?
                m(`.${style['desktop-cancel-writing']}`,
                  {
                    config: cancelButtonConfig,
                    style: {
                      opacity: 0
                    }
                  },
                  cancelActionButton.call(ctrl)
                ) : ''
          ]
        )
      ]
    )
  }
}

export default DD
