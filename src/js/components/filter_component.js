'use strict'

import m from 'mithril'
import _ from 'lodash'
import classnames from 'classnames'

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
      onclick: handleMiniButtonClick.bind(ctrl, 'type')
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
        m(`.${style['clear-button-line']}`, { class: (ctrl.open() && ctrl.filter.status()) ? style['open'] : '' }, [
          clearActionButton.call(ctrl),
          m(`.${style['tooltip']}`, { class: (ctrl.clickedFilterSection() && ctrl.open()) ? style['visible'] : '' }, ['Clear', m(`.${style['nod']}`)])
          // parentCtrl.tooltips[0].visible() ? m(`.${style['tooltip']}`, 'Filter') : ''
        ]),
        m(`.${style['star-button-line']}`, { class: ctrl.open() ? style['open'] : '' }, [
          starActionButton.call(ctrl),
          m(`.${style['tooltip']}`, { class: (!ctrl.clickedFilterSection() && ctrl.open()) ? style['visible'] : '' }, ['Stars', m(`.${style['nod']}`)])
          // parentCtrl.tooltips[0].visible() ? m(`.${style['tooltip']}`, 'Filter') : ''
        ]),
        m(`.${style['type-button-line']}`, { class: ctrl.open() ? style['open'] : '' },  [
          typeActionButton.call(ctrl),
          m(`.${style['tooltip']}`, { class: (!ctrl.clickedFilterSection() && ctrl.open()) ? style['visible'] : '' }, ['Type', m(`.${style['nod']}`)])
          // parentCtrl.tooltips[0].visible() ? m(`.${style['tooltip']}`, 'Filter') : ''
        ]),
        m(`.${style['price-button-line']}`, { class: ctrl.open() ? style['open'] : '' },  [
          priceActionButton.call(ctrl),
          m(`.${style['tooltip']}`, { class: (!ctrl.clickedFilterSection() && ctrl.open()) ? style['visible'] : '' }, ['Price', m(`.${style['nod']}`)])
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

const fltr = function() {
  const ctrl = this

  // const unfilteredRestaurants = m.prop(_.cloneDeep(ctrl.restaurants()))
  let status = 0
  const filter = {
    status(type) {
      
      if ( typeof type === 'number') {
        status = type
      } else if (typeof type === 'string') {
        switch( type ) {
          case 'price':
            return filter.active().price()
          case 'rating':
            return filter.active().rating()
          case 'category':
            return filter.active().category().length
          default:
            return false;
        }
      }
      return status
    },
    active: m.prop({
      price: m.prop(0),
      rating: m.prop(0),
      category: m.prop([])
    }),
  }

  const filterPrice = function(rests) {
    filter.status(1)
    return _.filter(rests(), (restaurant) => {
            const activePriceFilter = filter.active().price()
            const price = restaurant.priceTier
            if (price <= 3 && activePriceFilter === price) {
              return 1
            } else if ( activePriceFilter > 3) {
              return price > 3
            }
          })
  }

  const filterRating = function(rests) {
    filter.status(1)
    return _.filter(rests(), (restaurant) => {
            const rating = Math.floor(restaurant.rating)
            const activeRatingFilter = filter.active().rating()
            if (rating <= 3 && activeRatingFilter === rating) {
              return 1
            } else if ( activeRatingFilter > 3) {
              return rating > 3
            }
          })
  }

  const filterCategory = function(rests, category) {
    filter.status(1)
    // ctrl.categories()
    //find category name in categories array for the filter menu,
    // and set it's flag to true
    const filterListCateroryIndex = _.find(ctrl.categories(), (item) => {
      return item.name() === category
    })
    console.log(filterListCateroryIndex.active())

    return _.filter(rests(), (restaurant) => {
            const index = _.indexOf(restaurant.categories, category)
            if(index !== -1) {
              return 1
            }
          })

  }

  const applyFilter = function() {

    const rests = m.prop(_.cloneDeep(ctrl.unfilteredRestaurants()))

    if (filter.active().price()) {
      rests(filterPrice(rests))
    }

    if (filter.active().rating()) {
      rests(filterRating(rests))
    }

    if (filter.active().category().length) {
      _.forEach(filter.active().category(), (category) => {
        rests(filterCategory(rests, category))
      })
    }

    if( !filter.active().price() && !filter.active().rating() && filter.active().category().length === 0) {
      filter.status(0)
    } else {
      filter.status(1)
    }

    ctrl.restaurants(rests())
    m.redraw()
  }

  return {
    add(type, value) {
      switch(type) {
        case 'price':
          console.log('PRICE FILTER')
          console.log('CURRENT FILTER')
          console.log(filter.active().price())
          console.log('NEW FILTER VALUE')
          
          const newPriceValue = value + 1
          console.log(newPriceValue)
          if(filter.active().price()) {
            if(filter.active().price() !== newPriceValue) {
              filter.active().price(newPriceValue)
              applyFilter()
            } else {

              filter.active().price(0)
              applyFilter()

            }
          } else {
            filter.active().price(newPriceValue)
            // apply price filter give .. ctrl.restaurants()
            ctrl.restaurants(filterPrice(ctrl.restaurants))
            console.log(ctrl.restaurants())
            m.redraw()
          }
          break
        case 'rating':
          const newRatingValue = value + 1
          if(filter.active().rating()) {
            if(filter.active().rating() !== newRatingValue) {
              filter.active().rating(newRatingValue)
              applyFilter()
            } else {

              filter.active().rating(0)
              applyFilter()
              
            }
          } else {
            filter.active().rating(newRatingValue)
            // apply rating filter give .. ctrl.restaurants()
            ctrl.restaurants(filterRating(ctrl.restaurants))
            m.redraw()
          }
          break
        case 'category':
          if (filter.active().category().length) {
            const index = _.indexOf(filter.active().category(), value)
            if (index === -1) {
              // apply category filter
              filter.active().category().push(value)
              ctrl.restaurants(filterCategory(ctrl.restaurants, value))
              m.redraw()
            } else {
              _.pullAt(filter.active().category(), index)
              // applyFullFilter
              applyFilter()
            }

          } else {
            filter.active().category().push(value)
            ctrl.restaurants(filterCategory(ctrl.restaurants, value))
            m.redraw()
          }
          break
        default:
          break
      }
    },
    reset() {
      filter.active().category()
      // console.log(filter.status())
      // console.log(filter.active().price())
      // console.log(filter.active().rating())
      // console.log(filter.active().category())

      filter.status(0)
      filter.active().price(0)
      filter.active().rating(0)
      filter.active().category([])
      ctrl.restaurants(ctrl.unfilteredRestaurants())
      _.forEach(ctrl.categories(), (category) => {
        category.active(false)
      })
    },
    status(type) {
      return filter.status(type)
    }
  }
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