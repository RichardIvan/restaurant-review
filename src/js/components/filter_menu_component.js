'use strict'

//libraries
import m from 'mithril'
import _ from 'lodash'
import Velocity from 'velocity-animate'


//helpers
import 'polythene/common/object.assign';

//services
import Aria from '../services/aria.js'

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

const rowConfig = function(ariaObject, el, init) {
  if(!init) {
    Aria.register(ariaObject)
  }
}

const renderOptions = function(menuType) {
  const ctrl = this

  let icon
  let clickHandler
  let cls
  let rows
  const ariaParent = ctrl.clickedFilterSection()
  console.log(ariaParent)
  const aChild = `${menuType}-row`
  let anncouncement
  if (menuType === 'rating') {
    icon = starIcon
    clickHandler = ratingClickHandler
    cls = style['star-icon']
    rows = ctrl.ratingRows
    anncouncement = 'price'
  } else {
    icon = dollarIcon
    clickHandler = priceClickHandler
    cls = style['price-icon']
    rows = ctrl.priceRows
    anncouncement = 'star'
  }

  return m(`ul.${style['menu-rows']}`, [
    _.map(rows(), (activeStatus, index) => {
      const numberOfIcons = index + 1
      const iconsArr = new Array(numberOfIcons)
      return m(`li.${style['menu-row']}`, Object.assign(
          {
            key: index,
            onclick: clickHandler.bind(ctrl, index),
            onkeyup: (e) => {
              if(e.keyCode === 13) {
                clickHandler.call(ctrl, index)
              } else if (e.keyCode === 27) {
                ctrl.clickedFilterSection('')
              }
            }
          },
          {
            config: rowConfig.bind(ctrl,
              {
                ariaParent,
                ariaChild: `${aChild}-${index}`
              })
          },
          {
            'data-aria-id': `${ariaParent} ${aChild}-${index}`,
            tabIndex: Aria.tabIndexDir[ariaParent] ? Aria.tabIndexDir[ariaParent][`${aChild}-${index}`] : -1,
            'role': 'menuitem',
            'title': `use ${anncouncement} rating filter of ${numberOfIcons} ${numberOfIcons > 3 ? 'or more' : ''}. Filter is ${ctrl.filter.status(menuType) ? '' : 'not'} applied`,
            'aria-label': `use ${anncouncement} rating filter of ${numberOfIcons} ${numberOfIcons > 3 ? 'or more' : ''}. Filter is ${ctrl.filter.status(menuType) ? '' : 'not'} applied`,
            'aria-checked': ctrl.filter.status(menuType) ? true : false
          }
        ),
        [
          m(`ul`, 
            { 
              class: activeStatus() ? `${style['filter--active']}` : ''
            },
            [
              _.map(iconsArr, (nothing, i) => {
                if (i === 3)
                  return m(`li.${style['plus-icon']}`, { key: i }, m('span', plusIcon))
                return m(`li.${cls}`, { key: i }, m('span', icon))
              })
            ]
          )
        ])
    })
  ])
} 

const renderTypeMenu = function() {
  const ctrl = this
  const ariaParent = ctrl.clickedFilterSection()
  const aChild = `${ctrl.clickedFilterSection()}-row`

  return m(`ul.${style['food-menu']}`, [
    _.map(ctrl.categories(), (category, index) => {
      return m(`li.${style['menu-row']}`,
        { 
          onclick: categoryClickHandler.bind(ctrl, category),
          onkeyup: (e) => {
            if(e.keyCode === 13) {
              categoryClickHandler.call(ctrl, category)
            } else if( e.keyCode === 27) {
              ctrl.clickedFilterSection('')
            }
          },
          'data-aria-id': `${ctrl.clickedFilterSection()} ${ctrl.clickedFilterSection()}-row-${index}`,
            tabIndex: Aria.tabIndexDir[ariaParent] ? Aria.tabIndexDir[ariaParent][`${aChild}-${index}`] : -1,
          config: rowConfig.bind(ctrl,
            {
              ariaParent,
              ariaChild: `${aChild}-${index}`
            }
          ),
          'role': 'menuitem',
          title: `${category.name()} category filter is ${category.active() ? '' : 'not'} applied, press enter to ${category.active() ? 'remove' : 'apply'} filter`,
          'aria-label': `${category.name()} category filter is ${category.active() ? '' : 'not'} applied, press enter to ${category.active() ? 'remove' : 'apply'} filter`,
          'aria-checked': category.active()
        },
        m('span',
          {
            class: category.active() ? `${style['active']}` : ''
          },
          category.name()
        )
      )
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


  return m(`.${style['filter-menu']}.${style['shadow']}`,
    {
      config: filterMenuConfig,
      id: 'filter-menu'
    },
    [
      (ctrl.clickedFilterSection() === 'rating') ? renderOptions.call(ctrl, 'rating') : null,
      (ctrl.clickedFilterSection() === 'category') ? renderTypeMenu.call(ctrl) : null,
      (ctrl.clickedFilterSection() === 'price') ? renderOptions.call(ctrl, 'price') : null
    ]
    )
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