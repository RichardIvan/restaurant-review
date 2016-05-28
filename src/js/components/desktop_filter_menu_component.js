'use strict'

//libraries
import m from 'mithril'
import _ from 'lodash'
import Velocity from 'velocity-animate'

//stles
import style from '../../css/filter.scss'

//polythene icons
import starIcon from 'mmsvg/google/msvg/toggle/star'
import plusIcon from 'mmsvg/google/msvg/content/add'
import dollarIcon from 'mmsvg/google/msvg/editor/attach-money'


const ratingClickHandler = function(index) {
  const ctrl = this
  _.forEach(ctrl.ratingRows(), (row, i) => {
    if (index === i) {
      row(!row())
    } else row(false)
  })
  ctrl.filter.add('rating', index)
}

const priceClickHandler = function(index) {
  const ctrl = this
  _.forEach(ctrl.priceRows(), (row, i) => {
    if (index === i) {
      row(!row())
    } else row(false)
  })
  ctrl.filter.add('price', index)
}

const categoryClickHandler = function(category) {
  const ctrl = this
  category.active(!category.active())
  ctrl.filter.add('category', category.name())
}

const renderOptions = function(menuType) {
  const ctrl = this

  let icon
  let clickHandler
  let cls
  let rows
  if (menuType === 'rating') {
    icon = starIcon
    clickHandler = ratingClickHandler
    cls = style['star-icon']
    rows = ctrl.ratingRows
  } else {
    icon = dollarIcon
    clickHandler = priceClickHandler
    cls = style['price-icon']
    rows = ctrl.priceRows
  }

  return m(`ul.${style['menu-rows']}`, [
    _.map(rows(), (activeStatus, index) => {
      const numberOfIcons = index + 1
      const iconsArr = new Array(numberOfIcons)
      return m(`li.${style['menu-row']}`, { key: index, onclick: clickHandler.bind(ctrl, index) }, [
        m(`ul`, { class: activeStatus() ? `${style['filter--active']}` : '' } ,[
          _.map(iconsArr, (_, i) => {
            if (i === 3)
              return m(`li.${style['plus-icon']}`, { key: i }, m('span', plusIcon))
            return m(`li.${cls}`, { key: i }, m('span', icon))
          })
      ])])
    })
  ])
} 

const renderTypeMenu = function() {
  const ctrl = this

  return m(`ul.${style['food-menu']}`, [
    _.map(ctrl.categories(), (category) => {
      return m(`li.${style['menu-row']}`, { onclick: categoryClickHandler.bind(ctrl,category) }, m('span', { class: category.active() ? `${style['active']}` : '' }, category.name()))
    })
  ])

  // return _.map(, (category) => {
  //   //code
  // })
}

const filterMenuConfig = function(el, inited) {
  if(!inited) {
    Velocity(
      el,
      {
        opacity: 1
      },
      {
        duration: '150ms'
      }
    )
  } 
}


const renderFilterMenu = function(args) {
  const ctrl = this
  // const parentCtrl = args


  return m(`.${style['filter-menu']}.${style['shadow']}`, { config: filterMenuConfig } ,[
    (ctrl.clickedFilterSection() === 'rating') ? renderOptions.call(ctrl, 'rating') : '',
    (ctrl.clickedFilterSection() === 'type') ? renderTypeMenu.call(ctrl) : '',
    (ctrl.clickedFilterSection() === 'price') ? renderOptions.call(ctrl, 'price') : ''
      
    ])
}



const FilterMenu = {

  controller(args) {
    const Ctrl = {
      restaurants: args.restaurants,
      categories: args.categories,
      clickedFilterSection: args.clickedFilterSection,
      filter: args.filter,
      priceRows: m.prop([m.prop(false), m.prop(false), m.prop(false), m.prop(false)]),
      ratingRows: m.prop([m.prop(false), m.prop(false), m.prop(false), m.prop(false)])
    }
    
    return Ctrl
  },
  view(ctrl, args) {
    return renderFilterMenu.call(ctrl, args)
  }

}

export default FilterMenu