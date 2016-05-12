'use strict'

import Constants from './constants.js'
import Dispatcher from './dispatcher.js'

// 15:00
// action creation could be also the initialization

// action can trigger an api call therefore bypass dispatcher

// data coming in here is a objet literal containing new fields of data and specific action type

// this is action Creator
// it exports actions

export default {

  initialize() {
    Dispatcher({
      action: Constants.ActionType.INITIALIZE_APP
    })
  }
  
}

