import { spawnSync } from 'node:child_process';
import { access, readdir, readFile, rm, writeFile } from 'node:fs/promises';
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
  'eslintExpo',
  'eslintExpoTypeChecked',
  'eslintJest',
  'eslintJs',
  'eslintNodeJs',
  'eslintNodeTs',
  'eslintNodeTsTypeChecked',
  'eslintReactJsx',
  'eslintReactNativeJsx',
  'eslintReactNativeTsx',
  'eslintReactNativeTsxTypeChecked',
  'eslintReactTsx',
  'eslintReactTsxTypeChecked',
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
  '../lib/eslint/expo/index.js',
  '../lib/eslint/expo/type-checked/index.js',
  '../lib/eslint/react/jsx/index.js',
  '../lib/eslint/react-native/jsx/index.js',
  '../lib/eslint/react-native/tsx/index.js',
  '../lib/eslint/react-native/tsx-type-checked/index.js',
  '../lib/eslint/react/tsx/index.js',
  '../lib/eslint/react/tsx-type-checked/index.js',
  '../lib/eslint/ts/index.js',
  '../lib/eslint/vitest/index.js',
  '../lib/prettier/index.js',
  '../commitlint.config.js',
  '../jest.config.js',
  '../jest.expo.config.js',
  '../jest.react-native.config.js',
  '../vitest.config.js',
  '../stylelint.config.js',
]) {
  await importDefault(specifier);
}

