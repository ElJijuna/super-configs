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
  'eslintJest',
  'eslintJs',
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

for (const path of ['biome.json', 'markdownlint.json', 'typedoc.json']) {
  await readJson(path);
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
