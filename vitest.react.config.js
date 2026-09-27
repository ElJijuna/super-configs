import { mergeConfig } from 'vitest/config';
import vitestConfig from './vitest.config.js';

export default mergeConfig(vitestConfig, {
  test: {
    environment: 'jsdom',
  },
});
