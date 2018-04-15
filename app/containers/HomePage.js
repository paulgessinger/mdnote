// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Home from '../components/Home';
import { bindActionCreators } from 'redux';
import * as EntriesActions from '../actions/entries';

type Props = {};

function mapStateToProps(state) {
  return {
    entries: state.entries
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(EntriesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
//export default class HomePage extends Component<Props> {
  //props: Props;

  //render() {
    //return (
      //<Home/>
    //);
  //}
//}
