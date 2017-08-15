import { combineReducers } from 'redux';
//import {routerReducer} from 'react-router-redux';
import moment from 'moment';

import {
  SET_DATADIR,
  SET_TITLE,
  RECEIVED_NOTES,
  SET_ACTIVE_DAY,
} from '../actions';

const appReducer = (state = {datadir: null, title: ''}, action) => {

  switch (action.type) {
    case SET_DATADIR:
      return {
        ...state,
        datadir: action.datadir,
      }
    case SET_TITLE:
      return {
        ...state,
        title: action.title,
      }
    default:
      return state;
  }

}

const noteReducer = (state = {notes: null, active_day: moment()}, action) => {
  switch (action.type) {
    case RECEIVED_NOTES:
      const notes = action.notes;
      return {
        ...state,
        notes,
      };
    case SET_ACTIVE_DAY:
      return {
        ...state,
        active_day: action.day,
      }
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  app: appReducer,
  note: noteReducer,
  //routing: routerReducer,
});

export default rootReducer;
