'use strict'

import m from 'mithril'
import _ from 'lodash'

// this function is run in case the user clicks enter on a currently focused element
const hasChildren = function(endpoint) {
  return endpoint.children ? 1 : 0
}

//accepts status of if the children search is dynamic
const selectChild = function(status) {
  // here we have the dom id
  const ariaKey = Aria.lastAriaChild().keys()[0]

  // here we are simply checking if we are clicking on clickable element
  // or is the active element body..?
  if (ariaKey === document.activeElement.id) {
    const ariaObjectChildren = Aria.lastAriaChild().children

    //ariaObjectChildren is an array of objects
    if (ariaObjectChildren) {

      //change currents child tabindex to -1
      Aria.lastAriaChild().tabIndex(-1)

      // this is utility function that is shared
      // only accepts different tabIndexValue
      Aria.lastAriaChild().children = _.map(ariaObjectChildren, (object) => {
        const childObject = object
        childObject.tabIndex(0)
        return childObject
      })
      
      //set currents' child parent to be last known child
      const parentKey = Aria.lastAriaParent().keys()[0]
      parentsParentPath.push(parentKey)
      //change to new parent
      Aria.lastAriaParent(Aria.lastAriaChild())

      //set current child aria object of first child
      Aria.lastAriaChild(ariaObjectChildren[0])

      const childKey = Aria.lastAriaChild().keys()[0]
      

      //find child with the first id from the currenlty selected element
      const childDomElement = document.activeElement.getElementById(key)
      childDomElement.focus()

      m.redraw()

    }

  }

}

const getParentFromPath = function(p) {
  let path = _.dropRight(p)

  let currentObject = Aria.root

  while(path.length) {
    currentObject = currentObject.children[_.first(path)]
    path = _.drop(path)
  }

  return currentObject
}

//accepts status of if the children search is dynamic
const goBack = function(status) {

  //check if the focus element is any child of currentAriaChild

  const keys = _.keys(Aria.lastAriaChild())

  if(_.indexOf(keys, document.activeElement.id) !== -1) {
    //set tabIndexes to -1

    // this is utility function that is shared
    // only accepts different tabIndexValue
    Aria.lastAriaChild().children = _.map(Aria.lastAriaChild().children, (object) => {
      const childObject = object
      childObject.tabIndex(-1)
      return childObject
    })

    Aria.lastAriaChild(Aria.lastAriaParent())

    const lastFucusedElementID = _.last(Aria.lastAriaParent())

    Aria.lastAriaParent( getParentFromPath( Aria.parentsParentPath ))
    //make all the children able to be tabbed over
    Aria.lastAriaParent().children = _.map(Aria.lastAriaParent().children, (object) => {
      const childObject = object
      childObject.tabIndex(0)
      return childObject
    })
  }

  

}

//when we go one directory up we need to recalculate, or get the object by
//recursively traversing the object's path

//when we got one up, we we drop last elemetn form the path array and then
// look up the object as described above..

// we always add the parent root to the pathArray since we dont really know how deep we can go


const groups = {

}

const setLastInFocus = function() {
  return new Promise((resolve, reject) => {
    const activeElement = document.activeElement
    const id = activeElement.id
  })
}

const selectNext = () => {
  Aria.getActiveGroup()
    .then(Aria.setLastInFocus)
}

const selectPrevious = () => {

}

const hasClosed = (group) => {

}

const hasOpened = (group) => {

}


