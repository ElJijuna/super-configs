import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import type { Linter } from 'eslint';
import globals from 'globals';
import { preferAsyncAwaitRestrictions } from '../async-await.js';
import { eslint9RecommendedCompatibilityRules } from '../eslint-9-recommended.js';
import {
  preferBracketNotationDestructuringRestriction,
  preferDestructuringRule,
} from '../prefer-destructuring.js';
import { preferProcessEnvDestructuringRestriction } from '../process-env.js';

export const createEslintJsConfig = (
  name: string,
  runtimeGlobals: Linter.Globals,
): Linter.Config[] => [
  js.configs.recommended,
  {
    name,
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...runtimeGlobals,
        ...globals.es2021,
      },
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      ...eslint9RecommendedCompatibilityRules,
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'always', prev: '*', next: 'block-like' },
        { blankLine: 'always', prev: 'const', next: '*' },
        { blankLine: 'never', prev: 'const', next: 'const' },
        { blankLine: 'always', prev: 'let', next: '*' },
        { blankLine: 'never', prev: 'let', next: 'let' },
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: '*', next: 'throw' },
      ],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'prefer-destructuring': preferDestructuringRule,
      'no-restricted-syntax': [
        'error',
        preferProcessEnvDestructuringRestriction,
        preferBracketNotationDestructuringRestriction,
        ...preferAsyncAwaitRestrictions,
      ],
    },
  },
];
