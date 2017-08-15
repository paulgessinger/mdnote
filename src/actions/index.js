import path from "path";
import _ from 'lodash';


const electron = window.require('electron');
//const storage = require('node-persist');
//const storage = electron.remote.require('node-persist');
const fs = electron.remote.require('fs');
//const {app} = electron;
const app = electron.remote.app;
const app_path = app.getPath("userData");



//export const LOADED_AVAILABLE_DAYS = "LOADED_AVAILABLE_DAYS";
export const SET_DATADIR = "SET_DATADIR";
export const GET_DATADIR = "GET_DATADIR";
export const PERSIST_DATADIR = "PERSIST_DATADIR";

//export const loadAvailableDays = () => dispatch => {
  //var action = {type: LOADED_AVAILABLE_DAYS};
//};


export const setDataDir = datadir => ({
  type: SET_DATADIR,
  datadir: datadir,
});


export const getDataDir = () => (dispatch, getState) => {
  //var action = {type: GET_DATADIR}

  //const state = getState();

  var dataDir = localStorage.getItem("dataDir");
  //console.log(dataDir);
  if(dataDir === null) {
    // dataDir has not been set, use default
    dataDir = path.join(app_path, "data");
    if(!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    return dispatch(persistDataDir(dataDir));
  }
  else {
    return dispatch(setDataDir(dataDir));
  }


};

export const persistDataDir = (dataDir) => (dispatch, getState) => {
  localStorage.setItem("dataDir", dataDir);
  dispatch(setDataDir(dataDir));
}





export const SET_TITLE = "SET_TITLE";

export const setTitle = (title) => ({
  type: SET_TITLE,
  title,
});


export const FETCH_NOTES = "FETCH_NOTES";
export const RECEIVED_NOTES = "RECEIVED_NOTES";
export const SET_ACTIVE_DAY = "SET_ACTIVE_DAY";

export const receivedNotes = (notes) => ({
  type: RECEIVED_NOTES,
  notes,
});

export const fetchNotes = () => async (dispatch, getState) => {
  console.log('fetching notes');
  var notes = {};

  //const state = getState();
  //console.log(state);
  var datadir = getState().app.datadir;

  if(datadir === null) {
    // need to get datadir first
    await dispatch(getDataDir());
    //console.log("got datadir now", getState());
    datadir = getState().app.datadir;
  }

  console.log("datadir", datadir);
  const files = _.filter(fs.readdirSync(datadir), f => f.endsWith(".md"));
  


  for(let f of files) {
    //console.log(f);
    const fullf = path.join(datadir, f);
    const day = f.substring(0, f.length - 3);
    const data = fs.readFileSync(fullf, {encoding: "utf-8"});
    //console.log(day, data);
    notes[day] = data;
  }

  dispatch(receivedNotes(notes));
}

export const setActiveDay = (day) => ({
  type: SET_ACTIVE_DAY,
  day,
})
