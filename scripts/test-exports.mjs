import { access, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};
const importDefault = async (specifier) => {
  const module = await import(specifier);

  assert(module.default, `${specifier} must export a default value`);

  return module.default;
};
const readJson = async (path) => JSON.parse(await readFile(join(root, path), 'utf8'));
const rootModule = await import('../lib/index.js');

for (const name of [
  'eslintBrowserJs',
  'eslintBrowserTs',
  'eslintBunJs',
  'eslintBunTs',
  'eslintJest',
  'eslintJs',
  'eslintNodeJs',
  'eslintNodeTs',
  'eslintReactJsx',
  'eslintReactTsx',
  'eslintTs',
  'prettierConfig',
]) {
  assert(rootModule[name], `root export ${name} is missing`);
}

for (const specifier of [
  '../lib/eslint/jest/index.js',
  '../lib/eslint/js/index.js',
  '../lib/eslint/react/jsx/index.js',
  '../lib/eslint/react/tsx/index.js',
  '../lib/eslint/ts/index.js',
  '../lib/prettier/index.js',
  '../commitlint.config.js',
  '../jest.config.js',
  '../vitest.config.js',
  '../stylelint.config.js',
]) {
  await importDefault(specifier);
}

for (const [specifier, expectedGlobal, excludedGlobal] of [
  ['super-configs/eslint/browser/js', 'window', 'process'],
  ['super-configs/eslint/browser/ts', 'window', 'process'],
  ['super-configs/eslint/bun/js', 'Bun', 'window'],
  ['super-configs/eslint/bun/ts', 'Bun', 'window'],
  ['super-configs/eslint/js', 'process', 'window'],
  ['super-configs/eslint/node/js', 'process', 'window'],
  ['super-configs/eslint/node/ts', 'process', 'window'],
  ['super-configs/eslint/react/jsx', 'window', 'process'],
  ['super-configs/eslint/ts', 'process', 'window'],
]) {
  const config = await importDefault(specifier);
  const configuredGlobals = Object.assign(
    {},
    ...config.map((entry) => entry.languageOptions?.globals ?? {}),
  );

  assert(expectedGlobal in configuredGlobals, `${specifier} must define ${expectedGlobal}`);
  assert(!(excludedGlobal in configuredGlobals), `${specifier} must not define ${excludedGlobal}`);
}

for (const path of [
  'biome.json',
  'lib/tsconfig/base.json',
  'lib/tsconfig/node.json',
  'lib/tsconfig/react.json',
  'markdownlint.json',
  'typedoc.json',
]) {
  await readJson(path);
}

for (const specifier of [
  'super-configs/tsconfig/base',
  'super-configs/tsconfig/node',
  'super-configs/tsconfig/react',
]) {
  const url = import.meta.resolve(specifier);
  const config = JSON.parse(await readFile(new URL(url), 'utf8'));

  assert(config.compilerOptions, `${specifier} must define compilerOptions`);
}

for (const path of [
  '.editorconfig',
  'commitlint.config.js',
  'jest.config.js',
  'vitest.config.js',
  'stylelint.config.js',
]) {
  await access(join(root, path));
}

console.log('exports ok');
