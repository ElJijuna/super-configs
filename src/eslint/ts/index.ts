import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import type { Linter } from 'eslint';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { preferAsyncAwaitRestrictions } from '../async-await.js';
import {
  preferBracketNotationDestructuringRestriction,
  preferDestructuringRule,
} from '../prefer-destructuring.js';
import { preferProcessEnvDestructuringRestriction } from '../process-env.js';

const eslintTsConfig: Linter.Config[] = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    name: 'super-configs/ts',
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
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
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
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

export default eslintTsConfig;
