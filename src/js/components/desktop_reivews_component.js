'use strict'

import m from 'mithril'
import _ from 'lodash'
import moment from 'moment'

//services
import Aria from '../services/aria.js'

import style from '../../css/desktop-reviews.scss'

//POLYTHENE ICONS
import fullStar from '../../icons/rr_review_full_star.js'
import emptyStar from '../../icons/rr_review_empty_star.js'

const renderStars = (rating) => {

  const stars = new Array(rating).fill(true)

  while( stars.length < 5) {
    stars.push(false)
  }

  return stars
} 

const reviewConfig = function(ariaObject, el, init) {

  if(!init) {
    Aria.register(ariaObject)
  }
}

const renderReview = (ariaObject, review, indexDB) => {
  return m(`li.${style['review-item']}.single-review`,
    {
      key: review.time,
      config: reviewConfig.bind(null, ariaObject),
      'data-aria-id': `${ariaObject.ariaParent} ${ariaObject.ariaChild}`,
      tabIndex: Aria.tabIndexDir[ariaObject.ariaParent] ? Aria.tabIndexDir[ariaObject.ariaParent][ariaObject.ariaChild] : -1,
      // onkeyup: Aria.handleAriaKeyPress.bind(null, ariaObject.ariaParent, ariaObject.ariaChild)
    },
    [
      m(`.${style['line-one']}`, [
        m('h4', review.author_name),
        m(`h4`, moment(review.time * 1000).format('DD/MM/YYYY')) 
      ]),
      m(`.${style['line-two']}`, [
        m(`.${style['clear']}`),
        m(`ul.${style['user-stars']}`, _.map(renderStars(review.rating), (star, i) => {
          switch(star) {
            case true:
              return m(`li.${style['star']}`, { key: i }, fullStar)
            case false:
              return m(`li.${style['star']}`, { key: i }, emptyStar)
          }
        })),
        m(`p`, review.text) 
      ])
    ]
  )
}

const reviewsComponentConfig = function(ariaObject, el, init) {
  if(!init) {
    Aria.register(ariaObject)
  }
}

const ReviewsComponent = {
  view(ctrl, { reviews, indexDBReviews, ariaParent, ariaChild }) {
    return m(`.${style['desktop-reviews-container']}`,
      {
        config: reviewsComponentConfig.bind(null,
          {
            ariaParent,
            ariaChild
          }
        ),
        'data-aria-id': `${ariaParent} ${ariaChild}`,
        tabIndex: Aria.tabIndexDir[ariaParent] ? Aria.tabIndexDir[ariaParent][ariaChild] : -1,
        // onkeyup: Aria.handleAriaKeyPress.bind(ctrl, ariaParent, ariaChild)
      },
      [
        m(`.${style['reviews-heading']}`,
          [
            m(`.${style['flex']}`),
            m(`h3`, 'Reviews'),
            m(`.${style['flex']}`)
          ]
        ),
        m(`ul.${style['reviews']}`,
          {
            
          },
          [
            _.map(reviews, (review, index) => {
              return renderReview({ ariaParent: ariaChild, ariaChild: `r-${index}`}, review)
            }),
            _.map(indexDBReviews(), (review, index) => {
              return renderReview({ ariaParent: ariaChild, ariaChild: `dbr-${index}`}, review, true)
            })
                
          ]
        )
      ]
    )
  }
}

export default ReviewsComponent