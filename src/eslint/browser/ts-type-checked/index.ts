import type { Linter } from 'eslint';
import { browserGlobals } from '@/eslint/runtime-globals.js';
import { createEslintTsConfig } from '@/eslint/ts/create-config.js';

const eslintBrowserTsTypeCheckedConfig: Linter.Config[] = createEslintTsConfig(
  'super-configs/browser-ts-type-checked',
  browserGlobals,
  { typeChecked: true },
);

export default eslintBrowserTsTypeCheckedConfig;
