import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxAccessibility from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import type { Linter } from 'eslint';

const eslintReactTsxConfig: Linter.Config[] = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    name: 'super-configs/react-tsx',
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: true,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      '@typescript-eslint': tseslint.plugin,
      'jsx-a11y': jsxAccessibility,
      import: importPlugin,
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true }],
      curly: ['error', 'all'],
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];

export default eslintReactTsxConfig;
