'use strict'

import m from 'mithril'
import _ from 'lodash'

//services
import Aria from '../services/aria.js'

import style from '../../css/desktop-info.scss'

//POLYTHENE COMPONENTS
import downArrowIcon from '../../icons/rr_down_arrow.js'

const infoHeaderConfig = function(ariaObject, el, init) {
  if(!init) {
    Aria.register(ariaObject)
  }
}

const ariaConfig = function(ariaObject, el, init) {
  if(!init) {
    console.log(ariaObject)
    Aria.register(ariaObject)
  }
}

const constructAttributes = function(ariaParent, ariaChild) {
  const ctrl = this
  return {
    config: ariaConfig.bind(null, { ariaParent, ariaChild }),
    tabIndex: Aria.tabIndexDir[ariaParent] ? Aria.tabIndexDir[ariaParent][ariaChild] : -1,
    'data-aria-id': `${ariaParent} ${ariaChild}`,
    onkeyup(e) {
      if (e.keyCode === 27) {
        ctrl.info.state.expanded(false)
        Aria.handleAriaKeyPress(ariaParent, ariaChild, e)
      }
    }
  }
}

const InfoComponent = {
  controller() {
    return {
      info: {
        state: {
          expanded: m.prop(false)
        }
      }
    }
  },
  view(ctrl, { address, openingHours, priceTier, categories, ariaParent, ariaChild }) {
    return m(`.${style['desktop-info-container']}`,
      {
        
      },
      [
        m(`.${style['header']}`,
          {
            config: infoHeaderConfig.bind(null,
              {
                ariaParent,
                ariaChild
              }
            ),
            'data-aria-id': `${ariaParent} ${ariaChild}`,
            tabIndex: Aria.tabIndexDir[ariaParent] ? Aria.tabIndexDir[ariaParent][ariaChild] : -1,
            onkeyup: (e) => {
              if (e.keyCode === 13) {
                ctrl.info.state.expanded(true)
                // Aria.handleAriaKeyPress.call(ctrl, ariaParent, ariaChild, e)
              }
            }
          },
          m(`.${style['header-section']}`,
            m(`.${style['flex']}`),
            m(`.${style['info']}`,
              [
                m(`h3`, 'Info'),
                m(`.${style['clear']}`)
              ]
            ),
            m(`.${style['flex']}`)
          ),
          m(`.${style['icon-section']}`,
            {
              onclick: () => (ctrl.info.state.expanded(!ctrl.info.state.expanded()))
            },
            [
              m(`.${style['flex']}`),
              m(`.${style['info-icon']}`, downArrowIcon),
              m(`.${style['flex']}`)
            ]
          )
        ),
        m(`.${style['content']}`,
          {
            class: ctrl.info.state.expanded() ? `${style['open']} ${style['visible']}` : ''
          },
          [
            m(`.${style['address']}`,
              constructAttributes.call(ctrl, ariaChild, 'address'),
              [
                m(`.${style['label']}`, 'Address'),
                m(`.${style['info']}`,
                  m(`ul`, _.map(address.split(','), (line) => m(`li`, line)))
                )
              ]
            ),
            m(`.${style['opening-hours']}`,
              constructAttributes.call(ctrl ,ariaChild, 'opening-hours'),
              [
                m(`.${style['label']}`, 'Opening Hours'),
                m(`.${style['info']}`,
                  m(`ul`, _.map(openingHours, (line) => m(`li.${style['time']}`, line)))
                )
              ]
              
            ),
            m(`.${style['categories']}`,
              constructAttributes.call(ctrl, ariaChild, 'categories'),
              [
                m(`.${style['label']}`, 'Categories'),
                m(`.${style['info']}`,
                  m(`ul`, _.map(categories, (line) => m(`li`, line)))
                )
              ]
              
            )
          ]
        ),
        m(`.${style['clear']}`)
      ]
    )
  }
}


export default InfoComponent