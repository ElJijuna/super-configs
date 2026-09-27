import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
      reporter: ['text', 'json', 'html'],
    },
  },
});
