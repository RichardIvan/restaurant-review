'use strict'

import m from 'mithril'

//components
import Card from './card_component'

window.onresize = function(e) {
  console.log(e)
  // capturing the size of window and serving appropriate image Sizes
  // withing element size store
}

const config = function(el, init) {
  const ctrl = this;
  if(!init) {
    const d = el.getBoundingClientRect()
    console.log(d)
    const windowWidth = m.prop(d.width)
    const ratio = m.prop(1.55)
    const height = m.prop(Math.round((windowWidth()) / ratio()))
    const width = m.prop(Math.round(height() * ratio()))

    ctrl.dimensions = {
      windowWidth,
      ratio,
      card: {
        width,
        height
      }
    }

    // console.log(this.dimensions)
    console.log(width())
    console.log(height())

    // const ratio = width / height
    // const ratio = 395 / 255
    // console.log(parseFloat(ratio.toFixed(2), 10))

    // widthT = heightT * Aspect Ratio
    // heightT = widthT / Aspect Ratio

  }
}

const App = {
  controller() {
    const state = m.prop({
      data: m.prop([])
    })
    fetch('/data')
      .then(data => data.json())
      .then(state().data)
      .then(m.redraw)

    return {
      restaurants: state().data
    }
  },
  view(ctrl) {
    return m('.main-container', { config: config.bind(ctrl) }, [
      ctrl.restaurants().map((restaurant) => {
        const data = {
          address: restaurant.address,
          name: restaurant.name,
          photos: restaurant.photos,
          rating: restaurant.rating,
          id: restaurant.place_id,
          dimensions: ctrl.dimensions
        }
        return m.component(Card, { data })
      })
    ])
  }
}

export default App
