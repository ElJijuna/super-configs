import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import type { Linter } from 'eslint';
import importPlugin from 'eslint-plugin-import';
import jsxAccessibility from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import { blockSpacingRules } from '../../style.js';

const eslintReactJsxConfig: Linter.Config[] = [
  js.configs.recommended,
  {
    name: 'super-configs/react-jsx',
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@stylistic': stylistic,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxAccessibility,
      import: importPlugin,
    },
    rules: {
      ...blockSpacingRules,
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'jsx-quotes': ['error', 'prefer-double'],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSQualifiedName[left.name="React"]',
          message: 'Import the type directly instead of using React.X',
        },
      ],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
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

export default eslintReactJsxConfig;
