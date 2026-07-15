import type { Linter } from 'eslint';
import { bunGlobals } from '../../runtime-globals.js';
import { createEslintTsConfig } from '../../ts/create-config.js';

const eslintBunTsTypeCheckedConfig: Linter.Config[] = createEslintTsConfig(
  'super-configs/bun-ts-type-checked',
  bunGlobals,
  { typeChecked: true },
);

export default eslintBunTsTypeCheckedConfig;
