import "./SettingsView.css";
import React from 'react';
import { connect } from 'react-redux'
import {persistDataDir} from '../actions';
import AppTitle from '../components/AppTitle';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import {
  fetchNotes,
} from '../actions';


const electron = window.require('electron');
const dialog = electron.remote.dialog;
//console.log(dialog);


class SettingsView extends React.Component {

  constructor(props) {
    super(props);
    //console.log(props);
    this.state = {datadir: props.datadir || '', errors: {datadir: []}};
  }

  componentWillMount() {
    this.props.dispatch(fetchNotes());
  }

  componentWillReceiveProps(nextProps) {
    this.setState({datadir: nextProps.datadir});
  }

  datadirChange(e) {
    const val = e.target.value;

    //const errors = Object.assign({}, this.state.errors);
    var errors = [];

    if(val.length === 0) {
      errors.push("Data dir must not be empty");
    }

    this.setState({
      datadir: e.target.value,
      errors: {datadir: errors},
    });
  }

  chooseDataDir() {
    const result = dialog.showOpenDialog({properties: ['openDirectory']})
    if(result && result.length > 0) {
      const dir = result[0];
      this.setState({datadir: dir, errors: {datadir: []}});
    }
  }
  
  render() {
    return (
      <div className="settings-wrap">
        <AppTitle title="Settings"/>
        <Card>
          <CardHeader title="Data storage directory" subtitle="Specify where your notes are stored"/>
          <CardText>
            <TextField
            name="datadir"
            value={this.state.datadir} 
            onChange={this.datadirChange.bind(this)}
            errorText={this.state.errors.datadir.length === 0 ? null : this.state.errors.datadir.join("\n")}
            fullWidth={true}/>
          </CardText>
          <CardActions>
            <FlatButton label="Choose..." onClick={this.chooseDataDir.bind(this)}/>
          </CardActions>
        </Card>

        <div className="settings-bottom-row">

          <RaisedButton 
            primary={true} 
            label="Save" 
            onClick={() => this.props.dispatch(persistDataDir(this.state.datadir))}
            disabled={this.state.errors.datadir.length !== 0 || this.state.datadir === this.props.datadir}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({datadir: state.app.datadir});
export default connect(mapStateToProps)(SettingsView);
