'use strict'

import m from 'mithril'
import _ from 'lodash'
import moment from 'moment'
import Velocity from 'velocity-animate'

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
  hoursOpen(!hoursOpen())
}

const detailsConfig = function(el, inited, context) {
  if (!inited) {
    Velocity(
      el,
      {
        opacity: 1
      },
      {
        duration: '300ms'
        // delay: '600ms'
      }
    ),
    context.onunload = function() {
      // velocity end 
    }
  }
}

const headerConfig = function(el, inited) {
  if (!inited) {
    Velocity(
      el,
      {
        opacity: 1
      },
      {
        duration: '300ms',
        // delay: '600ms'
        complete() {
          const divs = document.getElementsByClassName('single-review');
          Velocity(
            divs[0],
            {
              opacity: 1
            },
            {
              duration: '300ms',
              // stagger: '300ms',
              delay: '3s',
              begin() {
                console.log('animation running')
              }
            }
          )
        }
      }
    )
  }
}

const reviewItemConfig = function(el, inited) {
  if(!inited) {
    const children = el.children
    const childrenLenght = children.length

    var i = 0;                     //  set your counter to 1

    function afterLoop () {           //  create a loop function
       setTimeout(function () {    //  call a 3s setTimeout when the loop is called
          Velocity(
            children[i],
            {
              opacity: 1
            },
            {
              duration: '300ms',
              // stagger: '300ms',
            }
          )
          i++;            //  your code here
                              //  increment the counter
          if (i < childrenLenght) {            //  if the counter < 10, call the loop function
             afterLoop();             //  ..  again which will trigger another 
          }                        //  ..  setTimeout()
       }, 75)
       // m.redraw()
    }

    afterLoop();
    
  }
}

export default {
  controller(args) {
    return {
      hoursOpen: m.prop(false)
    }
  },
  view(ctrl, args) {
    return m(`.${style['details']}`, { style: getStyle.call(null, args.dimensions) }, [
        // m(`.${style['ptoto']}`, { style: getPhotoStyle.call(null, args.dimensions) }),
        m(`.${style['header']}`, { style: { opacity: 0 }, class: ctrl.hoursOpen() ? 'open' : '', config: headerConfig }, [
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
          m(`ul.${style['reviews-container']}`, { config: reviewItemConfig } ,[
            _.map(args.restaurant.reviews, (review) => {
              return m(`li.${style['review-item']}.single-review`, { key: review.author_name, style: { opacity: 0 } }, [
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