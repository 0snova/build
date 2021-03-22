import fs from 'fs';
import path from 'path';

const skipEntries = ['devDependencies', 'publishConfig', 'scripts'];

type PackageJSONContent = {
  main: string;
  module: string;
  browser: string;
  types: string;
};

type MakePackageJSONOptions = {
  distDir?: string;
};

export function makePackageJSON(
  originalPackageJSONContent: PackageJSONContent,
  { distDir = 'dist' }: MakePackageJSONOptions = {}
) {
  const resultPkg: Record<string, unknown> = {};

  Object.entries(originalPackageJSONContent).forEach(([name, value]) => {
    if (skipEntries.includes(name)) {
      return;
    }

    if (name === 'files') {
      resultPkg[name] = ['*'];
    } else if (name === 'main' || name === 'module' || name === 'browser' || name === 'types') {
      resultPkg[name] = value.startsWith(distDir) ? value.replace(`${distDir}/`, '') : value;
    } else {
      resultPkg[name] = value;
    }
  });

  return resultPkg as PackageJSONContent;
}

export function savePackageJSON(content: PackageJSONContent, distDir = 'dist') {
  fs.writeFileSync(path.resolve(process.cwd(), distDir, 'package.json'), JSON.stringify(content, undefined, 2), {
    encoding: 'utf-8',
  });
}
