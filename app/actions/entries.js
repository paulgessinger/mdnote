export const ENTRIES_LOADING = 'ENTRIES_LOADING';
export const ENTRIES_LOADED = 'ENTRIES_LOADED';
export const OPEN_ENTRY = 'OPEN_ENTRY';

import _ from "lodash";
import path from 'path';

//const electron = window.require("electron");
//const fs = electron.fs;
import * as fs from 'fs';
import moment from "moment";

import {DATA_PATH} from "../config.js";

function readdir(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if(err) {
        reject(err);
      }
      else {
        resolve(files);
      }
    });
  });
}

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
        date: moment(date_str, "YYYY-MM-DD")
      };
    });

    var outFiles = {};

    for(let f of files) {
      outFiles[f.date_str] = f;
    }

    dispatch(entriesLoaded(outFiles));
  };
}

export function openEntry(day, history) {
  //history.push("/"+day.format("YYYY-MM-DD"));
  return {
    type: OPEN_ENTRY,
    day: day
  };
}
