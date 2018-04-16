// @flow
export const ENTRIES_LOADING = 'ENTRIES_LOADING';
export const ENTRIES_LOADED = 'ENTRIES_LOADED';
export const OPEN_ENTRY = 'OPEN_ENTRY';
export const ENTRY_READ = 'ENTRY_READ';
export const ENTRY_READ_PENDING = 'ENTRY_READ_PENDING';
export const ENTRY_READ_SUCCESS = 'ENTRY_READ_SUCCESS';

export const ACTIVE_ENTRY_CHANGED = 'ACTIVE_ENTRY_CHANGED';

export const ENTRY_SAVE = 'ENTRY_SAVE';
export const ENTRY_SAVE_PENDING = 'ENTRY_SAVE_PENDING';
export const ENTRY_SAVE_SUCCESS = 'ENTRY_SAVE_SUCCESS';

import _ from "lodash";
import path from 'path';

import * as fs from 'fs';
import moment from "moment";

import {
  readdir,
  readFile,
  write,
  exists
} from '../utils/fs';


export type entryType = {
  path: string,
  filename: string,
  date: object,
  date_str: string,
  exists: bool,
  content: ?string
};





import {DATA_PATH} from "../config.js";


export function entriesLoading() {
  return {
    type: ENTRIES_LOADING
  };
}

export function entriesLoaded(entries) {
  return {
    type: ENTRIES_LOADED,
    entries: entries
  };
}

export function loadEntries() {
  return async (dispatch: (action) => void) => {
    console.log("Loading entries", DATA_PATH);
    dispatch(entriesLoading());

    var files = await readdir(DATA_PATH);

    files = _.filter(files, f => f.endsWith(".md"));
    files = _.map(files, f => {
      const ext = path.extname(f);
      const date_str = path.basename(f, ext);
      return {
        path: path.join(DATA_PATH, f),
        filename: f,
        date_str: date_str,
        date: moment(date_str, "YYYY-MM-DD"),
        exists: true,
        content: null,
      };
    });

    var outFiles = {};

    for(let f of files) {
      outFiles[f.date_str] = f;
    }

    dispatch(entriesLoaded(outFiles));
  };
}

export function openEntry(day: object, history: object) {
  //history.push("/"+day.format("YYYY-MM-DD"));
  return {
    type: OPEN_ENTRY,
    day: day
  };
}

export function entryReadSuccess(entry: entryType) {
  return {
    type: ENTRY_READ_SUCCESS,
    entry: entry
  };
}

export function entryReadPending() {
  return {
    type: ENTRY_READ_PENDING
  };
}

export function entryRead(entry: entryType) {
  return async (dispatch) => {

    dispatch(entryReadPending());

    const content = await readFile(entry.path);

    const newEntry = Object.assign({}, entry, {
      content: content
    });

    dispatch(entryReadSuccess(newEntry));
  };
}

export function activeEntryChanged(content) {
  return {
    type: ACTIVE_ENTRY_CHANGED,
    content: content
  };
}

export function entrySavePending() {
  return {
    type: ENTRY_SAVE_PENDING
  };
}

export function entrySaveSuccess() {
  return {
    type: ENTRY_SAVE_SUCCESS
  };
}

export function entrySave(entry) {
  return async (dispatch) => {
    dispatch(entrySavePending());

    if(await exists(entry.path)) {
      await write(entry.path, "w", entry.content);
      dispatch(entrySaveSuccess());
    }
    else {
      console.err("file does not exist");
    }
  };
}
