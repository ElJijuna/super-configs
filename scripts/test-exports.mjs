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
const readText = async (path) => readFile(join(root, path), 'utf8');
const rootModule = await import('../lib/index.js');

for (const name of [
  'eslintBrowserJs',
  'eslintBrowserTs',
  'eslintBrowserTsTypeChecked',
  'eslintBunJs',
  'eslintBunTs',
  'eslintBunTsTypeChecked',
  'eslintJest',
  'eslintJs',
  'eslintNodeJs',
  'eslintNodeTs',
  'eslintNodeTsTypeChecked',
  'eslintReactJsx',
  'eslintReactTsx',
  'eslintTs',
  'eslintTsTypeChecked',
  'createEslintConfig',
  'prettierConfig',
]) {
  assert(rootModule[name], `root export ${name} is missing`);
}

const eslintFactoryModule = await import('super-configs/eslint');

assert(
  typeof eslintFactoryModule.createEslintConfig === 'function',
  'super-configs/eslint must export createEslintConfig',
);

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
  ['super-configs/eslint/browser/ts-type-checked', 'window', 'process'],
  ['super-configs/eslint/bun/js', 'Bun', 'window'],
  ['super-configs/eslint/bun/ts', 'Bun', 'window'],
  ['super-configs/eslint/bun/ts-type-checked', 'Bun', 'window'],
  ['super-configs/eslint/js', 'process', 'window'],
  ['super-configs/eslint/node/js', 'process', 'window'],
  ['super-configs/eslint/node/ts', 'process', 'window'],
  ['super-configs/eslint/node/ts-type-checked', 'process', 'window'],
  ['super-configs/eslint/react/jsx', 'window', 'process'],
  ['super-configs/eslint/ts', 'process', 'window'],
  ['super-configs/eslint/ts-type-checked', 'process', 'window'],
]) {
  const config = await importDefault(specifier);
  const configuredGlobals = Object.assign(
    {},
    ...config.map((entry) => entry.languageOptions?.globals ?? {}),
  );

  assert(expectedGlobal in configuredGlobals, `${specifier} must define ${expectedGlobal}`);
  assert(!(excludedGlobal in configuredGlobals), `${specifier} must not define ${excludedGlobal}`);
}

const browserJsFactoryConfig = eslintFactoryModule.createEslintConfig({
  runtime: 'browser',
  language: 'js',
  ignores: ['dist/**'],
  overrides: [{ name: 'consumer/override', rules: { eqeqeq: 'off' } }],
});
const browserJsFactoryGlobals = Object.assign(
  {},
  ...browserJsFactoryConfig.map((entry) => entry.languageOptions?.globals ?? {}),
);

assert(browserJsFactoryConfig[0]?.ignores?.includes('dist/**'), 'factory must prepend ignores');
assert(
  browserJsFactoryConfig.at(-1)?.name === 'consumer/override',
  'factory must append overrides',
);
assert('window' in browserJsFactoryGlobals, 'browser JS factory config must define window');
assert(
  !('process' in browserJsFactoryGlobals),
  'browser JS factory config must not define process',
);

const bunTypeCheckedFactoryConfig = eslintFactoryModule.createEslintConfig({
  runtime: 'bun',
  language: 'ts',
  typeChecked: true,
});
const bunTypeCheckedFactoryGlobals = Object.assign(
  {},
  ...bunTypeCheckedFactoryConfig.map((entry) => entry.languageOptions?.globals ?? {}),
);
const bunFactoryUsesProjectService = bunTypeCheckedFactoryConfig.some(
  (entry) => entry.languageOptions?.parserOptions?.projectService === true,
);

assert('Bun' in bunTypeCheckedFactoryGlobals, 'Bun TS factory config must define Bun');
assert(bunFactoryUsesProjectService, 'type-checked factory config must enable projectService');

try {
  eslintFactoryModule.createEslintConfig({ language: 'js', typeChecked: true });

  throw new Error('factory must reject type-checked JavaScript');
} catch (error) {
  assert(
    error instanceof TypeError &&
      error.message === 'typeChecked is only supported when language is "ts"',
    'factory must reject type-checked JavaScript',
  );
}

for (const specifier of [
  'super-configs/eslint/browser/ts-type-checked',
  'super-configs/eslint/bun/ts-type-checked',
  'super-configs/eslint/node/ts-type-checked',
  'super-configs/eslint/ts-type-checked',
]) {
  const config = await importDefault(specifier);
  const usesProjectService = config.some(
    (entry) => entry.languageOptions?.parserOptions?.projectService === true,
  );
  const enablesTypedRule = config.some(
    (entry) => entry.rules?.['@typescript-eslint/no-floating-promises'] === 'error',
  );
  const scopesEveryConfigToTypeScript = config.every((entry) => entry.files?.includes('**/*.ts'));

  assert(usesProjectService, `${specifier} must enable projectService`);
  assert(enablesTypedRule, `${specifier} must enable type-aware rules`);
  assert(scopesEveryConfigToTypeScript, `${specifier} must only target TypeScript files`);
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

for (const specifier of ['super-configs/bunfig', 'super-configs/bunfig.toml']) {
  const url = import.meta.resolve(specifier);
  const bunfig = await readFile(new URL(url), 'utf8');

  assert(bunfig.includes('[test]'), `${specifier} must define the test section`);
  assert(bunfig.includes('coverage = true'), `${specifier} must enable coverage`);
  assert(bunfig.includes('coverageReporter = ["text", "lcov"]'), `${specifier} must emit LCOV`);
}

for (const path of [
  '.editorconfig',
  'commitlint.config.js',
  'jest.config.js',
  'lib/test/bunfig.toml',
  'vitest.config.js',
  'stylelint.config.js',
]) {
  await access(join(root, path));
}

const bunfig = await readText('lib/test/bunfig.toml');

assert(bunfig.includes('coverageDir = "coverage"'), 'bunfig must use the coverage directory');

console.log('exports ok');
