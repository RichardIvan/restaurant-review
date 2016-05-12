'use strict'

import m from 'mithril'
import _ from 'lodash'

import Bullet from 'bullet-pubsub'
import Constants from '../constants.js'

const LOCAL_EVENT_NAME = Constants.DataStores.DATA_STORE

const _data = {
  compact: m.prop(true)
}

const CardsStore = {

  getAll() {
    return new Promise((resolve, reject) => {
      resolve({ data: _data })
    })
  },
  // Allow Controller-View to register itself with store
  addChangeListener(callback) {
    Bullet.on(LOCAL_EVENT_NAME, callback)
  },
  removeChangeListener(callback) {
    Bullet.off(LOCAL_EVENT_NAME, callback)
  },
  emitChange() {
    Bullet.trigger(LOCAL_EVENT_NAME)
  },

  dispatchIndex(payload) {
    // console.log('PAYLOAD', payload)
    switch (payload.action) {
      case Constants.ActionType.COMPACT_CHANGE:
        if (typeof payload.data.index === 'number') {
          const curr = _data.compact()
          curr[payload.data.index] = payload.data.status
          _data.compact(curr)
        } else if (payload.data) {
          _data.compact(payload.data)
        } else {
          _data.compact([])
        }
        CardsStore.emitChange()
        break
      default:
        break
    }
  }
}

// Bullet.on('INITIALIZE_APP', Data.dispatchIndex)

export default CardsStore
