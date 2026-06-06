import js from '@eslint/js';
import type { Linter } from 'eslint';
import globals from 'globals';
import tseslint from 'typescript-eslint';

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
    },
  },
];

export default eslintTsConfig;
