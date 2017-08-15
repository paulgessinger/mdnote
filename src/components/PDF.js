import React from 'react';

import pdfjs from 'pdfjs-dist';
const electron = window.require('electron');
const fs = electron.remote.require('fs');

export default class PDF extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pdfdata: null
    };
  }

  _loadPDFData(path) {
    const pdfdata = fs.readFileSync(path);
    this.setState({pdfdata: pdfdata}, () => this._renderPDF());
  }
  
  componentWillMount() {
    this._loadPDFData(this.props.src);
  }

  _renderPDF() {
    //console.log("render pdf");
    const canvas = this.refs.canvas;
    var context = canvas.getContext('2d');
    //console.log(canvas);
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
      </div>
    );
  }

}


