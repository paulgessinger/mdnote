import * as fs from 'fs';

export function readdir(dir) {
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

export function readFile(file, enc = "utf-8") {
  return new Promise((resolve, reject) => {
    fs.readFile(file, enc, (err, content) => {
      if(err) {
        reject(err);
        return;
      }

      resolve(content);
    });
  });
}

export function write(file, flags, content) {
  return new Promise((resolve, reject) => {
    var wstream = fs.createWriteStream(file, {flags: flags});
    wstream.on("error", reject);
    wstream.write(content, (err) => {
      if(err) {
        reject(err);
      }
      else {
        wstream.end();
        resolve();
      }
    })
  })
}

export function mkdir(p) {
  return new Promise((resolve, reject) => {
    fs.mkdir(p, (err) => {
      if(err) {
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
}

export function exists(p) {
  return new Promise((resolve, reject) => {
    fs.stat(p, (err) => {
      if(err === null) {
        resolve(true);
      }
      else if(err.code === 'ENOENT') {
        resolve(false);
      }
      else {
        reject(err);
      }
    })
  });
}

export function appendFile(file, data) {
  return new Promise((resolve, reject) => {
    fs.appendFile(file, data, (err) => {
      if(err) {
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
}

export function copyFile(src, dest) {
  return new Promise((resolve, reject) => {

    var rstream = fs.createReadStream(src);
    var wstream = fs.createWriteStream(dest);
    rstream.pipe(wstream);

    rstream.on("error", e => reject(e));
    wstream.on("error", e => reject(e));

    rstream.on("close", resolve);

  });
}
