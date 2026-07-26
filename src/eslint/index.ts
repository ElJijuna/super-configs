import type { Linter } from 'eslint';
import eslintJestConfig from '@/eslint/jest/index.js';
import { createEslintJsConfig } from '@/eslint/js/create-config.js';
import eslintReactJsxConfig from '@/eslint/react/jsx/index.js';
import eslintReactTsxConfig from '@/eslint/react/tsx/index.js';
import { browserGlobals, bunGlobals, nodeGlobals } from '@/eslint/runtime-globals.js';
import { createEslintTsConfig } from '@/eslint/ts/create-config.js';
import eslintVitestConfig from '@/eslint/vitest/index.js';

export type EslintRuntime = 'node' | 'browser' | 'bun';
export type EslintLanguage = 'js' | 'ts';
export type EslintTestFramework = 'vitest' | 'jest';

interface CreateEslintConfigBaseOptions {
  runtime?: EslintRuntime;
  ignores?: string[];
  overrides?: Linter.Config[];
  react?: boolean;
  testFramework?: EslintTestFramework;
}

export type CreateEslintConfigOptions =
  | (CreateEslintConfigBaseOptions & {
      language?: 'ts';
      typeChecked?: boolean;
    })
  | (CreateEslintConfigBaseOptions & {
      language: 'js';
      typeChecked?: false;
    });

const getRuntimeGlobals = (runtime: EslintRuntime): Linter.Globals => {
  switch (runtime) {
    case 'browser':
      return browserGlobals;
    case 'bun':
      return bunGlobals;
    case 'node':
      return nodeGlobals;
  }
};
const getReactConfig = (language: EslintLanguage): Linter.Config[] =>
  language === 'js' ? eslintReactJsxConfig : eslintReactTsxConfig;
const getTestFrameworkConfig = (testFramework: EslintTestFramework): Linter.Config[] =>
  testFramework === 'jest' ? eslintJestConfig : eslintVitestConfig;

export const createEslintConfig = (options: CreateEslintConfigOptions = {}): Linter.Config[] => {
  const {
    runtime = 'node',
    language = 'ts',
    typeChecked = false,
    ignores = [],
    overrides = [],
    react = false,
    testFramework,
  } = options;

  if (language === 'js' && typeChecked) {
    throw new TypeError('typeChecked is only supported when language is "ts"');
  }

  if (react && typeChecked) {
    throw new TypeError('typeChecked is not supported when react is enabled');
  }

  const runtimeGlobals = getRuntimeGlobals(runtime);
  const name = `super-configs/${runtime}-${language}${typeChecked ? '-type-checked' : ''}`;
  const baseConfig = react
    ? getReactConfig(language)
    : language === 'js'
      ? createEslintJsConfig(name, runtimeGlobals)
      : createEslintTsConfig(name, runtimeGlobals, { typeChecked });

  return [
    ...(ignores.length > 0 ? [{ name: 'super-configs/ignores', ignores }] : []),
    ...baseConfig,
    ...(testFramework === undefined ? [] : getTestFrameworkConfig(testFramework)),
    ...overrides,
  ];
};
