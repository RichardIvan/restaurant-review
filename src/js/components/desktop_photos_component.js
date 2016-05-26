'use strict'

import m from 'mithril'

//helpers
import dimensionsHelper from '../helpers/screen-dimensions.js'

//styles
import style from '../../css/desktop-photo.scss'

let d

const PhotosComponent = {

  view(ctrl, { photo }) {
    d = dimensionsHelper.getDimensions('desktop-details-container')
    return m(`.${style['desktop-photo-container']}`,
      {
        // style: {
        //   height: d ? d.height() : ''
        // }
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