// @flow
import {
  ENTRIES_LOADING,
  ENTRIES_LOADED,
  OPEN_ENTRY,
  ENTRY_READ_SUCCESS,
  ENTRY_READ_PENDING,
  ACTIVE_ENTRY_CHANGED,
  ENTRY_SAVE_PENDING,
  ENTRY_SAVE_SUCCESS,
} from '../actions/entries';

import type { entryType } from '../actions/entries';

//export type counterStateType = {
  //+counter: number
//};

//type actionType = {
  //+type: string
//};

export type entriesStateType = {
  +entries: { [string]: entryType },
  +loading: bool,
  +activeEntry: ?entryType,
  +activeEntryLoading: bool,
};

const initialState = {
  entries: {},
  loading: false,
  activeEntry: null,
  activeEntryLoading: false,
  activeEntryChanged: false,
  entrySavePending: false,
};

export default function entries(state = initialState, action) {
  var newState;
  switch (action.type) {
    case ENTRIES_LOADED:
      return Object.assign({}, state, {entries: action.entries, loading: false});
    case ENTRIES_LOADING:
      return Object.assign({}, state, {loading: true});
    case OPEN_ENTRY:
      var activeEntry = state.entries[action.day.format("YYYY-MM-DD")]
      if(activeEntry === undefined) {
        activeEntry = {
          date: action.day,
          date_str: action.day.format("YYYY-MM-DD"),
          exists: false,
          path: "",
          filename: "",
          content: "",
        };
      }
      return Object.assign({}, state, {activeEntry: activeEntry});

    case ENTRY_READ_PENDING:
      return Object.assign({}, state, {activeEntryLoading: true});
    case ENTRY_READ_SUCCESS:
      return Object.assign({}, state, {
        activeEntryLoading: false,
        activeEntryChanged: false,
        activeEntry: action.entry
      });
    case ACTIVE_ENTRY_CHANGED:
      var activeEntry = Object.assign({}, state.activeEntry, {content: action.content});
      return Object.assign({}, state, {
        activeEntryChanged: true,
        activeEntry: activeEntry
      });

    case ENTRY_SAVE_PENDING:
      return Object.assign({}, state, {
        entrySavePending: true,
      });
    case ENTRY_SAVE_SUCCESS:
      return Object.assign({}, state, {
        entrySavePending: false,
        activeEntryChanged: false,
      });
    default:
      return state;
  }
}
