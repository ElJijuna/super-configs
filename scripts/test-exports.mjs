import { access, readdir, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';

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
const emittedModulePaths = (await readdir(join(root, 'lib'), { recursive: true })).filter(
  (path) => path.endsWith('.js') || path.endsWith('.d.ts'),
);

for (const path of emittedModulePaths) {
  const emittedModule = await readFile(join(root, 'lib', path), 'utf8');

  assert(
    !emittedModule.includes("'@/") && !emittedModule.includes('"@/'),
    `${path} must not expose source path aliases`,
  );
}

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
  'eslintVitest',
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
  '../lib/eslint/vitest/index.js',
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

for (const [specifier, expectedGlobal, excludedGlobal] of [
  ['super-configs/eslint/jest', 'jest', 'vi'],
  ['super-configs/eslint/vitest', 'vi', 'jest'],
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

for (const [specifier, filePath] of [
  ['super-configs/eslint/browser/js', 'fixture.js'],
  ['super-configs/eslint/browser/ts', 'fixture.ts'],
  ['super-configs/eslint/browser/ts-type-checked', 'fixture.ts'],
  ['super-configs/eslint/bun/js', 'fixture.js'],
  ['super-configs/eslint/bun/ts', 'fixture.ts'],
  ['super-configs/eslint/bun/ts-type-checked', 'fixture.ts'],
  ['super-configs/eslint/js', 'fixture.js'],
  ['super-configs/eslint/node/js', 'fixture.js'],
  ['super-configs/eslint/node/ts', 'fixture.ts'],
  ['super-configs/eslint/node/ts-type-checked', 'fixture.ts'],
  ['super-configs/eslint/react/jsx', 'fixture.jsx'],
  ['super-configs/eslint/react/tsx', 'fixture.tsx'],
  ['super-configs/eslint/ts', 'fixture.ts'],
  ['super-configs/eslint/ts-type-checked', 'fixture.ts'],
]) {
  const config = await importDefault(specifier);
  const fileMatchOverride = filePath.endsWith('.jsx') ? [{ files: ['**/*.jsx'] }] : [];
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [...config, ...fileMatchOverride],
  });
  const calculatedConfig = await eslint.calculateConfigForFile(filePath);

  for (const ruleName of ['no-unassigned-vars', 'no-useless-assignment', 'preserve-caught-error']) {
    assert(
      calculatedConfig.rules[ruleName][0] === 0,
      `${specifier} must preserve the ESLint 9 recommended behavior for ${ruleName}`,
    );
  }
}

for (const [specifier, filePath, code] of [
  ['super-configs/eslint/js', 'fixture.js', 'export const value = 1;\n'],
  ['super-configs/eslint/ts', 'fixture.ts', 'export const value: number = 1;\n'],
  [
    'super-configs/eslint/ts-type-checked',
    'src/eslint/index.ts',
    'export const value: number = 1;\n',
  ],
  [
    'super-configs/eslint/react/jsx',
    'fixture.jsx',
    'export const Component = () => <button type="button">OK</button>;\n',
  ],
  [
    'super-configs/eslint/react/tsx',
    'fixture.tsx',
    'export const Component = () => <button type="button">OK</button>;\n',
  ],
  ['super-configs/eslint/jest', 'fixture.test.js', "it('works', () => {});\n"],
  ['super-configs/eslint/vitest', 'fixture.test.js', "it('works', () => {});\n"],
]) {
  const config = await importDefault(specifier);
  const reactVersionOverride = specifier.includes('/react/')
    ? [
        {
          ...(filePath.endsWith('.jsx') ? { files: ['**/*.jsx'] } : {}),
          settings: { react: { version: '19.0' } },
        },
      ]
    : [];
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [...config, ...reactVersionOverride],
  });
  const [result] = await eslint.lintText(code, { filePath });

  assert(result.fatalErrorCount === 0, `${specifier} must execute successfully on ESLint 10`);
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
  'lib/cli/index.js',
  'lib/test/bunfig.toml',
  'vitest.config.js',
  'stylelint.config.js',
]) {
  await access(join(root, path));
}

const bunfig = await readText('lib/test/bunfig.toml');

assert(bunfig.includes('coverageDir = "coverage"'), 'bunfig must use the coverage directory');

console.log('exports ok');
