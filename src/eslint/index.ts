import type { Linter } from 'eslint';
import { createEslintJsConfig } from '@/eslint/js/create-config.js';
import { browserGlobals, bunGlobals, nodeGlobals } from '@/eslint/runtime-globals.js';
import { createEslintTsConfig } from '@/eslint/ts/create-config.js';

export type EslintRuntime = 'node' | 'browser' | 'bun';
export type EslintLanguage = 'js' | 'ts';

interface CreateEslintConfigBaseOptions {
  runtime?: EslintRuntime;
  ignores?: string[];
  overrides?: Linter.Config[];
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

export const createEslintConfig = (options: CreateEslintConfigOptions = {}): Linter.Config[] => {
  const {
    runtime = 'node',
    language = 'ts',
    typeChecked = false,
    ignores = [],
    overrides = [],
  } = options;

  if (language === 'js' && typeChecked) {
    throw new TypeError('typeChecked is only supported when language is "ts"');
  }

  const runtimeGlobals = getRuntimeGlobals(runtime);
  const name = `super-configs/${runtime}-${language}${typeChecked ? '-type-checked' : ''}`;
  const baseConfig =
    language === 'js'
      ? createEslintJsConfig(name, runtimeGlobals)
      : createEslintTsConfig(name, runtimeGlobals, { typeChecked });

  return [
    ...(ignores.length > 0 ? [{ name: 'super-configs/ignores', ignores }] : []),
    ...baseConfig,
    ...overrides,
  ];
};
