import type { Linter } from 'eslint';
import { bunGlobals } from '@/eslint/runtime-globals.js';
import { createEslintTsConfig } from '@/eslint/ts/create-config.js';

const eslintBunTsTypeCheckedConfig: Linter.Config[] = createEslintTsConfig(
  'super-configs/bun-ts-type-checked',
  bunGlobals,
  { typeChecked: true },
);

export default eslintBunTsTypeCheckedConfig;
