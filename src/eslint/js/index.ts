import type { Linter } from 'eslint';
import { nodeGlobals } from '../runtime-globals.js';
import { createEslintJsConfig } from './create-config.js';

const eslintJsConfig: Linter.Config[] = createEslintJsConfig('super-configs/js', nodeGlobals);

export default eslintJsConfig;
