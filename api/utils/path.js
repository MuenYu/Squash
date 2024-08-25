import fs from "fs";
import path from "path";

export const cwd = process.cwd();
export const uploadPath = path.join(cwd, 'upload');
export const outputPath = path.join(cwd, 'output');
export const publicPath = path.join(cwd, 'public');

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
