'use strict'

import m from 'mithril'
import fab from 'polythene/fab/fab';
import classnames from 'classnames'

import style from '../../css/filter.scss'

//polythene
import filterIcon from 'mmsvg/google/msvg/content/filter-list';
import starIcon from 'mmsvg/google/msvg/toggle/star';
import foodIcon from '../../icons/rr_food_icon';
import priceIcon from 'mmsvg/google/msvg/editor/attach-money';

//polythene components
const filterActionButton = (open, tooltipVisible) => {
  return m.component(fab, {
    icon: {
      msvg: filterIcon
    },
    class: style['filter-action-button'],
    events: {
      onclick: () => {
        console.log('clicked')
        open(!open())
        tooltipVisible(!tooltipVisible())
        // console.log(o)
      }
    }
  });
}

const starActionButton = (open) => {
  return m.component(fab, {
    icon: {
      msvg: starIcon
    },
    mini: true,
    class: style['filter-action-button-mini']
  });
}

  

const typeActionButton = (open) => {
  return m.component(fab, {
    icon: {
      msvg: foodIcon
    },
    class: style['filter-action-button-mini'],
    mini: true
  });
}

const priceActionButton = (open) => {
  return m.component(fab, {
    icon: {
      msvg: priceIcon
    },
    class: style['filter-action-button-mini'],
    mini: true
  });
}

const renderMiniActionButtons = (ctrl) => {
  return [
    m(`.${style['type-button-line']}`, { class: ctrl.open() ? style['open'] : '' },  [
          typeActionButton(),
          m(`.${style['tooltip']}`, { class: ctrl.tooltipVisible() ? style['visible'] : '' }, ['Type', m(`.${style['nod']}`)])
          // parentCtrl.tooltips[0].visible() ? m(`.${style['tooltip']}`, 'Filter') : ''
        ]),
        m(`.${style['price-button-line']}`, { class: ctrl.open() ? style['open'] : '' },  [
          priceActionButton(),
          m(`.${style['tooltip']}`, { class: ctrl.tooltipVisible() ? style['visible'] : '' }, ['Price', m(`.${style['nod']}`)])
          // parentCtrl.tooltips[0].visible() ? m(`.${style['tooltip']}`, 'Filter') : ''
        ])
  ]
}

const renderFilterMenu = (ctrl) => {
  return m(`.${style['filter-menu']}`, [
      m('.menu-bro')
    ])
}


const renderView = function(args) {
  const ctrl = this
  const parentCtrl = args


  return m(`.${style['filter-section']}`, [
      m(`.${style['buttons']}`, [
        m(`.${style['main-button-line']}`, [
          filterActionButton(ctrl.open, ctrl.tooltipVisible),
          ctrl.filterToolTipActive() ? m(`.${style['tooltip']}`, ['Filter', m(`.${style['nod']}`)]) : ''
          // parentCtrl.tooltips[0].visible() ? m(`.${style['tooltip']}`, 'Filter') : ''
        ]),
        m(`.${style['star-button-line']}`, { class: ctrl.open() ? style['open'] : '' }, [
          starActionButton(),
          m(`.${style['tooltip']}`, { class: ctrl.tooltipVisible() ? style['visible'] : '' }, ['Stars', m(`.${style['nod']}`)])
          // parentCtrl.tooltips[0].visible() ? m(`.${style['tooltip']}`, 'Filter') : ''
        ]),
        renderMiniActionButtons(ctrl),
        ctrl.open() ? m.component( FilterMenu, {
          // WE NEED TO GENERATE RESET FILTER FUNCTION THAT WILL STORE THE ORIGINAL VALUES
          // All we need to be passed to is all the restaurants
          // there we can be doing the filtering thereon and gain
          // prices options and types as to render options
          //
          restaurants: parentCtrl.restaurants
        } ) : ''

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

    return {
      open: m.prop(false),
      tooltipVisible: m.prop(false),
      filterToolTipActive: filterToolTipActive
    }
  },
  view(ctrl, args) {
    return renderView.call(ctrl, args)
  }
}

export default Filter