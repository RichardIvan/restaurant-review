'use strict'

import m from 'mithril'
import Velocity from 'velocity-animate'

export function runAnimation(el, top) {
  //this is Ctrl of app_component
  const ctrl = this

  Velocity(
    el,
    {
      "translateY": -top
    },
    { duration: 300,
      delay: 350,
      easing: [0.4, 0.0, 0.2, 1]
    }
  )
  Velocity(
    el.firstChild,
    {
      margin: 0
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