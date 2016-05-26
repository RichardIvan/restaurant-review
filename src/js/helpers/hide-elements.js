'use strict'

import m from 'mithril'

import { runAnimation } from './card-animation.js'
import runDelayedLoop from './delayed-loop.js'

import dimensionsHelper from './screen-dimensions.js'

const hide = function(clickedElementIndex, element) {

  // this is a controller from a card
  const ctrl = this

  if (dimensionsHelper.isDesktop()) {
    ctrl.selectedRestaurant(ctrl.restaurant())
    ctrl.element(ctrl.cardElement())
    ctrl.currentElementIndex(clickedElementIndex())
    m.redraw()
    return
  }

  if(ctrl.isCardExpanded())
    return

  ctrl.isCardExpanded(!ctrl.isCardExpanded())
  ctrl.thisCardExpanded(true)
  m.redraw()
  m.redraw()


  ctrl.selectedRestaurant(ctrl.restaurant())
  ctrl.element(ctrl.cardElement())
  ctrl.currentElementIndex(clickedElementIndex())

  // Ctrl.selectedRestaurant(Ctrl.restaurants()[clickedElementIndex()])
  // Ctrl.selectedEl(ctrl.element())
  // Ctrl.currentElementIndex(clickedElementIndex())

  //copying expanded property so it is accessible in details component when passed
  // Ctrl.expanded = ctrl.expanded


  const d = ctrl.cardElement().getBoundingClientRect()
  const top = d.top

  runAnimation.call(ctrl, ctrl.cardElement(), top)

  //true and false flag distaces what if the elments are going to be
  //visible or not

  runDelayedLoop(ctrl.restaurants(), clickedElementIndex(), false)

}

export default hide