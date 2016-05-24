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

const _dimensions = {
  'main-container': {
    width: m.prop('')
  }

}
_dimensions.ratio = m.prop(1.55)
// const _el = m.prop('')

// const _dimensions = m.prop({
//   height: m.prop(''),
//   width: m.prop('')
// })
// const height = m.prop(Math.round((windowWidth()) / ratio()))
// const width = m.prop(Math.round(height() * ratio()))

// the list-item namespace is the size of the card

const dimensions = {
  setElement(namespace, element) {
    if (_dimensions[namespace]) {
      if (typeof _dimensions[namespace].el === 'function') {
        _dimensions[namespace].el(element)
      } else _dimensions[namespace].el = m.prop(element)
    } else {
      _dimensions[namespace] = {
        el: m.prop(element)
      }
    }
  },
  setDimensions: function(namespace) {
    const d = _dimensions[namespace].el().getBoundingClientRect()

    if (namespace === 'main-container') {
      if (typeof _dimensions[namespace].width === 'function') {
        _dimensions[namespace].width(d.width)
      } else _dimensions[namespace].width = m.prop(d.width)

      // dimensions.setDimensions('list-container')
    } else {
      if (typeof _dimensions[namespace].width === 'function') {
        
        _dimensions[namespace].height(Math.floor((d.width) / _dimensions.ratio()))
        _dimensions[namespace].width(Math.floor(_dimensions[namespace].height() * _dimensions.ratio()))

      } else {
        _dimensions[namespace].height = m.prop(Math.floor((d.width) / _dimensions.ratio()))
        _dimensions[namespace].width = m.prop(Math.floor(_dimensions[namespace].height() * _dimensions.ratio()))

      }
    }


    

    // const windowWidth = m.prop(d.width)

    // _dimensions().height(Math.floor((windowWidth()) / _ratio()))
    // _dimensions().width(Math.floor(_dimensions().height() * _ratio()))
    
  },
  getDimensions(namespace) {
    return _dimensions[namespace]
  },
  isMobile() {
//     console.log(_dimensions['main-container'].width())
    return _dimensions['main-container'].width() < 767
  },
  isDesktop() {
    return _dimensions['main-container'].width() >= 1024
  }
}

export default dimensions