import type { Linter } from 'eslint';

export const preferDestructuringRule: Linter.RuleEntry = [
  'error',
  {
    VariableDeclarator: {
      array: true,
      object: true,
    },
    AssignmentExpression: {
      array: true,
      object: true,
    },
  },
  {
    enforceForRenamedProperties: false,
  },
];

export const preferBracketNotationDestructuringRestriction = {
  selector: [
    'VariableDeclarator[init.type="MemberExpression"][init.computed=true][init.property.type="Literal"][init.property.value=/^[$A-Z_a-z][$\\w]*$/]',
    'VariableDeclarator[init.type="TSAsExpression"][init.expression.type="MemberExpression"][init.expression.computed=true][init.expression.property.type="Literal"][init.expression.property.value=/^[$A-Z_a-z][$\\w]*$/]',
    'VariableDeclarator[init.type="TSTypeAssertion"][init.expression.type="MemberExpression"][init.expression.computed=true][init.expression.property.type="Literal"][init.expression.property.value=/^[$A-Z_a-z][$\\w]*$/]',
    'AssignmentExpression[right.type="MemberExpression"][right.computed=true][right.property.type="Literal"][right.property.value=/^[$A-Z_a-z][$\\w]*$/]',
    'AssignmentExpression[right.type="TSAsExpression"][right.expression.type="MemberExpression"][right.expression.computed=true][right.expression.property.type="Literal"][right.expression.property.value=/^[$A-Z_a-z][$\\w]*$/]',
    'AssignmentExpression[right.type="TSTypeAssertion"][right.expression.type="MemberExpression"][right.expression.computed=true][right.expression.property.type="Literal"][right.expression.property.value=/^[$A-Z_a-z][$\\w]*$/]',
    'AssignmentPattern[right.type="MemberExpression"][right.computed=true][right.property.type="Literal"][right.property.value=/^[$A-Z_a-z][$\\w]*$/]',
    'AssignmentPattern[right.type="TSAsExpression"][right.expression.type="MemberExpression"][right.expression.computed=true][right.expression.property.type="Literal"][right.expression.property.value=/^[$A-Z_a-z][$\\w]*$/]',
    'AssignmentPattern[right.type="TSTypeAssertion"][right.expression.type="MemberExpression"][right.expression.computed=true][right.expression.property.type="Literal"][right.expression.property.value=/^[$A-Z_a-z][$\\w]*$/]',
    'Property[value.type="MemberExpression"][value.computed=true][value.property.type="Literal"][value.property.value=/^[$A-Z_a-z][$\\w]*$/]',
    'Property[value.type="TSAsExpression"][value.expression.type="MemberExpression"][value.expression.computed=true][value.expression.property.type="Literal"][value.expression.property.value=/^[$A-Z_a-z][$\\w]*$/]',
    'Property[value.type="TSTypeAssertion"][value.expression.type="MemberExpression"][value.expression.computed=true][value.expression.property.type="Literal"][value.expression.property.value=/^[$A-Z_a-z][$\\w]*$/]',
  ].join(', '),
  message: 'Destructure object properties before using bracket notation, e.g. const { name } = c.',
};
