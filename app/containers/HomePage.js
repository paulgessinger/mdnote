// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Home from '../components/Home';
import { bindActionCreators } from 'redux';
import * as EntriesActions from '../actions/entries';
import * as EditActions from '../actions/edit';

type Props = {};

function mapStateToProps(state) {
  return {
    entries: state.entries,
    editor_open: state.edit.editor_open,
    entrySavePending: state.entries.entrySavePending,
  };
}

function mapDispatchToProps(dispatch) {
  return Object.assign({},
    bindActionCreators(EntriesActions, dispatch),
    bindActionCreators(EditActions, dispatch));
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
