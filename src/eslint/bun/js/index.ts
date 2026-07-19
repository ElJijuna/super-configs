import type { Linter } from 'eslint';
import { createEslintJsConfig } from '@/eslint/js/create-config.js';
import { bunGlobals } from '@/eslint/runtime-globals.js';

const eslintBunJsConfig: Linter.Config[] = createEslintJsConfig('super-configs/bun-js', bunGlobals);

export default eslintBunJsConfig;
