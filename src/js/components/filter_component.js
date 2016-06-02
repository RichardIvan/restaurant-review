'use strict'

import m from 'mithril'
import _ from 'lodash'
import classnames from 'classnames'

//helpers
import fltr from '../helpers/filter.js'

//polythene
import fab from 'polythene/fab/fab'

//components
import FilterMenu from '../components/filter_menu_component'

import style from '../../css/filter.scss'

//polythene
import filterIcon from 'mmsvg/google/msvg/content/filter-list'
import starIcon from 'mmsvg/google/msvg/toggle/star'
import foodIcon from '../../icons/rr_food_icon'
import priceIcon from 'mmsvg/google/msvg/editor/attach-money'
import clearIcon from 'mmsvg/google/msvg/content/clear'

//polythene components
const filterActionButton = function() {
  const ctrl = this

  return m.component(fab, {
    icon: {
      msvg: filterIcon
    },
    class: style['filter-action-button'],
    events: {
      onclick: () => {
        ctrl.open(!ctrl.open())
        ctrl.clickedFilterSection('')
        // if (ctrl.open()) {
          
        // }
        // tooltipVisible(!tooltipVisible())
        // console.log(o)
      }
    }
  });
}

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

  if (type === ctrl.clickedFilterSection()) {
    ctrl.clickedFilterSection('')
  } else {
    ctrl.clickedFilterSection(type)
  }
}

const clearActionButton = function() {
  const ctrl = this
  return m.component(fab, {
    icon: {
      msvg: clearIcon
    },
    mini: true,
    class: style['filter-action-button-mini'],
    events: {
      onclick: handleMiniButtonClick.bind(ctrl, 'clear')
    }
  });
}

const starActionButton = function() {
  const ctrl = this
  return m.component(fab, {
    icon: {
      msvg: starIcon
    },
    mini: true,
    class: classnames(style['filter-action-button-mini'], ctrl.filter.status('rating') ? style['rating-fab--active'] : '' ),
    events: {
      onclick: handleMiniButtonClick.bind(ctrl, 'rating')
    }
  })
} 

const typeActionButton = function() {
  const ctrl = this
  return m.component(fab, {
    icon: {
      msvg: foodIcon
    },
    class: classnames(style['filter-action-button-mini'], ctrl.filter.status('category') ? style['type-fab--active'] : '' ),
    mini: true,
    events: {
      onclick: handleMiniButtonClick.bind(ctrl, 'category')
    }
  });
}

const priceActionButton = function() {
  const ctrl = this
  return m.component(fab, {
    icon: {
      msvg: priceIcon
    },
    class: classnames(style['filter-action-button-mini'], ctrl.filter.status('price') ? style['price-fab--active'] : '' ),
    mini: true,
    events: {
      onclick: handleMiniButtonClick.bind(ctrl, 'price')
    }
  })
}

const renderMiniActionButtons = (ctrl) => {
  return [
        m(`.${style['clear-button-line']}`,
          {
            class: (ctrl.open() && ctrl.filter.status()) ? style['open'] : ''
          }, 
          [
            clearActionButton.call(ctrl),
            m(`.${style['tooltip']}`,
              {
                class: (ctrl.clickedFilterSection() && ctrl.open()) ? style['visible'] : ''
              },
              [
                'Clear', m(`.${style['nod']}`)
              ]
            )
          // parentCtrl.tooltips[0].visible() ? m(`.${style['tooltip']}`, 'Filter') : ''
        ]),
        m(`.${style['star-button-line']}`,
          {
            class: ctrl.open() ? style['open'] : ''
          },
          [
            starActionButton.call(ctrl),
            m(`.${style['tooltip']}`,
              {
                class: (!ctrl.clickedFilterSection() && ctrl.open()) ? style['visible'] : ''
              },
              [
                'Stars', m(`.${style['nod']}`)
              ]
            )
          // parentCtrl.tooltips[0].visible() ? m(`.${style['tooltip']}`, 'Filter') : ''
        ]),
        m(`.${style['type-button-line']}`,
          {
            class: ctrl.open() ? style['open'] : ''
          },
          [
            typeActionButton.call(ctrl),
            m(`.${style['tooltip']}`,
              {
                class: (!ctrl.clickedFilterSection() && ctrl.open()) ? style['visible'] : ''
              },
              [
                'Type', m(`.${style['nod']}`)
              ]
            )
          // parentCtrl.tooltips[0].visible() ? m(`.${style['tooltip']}`, 'Filter') : ''
        ]),
        m(`.${style['price-button-line']}`,
          {
            class: ctrl.open() ? style['open'] : ''
          },
          [
            priceActionButton.call(ctrl),
            m(`.${style['tooltip']}`,
              {
                class: (!ctrl.clickedFilterSection() && ctrl.open()) ? style['visible'] : ''
              },
              [
                'Price', m(`.${style['nod']}`)
              ])
          // parentCtrl.tooltips[0].visible() ? m(`.${style['tooltip']}`, 'Filter') : ''
        ])
  ]
}

const renderView = function(args) {
  const ctrl = this
  const parentCtrl = args


  return m(`.${style['filter-section']}`, { style: { zIndex: !ctrl.detailsOpen() ? 20 : 0 } }, [
      m(`.${style['buttons']}`, [
        m(`.${style['main-button-line']}`, [
          filterActionButton.call(ctrl),
          ctrl.filterToolTipActive() ? m(`.${style['tooltip']}`, ['Filter', m(`.${style['nod']}`)]) : ''
          // parentCtrl.tooltips[0].visible() ? m(`.${style['tooltip']}`, 'Filter') : ''
        ]),
        renderMiniActionButtons(ctrl),
        ctrl.clickedFilterSection() ? m.component( FilterMenu, {
          // WE NEED TO GENERATE RESET FILTER FUNCTION THAT WILL STORE THE ORIGINAL VALUES
          // All we need to be passed to is all the restaurants
          // there we can be doing the filtering thereon and gain
          // prices options and types as to render options
          //
          restaurants: parentCtrl.restaurants,
          categories: parentCtrl.categories,
          filter: ctrl.filter,
          clickedFilterSection: ctrl.clickedFilterSection
        } ) : '',
        ctrl.open() ? m(`.${style['overlay']}`, { onclick: () => ctrl.closeFilterSection() }) : '',
      ])
    ])

}



const Filter = {
  controller(args) {

    const filterToolTipActive = m.prop(true)
    setTimeout(() => {
      filterToolTipActive(false)
      m.redraw()
    }, 2000)

    const Ctrl = {
      open: m.prop(false),
      tooltipVisible: m.prop(false),
      filterToolTipActive,
      restaurants: args.restaurants,
      unfilteredRestaurants: args.unfilteredRestaurants, 
      categories: args.categories,
      clickedFilterSection: m.prop(''),
      closeFilterSection() {
        Ctrl.open(false)
        Ctrl.clickedFilterSection('')
      },
      detailsOpen: args.detailsOpen
    }
    Ctrl.filter = fltr.call(Ctrl)

    return Ctrl
  },
  view(ctrl, args) {
    return renderView.call(ctrl, args)
  }
}

export default Filter