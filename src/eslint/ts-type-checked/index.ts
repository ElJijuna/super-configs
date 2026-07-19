import type { Linter } from 'eslint';
import { nodeGlobals } from '@/eslint/runtime-globals.js';
import { createEslintTsConfig } from '@/eslint/ts/create-config.js';

const eslintTsTypeCheckedConfig: Linter.Config[] = createEslintTsConfig(
  'super-configs/ts-type-checked',
  nodeGlobals,
  { typeChecked: true },
);

export default eslintTsTypeCheckedConfig;
