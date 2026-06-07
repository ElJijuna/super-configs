import js from '@eslint/js';
import type { Linter } from 'eslint';
import globals from 'globals';
import { preferProcessEnvDestructuringRule } from '../process-env.js';

const eslintJsConfig: Linter.Config[] = [
  js.configs.recommended,
  {
    name: 'super-configs/js',
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'no-restricted-syntax': preferProcessEnvDestructuringRule,
    },
  },
];

export default eslintJsConfig;
