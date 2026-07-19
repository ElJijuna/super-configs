import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { tsconfigPaths: true });
const eslintTsConfig = await jiti.import<Linter.Config[]>('@/eslint/ts/index.ts', {
  default: true,
});

export default defineConfig([
  {
    name: 'super-configs/ignores',
    ignores: ['lib/**', 'coverage/**', 'node_modules/**'],
  },
  ...eslintTsConfig,
]);
