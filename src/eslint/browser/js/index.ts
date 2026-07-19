import type { Linter } from 'eslint';
import { createEslintJsConfig } from '@/eslint/js/create-config.js';
import { browserGlobals } from '@/eslint/runtime-globals.js';

const eslintBrowserJsConfig: Linter.Config[] = createEslintJsConfig(
  'super-configs/browser-js',
  browserGlobals,
);

export default eslintBrowserJsConfig;
