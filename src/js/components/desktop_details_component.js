'use strict'

import m from 'mithril'

//helpers
import dimensionsHelper from '../helpers/screen-dimensions.js'

//styles
import style from '../../css/desktop-details.scss'

const DD = {
  view(ctrl, args) {
    console.log('DESKTOP VIEW LOADED')
    return m(`.${style['desktop-details-container']}`)
  }
}

export default DD
