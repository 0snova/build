#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import { copyFiles, makePackageJSON, savePackageJSON } from '@osnova/build-library';

const targetDir = process.argv[2];

export function main() {
  const pkgJSON = path.resolve('package.json');

  copyFiles(['README.md'], targetDir).catch((e) => {
    console.error(e);
  });

  savePackageJSON(makePackageJSON(JSON.parse(fs.readFileSync(pkgJSON, { encoding: 'utf-8' }))), targetDir);
}
