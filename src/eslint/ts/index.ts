import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import type { Linter } from 'eslint';

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
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true }],
      curly: ['error', 'all'],
    },
  },
];

export default eslintTsConfig;
