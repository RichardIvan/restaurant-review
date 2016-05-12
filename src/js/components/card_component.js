'use strict'

import m from 'mithril'

import style from '../../css/card.scss'

//stores
import DataStore from '../stores/data-store.js'

import fullStar from '../../icons/full-star.js'

//export it
const getRandomImage = (photos) => {
  const max = photos.length
  return photos[Math.floor(Math.random() * max)]
}

const renderHeading = function() {
  const ctrl = this
  return [  
            fullStar,
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
                    // ctrl.lineTwoWidth(`${h1Width}px`)
                  }
                }, style: { width: 'auto' } }, ctrl.titleLine2()),
                m(`.${style['heading-background1']}`),
                m(`.${style['heading-background2']}`)
              ]) : '']
            //
}

const renderAddress = function() {
  const ctrl = this;
  return [

    m(`.${style['address-container']}`, { style: { width: ctrl.addressLineWidth() } }, [
                m(`.${style['address-line1']}`, [
                  m('h3', { config: (el, inited) => {
                    if(!inited) {
                      const addressWidth = el.offsetWidth + 25
                      ctrl.addressLineOneWidth(addressWidth)
                      // ctrl.addressLineWidth(`${addressWidth}px`)
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
                      } else ctrl.addressLineWidth(`${ctrl.addressLineOneWidth()}px`)
                    }
                  } }, ctrl.sortCode),
                  m(`.${style['address-heading-background1']}`),
                  m(`.${style['address-heading-background2']}`)
                ])
              ])

  ]
}

const renderRating = function() {
  const ctrl = this
  return [
    m(`.${style['rating-container']}`, [
      m(`.${style['stars-container']}`, [

      ]),
      m(`.${style['rating-background1']}`),
      m(`.${style['rating-background2']}`)
    ])
  ]
}

const Card = {
  controller(args) {

    const constructImageUrl = () => {
      const randomImage = getRandomImage(args.data.photos)
      //get card size from store
      const cardSize = `${395}${255}`

      console.log(getRandomImage())

    }

    const state = m.prop({
      // imageUrl: m.prop(constructImageUrl())
    })

    const rating = args.data.rating
    const fullStars = parseInt(rating, 10)
    const remainder = (rating - fullStars).toFixed(1)
    console.log(fullStars)
    console.log(remainder)
    const starsArr = new Array(fullStars).fill('full Star')
    if (remainder >= 0.5) {
      starsArr.push('half Star')
    }
    while(starsArr.length < 5) {
      starsArr.push('empty star')
    }

    // Bullet.on('IMAGE_SIZE_CHANGE', updateSize)
    const title = m.prop(args.data.name);
    const titleLine2 = m.prop('')


    const addressArr = args.data.address.split(',')
    const address = addressArr[0]
    const sortCode = addressArr[1]

    let lineOneWidth = m.prop('100%')
    let lineTwoWidth = m.prop('100%')

    return {
      title,
      titleLine2,
      address,
      sortCode,
      lineOneWidth,
      lineTwoWidth,
      addressLineWidth: m.prop('100%'),
      addressLineOneWidth: m.prop(0),

      stars: m.prop(starsArr),

      expanded: m.prop(false)
    }
  },
  view(ctrl, args) {
    // console.log(args)
    // set the size of the image from the size store
    return m(`li.${style['list-item']}`, { key: args.id }, [
        m(`.${style['card-container']}`,  {
          style: {
            backgroundImage: `url('${args.data.photos[0].prefix}395x255${args.data.photos[0].suffix}')`
          }
        }, [

            renderHeading.call(ctrl),
            
            ctrl.expanded() ? renderAddress.call(ctrl) : renderRating.call(ctrl),

            // ctrl.expanded() ? '' : renderExpandButton.call(ctrl)

            
          ])
      ])
  }
}

export default Card
