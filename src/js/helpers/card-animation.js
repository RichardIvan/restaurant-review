'use strict'

import m from 'mithril'
import Velocity from 'velocity-animate'

import dimensionsHelper from './screen-dimensions.js'
import animationHelper from './animation-helper.js'

export function runAnimation(el, top) {
  //this is Ctrl of app_component
  const ctrl = this

  const height = dimensionsHelper.getDimensions().height()
  const width = dimensionsHelper.getDimensions().width()

  animationHelper.setDimensions(el.firstChild)

  let translateX = 0
  if(animationHelper.getPosition().translateX()) {
    translateX = animationHelper.getPosition().translateX()
  }

  Velocity(
    el,
    {
      "translateY": -top,
      translateX: -translateX + 8.5
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