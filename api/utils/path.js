import fs from "fs";

/**
 * create path recursively if the path does not exist
 * @param {*} path 
 */
export function createPathIfNotExist(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true }, (err) => {
      if (err) throw err;
    });
  }
}
