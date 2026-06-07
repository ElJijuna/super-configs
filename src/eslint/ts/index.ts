import js from '@eslint/js';
import type { Linter } from 'eslint';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { preferAsyncAwaitRestrictions } from '../async-await.js';
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
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'no-restricted-syntax': [
        'error',
        preferProcessEnvDestructuringRestriction,
        ...preferAsyncAwaitRestrictions,
      ],
    },
  },
];

export default eslintTsConfig;
