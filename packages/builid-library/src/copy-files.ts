import fs from 'fs';
import path from 'path';
import { deferred } from './deferred';

export function copyFiles(files: string[] = [], dest = './dist') {
  const promises = [];

  for (const file of files) {
    const absoluteDestPath = path.resolve(dest, file);
    const absoluteSrcPath = path.resolve(file);

    const { promise, resolve, reject } = deferred();

    promises.push(promise);

    fs.copyFile(absoluteSrcPath, absoluteDestPath, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(file);
    });
  }

  return Promise.all(promises);
}
