import React, { Component } from 'react';
import './App.css';
//import PDF from '../components/PDF';
import TitleBar from '../components/TitleBar';
import { connect } from 'react-redux'
//import {getDataDir} from '../actions';
import {Link, Route} from 'react-router-dom';

import LogView from './LogView';
import SettingsView from './SettingsView';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


const srcs = [
  "/Users/Paul/CloudStation/Documents/Physics/Master/Log/md/assets/2017-02-27/limits_obs13477_13478_exp13482.pdf",
  '/Users/Paul/CloudStation/Documents/Physics/Master/Log/md/assets/2017-05-27/elec_hist_mt_logX.pdf'

];

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      src: srcs[0]
    };
  }

  componentDidMount() {
    //if(this.props.datadir === null) {
      //this.props.dispatch(getDataDir());
    //}

    //this.props.history.location.push("/log");
  }

  render() {
    //var pdfs = [];
    //for(let i = 0;i<5;i++) {
      //pdfs.push(<PDF key={i} src={this.state.src}/>);
    //}
    //console.log(this.props.children);
    console.log(this.props);
    return (
      <MuiThemeProvider>
        <div className="wrap">
          <TitleBar title={this.props.apptitle}/>
          <Link to="/">To Log</Link>
          <Link to="/settings">To settings</Link>
          <div className="scroll_wrap">
            <Route path="/" exact title="Log" component={LogView}/>
            <Route path="/settings" title="Settings" component={SettingsView}/>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  datadir: state.app.datadir,
  apptitle: state.app.title,
});

export default connect(mapStateToProps)(App);
