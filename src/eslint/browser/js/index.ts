import type { Linter } from 'eslint';
import { createEslintJsConfig } from '../../js/create-config.js';
import { browserGlobals } from '../../runtime-globals.js';

const eslintBrowserJsConfig: Linter.Config[] = createEslintJsConfig(
  'super-configs/browser-js',
  browserGlobals,
);

export default eslintBrowserJsConfig;
