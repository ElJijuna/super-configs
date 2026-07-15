import type { Linter } from 'eslint';
import { bunGlobals } from '../../runtime-globals.js';
import { createEslintTsConfig } from '../../ts/create-config.js';

const eslintBunTsConfig: Linter.Config[] = createEslintTsConfig('super-configs/bun-ts', bunGlobals);

export default eslintBunTsConfig;
