import type { Linter } from 'eslint';
import { browserGlobals } from '@/eslint/runtime-globals.js';
import { createEslintTsConfig } from '@/eslint/ts/create-config.js';

const eslintBrowserTsConfig: Linter.Config[] = createEslintTsConfig(
  'super-configs/browser-ts',
  browserGlobals,
);

export default eslintBrowserTsConfig;
