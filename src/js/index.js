'use strict'

import m from 'mithril'
import App from './components/app_component'

import '../fonts/Roboto-Regular.ttf'
import '../css/global-styles.scss'

const el = document.getElementsByTagName('body')[0]
m.mount(el, App)
