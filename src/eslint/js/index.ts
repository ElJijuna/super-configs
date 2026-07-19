import type { Linter } from 'eslint';
import { createEslintJsConfig } from '@/eslint/js/create-config.js';
import { nodeGlobals } from '@/eslint/runtime-globals.js';

const eslintJsConfig: Linter.Config[] = createEslintJsConfig('super-configs/js', nodeGlobals);

export default eslintJsConfig;
