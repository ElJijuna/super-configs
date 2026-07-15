import type { Linter } from 'eslint';
import { createEslintJsConfig } from '../../js/create-config.js';
import { bunGlobals } from '../../runtime-globals.js';

const eslintBunJsConfig: Linter.Config[] = createEslintJsConfig('super-configs/bun-js', bunGlobals);

export default eslintBunJsConfig;
