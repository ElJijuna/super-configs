import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import eslintTsConfig from './lib/eslint/ts/index.js';

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    name: 'super-configs/lint',
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  ...eslintTsConfig,
]);
