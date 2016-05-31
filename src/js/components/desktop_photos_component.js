'use strict'

import m from 'mithril'

//helpers
import dimensionsHelper from '../helpers/screen-dimensions.js'

//services
import Aria from '../services/aria.js'

//styles
import style from '../../css/desktop-photo.scss'

const photoComponentConfig = function(ariaObject, el, init) {
  if(!init) {
    Aria.register(ariaObject)
  }
}

let d

const PhotosComponent = {

  view(ctrl, { photo, ariaParent, ariaChild }) {
    d = dimensionsHelper.getDimensions('desktop-details-container')
    return m(`.${style['desktop-photo-container']}`,
      {
        // style: {
        //   height: d ? d.height() : ''
        // }
        config: photoComponentConfig.bind(null, {
          ariaParent,
          ariaChild
        }),
        'data-aria-id': `${ariaParent} ${ariaChild}`,
        tabIndex: Aria.tabIndexDir[ariaParent] ? Aria.tabIndexDir[ariaParent][ariaChild] : -1,
        onkeyup: Aria.handleAriaKeyPress.bind(ctrl, ariaParent, ariaChild)
      },
      [
        d ? 
          m(`.${style['photo']}`,
            {
              style: {
                backgroundImage: `url('${photo.prefix}${d.width()}x${d.height()}${photo.suffix}')`,
                height: `${d.height() - 32}px`,
                width: `${d.width() - 32}px`
              }
            }
          ) : ''
      ])
  }

}

export default PhotosComponent