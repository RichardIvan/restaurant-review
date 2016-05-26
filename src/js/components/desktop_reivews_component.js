'use strict'

import m from 'mithril'
import _ from 'lodash'
import moment from 'moment'

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


const renderReview = (review, indexDB) => {
  return m(`li.${style['review-item']}.single-review`, { key: review.time }, [
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
                  ])
}

const ReviewsComponent = {
  view(ctrl, { reviews, indexDBReviews }) {
    return m(`.${style['desktop-reviews-container']}`,
      [
        m(`.${style['reviews-heading']}`,
          [
            m(`.${style['flex']}`),
            m(`h3`, 'Reviews'),
            m(`.${style['flex']}`)
          ]
        ),
        m(`ul.${style['reviews']}`,
          [
            _.map(reviews, (review) => {
              return renderReview(review)
            }),
            _.map(indexDBReviews(), (review) => {
              return renderReview(review, true)
            })
                
          ]
        )
      ]
    )
  }
}

export default ReviewsComponent