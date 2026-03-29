import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxAccessibility from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import type { Linter } from 'eslint';

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
            react,
            'react-hooks': reactHooks,
            'jsx-a11y': jsxAccessibility,
            import: importPlugin,
            prettier,
        },
        rules: {
            'prettier/prettier': 'error',
            'react/prop-types': 'off',
            'react/react-in-jsx-scope': 'off',
            'no-unused-vars': 'warn',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            quotes: ['error', 'single', { avoidEscape: true }],
            curly: ['error', 'all'],
            'import/order': [
                'warn',
                {
                    groups: ['builtin', 'external', 'internal'],
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
