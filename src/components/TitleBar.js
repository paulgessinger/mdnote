import React from 'react';
import PropTypes from 'prop-types';
import "./TitleBar.css";


export default class TitleBar extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  }

  render() {
    return <div className="titlebar">
      <div className="app-title">{this.props.title}</div>
    </div>;
  }

}
