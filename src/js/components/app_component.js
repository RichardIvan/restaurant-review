'use strict'

import m from 'mithril'

//components
import Card from './card_component'

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


    return m('.main-container', [
        ctrl.restaurants().map(function(restaurant) {
          const data = {
            address: restaurant.address,
            name: restaurant.name,
            photos: restaurant.photos,
            rating: restaurant.rating,
            id: restaurant.place_id
          }
          return m.component(Card, { data })
        })
      ])
  }
}

export default App
