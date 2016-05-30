'use strict'

import m from 'mithril'

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
            tabIndex: Aria.tabIndexDir[ariaParent] ? Aria.tabIndexDir[ariaParent][ariaChild] : -1,
            onkeyup: Aria.handleAriaKeyPress.bind(ctrl, ariaParent, ariaChild)
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
              [
                m(`.${style['label']}`, 'Address'),
                m(`.${style['info']}`,
                  m(`ul`, _.map(address.split(','), (line) => m(`li`, line)))
                )
              ]
            ),
            m(`.${style['opening-hours']}`,
              m(`.${style['label']}`, 'Opening Hours'),
              m(`.${style['info']}`,
                m(`ul`, _.map(openingHours, (line) => m(`li.${style['time']}`, line)))
              )
            ),
            m(`.${style['categories']}`,
              m(`.${style['label']}`, 'Categories'),
              m(`.${style['info']}`,
                m(`ul`, _.map(categories, (line) => m(`li`, line)))
              )
            )
          ]
        ),
        m(`.${style['clear']}`)
      ]
    )
  }
}


export default InfoComponent