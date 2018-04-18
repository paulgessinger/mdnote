// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import DayPicker from 'react-day-picker';
import moment from 'moment';
import ReactHtmlParser from 'react-html-parser';
import { convertNodeToElement } from 'react-html-parser';
import path from 'path';
import AceEditor from 'react-ace';
import 'brace/theme/github';
import 'brace/mode/markdown';
import cls from 'classnames';
const shell = require('electron').shell
const { BrowserWindow } = require('electron').remote
const PDFWindow = require('electron-pdf-window')
import * as fs from 'fs';
//const {BrowserWindow} = require('electron')

import {renderMarkdown} from '../utils/markdown';
import {DATA_PATH} from "../config.js";
import PDF from './PDF';

import {uploadFile} from '../utils/edit';

import "./calendar.global.css";

type Props = {
  loadEntries: () => void,
};

export default class Home extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      content_html: ""
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    //console.log(nextProps);
    if(nextProps.entries.activeEntry && nextProps.entries.activeEntry.content) {
      return {
        content_html: renderMarkdown(nextProps.entries.activeEntry.content)
      };
    }

    return null;
  }

  handleDayClick(day) {
    //console.log(day);
    //console.log(this.props);
    var now = moment();
    now.hour(12);
    now.minute(0);
    now.second(0);
    if(day > now.toDate()) {
      return;
    }
    //var {history} = this.props;
    this.props.editorClose();
    this.props.openEntry(moment(day));
  }

  _transform(node, index) {
    //console.log(node);
    if(node.name === "img") {
      //var elm = convertNodeToElement(node, index, this._transform.bind(this));
      //console.log(node);
      //console.log(node.attribs.src);
      //return elm;

      const src = node.attribs.src;
      if(src.endsWith(".pdf")) {
        return <PDF key={src} src={path.join(DATA_PATH, src)}/>
      }
      else {
        return <img src={path.join(DATA_PATH, node.attribs.src)} />;
      }
    }

    if(node.name === "a") {

      //console.log(node);
      const src = node.attribs.href;
      if(!src) return;

      var text = "";
      if(node.children && node.children.length > 0 && node.children[0].data) {
        text = node.children[0].data;
      }
      //console.log(text);

      if(src.startsWith("http://") || src.startsWith("https://")) {
        const onClick = (e) => {
            e.preventDefault();
            shell.openExternal(src);
        };
        return (<a className={styles.smartlink} key={src} href={src} onClick={onClick}>
          <span>{text}</span>
          <i className="fas fa-globe"></i>
        </a>);
      }
      else {

        if(fs.existsSync(path.join(DATA_PATH, src))) {
          if(!src.endsWith(".md")) {
            const onClick = (e) => {
              e.preventDefault();
              const fullPath = path.join(DATA_PATH, src);
              shell.openExternal(`file://${fullPath}`);
            }
            return (<a className={styles.smartlink} key={src} href={src} onClick={onClick}>
              <span>{text}</span>
              <i className="fas fa-paperclip"></i>
            </a>);

          }
          else {
            //console.log(src);
            const onClick = (e) => {
              e.preventDefault();
              const ext = path.extname(src);
              const fname = path.basename(src, ext);
              //console.log(fname, ext);
              var date = moment(fname, "YYYY-MM-DD");
              const isValid = date.format("YYYY-MM-DD") === fname;

              if(isValid) {
                //console.log("go", fname);
                this.handleDayClick(date);
              }

            }
            return (<a className={styles.smartlink} key={src} href={src} onClick={onClick}>
              <span>{text}</span>
              <i className="fas fa-sticky-note"></i>
            </a>);
          }
        }
        //if(fs.existsSync(path.join(DATA_PATH, "assets", src))) {

        //}
        // check if it exists
      }

    }
  }

  componentDidMount() {
    console.log("call loadEntries");
    this.props.loadEntries();

    this.updateInterval = setInterval(() => { this.props.loadEntries() }, 60*60*1000);
  }

  componentWillUnmount() {

    clearInterval(this.updateInterval);

  }

  componentDidUpdate() {
    //console.log(this.props.entries.activeEntry);
    const {activeEntry, entries, activeEntryLoading} = this.props.entries;

    const keys = Object.keys(entries).sort().reverse();

    if(activeEntry === null && keys.length > 0) {
      this.props.openEntry(entries[keys[0]].date);
    }

    if(activeEntry && !activeEntry.content && activeEntry.exists && !activeEntryLoading) {
      this.props.entryRead(activeEntry);
    }

    // scroll to bottom
    var element = this.refs["content"];
    element.scrollTop = element.scrollHeight;
  }

  _isDayDisabled(day) {
    //console.log(day);
    var m = moment(day);
    var mf = m.format("YYYY-MM-DD");
    //console.log(mf);
    //return this.props.entries.entries.indexOf(mf) == -1;
    return this.props.entries.entries[mf] === undefined;
  }

  async _onDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const {activeEntry} = this.props.entries;

    var promises = [];

    if(e.dataTransfer.items) {
      for(let item of e.dataTransfer.items) {
        let file = item.getAsFile();
        promises.push(uploadFile(file, this.props.entries.activeEntry));
      }
    }

    var files = await Promise.all(promises);

    var newContent = activeEntry.content;
    for(let file of files) {
      newContent += `\n![](${file})`;
    }

    activeEntry.content = newContent;
    this.props.entrySave(activeEntry)
  }

  _stopEvent(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  _onChange(value, e) {
    this.props.activeEntryChanged(value);

    clearTimeout(this._saveTimeout);
    this._saveTimeout = setTimeout(() => this.props.entrySave(this.props.entries.activeEntry), 1000);
  }

  async create() {
    const {activeEntry} = this.props.entries;

    await this.props.entryCreate(activeEntry.date);
    this.props.openEntry(activeEntry.date);
  }

  render() {

    const {loading, entries, activeEntry, activeEntryChanged} = this.props.entries;
    const {editor_open} = this.props;

    var activeDay = activeEntry ? activeEntry.date.toDate() : null;

    var content = "";

    //if(activeEntry) {
      //content = await renderMarkdown(activeEntry.content);
    //}

    //dangerouslySetInnerHTML={{__html: this.state.content_html}}>

    var html;
    if(activeEntry && activeEntry.exists) {
      html = ReactHtmlParser(this.state.content_html, {
        transform: (n, i) => this._transform(n, i)
      });
    }
    else {
      //html = "not exists";
      html = (<div>
        <h1>{activeEntry.date.format("DD.MM.YYYY")}</h1>
        <button onClick={() => this.create()}>create</button>
      </div>);
    }

    var edit_button;
    var save_button = null;
    if(editor_open) {
      edit_button = <button onClick={() => this.props.editorClose()}>close</button>;
      save_button = <button onClick={() => this.props.entrySave(activeEntry)} disabled={!activeEntryChanged}>save</button>;
    }
    else {
      if(activeEntry && activeEntry.exists) {
        edit_button = <button onClick={() => this.props.editorOpen()}>edit</button>;
      }
    }


    return (
      <div className={styles.container}
        onDrop={(e) => this._onDrop(e)}
        onDragOver={this._stopEvent}
        onDragLeave={this._stopEvent}
        onDragEnd={this._stopEvent}
      >
        <div className={styles.leftColumn}>
          <DayPicker
            selectedDays={activeDay}
            onDayClick={(d) => this.handleDayClick(d)}
            initialMonth={activeDay ? activeDay : new Date()}
            disabledDays={day => this._isDayDisabled(day)}
          />
          { edit_button }
          { save_button }
        </div>
        <div ref="content" className={cls(styles.rightColumn, {[styles.rightColumn_split] : editor_open})}>
          <div>
            { html }
          </div>
        </div>
        {editor_open ? <div className={styles.editColumn}>
          <AceEditor
            mode="markdown"
            theme="github"
            onChange={(v, e) => this._onChange(v, e)}
            width="100%"
            height="100%"
            focus={true}
            name="UNIQUE_ID_OF_DIV"
            value={activeEntry.content}
            editorProps={{$blockScrolling: true}}
          />
        </div> : null}
      </div>
    );
  }
}
