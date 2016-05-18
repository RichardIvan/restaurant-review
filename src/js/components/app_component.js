'use strict'

import m from 'mithril'
import _ from 'lodash'
import Velocity from 'velocity-animate'

//helpers
import runDelayedLoop from '../../js/helpers/delayed-loop.js'

//components
import Card from './card_component'
import Details from './details_component'
import Filter from './filter_component'

//style
import style from '../../css/app.scss'

window.onresize = function(e) {
  console.log(e)
  // capturing the size of window and serving appropriate image Sizes
  // withing element size store
}



const config = function(el, init) {
  const ctrl = this
  if(!init) {
    const d = el.getBoundingClientRect()
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
  }
}

// const scrollHandler = function(e) {
//   console.log( 'scrollin' )
//   console.log(e)
// }

// var latestKnownScrollY = 0;

// function update() {
//   // reset the tick so we can
//   // capture the next onScroll
//   ticking = false;

//   var currentScrollY = latestKnownScrollY;


//   console.log(currentScrollY)
//   // read offset of DOM elements
//   // and compare to the currentScrollY value
//   // then apply some CSS classes
//   // to the visible items
// }

// // kick off - no longer needed! Woo.
// // update();

// var latestKnownScrollY = 0,
//   ticking = false;

// // function onScroll() {
// //   latestKnownScrollY = window.scrollY;
// //   requestTick();
// // }

// function requestTick() {
//   if(!ticking) {
//     requestAnimationFrame(update);
//   }
//   ticking = true;
// }

// const ulConfig = function(el, inited) {
//   if(!inited) {
//     el.onscroll = function(e) {
//       latestKnownScrollY = el.scrollTop
//       requestTick()
//     }
//   }
// }

const runAnimation = function(el, top) {
  //this is Ctrl of app_component
  const ctrl = this

  Velocity(
    el,
    {
      "translateY": -top
    },
    { duration: 300,
      delay: 500,
      easing: [0.4, 0.0, 0.2, 1]
    }
  )
  Velocity(
    el['firstChild'],
    {
      margin: 0
    },
    { duration: 300,
      delay: 600,
      easing: [0.4, 0.0, 0.2, 1],
      queue: false,
      complete() {
        ctrl.detailsOpen(true)
      }
    }
  )
}

const App = {
  controller() {
    const state = m.prop({
      data: m.prop([])
    })
    const data = fetch('/data')
      .then(data => data.json())
      
    data.then((json) => {
        _.forEach(json, (item, i) => {
          item.elementInfo = {
            visible: m.prop(true),
            index: i
          }
        })

        state().data(json)

      })
      .then(m.redraw)

    const categories = m.prop('')
    const unfilteredRestaurants = m.prop('')
    data.then((json) => {

      unfilteredRestaurants(_.cloneDeep(json))
      categories(_.map(unfilteredRestaurants(), (restaurant) => {
        return restaurant.categories
      }))
      categories(_.flatten(categories(), true))
      categories(_.uniq(categories(), true))
      categories(_.map(categories(), (category) => {
          return {
            name: m.prop(category),
            active: m.prop(false)
          }
        }))
      console.log(categories())
    })

    
    

    const Ctrl = {
      restaurants: state().data,
      categories,
      selectedRestaurant: m.prop(''),
      selectedEl: m.prop(''),
      hide(clickedElementIndex, el) {

        // this is a controller from a card
        const ctrl = this

        if(ctrl.expanded())
          return

        ctrl.expanded(!ctrl.expanded())
        m.redraw()
        m.redraw()

        Ctrl.selectedRestaurant(Ctrl.restaurants()[clickedElementIndex])
        Ctrl.selectedEl(el)

        //copying expanded property so it is accessible in details component when passed
        Ctrl.expanded = ctrl.expanded


        const d = el.getBoundingClientRect()
        const top = d.top

        runAnimation.call(Ctrl, el, top)
        
        console.log(Ctrl.restaurants())

        runDelayedLoop(Ctrl.restaurants(), clickedElementIndex, false)

      },
      detailsOpen: m.prop(false),
      runDelayedLoop
    }

    return Ctrl
  },
  view(ctrl) {
    return m('.main-container', { config: config.bind(ctrl) }, [
      // THIS WHOLE UL MIGHT BECOME A COMPONENT!
      // config: ulConfig,
      m(`ul.${style['list-container']}`, {  style: { overflowY: ctrl.detailsOpen() ? 'hidden' : 'scroll' } }, [
        _.map(ctrl.restaurants(), (restaurant) => {
          const data = {
            address: restaurant.address,
            name: restaurant.name,
            photos: restaurant.photos,
            rating: restaurant.rating,
            id: restaurant.place_id,
            dimensions: ctrl.dimensions,
            hide: ctrl.hide,
            elementInfo: restaurant.elementInfo
          }
          return m.component(Card, { data })
        })
      ]),
      ctrl.detailsOpen() ? m.component( Details, {
        restaurants: ctrl.restaurants(),
        restaurant: ctrl.selectedRestaurant(),
        dimensions: ctrl.dimensions,
        element: ctrl.selectedEl,
        originalDimensions: ctrl.originalDimensions,
        expanded: ctrl.expanded,
        detailsOpen: ctrl.detailsOpen
      } ) : '',
      m.component( Filter, {
        restaurants: ctrl.restaurants,
        categories: ctrl.categories,
        filter: ctrl.filter
      } )
      //HERE WE NEED A DETAIL COMPONENT AFTER ITEM BEING CLICKED
    ])
  }
}

export default App
