'use strict'

import m from 'mithril'
import _ from 'lodash'


//helpers
import runDelayedLoop from '../../js/helpers/delayed-loop.js'
import { runAnimation } from '../../js/helpers/card-animation.js'

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
      selectedEl: m.prop(''),
      currentElementIndex: m.prop(''),
      hide(clickedElementIndex) {

        // this is a controller from a card
        

        const ctrl = this

        if(ctrl.expanded())
          return

        ctrl.expanded(!ctrl.expanded())
        m.redraw()
        m.redraw()

        Ctrl.selectedRestaurant(Ctrl.restaurants()[clickedElementIndex()])
        Ctrl.selectedEl(ctrl.element())
        Ctrl.currentElementIndex(clickedElementIndex())

        //copying expanded property so it is accessible in details component when passed
        Ctrl.expanded = ctrl.expanded


        const d = ctrl.element().getBoundingClientRect()
        const top = d.top

        runAnimation.call(Ctrl, ctrl.element(), top)

        runDelayedLoop(Ctrl.restaurants(), clickedElementIndex(), false)

      },
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
          const data = {
            address: restaurant.address,
            name: restaurant.name,
            photos: restaurant.photos,
            rating: restaurant.rating,
            key: restaurant.place_id,
            dimensions: ctrl.dimensions,
            hide: ctrl.hide,
            elementInfo: restaurant.elementInfo,
            elementIndex: m.prop(index)
          }
          return m.component(Card, data)
        })
      ]),
      ctrl.detailsOpen() ? m.component(Details, {
        restaurants: ctrl.restaurants,
        restaurant: ctrl.selectedRestaurant,
        dimensions: ctrl.dimensions,
        //element for incard animations
        element: ctrl.selectedEl,
        originalDimensions: ctrl.originalDimensions,
        //expanded for swapping rating for address in card
        expanded: ctrl.expanded,


        detailsOpen: ctrl.detailsOpen,
        currentElementIndex: ctrl.currentElementIndex
      } ) : '',

      // this is the whole filter component, that means the filter button also
      // if the details are opened there is the writign button wihtin
      !ctrl.detailsOpen() ? 
        m.component(Filter, {
          restaurants: ctrl.restaurants,
          unfilteredRestaurants: ctrl.unfilteredRestaurants,
          categories: ctrl.categories
          //details open for swithin fab edit/done within the filter comp.
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
