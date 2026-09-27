import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vitest/config';
import sharedConfig from './vitest.config.js';

export default mergeConfig(sharedConfig, {
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    coverage: {
      thresholds: {
        branches: 96,
        functions: 96,
        lines: 96,
        statements: 96,
      },
    },
  },
});
