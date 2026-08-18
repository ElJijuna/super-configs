import { createRequire } from 'node:module';
import { fixupPluginRules } from '@eslint/compat';
import js from '@eslint/js';
import type { Linter } from 'eslint';
import tseslint from 'typescript-eslint';
import { preferAsyncAwaitRestrictions } from '@/eslint/async-await.js';
import { eslint9RecommendedCompatibilityRules } from '@/eslint/eslint-9-recommended.js';
import {
  preferBracketNotationDestructuringRestriction,
  preferDestructuringRule,
} from '@/eslint/prefer-destructuring.js';
import { preferProcessEnvDestructuringRestriction } from '@/eslint/process-env.js';

interface CreateEslintNextConfigOptions {
  typeChecked?: boolean;
}

const typeScriptFiles = ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'];
const recommendedTypeCheckedRules: Linter.RulesRecord = Object.assign(
  {},
  ...tseslint.configs.recommendedTypeChecked.map((config) => config.rules ?? {}),
);
const require = createRequire(import.meta.url);

let compatibleNextConfig: Linter.Config[] | undefined;

const getCompatibleNextConfig = (): Linter.Config[] => {
  if (compatibleNextConfig !== undefined) {
    return compatibleNextConfig;
  }

  const nextCoreWebVitalsConfig = require('eslint-config-next/core-web-vitals') as Linter.Config[];
  const nextTypeScriptConfig = require('eslint-config-next/typescript') as Linter.Config[];

  compatibleNextConfig = [...nextCoreWebVitalsConfig, ...nextTypeScriptConfig].map((config) => {
    const { plugins } = config;

    if (plugins === undefined) {
      return config;
    }

    const compatiblePlugins = Object.fromEntries(
      Object.entries(plugins).map(([name, plugin]) => [name, fixupPluginRules(plugin)]),
    );
    const usesTypeScript = plugins['@typescript-eslint'] !== undefined;

    return {
      ...config,
      plugins: {
        ...compatiblePlugins,
        ...(usesTypeScript ? { '@typescript-eslint': tseslint.plugin } : {}),
      },
      ...(usesTypeScript
        ? {
            languageOptions: {
              ...config.languageOptions,
              parser: tseslint.parser,
            },
          }
        : {}),
    };
  });

  return compatibleNextConfig;
};
const sharedRules: Linter.RulesRecord = {
  ...eslint9RecommendedCompatibilityRules,
  curly: ['error', 'all'],
  eqeqeq: ['error', 'always'],
  'prefer-destructuring': preferDestructuringRule,
  'react/function-component-definition': [
    'error',
    {
      namedComponents: 'arrow-function',
      unnamedComponents: 'arrow-function',
    },
  ],
  'no-restricted-imports': [
    'error',
    {
      paths: [
        {
          name: 'react',
          importNames: ['default'],
          message: 'Import React APIs directly instead of using the default React namespace.',
        },
      ],
    },
  ],
  'no-restricted-syntax': [
    'error',
    preferProcessEnvDestructuringRestriction,
    preferBracketNotationDestructuringRestriction,
    ...preferAsyncAwaitRestrictions,
    {
      selector: 'TSQualifiedName[left.name="React"]',
      message: 'Import the type directly instead of using React.X',
    },
    {
      selector: 'CallExpression[callee.object.name="React"][callee.property.name="createElement"]',
      message: 'Import createElement directly instead of using React.createElement.',
    },
  ],
};

export const createEslintNextConfig = (
  options: CreateEslintNextConfigOptions = {},
): Linter.Config[] => {
  const { typeChecked = false } = options;

  return [
    js.configs.recommended,
    ...getCompatibleNextConfig(),
    {
      name: `super-configs/next${typeChecked ? '-type-checked' : ''}`,
      rules: sharedRules,
    },
    {
      name: `super-configs/next-ts${typeChecked ? '-type-checked' : ''}`,
      files: typeScriptFiles,
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          ...(typeChecked ? { projectService: true } : {}),
        },
      },
      plugins: {
        '@typescript-eslint': tseslint.plugin,
      },
      rules: {
        ...(typeChecked ? recommendedTypeCheckedRules : {}),
        '@typescript-eslint/consistent-type-imports': [
          'error',
          { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
        ],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      },
    },
  ];
};