for (const [specifier, preset] of [
  ['super-configs/jest/expo', 'jest-expo'],
  ['super-configs/jest/react-native', '@react-native/jest-preset'],
]) {
  const config = await importDefault(specifier);

  assert(config.preset === preset, `${specifier} must use ${preset}`);
  assert(config.transform === undefined, `${specifier} must leave transforms to its native preset`);
  assert(
    config.testMatch === undefined,
    `${specifier} must leave test discovery to its native preset`,
  );
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
  ['super-configs/eslint/react-native/jsx', '__DEV__', 'document'],
  ['super-configs/eslint/react-native/tsx', '__DEV__', 'document'],
  ['super-configs/eslint/react-native/tsx-type-checked', '__DEV__', 'document'],
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

for (const [testFramework, expectedName, expectedGlobal] of [
  ['vitest', 'super-configs/vitest', 'expect'],
  ['jest', 'super-configs/jest', 'jest'],
]) {
  const companionFactoryConfig = eslintFactoryModule.createEslintConfig({ testFramework });
  const companionConfig = companionFactoryConfig.at(-1);

  assert(
    companionConfig?.name === expectedName,
    `factory testFramework "${testFramework}" must append ${expectedName}`,
  );
  assert(
    expectedGlobal in (companionConfig?.languageOptions?.globals ?? {}),
    `factory testFramework "${testFramework}" must define ${expectedGlobal}`,
  );
  assert(
    companionFactoryConfig.some((entry) => entry.name === 'super-configs/node-ts'),
    `factory testFramework "${testFramework}" must keep the runtime preset`,
  );
}

const reactFactoryConfig = eslintFactoryModule.createEslintConfig({
  react: true,
  testFramework: 'vitest',
});
const typeCheckedReactFactoryConfig = eslintFactoryModule.createEslintConfig({
  react: true,
  typeChecked: true,
});
const expoFactoryConfig = eslintFactoryModule.createEslintConfig({
  expo: true,
  typeChecked: true,
});

assert(
  reactFactoryConfig.some((entry) => entry.name === 'super-configs/react-tsx'),
  'factory react option must use the React TSX preset',
);
assert(
  typeCheckedReactFactoryConfig.some(
    (entry) => entry.name === 'super-configs/react-tsx-type-checked',
  ),
  'factory react option must use the type-checked React TSX preset',
);
assert(
  expoFactoryConfig.some((entry) => entry.name === 'super-configs/expo-ts-type-checked'),
  'factory expo option must use the type-checked Expo preset',
);
assert(
  !expoFactoryConfig.some((entry) => entry.name?.startsWith('super-configs/react-native-')),
  'factory expo option must not use the React Native preset',
);

for (const [language, typeChecked, expectedName] of [
  ['js', false, 'super-configs/react-native-jsx'],
  ['ts', false, 'super-configs/react-native-tsx'],
  ['ts', true, 'super-configs/react-native-tsx-type-checked'],
]) {
  const reactNativeFactoryConfig = eslintFactoryModule.createEslintConfig({
    language,
    reactNative: true,
    typeChecked,
  });

  assert(
    reactNativeFactoryConfig.some((entry) => entry.name === expectedName),
    `factory React Native option must use ${expectedName}`,
  );
}

try {
  eslintFactoryModule.createEslintConfig({ react: true, reactNative: true });

  throw new Error('factory must reject React web with React Native');
} catch (error) {
  assert(
    error instanceof TypeError &&
      error.message === 'expo, react, and reactNative cannot be enabled together',
    'factory must reject React web with React Native',
  );
}

const expoTypeCheckedConfig = await importDefault('super-configs/eslint/expo/type-checked');
const expoTypeCheckedEntry = expoTypeCheckedConfig.find(
  (entry) => entry.name === 'super-configs/expo-ts-type-checked',
);
const expoConfig = await importDefault('super-configs/eslint/expo');
const expoEslint = new ESLint({ overrideConfigFile: true, overrideConfig: expoConfig });
const expoAppConfig = await expoEslint.calculateConfigForFile('src/App.tsx');
const expoMetroConfig = await expoEslint.calculateConfigForFile('metro.config.js');

assert('expo' in expoAppConfig.plugins, 'Expo preset must load the official Expo plugin');
assert('__DEV__' in expoAppConfig.languageOptions.globals, 'Expo preset must define __DEV__');
assert('window' in expoAppConfig.languageOptions.globals, 'Expo preset must define web globals');
assert(
  !('__dirname' in expoAppConfig.languageOptions.globals),
  'Expo app files must not receive Node.js-only globals',
);
assert(
  '__dirname' in expoMetroConfig.languageOptions.globals,
  'Expo preset must define Node.js globals for metro.config.js',
);

assert(
  expoTypeCheckedEntry?.languageOptions?.parserOptions?.projectService === true,
  'type-checked Expo preset must enable projectService',
);
assert(
  expoTypeCheckedEntry?.rules?.['@typescript-eslint/no-floating-promises'] === 'error',
  'type-checked Expo preset must enable type-aware rules',
);

assert(
  reactFactoryConfig.at(-1)?.name === 'super-configs/vitest',
  'factory react option must keep companion presets last',
);
assert(
  eslintFactoryModule
    .createEslintConfig({ react: true, language: 'js' })
    .some((entry) => entry.name === 'super-configs/react-jsx'),
  'factory react option must use the React JSX preset for JavaScript',
);

for (const specifier of [
  'super-configs/eslint/browser/ts-type-checked',
  'super-configs/eslint/bun/ts-type-checked',
  'super-configs/eslint/node/ts-type-checked',
  'super-configs/eslint/react-native/tsx-type-checked',
  'super-configs/eslint/react/tsx-type-checked',
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
  ['super-configs/eslint/expo', 'fixture.tsx'],
  ['super-configs/eslint/expo/type-checked', 'src/index.ts'],
  ['super-configs/eslint/react/jsx', 'fixture.jsx'],
  ['super-configs/eslint/react-native/jsx', 'fixture.native.jsx'],
  ['super-configs/eslint/react-native/tsx', 'fixture.native.tsx'],
  ['super-configs/eslint/react-native/tsx-type-checked', 'src/eslint/index.ts'],
  ['super-configs/eslint/react/tsx', 'fixture.tsx'],
  ['super-configs/eslint/react/tsx-type-checked', 'src/index.ts'],
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
  ['super-configs/eslint/expo', 'fixture.tsx', 'export const Screen = () => <View />;\n'],
  ['super-configs/eslint/expo/type-checked', 'src/index.ts', 'export const value: number = 1;\n'],
  [
    'super-configs/eslint/react/tsx',
    'fixture.tsx',
    'export const Component = () => <button type="button">OK</button>;\n',
  ],
  [
    'super-configs/eslint/react/tsx-type-checked',
    'src/index.ts',
    'export const value: number = 1;\n',
  ],
  [
    'super-configs/eslint/react-native/jsx',
    'fixture.android.jsx',
    'export default function Screen() { return <View />; }\n',
  ],
  [
    'super-configs/eslint/react-native/tsx',
    'fixture.ios.tsx',
    'export default function Screen() { return <View />; }\n',
  ],
  [
    'super-configs/eslint/react-native/tsx-type-checked',
    'src/eslint/index.ts',
    'export const value: number = 1;\n',
  ],
  ['super-configs/eslint/jest', 'fixture.test.js', "it('works', () => {});\n"],
  ['super-configs/eslint/vitest', 'fixture.test.js', "it('works', () => {});\n"],
]) {
  const config = await importDefault(specifier);
  const reactVersionOverride =
    specifier.includes('/react/') || specifier.includes('/expo')
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
  'biome.react-native.json',
  'lib/tsconfig/base.json',
  'lib/tsconfig/expo.json',
  'lib/tsconfig/node.json',
  'lib/tsconfig/react.json',
  'lib/tsconfig/react-native.json',
  'markdownlint.json',
  'typedoc.json',
]) {
  await readJson(path);
}

