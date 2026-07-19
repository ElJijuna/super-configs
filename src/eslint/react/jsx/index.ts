import { fixupPluginRules } from '@eslint/compat';
import js from '@eslint/js';
import type { Linter } from 'eslint';
import jsxAccessibility from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import { preferAsyncAwaitRestrictions } from '../../async-await.js';
import { eslint9RecommendedCompatibilityRules } from '../../eslint-9-recommended.js';
import {
  preferBracketNotationDestructuringRestriction,
  preferDestructuringRule,
} from '../../prefer-destructuring.js';
import { preferProcessEnvDestructuringRestriction } from '../../process-env.js';

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
      react: fixupPluginRules(react),
      'react-hooks': reactHooks,
      'jsx-a11y': fixupPluginRules(jsxAccessibility),
    },
    rules: {
      ...eslint9RecommendedCompatibilityRules,
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'prefer-destructuring': preferDestructuringRule,
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
          selector:
            'CallExpression[callee.object.name="React"][callee.property.name="createElement"]',
          message: 'Import createElement directly instead of using React.createElement.',
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
