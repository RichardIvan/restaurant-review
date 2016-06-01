'use strict'

import m from 'mithril'
import _ from 'lodash'

//helpers
import runDelayedLoop from '../../js/helpers/delayed-loop.js'
import dimensionsHelper from '../../js/helpers/screen-dimensions.js'

//services
import Aria from '../services/aria.js'

//components
import Toolbar from './toolbar_component'
import Card from './card_component'
import DesktopDetailsComponent from './desktop_details_component'
import Details from './details_component'
import Filter from './filter_component'

//style
import style from '../../css/app.scss'


//TODO
window.onresize = function(e) {
  dimensionsHelper.setDimensions('main-container')
  dimensionsHelper.setDimensions('list-container')
  m.redraw()
}



//Export as it's own helper!
const captureElement = function(namespace, el, init) {
  if(!init) {
    dimensionsHelper.setElement(namespace, el)
    dimensionsHelper.setDimensions(namespace)
  }
}

const listContainerConfig = function( ariaObject, el, init) {
  if(!init) {
    Aria.register(ariaObject)
    Aria.tabIndexDir[ariaObject.ariaParent][ariaObject.ariaChild] = 0
  }
}

const appContainerConfig = function(ariaObject, namespace, el, init) {
  if(!init) {
    Aria.register(ariaObject)
    dimensionsHelper.setElement(namespace, el)
    dimensionsHelper.setDimensions(namespace)
  }
}

const App = {
  controller() {
    const state = m.prop({
      data: m.prop([]),
      selectedRestaurant: m.prop('')
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
      state().selectedRestaurant(json[0])
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
      selectedRestaurant: state().selectedRestaurant,
      element: m.prop(''),
      currentElementIndex: m.prop(''),
      isCardExpanded: m.prop(''),
      
      detailsOpen: m.prop(false),
      runDelayedLoop,

      ariaParent: 'root',
      ariaChild: 'root'
    }
    // Ctrl.selectedRestaurant = m.prop(Ctrl.restaurants)

    return Ctrl
  },
  view(ctrl) {
    return m('.main-container',
      {
        config: appContainerConfig.bind(null,
          {
            ariaParent: ctrl.ariaParent,
            ariaChild: ctrl.ariaChild
          },
          'main-container'
        ),
        onkeyup: Aria.handleAriaKeyPress,
        'data-aria-id': `${ctrl.ariaParent} ${ctrl.ariaChild}`
      },
      [
        // THIS WHOLE UL MIGHT BECOME A COMPONENT!
        // config: ulConfig,
        // console.log(ctrl.selectedRestaurant()),
        m('span',
          {
            id: 'aria-select-control-description',
            class: 'aria-hide'             
          },
          'select item by pressing enter'
        ),


        (dimensionsHelper.isDesktop() && ctrl.selectedRestaurant()) ?
          m.component(DesktopDetailsComponent,
            {
              restaurant: ctrl.selectedRestaurant(),
              ariaParent: ctrl.ariaParent,
              ariaChild: 'desktop-details-container'
            }) : '',


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

          // ariaParent: 'root',
          // ariaId: 'list-container'
        } ) : '',


        m(`aside.${style['list-container']}`,
          {

            style: {
              overflowY: ctrl.detailsOpen() ? 'hidden' : 'scroll',
              position: dimensionsHelper.isMobile() ? 'absolute' : 'relative'
            },
            'data-aria-id': `${ctrl.ariaParent} list-container`,
            tabIndex: Aria.tabIndexDir[ctrl.ariaParent] ? Aria.tabIndexDir[ctrl.ariaParent]['list-container'] : -1,
            // onkeyup: Aria.handleAriaKeyPress.bind(ctrl, ctrl.ariaParent, 'list-container'),
            config: listContainerConfig.bind(ctrl,
              {
                ariaParent: ctrl.ariaParent,
                ariaChild: 'list-container'
              }
            ),
            role: 'region',
            'aria-labelledby': 'h3-region-label aria-select-control-description'
          },
          [ 
            dimensionsHelper.isDesktop() ?
              m(Toolbar, {
                restaurants: ctrl.restaurants,
                categories: ctrl.categories,
                unfilteredRestaurants: ctrl.unfilteredRestaurants,
                // restaurant: ctrl.restaurants
                ariaParent: 'list-container'
              }) : '',
          
            m(`ul`,
              {
                style: {
                  // overflowY: ctrl.detailsOpen() ? 'hidden' : 'scroll',
                },
                config: captureElement.bind(null, 'list-container'),
                role: 'list'
              },
              [
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
                    currentElementIndex: ctrl.currentElementIndex,

                    ariaParent: 'list-container',
                    ariaChild: `restaurant-card-${index}`

                  }
                  return m.component(Card, data)
                })
              ]
            )

          ]
        ),

        

        // this is the whole filter component, that means the filter button also
        // if the details are opened there is the writign button wihtin

        !dimensionsHelper.isDesktop() ?
          m.component(Filter, {
            restaurants: ctrl.restaurants,
            unfilteredRestaurants: ctrl.unfilteredRestaurants,
            categories: ctrl.categories,
            detailsOpen: ctrl.detailsOpen
          } ) : '',
        // !ctrl.detailsOpen() ? 
        //    : '',
        ctrl.restaurants().length === 0 ?
          m(`.${style['no-restults-overlay']}`,
            [
              m(''),
              m(`.${style['content']}`, [
                m('h1', 'No restaurants found'),
                m('p', "Hey, why don't you try removing some filters!")
              ]),
              m('')
            ]
          ) : ''
        //HERE WE NEED A DETAIL COMPONENT AFTER ITEM BEING CLICKED
      ]
    )
  }
}

export default App
