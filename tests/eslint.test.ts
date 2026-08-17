import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';
import { createEslintConfig } from '../src/eslint/index.js';
import {
  eslintBrowserJs,
  eslintBrowserTs,
  eslintBrowserTsTypeChecked,
  eslintBunJs,
  eslintBunTs,
  eslintBunTsTypeChecked,
  eslintJest,
  eslintJs,
  eslintNodeJs,
  eslintNodeTs,
  eslintNodeTsTypeChecked,
  eslintReactJsx,
  eslintReactNativeJsx,
  eslintReactNativeTsx,
  eslintReactNativeTsxTypeChecked,
  eslintReactTsx,
  eslintTs,
  eslintTsTypeChecked,
  eslintVitest,
  prettierConfig,
} from '../src/index.js';
import sharedVitestConfig from '../src/test/vitest.config.js';

const presets = [
  eslintBrowserJs,
  eslintBrowserTs,
  eslintBrowserTsTypeChecked,
  eslintBunJs,
  eslintBunTs,
  eslintBunTsTypeChecked,
  eslintJest,
  eslintJs,
  eslintNodeJs,
  eslintNodeTs,
  eslintNodeTsTypeChecked,
  eslintReactJsx,
  eslintReactNativeJsx,
  eslintReactNativeTsx,
  eslintReactNativeTsxTypeChecked,
  eslintReactTsx,
  eslintTs,
  eslintTsTypeChecked,
  eslintVitest,
];

describe('public configuration exports', () => {
  it('exports every ESLint preset as a non-empty flat config', () => {
    for (const preset of presets) {
      expect(preset).toBeInstanceOf(Array);
      expect(preset.length).toBeGreaterThan(0);
    }
  });

  it.each([
    ['JSX', eslintReactNativeJsx],
    ['TSX', eslintReactNativeTsx],
    ['type-checked TSX', eslintReactNativeTsxTypeChecked],
  ])('configures the React Native %s runtime without broad environment globals', (_, config) => {
    const configuredGlobals = Object.assign(
      {},
      ...config.map((entry) => entry.languageOptions?.globals ?? {}),
    );

    expect(configuredGlobals).toHaveProperty('__DEV__');
    expect(configuredGlobals).toHaveProperty('fetch');
    expect(configuredGlobals).toHaveProperty('process');
    expect(configuredGlobals).not.toHaveProperty('document');
    expect(configuredGlobals).not.toHaveProperty('__dirname');
  });

  it.each([
    ['JSX', eslintReactNativeJsx],
    ['TSX', eslintReactNativeTsx],
    ['type-checked TSX', eslintReactNativeTsxTypeChecked],
  ])('enables the complete recommended React Hooks rules for React Native %s', (_, config) => {
    const nativeConfig = config.find((entry) =>
      entry.name?.startsWith('super-configs/react-native'),
    );

    expect(nativeConfig?.rules?.['react-hooks/rules-of-hooks']).toBe('error');
    expect(nativeConfig?.rules?.['react-hooks/immutability']).toBe('error');
    expect(nativeConfig?.plugins).not.toHaveProperty('jsx-a11y');
  });

  it('accepts native globals and function component declarations', async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: eslintReactNativeTsx,
    });
    const [result] = await eslint.lintText(
      [
        "import { View } from 'react-native';",
        'export default function Screen() {',
        '  if (__DEV__) {',
        '    console.log(fetch);',
        '  }',
        '  return <View />;',
        '}',
      ].join('\n'),
      { filePath: 'src/Screen.native.tsx' },
    );

    expect(result.messages).toEqual([]);
  });

  it('rejects browser-only globals and React Native deep imports', async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: eslintReactNativeJsx,
    });
    const [result] = await eslint.lintText(
      [
        "import View from 'react-native/Libraries/Components/View/View';",
        'export const Screen = () => <View title={document.title} />;',
      ].join('\n'),
      { filePath: 'src/Screen.android.jsx' },
    );

    expect(result.messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ruleId: 'no-restricted-imports', severity: 2 }),
        expect.objectContaining({ ruleId: 'no-undef', severity: 2 }),
      ]),
    );
  });

  it('enables project-service rules for type-checked React Native', () => {
    expect(
      eslintReactNativeTsxTypeChecked.some(
        (entry) => entry.languageOptions?.parserOptions?.projectService === true,
      ),
    ).toBe(true);
    expect(
      eslintReactNativeTsxTypeChecked.some(
        (entry) => entry.rules?.['@typescript-eslint/no-floating-promises'] === 'error',
      ),
    ).toBe(true);
    expect(
      eslintReactNativeTsxTypeChecked.every((entry) => entry.files?.includes('**/*.tsx')),
    ).toBe(true);
  });

  it('exports the legacy Prettier configuration', () => {
    expect(prettierConfig).toMatchObject({
      printWidth: 100,
      singleQuote: true,
    });
  });

  it('re-exports the shared Vitest configuration', () => {
    expect(sharedVitestConfig).toMatchObject({
      test: {
        globals: true,
        environment: 'node',
        coverage: {
          reporter: ['text', 'json', 'html'],
        },
      },
    });
  });
});

