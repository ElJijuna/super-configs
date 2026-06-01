import type { Linter } from 'eslint';

export const blockSpacingRules: Linter.RulesRecord = {
  '@stylistic/padding-line-between-statements': [
    'error',
    {
      blankLine: 'always',
      prev: ['if', 'for', 'while', 'do', 'switch', 'try'],
      next: '*',
    },
    {
      blankLine: 'always',
      prev: 'const',
      next: '*',
    },
    {
      blankLine: 'any',
      prev: 'const',
      next: 'const',
    },
  ],
};
