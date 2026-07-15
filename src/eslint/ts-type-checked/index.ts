import type { Linter } from 'eslint';
import { nodeGlobals } from '../runtime-globals.js';
import { createEslintTsConfig } from '../ts/create-config.js';

const eslintTsTypeCheckedConfig: Linter.Config[] = createEslintTsConfig(
  'super-configs/ts-type-checked',
  nodeGlobals,
  { typeChecked: true },
);

export default eslintTsTypeCheckedConfig;
