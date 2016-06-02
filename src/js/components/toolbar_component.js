'use strict'

import m from 'mithril'

//styles
import style from '../../css/toolbar.scss'

//components
import DesktopFilter from './desktop_filter_component.js'

const Toolbar = {
  view(ctrl, { restaurants, categories, unfilteredRestaurants, ariaParent }) {
    return m(`.${style['toolbar-container']}`,
      {
        role: 'toolbar'
      },
      [
        m(`.${style['flex']}`),
        m(`.${style['content-container']}`,
          [

            m(`.${style['h3-container']}`,
              [
                m(`.${style['flex']}`),
                m(`h3`,
                  {
                    id: 'h3-region-label'
                  },
                  'Restaurant Listing'),
                m(`.${style['flex']}`)
              ]
            ),
            m.component(DesktopFilter,
              {
                restaurants,
                categories,
                unfilteredRestaurants,

                ariaParent,
                ariaChild: 'filter-button'
              }
            )
            // m(`h3`, 'Filter')

          ]
        ),
        m(`.${style['flex']}`)
      ]
    )
  }
}

export default Toolbar