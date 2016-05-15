'use strict'

import m from 'mithril'
import _ from 'lodash'
import moment from 'moment'

//styles
import style from '../../css/details.scss'

//icons
import downArrowIcon from '../../icons/rr_down_arrow.js'
import fullStar from '../../icons/rr_review_full_star.js'
import emptyStar from '../../icons/rr_review_empty_star.js'

const getStyle = function(d) {
  if (!d)
    return

  const dimensions = d

  const position = 'absolute'
  // const height = `${dimensions.card.height() + 16}px`
  const height = `calc(100% - ${dimensions.card.height()}px)`
  const width = `100%`
  const top = `${dimensions.card.height()}px`

  // TODO - DELETE
  const background = 'white'

  const zIndex = 1

  return {
    position,
    height,
    width,
    top,
    zIndex,
    background
  }
}

// const getPhotoStyle = (d) => {

//   if (!d)
//     return

//   const dimensions = d

//   const position = 'absolute'
//   // const height = `${dimensions.card.height() + 16}px`
//   const height = `${dimensions.card.height()}px`
//   const width = `100%`
//   // const top = 0
//   const top = `-${dimensions.card.height()}px`

//   // TODO - DELETE
//   const background = 'white'

//   const zIndex = 1

//   return {
//     position,
//     height,
//     width,
//     top,
//     zIndex,
//     background
//   }

// }

const generateStars = (rating) => {

  const stars = new Array(rating).fill(true)

  while( stars.length < 5) {
    stars.push(false)
  }

  return stars
} 

const toggleHoursSection = function(hoursOpen) {
  console.log(hoursOpen(!hoursOpen()))
}

export default {
  controller(args) {
    return {
      hoursOpen: m.prop(false)
    }
  },
  view(ctrl, args) {
    console.log(args)
    return m(`.${style['details']}`, { style: getStyle.call(null, args.dimensions) }, [
        // m(`.${style['ptoto']}`, { style: getPhotoStyle.call(null, args.dimensions) }),
        m(`.${style['header']}`, { class: ctrl.hoursOpen() ? 'open' : '' }, [
          m(`.${style['line-one']}`, [
            m('h3', 'Reviews'),
            m(`.${style['header-opening-hours']}`, { onclick: toggleHoursSection.bind(null, ctrl.hoursOpen) } ,[
              m('h3', 'Opening Hours'),
              m(`.${style['down-arrow']}`, { class: ctrl.hoursOpen() ? 'open' : '' } ,downArrowIcon)
            ])
          ]),
          m(`.${style['opening-hours-section']}`, { class: ctrl.hoursOpen() ? 'visible' : '' } ,[
            m(`ul.${style['opening-hours']}`, [
              _.map(args.restaurant.opening_hours, (line) => {
                return m(`li.${style['time']}`, line)
              })
            ]),
            m(`.${style['clear']}`)
          ])
        ]),
        m(`.${style['reviews']}`, [
          m(`ul.${style['reviews-container']}`, [
            _.map(args.restaurant.reviews, (review) => {
              return m(`li.${style['review-item']}`, { key: review.author_name }, [
                m(`.${style['line-one']}`, [
                  m('h4', review.author_name),
                  m(`h4`, moment(review.time * 1000).format('DD/MM/YYYY')) 
                ]),
                m(`.${style['line-two']}`, [
                  m(`.${style['clear']}`),
                  m(`ul.${style['user-stars']}`, _.map(generateStars(review.rating), (star, i) => {
                    switch(star) {
                      case true:
                        return m(`li.${style['star']}`, { key: i } ,fullStar)
                      case false:
                        return m(`li.${style['star']}`, { key: i } ,emptyStar)
                    }
                  })),
                  m(`p`, review.text) 
                ])
              ])
              console.log(review)
            })
          ])
        ])
      ])
  }
}