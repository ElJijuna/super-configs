import { defineConfig } from 'eslint/config';
import eslintTsConfig from './src/eslint/ts/index.ts';

export default defineConfig([
  {
    name: 'super-configs/ignores',
    ignores: ['lib/**', 'coverage/**', 'node_modules/**'],
  },
  ...eslintTsConfig,
]);
