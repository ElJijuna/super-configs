import type { Linter } from 'eslint';
import eslintExpoConfig from '@/eslint/expo/index.js';
import eslintExpoTypeCheckedConfig from '@/eslint/expo/type-checked/index.js';
import eslintJestConfig from '@/eslint/jest/index.js';
import { createEslintJsConfig } from '@/eslint/js/create-config.js';
import { createEslintNextConfig } from '@/eslint/next/create-config.js';
import eslintReactJsxConfig from '@/eslint/react/jsx/index.js';
import eslintReactTsxConfig from '@/eslint/react/tsx/index.js';
import eslintReactTsxTypeCheckedConfig from '@/eslint/react/tsx-type-checked/index.js';
import eslintReactNativeJsxConfig from '@/eslint/react-native/jsx/index.js';
import eslintReactNativeTsxConfig from '@/eslint/react-native/tsx/index.js';
import eslintReactNativeTsxTypeCheckedConfig from '@/eslint/react-native/tsx-type-checked/index.js';
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
  expo?: boolean;
  next?: boolean;
  react?: boolean;
  reactNative?: boolean;
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
const getReactConfig = (language: EslintLanguage, typeChecked: boolean): Linter.Config[] => {
  if (language === 'js') {
    return eslintReactJsxConfig;
  }

  return typeChecked ? eslintReactTsxTypeCheckedConfig : eslintReactTsxConfig;
};
const getReactNativeConfig = (language: EslintLanguage, typeChecked: boolean): Linter.Config[] => {
  if (language === 'js') {
    return eslintReactNativeJsxConfig;
  }

  return typeChecked ? eslintReactNativeTsxTypeCheckedConfig : eslintReactNativeTsxConfig;
};
const getTestFrameworkConfig = (testFramework: EslintTestFramework): Linter.Config[] =>
  testFramework === 'jest' ? eslintJestConfig : eslintVitestConfig;
const getExpoConfig = (typeChecked: boolean): Linter.Config[] =>
  typeChecked ? eslintExpoTypeCheckedConfig : eslintExpoConfig;
const getNextConfig = (typeChecked: boolean): Linter.Config[] =>
  createEslintNextConfig({ typeChecked });

export const createEslintConfig = (options: CreateEslintConfigOptions = {}): Linter.Config[] => {
  const {
    runtime = 'node',
    language = 'ts',
    typeChecked = false,
    ignores = [],
    overrides = [],
    expo = false,
    next = false,
    react = false,
    reactNative = false,
    testFramework,
  } = options;

  if (language === 'js' && typeChecked) {
    throw new TypeError('typeChecked is only supported when language is "ts"');
  }

  if ([expo, next, react, reactNative].filter(Boolean).length > 1) {
    throw new TypeError('expo, next, react, and reactNative cannot be enabled together');
  }

  const runtimeGlobals = getRuntimeGlobals(runtime);
  const name = `super-configs/${runtime}-${language}${typeChecked ? '-type-checked' : ''}`;
  const baseConfig = expo
    ? getExpoConfig(typeChecked)
    : next
      ? getNextConfig(typeChecked)
      : react
        ? getReactConfig(language, typeChecked)
        : reactNative
          ? getReactNativeConfig(language, typeChecked)
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
