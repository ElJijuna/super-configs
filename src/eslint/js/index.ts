import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import type { Linter } from 'eslint';

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
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      quotes: ['error', 'single', { avoidEscape: true }],
      curly: ['error', 'all'],
    },
  },
];

export default eslintJsConfig;
