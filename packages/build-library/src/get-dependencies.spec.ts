import { getEveryDependency } from './get-dependencies';

const pkgJsonPath = '../../../package.json';

test(`with exclude list`, () => {
  expect(
    getEveryDependency(pkgJsonPath, {
      exclude: ['@types/**'],
      dev: true,
    })
  ).toMatchInlineSnapshot(`
    Array [
      "@babel/cli",
      "@babel/core",
      "@babel/preset-env",
      "@babel/preset-typescript",
      "@typescript-eslint/eslint-plugin",
      "@typescript-eslint/parser",
      "eslint",
      "eslint-config-prettier",
      "eslint-plugin-prettier",
      "husky",
      "jest",
      "lerna",
      "lint-staged",
      "prettier",
      "shx",
      "typescript",
    ]
  `);
});

test(`exclude is stronger than include`, () => {
  expect(
    getEveryDependency(pkgJsonPath, {
      include: ['@types/**'],
      exclude: ['@types/**'],
      dev: true,
    })
  ).toMatchInlineSnapshot(`Array []`);
});
