const { copyFiles } = require('../dist/copy-files');
const { makePackageJSON, savePackageJSON } = require('../dist/make-package-json');

copyFiles(['README.md']).catch((e) => {
  console.error(e);
});

savePackageJSON(makePackageJSON(require('../package.json')));
