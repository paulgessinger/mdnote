import React from 'react';
import ReactDOM from 'react-dom';
import Root from './containers/Root';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import configureStore from './store/configureStore';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
//import { memoryHistory } from 'react-router';
//import {createMemoryHistory} from 'history';
//import { syncHistoryWithStore } from 'react-router-redux';
//import _ from 'lodash';


var lastRender = new Date();
const fps = 20.;
const delay = 1000 / fps;
function resizeCanvasElements() {

  if((new Date()) - lastRender < delay) {
    return;
  }
  
  lastRender = new Date();

  const canvases = document.getElementsByTagName("canvas");
  for(const c of canvases) {
    resizeCanvasElement(c);
  }

  //window.requestAnimationFrame(raf);
}

function resizeCanvasElement(c) {
  const w = c.dataset.width;
  const h = c.dataset.height;
  const dpr = window.devicePixelRatio;

  const retw = w / dpr;

  const parent = c.parentNode;
  const pw = parent.offsetWidth;
  //console.log(pw);

  if(retw > pw) {
    const r = w / h;
    const destw = Math.min(retw, pw);
    c.style.width = destw + "px";
    c.style.height = destw/r + "px";
  }
  else {

    const curw = c.offsetWidth;
    //console.log(retw, curw);

    if(!isNaN(retw) && retw !== curw) {
      c.style.width = retw + "px";
      c.style.height = h / dpr + "px";
    }

  }

}

window.resizeCanvasElements = resizeCanvasElements;
window.resizeCanvasElement = resizeCanvasElement;

//window.requestAnimationFrame(raf);
window.addEventListener("resize", resizeCanvasElements);


var store = configureStore();
//const memoryHistory = createMemoryHistory();
//const history = syncHistoryWithStore(memoryHistory, store);
//const history = memoryHistory;
ReactDOM.render(<Root store={store} />, document.getElementById('root'));
registerServiceWorker();
