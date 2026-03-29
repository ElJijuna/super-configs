import type { Config } from 'prettier';

const prettierConfig: Config = {
    semi: true,
    singleQuote: true,
    printWidth: 100,
    tabWidth: 2,
    trailingComma: 'es5',
    bracketSpacing: true,
    arrowParens: 'avoid',
    endOfLine: 'auto',
};

export default prettierConfig;
