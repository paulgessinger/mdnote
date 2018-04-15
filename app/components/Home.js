// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import DayPicker from 'react-day-picker';
import moment from 'moment';

import "./calendar.global.css";

type Props = {
  loadEntries: () => void,
};

export default class Home extends Component<Props> {
  props: Props;

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log(nextProps);
  }

  handleDayClick(day) {
    //console.log(day);
    //console.log(this.props);
    var {history} = this.props;
    this.props.openEntry(moment(day), history);
  }

  componentDidMount() {
    console.log("call loadEntries");
    this.props.loadEntries();
  }

  _isDayDisabled(day) {
    //console.log(day);
    var m = moment(day);
    var mf = m.format("YYYY-MM-DD");
    //console.log(mf);
    //return this.props.entries.entries.indexOf(mf) == -1;
    return this.props.entries.entries[mf] === undefined;
  }

  render() {

    const {loading, entries, activeEntry} = this.props.entries;

    //if(!loading) {

    //}

    var activeDay = activeEntry !== null ? activeEntry.date.toDate() : null;

    return (
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <DayPicker
            selectedDays={activeDay}
            onDayClick={(d) => this.handleDayClick(d)}
            initialMonth={new Date()}
            disabledDays={day => this._isDayDisabled(day)}
          />
        </div>
        <div className={styles.rightColumn}>
          { activeEntry ? activeEntry.date.format("YYYY-MM-DD") : "nothing" }
        </div>
      </div>
    );
  }
}
