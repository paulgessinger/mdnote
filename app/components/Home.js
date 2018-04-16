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
    var {history} = this.props;
    this.props.openEntry(moment(day), history);
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
  }

  componentDidMount() {
    console.log("call loadEntries");
    this.props.loadEntries();
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

    await Promise.all(promises);
    this.props.entryRead(activeEntry);
  }

  _stopEvent(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  _onChange(value, e) {
    this.props.activeEntryChanged(value);
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
      html = "not exists";
    }

    var edit_button;
    var save_button = null;
    if(editor_open) {
      edit_button = <button onClick={() => this.props.editorClose()}>close</button>;
      save_button = <button onClick={() => this.props.entrySave(activeEntry)} disabled={!activeEntryChanged}>save</button>;
    }
    else {
      edit_button = <button onClick={() => this.props.editorOpen()}>edit</button>;
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
        <div className={cls(styles.rightColumn, {[styles.rightColumn_split] : editor_open})}>
          <div>
            { html }
          </div>
        </div>
        {editor_open ? <div className={styles.editColumn}>
          <AceEditor
            mode="markdown"
            theme="github"
            onChange={(v, e) => this._onChange(v, e)}
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
