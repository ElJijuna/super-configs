import type { Linter } from 'eslint';
import { browserGlobals } from '../../runtime-globals.js';
import { createEslintTsConfig } from '../../ts/create-config.js';

const eslintBrowserTsConfig: Linter.Config[] = createEslintTsConfig(
  'super-configs/browser-ts',
  browserGlobals,
);

export default eslintBrowserTsConfig;
