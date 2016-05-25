'use strict'

import m from 'mithril'

//helpers
import dimensionsHelper from '../helpers/screen-dimensions.js'

//styles
import style from '../../css/desktop-details.scss'

const DD = {
  view(ctrl, args) {
    return m(`.${style['desktop-details-container']}`)
  }
}

export default DD
