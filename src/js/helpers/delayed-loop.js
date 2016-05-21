'use strict'

import m from 'mithril'
import _ from 'lodash'

export default function(data, index, status) {
  const array = data
  const lastIndex = array.length - 1

  const before = _.slice(array, 0, index)
  const beforeLenght = before.length
  const after = _.slice(array, index + 1)
  const afterLenght = after.length

  let bi = beforeLenght - 1

  function beforeLoop () {
    setTimeout(() => {
      before[bi].elementInfo.visible(status)  
      m.redraw()
      bi--
      if (bi >= beforeLenght - 4 && bi >= 0) {
        beforeLoop()
      } else {
        // if the bi is higher than length - 3
        // show the rest of the items all at once
        for(bi; bi >= 0; bi--) {
          if (bi >= 0)
            break
          before[bi].elementInfo.visible(status)
        }
        m.redraw()
      }
    }, 25)
  }
  if(index !== 0)
    beforeLoop()  

  let ai = 0

  function afterLoop () {
    setTimeout(() => {
      after[ai].elementInfo.visible(status)
      m.redraw()
      ai++
      if (ai < 3 && ai < afterLenght) {
        afterLoop()
         // if the ai is greater than 3
         // show the rest of the items all at once
      } else {
        for(ai; ai < afterLenght; ai++) {
          if(ai < afterLenght)
            break
          after[ai].elementInfo.visible(status)
        }
        m.redraw()
      }
    }, 25)
  }
  if(index !== lastIndex)
    afterLoop()
}