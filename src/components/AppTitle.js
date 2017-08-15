import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {setTitle} from '../actions';

class AppTitle extends React.Component {
  
  componentDidMount() {
    this.props.dispatch(setTitle(this.props.title));
  }
  
  static propTypes = {
    title: PropTypes.string.isRequired,
  }

  render() { return null; }

}

export default connect()(AppTitle);

