import type { Linter } from 'eslint';

type RestrictedSyntaxRestriction = {
  selector: string;
  message: string;
};

export const preferAsyncAwaitRestrictions: RestrictedSyntaxRestriction[] = [
  {
    selector: 'CallExpression[callee.property.name="then"]',
    message: 'Use async/await instead of Promise.then().',
  },
  {
    selector: 'CallExpression[callee.property.name="catch"]',
    message: 'Use try/catch with async/await instead of Promise.catch().',
  },
];

export const preferAsyncAwaitRule: Linter.RuleEntry = ['error', ...preferAsyncAwaitRestrictions];
