import js from '@eslint/js';
import type { Linter } from 'eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { preferProcessEnvDestructuringRestriction } from '../../process-env.js';

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
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
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
        {
          selector: 'TSQualifiedName[left.name="React"]',
          message: 'Import the type directly instead of using React.X',
        },
        {
          selector: 'FunctionDeclaration[id.name=/^[A-Z]/]',
          message: 'Use an arrow function for React components.',
        },
        {
          selector: 'VariableDeclarator[id.name=/^[A-Z]/][init.type="FunctionExpression"]',
          message: 'Use an arrow function for React components.',
        },
        {
          selector: 'ExportDefaultDeclaration[declaration.type="FunctionDeclaration"]',
          message: 'Use an arrow function for React components.',
        },
        {
          selector:
            'CallExpression[callee.object.name="React"][callee.property.name="createElement"]',
          message: 'Import createElement directly instead of using React.createElement.',
        },
      ],
    },
  },
];

export default eslintReactTsxConfig;
