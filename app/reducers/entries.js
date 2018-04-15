// @flow
import {
  ENTRIES_LOADING,
  ENTRIES_LOADED,
  OPEN_ENTRY,
} from '../actions/entries';

//export type counterStateType = {
  //+counter: number
//};

//type actionType = {
  //+type: string
//};

const initialState = {
  entries: [],
  loading: false,
  activeEntry: null,
};

export default function entries(state = initialState, action) {
  var newState;
  switch (action.type) {
    case ENTRIES_LOADED:
      return Object.assign({}, state, {entries: action.entries, loading: false});
    case ENTRIES_LOADING:
      return Object.assign({}, state, {loading: true});
    case OPEN_ENTRY:
      const activeEntry = state.entries[action.day.format("YYYY-MM-DD")]
      return Object.assign({}, state, {activeEntry: activeEntry});
    default:
      return state;
  }
}
