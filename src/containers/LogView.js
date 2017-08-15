import React from 'react';
import { connect } from 'react-redux'
import moment from 'moment';

import {
  setActiveDay,
  fetchNotes,
  //getDataDir,
} from '../actions';

import AppTitle from '../components/AppTitle';
import DayPicker from 'react-day-picker';
import "react-day-picker/lib/style.css"


class LogView extends React.Component {
  //componentDidMount() {
    //this.props.dispatch(setTitle("Log"));
  //}
  
  componentWillReceiveProps() {
    //const {datadir} = this.props;
    //if(datadir === null) {
      //this.props.dispatch(getDataDir());
    //}
    //else {
      //if(this.props.notes === null) {
        //this.props.dispatch(fetchNotes());
      //}
    //}
  }

  componentDidMount() {
    this.props.dispatch(fetchNotes());
  }

  isDayDisabled(d) {
    //return false;
    if(this.props.notes === null) {
      return true;
    }

    const day = d.format("YYYY-MM-DD");
    //console.log(day);
    return !(day in this.props.notes);

  }

  onSelect(day) {
    if(this.isDayDisabled(day)) return;
    const dt = moment(day);
    this.props.dispatch(setActiveDay(dt));
  }

  render() {

    const day = this.props.active_day;

    return (
      <div>
        <AppTitle title="Log"/>
        <DayPicker
          enableOutsideDays
          selectedDays={day.toDate()}
          disabledDays={d => this.isDayDisabled(moment(d))}
          onDayClick={d => this.onSelect(moment(d))}
        />

        {day.format("YYYY-MM-DD")}

      </div>
    );
  }

}

const mapStateToProps = (state) => ({
  active_day: state.note.active_day,
  notes: state.note.notes,
  datadir: state.app.datadir,
})

export default connect(mapStateToProps)(LogView);
