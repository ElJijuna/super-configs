import type { Linter } from 'eslint';

export const preferProcessEnvDestructuringRestriction = {
  selector:
    'MemberExpression[computed=true][object.object.name="process"][object.property.name="env"][property.type="Literal"]',
  message:
    'Destructure process.env instead of using bracket notation, e.g. const { NODE_ENV } = process.env.',
};

export const preferProcessEnvDestructuringRule: Linter.RuleEntry = [
  'error',
  preferProcessEnvDestructuringRestriction,
];
