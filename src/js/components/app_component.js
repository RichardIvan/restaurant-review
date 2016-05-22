'use strict'

import m from 'mithril'
import _ from 'lodash'

//helpers
import runDelayedLoop from '../../js/helpers/delayed-loop.js'

//components
import Card from './card_component'
import Details from './details_component'
import Filter from './filter_component'

//style
import style from '../../css/app.scss'


//TODO
window.onresize = function(e) {
  console.log(e)
  // capturing the size of window and serving appropriate image Sizes
  // withing element size store
}


const mainContainerConfig = function(el, init) {
  const ctrl = this
  if(!init) {

    //this is on load
    // we are running pretty much the same function on window resize after..
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
    })

    const Ctrl = {
      restaurants: state().data,
      categories,
      unfilteredRestaurants,
      selectedRestaurant: m.prop(''),
      element: m.prop(''),
      currentElementIndex: m.prop(''),
      isCardExpanded: m.prop(''),
      
      detailsOpen: m.prop(false),
      runDelayedLoop
    }

    return Ctrl
  },
  view(ctrl) {
    return m('.main-container', { config: mainContainerConfig.bind(ctrl) }, [
      // THIS WHOLE UL MIGHT BECOME A COMPONENT!
      // config: ulConfig,
      m(`ul.${style['list-container']}`, {  style: { overflowY: ctrl.detailsOpen() ? 'hidden' : 'scroll' } }, [
        _.map(ctrl.restaurants(), (restaurant, index) => {

          // pass restaurant object here
          const data = {
            restaurants: ctrl.restaurants,
            restaurant: m.prop(restaurant),
            key: restaurant.place_id,

            element: ctrl.element,
            selectedRestaurant: ctrl.selectedRestaurant,
            //dimensions is set via main container config
            // needs to be changed
            dimensions: ctrl.dimensions,
            hide: ctrl.hide,
            elementInfo: restaurant.elementInfo,
            elementIndex: m.prop(index),

            isCardExpanded: ctrl.isCardExpanded,
            detailsOpen: ctrl.detailsOpen,

            // clickedElementIndex: index,
            currentElementIndex: ctrl.currentElementIndex

          }
          return m.component(Card, data)
        })
      ]),
      ctrl.detailsOpen() ? m.component(Details, {
        restaurants: ctrl.restaurants,
        restaurant: ctrl.selectedRestaurant,
        dimensions: ctrl.dimensions,
        //element for incard animations
        element: ctrl.element,
        originalDimensions: ctrl.originalDimensions,
        //expanded for swapping rating for address in card
        isCardExpanded: ctrl.isCardExpanded,

        detailsOpen: ctrl.detailsOpen,
        // current element index is required so that we knwo what items are
        // we hidiing in the animation loop, this way we set before/after elements
        currentElementIndex: ctrl.currentElementIndex
      } ) : '',

      // this is the whole filter component, that means the filter button also
      // if the details are opened there is the writign button wihtin
      !ctrl.detailsOpen() ? 
        m.component(Filter, {
          restaurants: ctrl.restaurants,
          unfilteredRestaurants: ctrl.unfilteredRestaurants,
          categories: ctrl.categories
        } ) : '',
      ctrl.restaurants().length === 0 ? m(`.${style['no-restults-overlay']}`, [
        m(''),
        m(`.${style['content']}`, [
          m('h1', 'No restaurants found'),
          m('p', "Hey, why don't you try removing some filters!")
        ]),
        m('')
      ]) : ''
      //HERE WE NEED A DETAIL COMPONENT AFTER ITEM BEING CLICKED
    ])
  }
}

export default App
