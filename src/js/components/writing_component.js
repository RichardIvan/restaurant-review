'use strict'

import m from 'mithril'
import _ from 'lodash'

import dimensionsHelper from '../helpers/screen-dimensions.js'


//POLYTHENE
import textfield from 'polythene/textfield/textfield';

import style from '../../css/writing_component.scss'

//polythene components
import starIcon from 'mmsvg/google/msvg/toggle/star'



const verifyReview = function() {
  const ctrl = this

  let valid = false 
  if(ctrl.review().props().author_name() && ctrl.review().props().text() && ctrl.review().props().rating()) {
    valid = true
  }
  ctrl.review().valid(valid)
}

const changeReviewProp = function(type, value) {
  const ctrl = this
  
  switch(type) {
    case 'author_name':
      ctrl.review().props().author_name(value)
      break
    case 'text':
      ctrl.review().props().text(value)
      break
    case 'rating':
      ctrl.review().props().rating(value)
      break
    default:
      break
  }

  verifyReview.call(ctrl)
}

const handleStarClick = function(index) {
  const ctrl = this
  const star = ctrl.stars()[index]
  const nextStar = ctrl.stars()[index]
  const flag = m.prop(nextStar() ? true : !star())

  _.forEach(ctrl.stars(), (str, i) => {
    if(i <= index) {
      str(flag)
    } else str(false)
  })

  ctrl.changeReviewProp('rating', index + 1)
  
}

const createView = (ctrl, args) => {

  const tag = `.${style['writing-container']}`

  const props = {

    class: '',
    config: ''

  }

  const content = [

    m(`.${style['name-section']}`, [

      m.component(textfield, {
        label: 'Your name',
        floatingLabel: true,
        autofocus: true,
        focus: ctrl.nameFieldFocus(),
        type: 'text',
        value: () => (ctrl.review().props().author_name()),
        events: {
            oninput: () => {}, // only update on blur
            onchange: (e) => (changeReviewProp.call(ctrl, 'author_name', e.target.value))
        },
        tabindex: 0,
        // maxlength: 3,
        min: 0,
        max: 255,
        hideValidation: true // don't show red line
      })

    ]),
    m(`.${style['text-section']}`, [
      m.component(textfield, {
        label: 'Review text',
        floatingLabel: true,
        type: 'text',
        value: () => (ctrl.review().props().text()),
        events: {
          oninput: (e) => (changeReviewProp.call(ctrl, 'text', e.target.value))
          // onchange: (e) => (changeReviewProp('text', e.target.value)),
        },
        multiline: true,
        rows: 10,
        tabindex: 0,
        // maxlength: 3,
        min: 0,
        max: 255,
        hideValidation: true // don't show red line,
      })
    ]),

    m(`.${style['rating-banner']}`, 
      {
        top: (dimensionsHelper.getDimensions('desktop-details-container')) ? `${dimensionsHelper.getDimensions('desktop-details-container').height() - 24}px` : ''
      },
      [
        m(`ul`, [
          _.map(ctrl.stars(), (star, index) => {
            return m(`li.${style['star']}`,
              { 
                class: star() ? `${style['selected']}` : '',
                onclick: handleStarClick.bind(ctrl, index),
                key: index
              },
              starIcon
            )
          })
        ])
      ]
    )

  ]

  return m( tag, props, content)
}





const Writing = {

  controller(args) {

    // const Ctrl = {}
    // Ctrl.review = args.review
    // Ctrl.changeReviewProp = changeReviewProp.call(Ctrl)
    // Ctrl.nameFieldFocus = m.prop(false)
    // Ctrl.stars = m.prop(_.map(new Array(5), (star) => {
    //   return m.prop(false)
    // }))

    const Ctrl = {
      review: args.review,
      // changeReviewProp: args.changeReviewProp.call(args),
      nameFieldFocus: m.prop(false),
      stars: m.prop(_.map(new Array(5), (star) => {
        return m.prop(false)
      })),
      writingActive: args.writingActive
    }
    Ctrl.changeReviewProp = changeReviewProp.bind(Ctrl)

    return Ctrl 
  },
  view(ctrl, args) {
    if (!ctrl.writingActive()) {
      _.forEach(ctrl.stars(), (star) => {
        star(false)
      })
    }
    return createView(ctrl, args)
  }

}

export default Writing