const Aria = {
  lastGroupInFocus: m.prop(),
  lastElementInFocus: m.prop(),
  lastParent: m.prop(),
  lastAriaParent: m.prop(),
  lastAriaChild: m.prop(),
  parentsParentPath: [],
  // parentsParentPath: ['detail-view', 'photo'],

  // root: {
  //   children: [
  //     'detail-view': {
  //       tabIndex: m.prop(0),
  //       children: [
  //         'photo': {
  //           tabIndex: m.prop(-1)
  //         },
  //         'restaurant-info': {
  //           tabIndex: m.prop(-1),
  //           children: [
  //             'address': {
  //               tabIndex: m.prop(-1)
  //             },
  //             'opening-hours': {
  //               tabIndex: m.prop(-1)
  //             },
  //             'category': {
  //               tabIndex: m.prop(-1)
  //             }
  //           ]
  //         },
  //         'reviews': {
  //           tabIndex: -1,
  //           children: [
  //             'review': {
  //               tabIndex: -1
  //             }
  //           ]
  //         },
  //         'write-review': {
  //           tabIndex: m.prop(-1),
  //           children: [

  //           ]
  //         }
  //       ]
  //     },
  //     'list-view': {
  //       children: 
  //     }

  //   ]
  // }

  // root: {
  //   'detail-view': {
  //     tabIndex: -1,
  //     'photo': {
  //       parent: 
  //       tabIndex: -1
  //     },
  //     'restaurant-info': {
  //       tabIndex: -1,
  //       'open': true,
  //       'address': {
  //         tabIndex: -1
  //       },
  //       'openingHours': {
  //         tabIndex: -1
  //       },
  //       'category': {
  //         tabIndex: -1
  //       }
  //     },
  //     'reviews': {
  //       tabIndex: -1,
  //       open: true,
  //       review: {
  //         tabIndex: -1
  //       }
  //     }
  //   }
  // }
  
  childrenDir: {

  },
  parentsDir: {

  },
  tabIndexDir: {
    'root': {
      'desktop-details-container': 0
    }
  },

  handleAriaKeyPress: function(e) {
    console.  log(e)

    const extractAttribute = (array, value) => {
      const attr = _.filter(array, (val) => {
        if( val.name === value)
          return 1
      })

      return attr[0]
    }

    const nodeAttributes = e.target.attributes
    const attribute = extractAttribute(nodeAttributes, 'data-aria-id')


    if(!attribute)
      return

    console.log(attribute)

    const attributeValues = attribute.value.split(' ')
    const [parent, child] = attributeValues

    console.log('PARENT')
    console.log(parent)

    console.log('CHILD')
    console.log(child)
    
    // e.stopPropagation()
    const ctrl = this
//     console.log('key pressed')
//     console.log(e)    
    switch(e.keyCode) {
      case 13:
        console.log('pressed enter')
        Aria.select(parent, child)
        break
      case 27:
        console.log('pressed esc')
        Aria.back(parent, child)
        break
      default:
        break
    }
  },
  select(parent, child) {
    console.log(parent)
    console.log(this.parentsDir[parent])
    _.forEach(this.parentsDir[parent], (childID) => {
      this.tabIndexDir[parent][childID] = -1
    })

    _.forEach(this.parentsDir[child], (childID) => {
      this.tabIndexDir[child][childID] = 0
    })

    m.redraw()

    const el = document.querySelector(`[data-aria-id^='${child}']`)
    console.log(el)
    el.focus()
    
  },
  back(parent, child) {

    _.forEach(this.parentsDir[parent], (childID) => {
      this.tabIndexDir[parent][childID] = -1
    })

    const newParent = this.childrenDir[parent]

    _.forEach(this.parentsDir[newParent], (childID) => {
      this.tabIndexDir[newParent][childID] = 0
    })

    m.redraw()

    const el = document.querySelector(`[data-aria-id$=${parent}]`)
    console.log(el)
    el.focus()
  },
  tabIndex: function(parent, child) {
    return this.tabIndexDir[parent][child]

  },
  registerToChildDir: function(parent, child) {
    this.childrenDir[child] = parent
    // console.log(this.childrenDir[child])
    // console.log(this.childrenDir)
  },
  registerToParentDir: function(parent, child) {
    
    if(!this.parentsDir[parent]) {
      this.parentsDir[parent] = [child]
    } else if (_.indexOf(this.parentsDir[parent], child) === -1) {
      this.parentsDir[parent].push(child)
    }
  },
  registerTabIndex: function(parent, child) {
    if (!this.tabIndexDir[parent]) {
      this.tabIndexDir[parent] = {}
    }
    this.tabIndexDir[parent][child] = -1
  },
  register: function(ariaObject) {
    const parent = ariaObject.ariaParent
    const child = ariaObject.ariaChild

    this.registerToChildDir(parent, child)
    this.registerToParentDir(parent, child)
    this.registerTabIndex(parent, child)

//     console.log(this.childrenDir)
//     console.log(this.parentsDir)
//     console.log(this.tabIndexDir)
    // console.log(this.registerAsChild)
    // console.log(this.registerAsParent)
  }
}




export default Aria