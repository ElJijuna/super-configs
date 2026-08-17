import js from '@eslint/js';
import type { Linter } from 'eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import { preferAsyncAwaitRestrictions } from '@/eslint/async-await.js';
import { eslint9RecommendedCompatibilityRules } from '@/eslint/eslint-9-recommended.js';
import {
  preferBracketNotationDestructuringRestriction,
  preferDestructuringRule,
} from '@/eslint/prefer-destructuring.js';
import { preferProcessEnvDestructuringRestriction } from '@/eslint/process-env.js';
import { reactNativeGlobals } from '@/eslint/react-native/runtime-globals.js';

type ReactNativeLanguage = 'js' | 'ts';

const javaScriptFiles = ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs'];
const typeScriptFiles = ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'];
const reactHooksRecommendedConfig = (
  reactHooks.configs as Record<string, Record<string, Linter.Config>>
).flat.recommended;
const sharedRules: Linter.RulesRecord = {
  ...eslint9RecommendedCompatibilityRules,
  ...reactHooksRecommendedConfig.rules,
  curly: ['error', 'all'],
  eqeqeq: ['error', 'always'],
  'prefer-destructuring': preferDestructuringRule,
  'no-restricted-imports': [
    'error',
    {
      patterns: [
        {
          group: ['react-native/Libraries/**'],
          message: 'Import from the public react-native API instead of a deep internal path.',
        },
      ],
    },
  ],
  'no-restricted-syntax': [
    'error',
    preferProcessEnvDestructuringRestriction,
    preferBracketNotationDestructuringRestriction,
    ...preferAsyncAwaitRestrictions,
  ],
};
const createReactNativeConfigEntry = (
  language: ReactNativeLanguage,
  files: string[],
): Linter.Config<Linter.RulesRecord> => ({
  name: `super-configs/react-native-${language === 'js' ? 'jsx' : 'tsx'}`,
  files,
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    globals: reactNativeGlobals,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  plugins: {
    'react-hooks': reactHooks,
    ...(language === 'ts' ? { '@typescript-eslint': tseslint.plugin } : {}),
  },
  rules: {
    ...sharedRules,
    ...(language === 'js'
      ? { 'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }] }
      : {
          '@typescript-eslint/consistent-type-imports': [
            'error',
            { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
          ],
          '@typescript-eslint/explicit-module-boundary-types': 'off',
          '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        }),
  },
});

export const createEslintReactNativeConfig = (language: ReactNativeLanguage): Linter.Config[] => {
  const files = language === 'js' ? javaScriptFiles : typeScriptFiles;
  const baseConfigs = [
    js.configs.recommended,
    ...(language === 'ts' ? tseslint.configs.recommended : []),
  ];

  return [
    ...baseConfigs.map((config) => ({ ...config, files })),
    createReactNativeConfigEntry(language, files),
  ];
};
