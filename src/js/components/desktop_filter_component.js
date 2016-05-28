'use strict'

import m from 'mithril'
import _ from 'lodash'

//helpers
import fltr from '../helpers/filter.js'

//style
import style from '../../css/desktop-filter.scss'

//polythene
import menu from 'polythene/menu/menu'
import list from 'polythene/list/list'
import listTile from 'polythene/list-tile/list-tile'
import btn from 'polythene/button/button'

import FilterMenuComponent from './filter_menu_component.js'

//TODO
// have an overlay that will close this modal by seeting permanent to false
// upon being clicked

//this components sets up a window listener for esc and deregister specific one using named handler

//conditionally display conent of the menu

const handleMiniButtonClick = function(type) {
  const ctrl = this

  if (type === 'clear') {

    console.log('CLICKE CLEAR BUTTON')
    console.log(ctrl)
    ctrl.filter.reset()
    ctrl.open(!ctrl.open())
    ctrl.clickedFilterSection('')
    return
  }

  console.log(type)

  if (type === ctrl.clickedFilterSection()) {
    ctrl.clickedFilterSection('')
  } else {
    ctrl.clickedFilterSection(type)
  }
}


const filterMenu = function() {
  const ctrl = this
  return m.component(list, {
          tiles: [
            m.component(listTile, {
              title: 'Type',
              ink: true,
              events: {
                onclick: handleMiniButtonClick.bind(ctrl, 'rating')
              }
            }),
            m.component(listTile, {
              title: 'Type',
              ink: true,
              events: {
                onclick: handleMiniButtonClick.bind(ctrl, 'type')
              }
            }),
            m.component(listTile, {
              title: 'Price',
              ink: true,
              events: {
                onclick: handleMiniButtonClick.bind(ctrl, 'price')
              }
            }),
            m.component(listTile, {
              title: 'Reset',
              ink: true,
              events: {
                onclick: handleMiniButtonClick.bind(ctrl, 'rating')
              }
            })
          ]
        })
}

const listOfFilters = function() {
  const ctrl = this
  return m.component(list, {
        tiles: [
          m.component(listTile, {
            title: 'Type',
            ink: true,
            events: {
              onclick: handleMiniButtonClick.bind(ctrl, 'rating')
            }
          }),
          m.component(listTile, {
            title: 'Type',
            ink: true,
            events: {
              onclick: handleMiniButtonClick.bind(ctrl, 'type')
            }
          }),
          m.component(listTile, {
            title: 'Price',
            ink: true,
            events: {
              onclick: handleMiniButtonClick.bind(ctrl, 'price')
            }
          }),
          m.component(listTile, {
            title: 'Reset',
            ink: true,
            events: {
              onclick: handleMiniButtonClick.bind(ctrl, 'rating')
            }
          })
        ]
      })
}

const DesktopFilter = {
  controller( { restaurants, unfilteredRestaurants ,categories } ) {
    const Ctrl = {
      open: m.prop(false),
      clickedFilterSection: m.prop(''),
      restaurants,
      unfilteredRestaurants,
      categories
    }
    Ctrl.filter = fltr.call(Ctrl)

    return Ctrl
  },
  view(ctrl, { restaurants, unfilteredRestaurants, categories }) {
    return m(`.${style['container']}`,
      [
        m(`.${style['overlay']}`,
          {
            class: ctrl.open() ? `${style['open']}` : `${style['closed']}`,
            onclick: () => {
              console.log('duck this')
            }
          }
        ),
        m.component(btn, {
          label: 'Filter',
          id: 'button',
          raised: false,
          events: {
            onclick: () => (ctrl.open(true))
          }
        }),
        m.component(menu, {
          target: 'button', // to align with the link
          offset: -100, // horizontally align with link
          id: 'filter-menu-container',
          show: ctrl.open(), // should the menu be open or closed?
          didHide: () => (ctrl.open(false)), // called after closing
          permanent: m.prop(true),
          size: 7,
          origin: 'top-left',
          class: !ctrl.open() ? `${style['closed']}` : '',
          content: ctrl.clickedFilterSection() ?
            m(list, {
              tiles: [
                m(listTile, {
                  id: 'filter-component-container',
                  content: m(FilterMenuComponent,
                    {
                      clickedFilterSection: ctrl.clickedFilterSection,
                      restaurants,
                      categories,
                      unfilteredRestaurants,
                      filter: ctrl.filter,
                      open: ctrl.open
                    }
                  )
                })
              ]
            }) :
            filterMenu.call(ctrl)
        })
      ]
    )
  }
}

export default DesktopFilter