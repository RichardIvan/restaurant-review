'use strict'

//libraries
import Bullet from 'bullet-pubsub'

//stores
import DataStore from './stores/data-store.js'

export default function (payload) {
  DataStore.dispatchIndex(payload)
}
