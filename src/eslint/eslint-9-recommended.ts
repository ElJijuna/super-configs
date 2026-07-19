import type { Linter } from 'eslint';

/** Preserve the ESLint 9 `eslint:recommended` rule set when running on ESLint 10. */
export const eslint9RecommendedCompatibilityRules: Linter.RulesRecord = {
  'no-unassigned-vars': 'off',
  'no-useless-assignment': 'off',
  'preserve-caught-error': 'off',
};
