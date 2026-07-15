import type { Linter } from 'eslint';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const eslintVitestConfig: Linter.Config[] = [
  {
    name: 'super-configs/vitest',
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.vitest,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/no-namespace': 'off',
      curly: ['error', 'all'],
    },
  },
];

export default eslintVitestConfig;
