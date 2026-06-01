import type { Config } from 'prettier';

const prettierConfig: Config = {
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',
};

export default prettierConfig;
