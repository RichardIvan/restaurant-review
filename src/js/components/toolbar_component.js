'use strict'

import m from 'mithril'

//styles
import style from '../../css/toolbar.scss'

const Toolbar = {
  view() {
    return m(`.${style['toolbar-container']}`,
      [
        m(`.${style['flex']}`),
        m(`.${style['content-container']}`,
          [

            m(`h3`, 'Restaurant Listing'),
            m(`h3`, 'Filter')

          ]
        ),
        m(`.${style['flex']}`),
      ]
    )
  }
}

export default Toolbar