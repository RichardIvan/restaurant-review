'use strict'

import m from 'mithril'

const _size = {
  height: m.prop(''),
  width: m.prop('')
}

const _position = {
  translateY: m.prop(''),
  translateX: m.prop('')
}


const animationHelper = {

  getSize() {
    return {
      height: _size.height,
      width: _size.width
    }
  },
  getPosition() {
    return {
      translateY: _position.translateY,
      translateX: _position.translateX
    }
  },
  setDimensions(el) {
    const dimensions = el.getBoundingClientRect()

    _size.height(dimensions.height)
    _size.width(dimensions.width)

    _position.translateY(dimensions.top)
    _position.translateX(dimensions.left)
  }

}

export default animationHelper