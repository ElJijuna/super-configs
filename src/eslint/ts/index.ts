import type { Linter } from 'eslint';
import { nodeGlobals } from '@/eslint/runtime-globals.js';
import { createEslintTsConfig } from '@/eslint/ts/create-config.js';

const eslintTsConfig: Linter.Config[] = createEslintTsConfig('super-configs/ts', nodeGlobals);

export default eslintTsConfig;
