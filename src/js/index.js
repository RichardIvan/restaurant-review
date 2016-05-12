'use strict'

import m from 'mithril'
import App from './components/app_component'

import '../fonts/Roboto-Regular.ttf'
import '../css/global-styles.scss'

window.onresize = function(e) {
  console.log(e)
  // capturing the size of window and serving appropriate image Sizes
  // withing element size store
}

const el = document.getElementsByTagName('body')[0]
m.mount(el, App)
