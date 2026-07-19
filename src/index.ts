// ESLint Configurations

export { default as eslintBrowserJs } from '@/eslint/browser/js/index.js';
export { default as eslintBrowserTs } from '@/eslint/browser/ts/index.js';
export { default as eslintBrowserTsTypeChecked } from '@/eslint/browser/ts-type-checked/index.js';
export { default as eslintBunJs } from '@/eslint/bun/js/index.js';
export { default as eslintBunTs } from '@/eslint/bun/ts/index.js';
export { default as eslintBunTsTypeChecked } from '@/eslint/bun/ts-type-checked/index.js';
export type {
  CreateEslintConfigOptions,
  EslintLanguage,
  EslintRuntime,
} from '@/eslint/index.js';
export { createEslintConfig } from '@/eslint/index.js';
export { default as eslintJest } from '@/eslint/jest/index.js';
export { default as eslintJs } from '@/eslint/js/index.js';
export { default as eslintNodeJs } from '@/eslint/node/js/index.js';
export { default as eslintNodeTs } from '@/eslint/node/ts/index.js';
export { default as eslintNodeTsTypeChecked } from '@/eslint/node/ts-type-checked/index.js';
export { default as eslintReactJsx } from '@/eslint/react/jsx/index.js';
export { default as eslintReactTsx } from '@/eslint/react/tsx/index.js';
export { default as eslintTs } from '@/eslint/ts/index.js';
export { default as eslintTsTypeChecked } from '@/eslint/ts-type-checked/index.js';
export { default as eslintVitest } from '@/eslint/vitest/index.js';

// Prettier Configuration
export { default as prettierConfig } from '@/prettier/index.js';
