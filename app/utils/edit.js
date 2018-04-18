import path from 'path';
import * as fs from 'fs';
import moment from 'moment';


import {
  mkdir,
  exists,
  appendFile,
  copyFile
} from './fs';

export async function uploadFile(file, entry) {

  console.log(file, entry);

  const asset_dir = path.join(path.dirname(entry.path), "assets", entry.date_str);

  console.log(asset_dir);

  const asset_dir_exists = await exists(asset_dir);
  if(!asset_dir_exists) {
    console.log("mkdir");
    await mkdir(asset_dir);
  }

  const file_ext = path.extname(file.path);
  var filename = path.basename(file.path, file_ext);

  var dest = path.join(asset_dir, filename + file_ext);
  var relative = path.join("assets", entry.date_str, filename+file_ext)

  if(await exists(dest)) {
    const dest_filename = filename + "_" + moment().format("YYYY-MM-DD-hh-mm") + "" + file_ext;
    dest = path.join(asset_dir, dest_filename)
    relative = path.join("assets", entry.date_str, dest_filename);
  }


  var copy = copyFile(file.path, dest);

  const appendLine = `\n![](${relative})`;

  var append = appendFile(entry.path, appendLine);

  await append;
  await copy;

  return relative;
}
