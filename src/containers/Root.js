import React from 'react';
import App from './App.js';
//import LogView from './LogView';
//import SettingsView from './SettingsView';
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route} from 'react-router-dom'
//import {Route} from 'react-router';
//import routes from '../routes';

const Root = ({store, history}) => 
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}/>
    </Router>
  </Provider>

export default Root;
