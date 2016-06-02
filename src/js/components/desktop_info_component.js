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
    Aria.register(ariaObject)
  }
}

const constructAttributes = function(ariaParent, ariaChild, content) {
  const ctrl = this

  let title

  switch(ariaChild) {
    case 'address':
      title = content
      break
    case 'opening-hours':
      if(typeof content === 'string') {
        title = content
        break
      }
      title = content.join(', ')
      break
    default:
      title = content.join(', ')
      break
  }
  return {
    config: ariaConfig.bind(null, { ariaParent, ariaChild }),
    tabIndex: Aria.tabIndexDir[ariaParent] ? Aria.tabIndexDir[ariaParent][ariaChild] : -1,
    'data-aria-id': `${ariaParent} ${ariaChild}`,
    onkeyup(e) {
      if (e.keyCode === 27) {
        ctrl.info.state.expanded(false)
        Aria.back(ariaParent, ariaChild)
      }
    },
    'role': 'listitem',
    'aria-labelledby': `${ariaChild}-description-label ${ariaChild}-description`,
    'title': `${ariaChild}: ${title}`
  }
}

const InfoComponent = {
  controller(args) {
    return {
      info: {
        state: {
          expanded: m.prop(false)
        }
      }
    }
  },
  view(ctrl, { address, openingHours, priceTier, categories, ariaParent, ariaChild }) {

    const addressTitle = 'address'
    const openingHoursTitle = 'opening-hours'
    const categoriesTitle = 'categories'

    return m(`.${style['desktop-info-container']}`,
      {
        'role': 'group',
        'aria-expanded': ctrl.info.state.expanded() ? true : false
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
            m(`.${style[addressTitle]}`,
              constructAttributes.call(ctrl, ariaChild, addressTitle, address),
              [
                m(`.${style['label']}`, { id: `${addressTitle}-description-label` },'Address'),
                m(`.${style['info']}`,
                  m(`ul`,
                    {
                      id: `${addressTitle}-description`
                    },
                    [
                      _.map(address.split(','),
                        (line) => {
                          return m(`li`,
                            line
                          )
                        }
                      )
                    ]
                  )
                )
              ]
            ),
            m(`.${style[openingHoursTitle]}`,
              constructAttributes.call(ctrl, ariaChild, openingHoursTitle, openingHours),
              [
                m(`.${style['label']}`, { id: `${openingHoursTitle}-description-label` }, 'Opening Hours'),
                m(`.${style['info']}`,
                  m(`ul`,
                    {
                      id: `${openingHoursTitle}-description`
                    },
                    [
                      _.map(openingHours, (line) => m(`li.${style['time']}`, line))
                    ]
                  )
                )
              ]
              
            ),
            m(`.${style[categoriesTitle]}`,
              constructAttributes.call(ctrl, ariaChild, categoriesTitle, categories),
              [
                m(`.${style['label']}`, { id: `${categoriesTitle}-description-label` },'Categories'),
                m(`.${style['info']}`,
                  {
                    id: `${categoriesTitle}-description`
                  },
                  [
                    m(`ul`,
                      [
                        _.map(categories, (line) => m(`li`, line))
                      ]
                    )
                  ]
                  
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