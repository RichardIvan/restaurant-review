'use strict'

import m from 'mithril'
import _ from 'lodash'

//helpers
import hide from '../helpers/hide-elements.js'
import dimensionsHelper from '../helpers/screen-dimensions.js'

import style from '../../css/card.scss'

//stores
import DataStore from '../stores/data-store.js'


// const fullStar = require('../../icons/rr_full_star.js')
// import fullStar from 'mmsvg/google/msvg/action/accessibility'
// const halfStar = 
import fullStar from '../../icons/rr_full_star.js'
import halfStar from '../../icons/rr_half_star.js'
import emptyStar from '../../icons/rr_empty_star.js'

//export it
const getRandomImage = (photos) => {
  const max = photos.length
  return photos[Math.floor(Math.random() * max)]
}

const renderHeading = function() {
  const ctrl = this
  return [  
            m(`.${style['heading-container']}`, { style: { width: ctrl.lineOneWidth() } }, [
                m('h1', { config: (el, inited) => {
                  if(!inited) {
                    let h1Width = el.offsetWidth + 60
                    // console.log(h1Width)
                    if (h1Width > 360) {
                      const tittleArr = ctrl.title().split(' ')
                      
                      ctrl.titleLine2(tittleArr.splice(2).join(' '))
                      ctrl.title(tittleArr.splice(0, 2).join(' '))

                      setTimeout(() => {
                        h1Width = el.offsetWidth + 60
                        ctrl.lineOneWidth(`${h1Width}px`)
                        console.log( ctrl.lineOneWidth() )
                      }, 0)
                    } else {
                      ctrl.lineOneWidth(`${h1Width}px`)
                    }
                    setTimeout(() => m.redraw(), 0)
                  }
                }, style: { width: 'auto' } }, ctrl.title()),
                m(`.${style['heading-background1']}`),
                m(`.${style['heading-background2']}`),
              ]),

            ctrl.titleLine2() ?
 
            m(`.${style['heading-container2']}`, { style: { width: ctrl.lineTwoWidth() } }, [
                m('h1', { config: (el, inited) => {
                  if(!inited) {
                    const h1Width = el.offsetWidth + 60
                    ctrl.lineTwoWidth(`${h1Width}px`)
                  }
                }, style: { width: 'auto' } }, ctrl.titleLine2()),
                m(`.${style['heading-background1']}`),
                m(`.${style['heading-background2']}`)
              ]) : '']
            //
}

const renderAddress = function() {
  const ctrl = this
  return [
    m(`.${style['address-container']}`, { style: { width: ctrl.addressLineWidth() } }, [
          m(`.${style['address-line1']}`, [
            m('h3', { config: (el, inited) => {
              if(!inited) {
                const addressWidth = el.offsetWidth + 25
                ctrl.addressLineOneWidth(addressWidth)
              }
            } }, ctrl.address),
            m(`.${style['address-heading-background1']}`),
            m(`.${style['address-heading-background2']}`)
          ]),
          m(`.${style['address-line2']}`, [
            m('h3', { config: (el, inited) => {
              if(!inited) {
                const addressWidth = el.offsetWidth + 25
                if ( ctrl.addressLineOneWidth() <= addressWidth ) {
                  ctrl.addressLineWidth(`${addressWidth}px`)
                } else {
                  ctrl.addressLineWidth(`${ctrl.addressLineOneWidth()}px`)
                }
              }
            } }, ctrl.sortCode),
            m(`.${style['address-heading-background1']}`),
            m(`.${style['address-heading-background2']}`)
          ])
        ])

  ]
}

const renderRating = function(stars) {
  return m(`.${style['rating-container']}`, [
      m(`ul.${style['stars-container']}`,
        _.map(stars, (item, i) => {
          return m('li', { key: i }, item)
        })),
      m(`.${style['rating-background1']}`),
      m(`.${style['rating-background2']}`) 
    ])
}

const listItemConfig = function(el, inited) {
  const ctrl = this
  if(!inited) {
    ctrl.cardElement(el)
  }
}

const handleScroll = function(e) {
  console.log('scrollin')
}

const Card = {
  controller(args) {

    const constructImageUrl = () => {
      const randomImage = getRandomImage(args.restaurant().photos)
      //get card size from store
      const cardSize = `${395}${255}`

      console.log(getRandomImage())

    }

    const state = m.prop({
      // imageUrl: m.prop(constructImageUrl())
    })

    const rating = args.restaurant().rating
    const fullStars = parseInt(rating, 10)
    const remainder = ((rating - fullStars).toFixed(1))/1
    const starsArr = new Array(fullStars).fill('full')
    if (remainder >= 0.5) {
      starsArr.push('half')
    }
    while(starsArr.length < 5) {
      starsArr.push('empty')
    }

    const sss = _.map(starsArr, (st) => {
      switch(st) {
        case 'full':
          return fullStar
        case 'half':
          return halfStar
        default:
          return emptyStar
      }
    })

    // Bullet.on('IMAGE_SIZE_CHANGE', updateSize)
    const title = m.prop(args.restaurant().name)
    const titleLine2 = m.prop('')

    const addressArr = args.restaurant().address.split(',')
    const address = addressArr[0]
    const sortCode = addressArr[1]

    const lineOneWidth = m.prop('100%')
    const lineTwoWidth = m.prop('100%')

    return {
      restaurants: args.restaurants,
      restaurant: args.restaurant,

      title,
      titleLine2,
      address,
      sortCode,
      lineOneWidth,
      lineTwoWidth,
      addressLineWidth: m.prop('100%'),
      addressLineOneWidth: m.prop(0),

      rating: m.prop(args.restaurant().rating),
      stars: m.prop(sss),

      isCardExpanded: args.isCardExpanded,
      thisCardExpanded: m.prop(false),

      detailsOpen: args.detailsOpen,
      // hide: args.hide,
      elementInfo: args.elementInfo,
      data: args,

      // ctrl.selectedRestaurant
      // ctrl.selectedEl
      // ctrl.currentElementIndex

      element: args.element,
      cardElement: m.prop(''),
      selectedRestaurant: args.selectedRestaurant,
      currentElementIndex: args.currentElementIndex
    }
  },
  view(ctrl, args) {
//     console.log(ctrl.data.dimensions.card.height())
//     console.log(ctrl.data.dimensions.card.width())
    const width = dimensionsHelper.getDimensions().width()
    const height = (dimensionsHelper.getDimensions().width() > 766) ? Math.floor(dimensionsHelper.getDimensions().height() / 2) : dimensionsHelper.getDimensions().height()
    !ctrl.isCardExpanded() ? ctrl.thisCardExpanded(false) : null
    return m(`li.${style['list-item']}`, { config: listItemConfig.bind(ctrl), onclick: hide.bind(ctrl, args.elementIndex), class: ctrl.elementInfo.visible() ? style['visible'] : '' }, [
        m(`.${style['card-container']}`,  {
          style: {

            //the dimensions or height might be comming dynamically from the args
            // instead of the initiated conponent
            backgroundImage: `url('${ctrl.restaurant().photos[0].prefix}${width}x${dimensionsHelper.getDimensions().height()}${ctrl.restaurant().photos[0].suffix}')`,

            height: `${height}px`
          }
        }, [

          renderHeading.call(ctrl),

          ctrl.isCardExpanded() && ctrl.thisCardExpanded() ? renderAddress.call(ctrl) : renderRating(ctrl.stars())

          // ctrl.expanded() ? '' : renderExpandButton.call(ctrl)

        ])
      ])
  }
}

export default Card