describe('createEslintConfig', () => {
  it('creates the default Node.js TypeScript preset', () => {
    const config = createEslintConfig();
    const customConfig = config.at(-1);

    expect(customConfig?.name).toBe('super-configs/node-ts');
    expect(customConfig?.languageOptions?.globals).toHaveProperty('process');
    expect(customConfig?.languageOptions?.parserOptions).toBeUndefined();
  });

  it.each([
    ['browser', 'window'],
    ['bun', 'Bun'],
    ['node', 'process'],
  ] as const)('creates a JavaScript preset for the %s runtime', (runtime, globalName) => {
    const config = createEslintConfig({ runtime, language: 'js' });
    const customConfig = config.at(-1);

    expect(customConfig?.name).toBe(`super-configs/${runtime}-js`);
    expect(customConfig?.languageOptions?.globals).toHaveProperty(globalName);
  });

  it('creates a type-checked preset scoped to TypeScript files', () => {
    const config = createEslintConfig({ runtime: 'browser', typeChecked: true });
    const customConfig = config.at(-1);

    expect(customConfig?.name).toBe('super-configs/browser-ts-type-checked');
    expect(customConfig?.files).toEqual(['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts']);
    expect(customConfig?.languageOptions?.parserOptions).toEqual({ projectService: true });
    expect(config.slice(0, -1).every((item) => item.files !== undefined)).toBe(true);
  });

  it('places ignores before the preset and overrides after it', () => {
    const override = { name: 'consumer/override', rules: { eqeqeq: 'off' as const } };
    const config = createEslintConfig({
      ignores: ['generated/**'],
      overrides: [override],
    });

    expect(config[0]).toEqual({ name: 'super-configs/ignores', ignores: ['generated/**'] });
    expect(config.at(-1)).toBe(override);
  });

  it('rejects type-aware linting for JavaScript', () => {
    expect(() => createEslintConfig({ language: 'js', typeChecked: true } as never)).toThrowError(
      'typeChecked is only supported when language is "ts"',
    );
  });

  it.each([
    ['vitest', 'super-configs/vitest'],
    ['jest', 'super-configs/jest'],
  ] as const)('appends the %s companion preset', (testFramework, expectedName) => {
    const config = createEslintConfig({ testFramework });
    const companionConfig = config.at(-1);

    expect(companionConfig?.name).toBe(expectedName);
    expect(companionConfig?.files).toEqual([
      '**/*.test.{js,jsx,ts,tsx}',
      '**/*.spec.{js,jsx,ts,tsx}',
    ]);
    expect(config.some((item) => item.name === 'super-configs/node-ts')).toBe(true);
  });

  it('keeps overrides after the companion preset', () => {
    const override = { name: 'consumer/override', rules: { eqeqeq: 'off' as const } };
    const config = createEslintConfig({ testFramework: 'vitest', overrides: [override] });

    expect(config.at(-1)).toBe(override);
    expect(config.at(-2)?.name).toBe('super-configs/vitest');
  });

  it.each([
    ['ts', 'super-configs/react-tsx'],
    ['js', 'super-configs/react-jsx'],
  ] as const)('replaces the base preset with React for %s', (language, expectedName) => {
    const config = createEslintConfig({ language, react: true });

    expect(config.at(-1)?.name).toBe(expectedName);
    expect(config.some((item) => item.name?.startsWith('super-configs/node-'))).toBe(false);
  });

  it.each([
    ['ts', false, 'super-configs/react-native-tsx'],
    ['ts', true, 'super-configs/react-native-tsx-type-checked'],
    ['js', false, 'super-configs/react-native-jsx'],
  ] as const)('creates the React Native %s preset with typeChecked=%s', (language, typeChecked, expectedName) => {
    const config = createEslintConfig({ language, reactNative: true, typeChecked });

    expect(config.at(-1)?.name).toBe(expectedName);
    expect(config.some((item) => item.name?.startsWith('super-configs/node-'))).toBe(false);
  });

  it('rejects enabling React web and React Native together', () => {
    expect(() => createEslintConfig({ react: true, reactNative: true })).toThrowError(
      'react and reactNative cannot be enabled together',
    );
  });

  it('combines React with a companion test preset', () => {
    const config = createEslintConfig({
      react: true,
      testFramework: 'jest',
      ignores: ['dist/**'],
    });

    expect(config[0]).toEqual({ name: 'super-configs/ignores', ignores: ['dist/**'] });
    expect(config.some((item) => item.name === 'super-configs/react-tsx')).toBe(true);
    expect(config.at(-1)?.name).toBe('super-configs/jest');
  });

  it('rejects type-aware linting for React', () => {
    expect(() => createEslintConfig({ react: true, typeChecked: true })).toThrowError(
      'typeChecked is not supported when react is enabled',
    );
  });
});
