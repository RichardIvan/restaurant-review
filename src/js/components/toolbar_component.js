'use strict'

import m from 'mithril'

//styles
import style from '../../css/toolbar.scss'

//components
import DesktopFilter from './desktop_filter_component.js'

const Toolbar = {
  view(ctrl, { restaurants, categories, unfilteredRestaurants }) {
    console.log(categories)
    console.log(categories())
    return m(`.${style['toolbar-container']}`,
      [
        m(`.${style['flex']}`),
        m(`.${style['content-container']}`,
          [

            m(`.${style['h3-container']}`,
              [
                m(`.${style['flex']}`),
                m(`h3`, 'Restaurant Listing'),
                m(`.${style['flex']}`)
              ]
            ),
            m.component(DesktopFilter,
              {
                restaurants,
                categories,
                unfilteredRestaurants
              }
            )
            // m(`h3`, 'Filter')

          ]
        ),
        m(`.${style['flex']}`),
      ]
    )
  }
}

export default Toolbar