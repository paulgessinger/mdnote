import React from 'react';

//import pdfjs from 'pdfjs-dist';
//import pdfjs from 'pdfjs';
const electron = window.require('electron');
const fs = electron.remote.require('fs');

require('pdfjs-dist/build/pdf.combined');
var pdfjs = window.PDFJS;
//pdfjs.workerSrc = "node_modules/pdfjs-dist/build/pdf.worker.js";

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

export default class PDF extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pdfdata: null
    };
  }

  _loadPDFData(path) {
    //console.log(path);
    const pdfdata = fs.readFileSync(path);
    this.setState({pdfdata: pdfdata}, () => this._renderPDF());
  }

  componentWillMount() {
    this._loadPDFData(this.props.src);
  }

  _renderPDF() {
    ////console.log("render pdf");
    const canvas = this.refs.canvas;
    var context = canvas.getContext('2d');
    ////console.log(canvas);
    pdfjs.getDocument({data: this.state.pdfdata}).then((pdf) => {
      // Fetch the page.
      this.pdfjs_instance = pdf;
      pdf.getPage(1).then(function (page) {
        const dpr = window.devicePixelRatio;
        var scale = dpr;
        var viewport = page.getViewport(scale);

        // Prepare canvas using PDF page dimensions.
        canvas.height = viewport.height;// * dpr;
        canvas.width = viewport.width;// * dpr;
        canvas.dataset.width = viewport.width;
        canvas.dataset.height = viewport.height;


        // Render PDF page into canvas context.
        var renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        //console.log("render");
        page.render(renderContext);
        window.resizeCanvasElement(canvas);
      });
    });

  }

  componentWillReceiveProps(newProps) {
    //console.log("new props", newProps);
    if(newProps.src !== this.props.src) {
      //console.log("rerender pdf");
      this._destroy();
      this._loadPDFData(newProps.src);
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.src !== this.props.src;
  }

  _destroy() {
    if(this.pdfjs_instance) {
      this.pdfjs_instance.destroy();
      this.pdfjs_instance = undefined;
    }
  }

  componentWillUnmount() {
    this._destroy();
  }

  render() {
    if(this.state.pdfdata === null) {
      return null;
    }

    return (
      <div className="pdf">
        <canvas ref="canvas"/>
        hallo
      </div>
    );
  }

}


