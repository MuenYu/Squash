import fs from "fs";
import path from "path";
import { pipeline } from "stream";
import { promisify } from "util";

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

const streamPipe = promisify(pipeline)

// store the data to the specified path
export async function stream2file(stream, path) {
  const fileStream = fs.createWriteStream(path)
  await streamPipe(stream, fileStream)
}

// check if the file exist
export function exist(path) {
  return fs.existsSync(path)
}

export function file2Stream(path) {
  return fs.createReadStream(path)
}