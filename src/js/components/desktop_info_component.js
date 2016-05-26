'use strict'

import m from 'mithril'

import style from '../../css/desktop-info.scss'

//POLYTHENE COMPONENTS
import downArrowIcon from '../../icons/rr_down_arrow.js'

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
  view(ctrl, { address, openingHours, priceTier, categories }) {
    return m(`.${style['desktop-info-container']}`,
      [
        m(`.${style['header']}`,
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