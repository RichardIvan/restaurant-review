'use strict'

import m from 'mithril'

//this is on load
// // we are running pretty much the same function on window resize after..
// const d = el.getBoundingClientRect()
// const windowWidth = m.prop(d.width)
// const ratio = m.prop(1.55)
// const height = m.prop(Math.round((windowWidth()) / ratio()))
// const width = m.prop(Math.round(height() * ratio()))

// ctrl.dimensions = {
//   windowWidth,
//   ratio,
//   card: {
//     width,
//     height
//   }
// }

const _el = m.prop('')
const _ratio = m.prop(1.55)
const _dimensions = m.prop({
  height: m.prop(''),
  width: m.prop('')
})
// const height = m.prop(Math.round((windowWidth()) / ratio()))
// const width = m.prop(Math.round(height() * ratio()))

const dimensions = {
  setElement(element) {
    _el(element)
  },
  setDimensions() {
    const d = _el().getBoundingClientRect()

    const windowWidth = m.prop(d.width)

    _dimensions().height(Math.floor((windowWidth()) / _ratio()))
    _dimensions().width(Math.floor(_dimensions().height() * _ratio()))
    
  },
  getDimensions() {
    return _dimensions()
  }
}

export default dimensions