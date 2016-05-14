'use strict'

import m from 'mithril'
import _ from 'lodash'

//components
import Card from './card_component'
import style from '../../css/app.scss'

window.onresize = function(e) {
  console.log(e)
  // capturing the size of window and serving appropriate image Sizes
  // withing element size store
}



const config = function(el, init) {
  const ctrl = this
  if(!init) {
    const d = el.getBoundingClientRect()
    const windowWidth = m.prop(d.width)
    const ratio = m.prop(1.55)
    const height = m.prop(Math.round((windowWidth()) / ratio()))
    const width = m.prop(Math.round(height() * ratio()))

    ctrl.dimensions = {
      windowWidth,
      ratio,
      card: {
        width,
        height
      }
    }
  }
}

const scrollHandler = function(e) {
  console.log( 'scrollin' )
  console.log(e)
}

var latestKnownScrollY = 0;

function update() {
  // reset the tick so we can
  // capture the next onScroll
  ticking = false;

  var currentScrollY = latestKnownScrollY;


  console.log(currentScrollY)
  // read offset of DOM elements
  // and compare to the currentScrollY value
  // then apply some CSS classes
  // to the visible items
}

// kick off - no longer needed! Woo.
// update();

var latestKnownScrollY = 0,
  ticking = false;

// function onScroll() {
//   latestKnownScrollY = window.scrollY;
//   requestTick();
// }

function requestTick() {
  if(!ticking) {
    requestAnimationFrame(update);
  }
  ticking = true;
}

const ulConfig = function(el, inited) {
  if(!inited) {
    el.onscroll = function(e) {
      latestKnownScrollY = el.scrollTop
      requestTick()
    }
  }
}

const App = {
  controller() {
    const state = m.prop({
      data: m.prop([])
    })
    fetch('/data')
      .then(data => data.json())
      .then((json) => {

        _.forEach(json, (item, i) => {
          item.elementInfo = {
            visible: m.prop(true),
            index: i
          }
        })

        state().data(json)

      })
      .then(m.redraw)

    return {
      restaurants: state().data,
      hide(clickedElementIndex) {
        const array = state().data()
        const before = _.slice(array, 0, clickedElementIndex)
        const beforeLenght = before.length
        const after = _.slice(array, clickedElementIndex)
        const afterLenght = after.length

        var bi = beforeLenght - 1 ;                     //  set your counter to 1

        // (function myLoop (i) {          
        //    setTimeout(function () {   
        //       before[i].elementInfo.visible(false)          //  your code here                
        //       m.redraw()
        //       if (--i) myLoop(i);      //  decrement i and call myLoop again if i > 0
        //    }, 100)
        // })(beforeLenght); 

        function beforeLoop () {           //  create a loop function
           setTimeout(function () {    //  call a 3s setTimeout when the loop is called
              before[bi].elementInfo.visible(false)  
              m.redraw()
              bi--;                     //  increment the counter
              if (bi >= 0 ) {            //  if the counter < 10, call the loop function
                 beforeLoop();             //  ..  again which will trigger another 
              }                        //  ..  setTimeout()
           }, 75)
           
        }

        beforeLoop();  

        var ai = 1;                     //  set your counter to 1

        function afterLoop () {           //  create a loop function
           setTimeout(function () {    //  call a 3s setTimeout when the loop is called
              after[ai].elementInfo.visible(false)
              m.redraw()
              ai++;            //  your code here
                                  //  increment the counter
              if (ai < afterLenght) {            //  if the counter < 10, call the loop function
                 afterLoop();             //  ..  again which will trigger another 
              }                        //  ..  setTimeout()
           }, 75)
           // m.redraw()
        }

        afterLoop();   

        // console.log(before)
        // console.log(after)
      }
    }
  },
  view(ctrl) {
    return m('.main-container', { config: config.bind(ctrl) }, [
      m(`ul.${style['list-container']}`, { config: ulConfig }, [
        _.map(ctrl.restaurants(), (restaurant) => {
          const data = {
            address: restaurant.address,
            name: restaurant.name,
            photos: restaurant.photos,
            rating: restaurant.rating,
            id: restaurant.place_id,
            dimensions: ctrl.dimensions,
            hide: ctrl.hide,
            elementInfo: restaurant.elementInfo
          }
          return m.component(Card, { data })
        })
      ])
      
    ])
  }
}

export default App
