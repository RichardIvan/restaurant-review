'use strict'

import m from 'mithril'
import Velocity from 'velocity-animate'

import dimensionsHelper from './screen-dimensions.js'
import animationHelper from './animation-helper.js'

export function runAnimation(el, top) {
  //this is Ctrl of app_component
  const ctrl = this

  let height = ''
  let width = ''

  animationHelper.setDimensions(el)

  let translateX
  if(animationHelper.getPosition().translateX()) {
    translateX = animationHelper.getPosition().translateX()
  }

  if (dimensionsHelper.getDimensions().width() > 766) {
    height = dimensionsHelper.getDimensions().height()
    width = dimensionsHelper.getDimensions().width()
  }

  

  Velocity(
    el,
    {
      "translateY": -top,
      translateX: -translateX
    },
    { duration: 300,
      delay: 350,
      easing: [0.4, 0.0, 0.2, 1]
    }
  )
  Velocity(
    el.firstChild,
    {
      margin: 0,
      height: `${height}px`,
      width: `${width}px`
    },
    { duration: 300,
      delay: 450,
      easing: [0.4, 0.0, 0.2, 1],
      queue: false,
      complete() {
        ctrl.detailsOpen(true)
        m.redraw()
      }
    }
  )
}