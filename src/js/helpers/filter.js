'use strict'

import m from 'mithril'
import _ from 'lodash'

const Filter = function() {
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

export default Filter