const reactNativeBiomeUrl = import.meta.resolve('super-configs/biome/react-native');
const reactNativeBiomeConfig = JSON.parse(await readFile(new URL(reactNativeBiomeUrl), 'utf8'));

assert(
  reactNativeBiomeConfig.extends?.includes('./biome.json'),
  'super-configs/biome/react-native must extend the base Biome preset',
);

for (const [rule, level] of [
  ['noReactNativeDeepImports', 'error'],
  ['noReactNativeLiteralColors', 'warn'],
  ['noReactNativeRawText', 'error'],
  ['useReactNativePlatformComponents', 'error'],
]) {
  assert(
    reactNativeBiomeConfig.linter?.rules?.nursery?.[rule] === level,
    `super-configs/biome/react-native must configure ${rule} as ${level}`,
  );
}

const biomeEntrypoint = join(root, 'node_modules/@biomejs/biome/bin/biome');
const biomeFixturePath = join(root, '.react-native-biome-fixture.tsx');
const biomeFixture = `import InternalView from 'react-native/Libraries/Components/View/View';
import { ProgressBarAndroid, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({ root: { color: '#fff' } });

export const Screen = () => (
  <View style={styles.root}>
    Hello
    <ProgressBarAndroid />
    <InternalView />
  </View>
);
`;

let reactNativeLint;

try {
  await writeFile(biomeFixturePath, biomeFixture);
  reactNativeLint = spawnSync(
    process.execPath,
    [
      biomeEntrypoint,
      'lint',
      '--config-path',
      join(root, 'biome.react-native.json'),
      biomeFixturePath,
      '--reporter=json',
    ],
    { encoding: 'utf8' },
  );
} finally {
  await rm(biomeFixturePath, { force: true });
}

const reactNativeLintOutput = `${reactNativeLint.stdout}${reactNativeLint.stderr}`;

assert(reactNativeLint.status === 1, 'React Native Biome fixture must produce diagnostics');

for (const rule of [
  'noReactNativeDeepImports',
  'noReactNativeLiteralColors',
  'noReactNativeRawText',
  'useReactNativePlatformComponents',
]) {
  assert(reactNativeLintOutput.includes(rule), `React Native Biome fixture must trigger ${rule}`);
}

for (const specifier of [
  'super-configs/tsconfig/base',
  'super-configs/tsconfig/expo',
  'super-configs/tsconfig/node',
  'super-configs/tsconfig/react',
  'super-configs/tsconfig/react-native',
]) {
  const url = import.meta.resolve(specifier);
  const config = JSON.parse(await readFile(new URL(url), 'utf8'));

  assert(config.compilerOptions, `${specifier} must define compilerOptions`);
}

for (const [specifier, baseConfig] of [
  ['super-configs/tsconfig/expo', 'expo/tsconfig.base'],
  ['super-configs/tsconfig/react-native', '@react-native/typescript-config'],
]) {
  const url = import.meta.resolve(specifier);
  const config = JSON.parse(await readFile(new URL(url), 'utf8'));

  assert(config.extends === baseConfig, `${specifier} must extend ${baseConfig}`);
  assert(config.compilerOptions.strict === true, `${specifier} must enable strict mode`);
}

const nodeTsconfigUrl = import.meta.resolve('super-configs/tsconfig/node');
const nodeTsconfig = JSON.parse(await readFile(new URL(nodeTsconfigUrl), 'utf8'));

assert(
  nodeTsconfig.compilerOptions.types?.includes('node'),
  'super-configs/tsconfig/node must explicitly include Node.js types',
);

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

const readme = await readText('README.md');

for (const documentedValue of [
  '--react-native',
  '--expo',
  'super-configs/biome/react-native',
  'super-configs/eslint/expo',
  'super-configs/eslint/expo/type-checked',
  'super-configs/eslint/react-native/jsx',
  'super-configs/eslint/react-native/tsx',
  'super-configs/eslint/react-native/tsx-type-checked',
  'super-configs/eslint/react/tsx-type-checked',
  'super-configs/jest/expo',
  'super-configs/jest/react-native',
  'super-configs/tsconfig/expo',
  'super-configs/tsconfig/react-native',
]) {
  assert(readme.includes(documentedValue), `README must document ${documentedValue}`);
}

console.log('exports ok');
