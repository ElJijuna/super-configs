import type { Linter } from 'eslint';
import { nodeGlobals } from '../runtime-globals.js';
import { createEslintTsConfig } from './create-config.js';

const eslintTsConfig: Linter.Config[] = createEslintTsConfig('super-configs/ts', nodeGlobals);

export default eslintTsConfig;
