'use strict'

//libraries
import m from 'mithril'
import _ from 'lodash'

//stles
import style from '../../css/filter.scss'

//polythene icons
import starIcon from 'mmsvg/google/msvg/toggle/star'
import plusIcon from 'mmsvg/google/msvg/content/add'
import dollarIcon from 'mmsvg/google/msvg/editor/attach-money'


const ratingClickHandler = function(index) {
  const ctrl = this
  ctrl.filter.add('rating', index)
}

const priceClickHandler = function(index) {
  const ctrl = this
  ctrl.filter.add('price', index)
}

const categoryClickHandler = function(category) {
  const ctrl = this
  ctrl.filter.add('category', category)
}

const renderOptions = function(menuType) {
  const ctrl = this

  let icon
  let clickHandler
  let cls
  if (menuType === 'rating') {
    icon = starIcon
    clickHandler = ratingClickHandler
    cls = style['star-icon']
  } else {
    icon = dollarIcon
    clickHandler = priceClickHandler
    cls = style['price-icon']
  }
  const rows = new Array(4)

  return m(`ul.${style['menu-rows']}`, [
    _.map(rows, (row, index) => {
      const numberOfIcons = index + 1
      const iconsArr = new Array(numberOfIcons)
      return m(`li.${style['menu-row']}`, { onclick: clickHandler.bind(ctrl, index) }, [
        m(`ul`, [
          _.map(iconsArr, (_, i) => {
            if (i === 3)
              return m(`li.${style['plus-icon']}`, { key: i }, m('span', plusIcon))
            return m(`li.${cls}`, { key: i }, m('span', icon))
          })
      ])])
    })
  ])
} 

const renderTypeMenu = function(categories) {
  const ctrl = this

  return m(`ul.${style['food-menu']}`, [
    _.map(categories(), (category, index) => {
      // const numberOfIcons = index + 1
      // const iconsArr = new Array(numberOfIcons)
      return m(`li.${style['menu-row']}`, { onclick: categoryClickHandler.bind(ctrl, category.name()) }, m('span', { class: category.active() ? `${style['active']}` : '' }, category.name()))
    })
  ])

  // return _.map(, (category) => {
  //   //code
  // })
}

const renderFilterMenu = function(args) {
  const ctrl = this
  const parentCtrl = args

  console.log(ctrl.clickedFilterSection())

  return m(`.${style['filter-menu']}`, [
    (ctrl.clickedFilterSection() === 'rating') ? renderOptions.call(ctrl, 'rating') : '',
    (ctrl.clickedFilterSection() === 'type') ? renderTypeMenu.call(ctrl, ctrl.categories) : '',
    (ctrl.clickedFilterSection() === 'price') ? renderOptions.call(ctrl, 'price') : ''
      
    ])
}



const FilterMenu = {

  controller(args) {
    const Ctrl = {
      restaurants: args.restaurants,
      categories: args.categories,
      clickedFilterSection: args.clickedFilterSection,
      filter: args.filter
    }
    
    return Ctrl
  },
  view(ctrl, args) {
    return renderFilterMenu.call(ctrl, args)
  }

}

export default FilterMenu