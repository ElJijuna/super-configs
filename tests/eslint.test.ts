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
});
