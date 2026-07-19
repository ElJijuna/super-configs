# super-configs

<p align="center">
  <img src="https://raw.githubusercontent.com/ElJijuna/super-configs/main/public/assets/super-configs.png" alt="super-configs logo" width="160" />
</p>

[![npm version](https://img.shields.io/npm/v/super-configs.svg)](https://www.npmjs.com/package/super-configs)
[![npm downloads](https://img.shields.io/npm/dm/super-configs.svg)](https://www.npmjs.com/package/super-configs)
[![license](https://img.shields.io/npm/l/super-configs.svg)](./LICENSE)
[![CI](https://github.com/ElJijuna/super-configs/actions/workflows/ci.yml/badge.svg)](https://github.com/ElJijuna/super-configs/actions/workflows/ci.yml)
[![Release](https://github.com/ElJijuna/super-configs/actions/workflows/publish.yml/badge.svg)](https://github.com/ElJijuna/super-configs/actions/workflows/publish.yml)
[![semantic-release](https://img.shields.io/badge/release-semantic--release-e10079?logo=semantic-release&logoColor=white)](https://semantic-release.gitbook.io/semantic-release/)
[![Web Audit Report](https://github.com/ElJijuna/super-configs/actions/workflows/web-audit-report.yml/badge.svg)](https://github.com/ElJijuna/super-configs/actions/workflows/web-audit-report.yml)
[![Node.js](https://img.shields.io/badge/node-20.19%20%7C%2022.13%20%7C%2024%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Commitlint](https://img.shields.io/badge/lint-Commitlint-000000)](https://commitlint.js.org/)
[![ESLint](https://img.shields.io/badge/lint-ESLint-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)
[![Biome](https://img.shields.io/badge/format-Biome-60A5FA)](https://biomejs.dev/)
[![Jest](https://img.shields.io/badge/test-Jest-C21325?logo=jest&logoColor=white)](https://jestjs.io/)
[![Vitest](https://img.shields.io/badge/test-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Bun](https://img.shields.io/badge/runtime-Bun-000000?logo=bun&logoColor=white)](https://bun.sh/)
[![Prettier](https://img.shields.io/badge/legacy-Prettier-F7B93E?logo=prettier&logoColor=black)](https://prettier.io/)
[![Markdownlint](https://img.shields.io/badge/lint-Markdown-000000?logo=markdown&logoColor=white)](https://github.com/DavidAnson/markdownlint)
[![Stylelint](https://img.shields.io/badge/lint-Stylelint-263238?logo=stylelint&logoColor=white)](https://stylelint.io/)
[![TypeDoc](https://img.shields.io/badge/docs-TypeDoc-9600ff)](https://typedoc.org/)

Shared ESLint, Biome, Bun, Commitlint, Jest, Vitest, Markdownlint, Stylelint, TypeDoc, and legacy Prettier configurations for JavaScript, TypeScript, React, CSS, and Markdown projects.

## Installation

```bash
npm install super-configs --save-dev
# or
pnpm add super-configs -D
# or
yarn add super-configs -D
# or
bun add super-configs -D
```

### Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install eslint@^10 typescript@^6 --save-dev
```

ESLint 10 requires Node.js 20.19+, 22.13+, or 24+; odd-numbered Node.js releases are not
supported.

The Node.js TypeScript preset also requires Node.js declarations:

```bash
npm install @types/node --save-dev
```

TypeScript 6 consumers can keep using the standard `typescript` package. To compile with
TypeScript 7 while keeping TypeScript 6 available to tools such as typescript-eslint, TypeDoc,
and ts-jest, install both versions with aliases:

```bash
npm install \
  typescript@npm:@typescript/typescript6@^6.0.2 \
  @typescript/native@npm:typescript@^7.0.2 \
  --save-dev
```

With this setup, `tsc` runs TypeScript 7 and `tsc6` runs TypeScript 6. Consumers are not required
to migrate to TypeScript 7.

Biome, Commitlint, Jest, Vitest, Markdownlint, Stylelint, TypeDoc, and Prettier are optional peers. Use Biome for new projects:

```bash
npm install @biomejs/biome --save-dev
```

Use Markdownlint for Markdown projects:

```bash
npm install markdownlint --save-dev
```

Use Commitlint for Conventional Commits:

```bash
npm install @commitlint/cli @commitlint/config-conventional --save-dev
```

Use Jest for TypeScript test projects:

```bash
npm install jest ts-jest --save-dev
```

Use Vitest for TypeScript test projects:

```bash
npm install vitest --save-dev
```

Use Stylelint for CSS projects:

```bash
npm install stylelint stylelint-config-standard --save-dev
```

Use TypeDoc for TypeScript API documentation:

```bash
npm install typedoc --save-dev
```

## Usage

### Root Export

Prefer subpath imports for config files. The root export is available when you want to import multiple JavaScript configs from one place:

```javascript
import { eslintTs, prettierConfig } from 'super-configs';

export { eslintTs, prettierConfig };
```

### TypeScript

Extend the shared preset that matches your project. Define project-specific paths such as
`rootDir`, `outDir`, and `include` in your own `tsconfig.json`.

#### Node.js

```json
{
  "extends": "super-configs/tsconfig/node",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src/**/*.ts"]
}
```

#### React

```json
{
  "extends": "super-configs/tsconfig/react",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
```

### Recommended Project Setup

Install the shared config and the peer tools used by your project:

```bash
npm install super-configs eslint@^10 typescript@^6 @types/node @biomejs/biome --save-dev
```

Add scripts to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "biome check --write .",
    "format:check": "biome check .",
    "check": "npm run lint && npm run format:check"
  }
}
```

### CLI

Run the init command from a local install:

```bash
npx super-configs init --runtime bun --language ts --type-checked
```

If installed globally, use the binary directly:

```bash
super-configs init --runtime node --language ts
```

The command creates starter config files and skips existing files unless `--force` is passed.

Add companion presets and package scripts when needed:

```bash
super-configs init --runtime bun --language ts --type-checked --vitest --scripts
super-configs init --react --vitest
```

### ESLint

#### Config factory

Use the factory when you want one import and a runtime switch. Defaults are Node.js and TypeScript.

```javascript
// eslint.config.js
import { createEslintConfig } from 'super-configs/eslint';

export default createEslintConfig({
  runtime: 'bun',
  language: 'ts',
  typeChecked: true,
  ignores: ['dist/**', 'coverage/**'],
});
```

#### JavaScript

```javascript
// eslint.config.js
import eslintJs from 'super-configs/eslint/js';

export default [
  ...eslintJs,
];
```

#### TypeScript

```javascript
// eslint.config.js
import eslintTs from 'super-configs/eslint/ts';

export default [
  ...eslintTs,
];
```

#### Runtime presets

Choose an explicit runtime when code does not run in Node.js. The existing `eslint/js` and
`eslint/ts` imports remain Node.js defaults for backwards compatibility.

| Runtime | JavaScript | TypeScript | Type-checked TypeScript |
| --- | --- | --- | --- |
| Node.js | `super-configs/eslint/node/js` | `super-configs/eslint/node/ts` | `super-configs/eslint/node/ts-type-checked` |
| Browser | `super-configs/eslint/browser/js` | `super-configs/eslint/browser/ts` | `super-configs/eslint/browser/ts-type-checked` |
| Bun | `super-configs/eslint/bun/js` | `super-configs/eslint/bun/ts` | `super-configs/eslint/bun/ts-type-checked` |

```javascript
// eslint.config.js
import eslintBrowserTs from 'super-configs/eslint/browser/ts';

export default [
  ...eslintBrowserTs,
];
```

#### Type-aware TypeScript

Type-aware presets enable `typescript-eslint` recommended type-checked rules with
`parserOptions.projectService`. Each linted TypeScript file must belong to its nearest
`tsconfig.json`. Typed linting is slower but catches unsafe assignments, floating promises, and
other issues requiring TypeScript type information.

```javascript
// eslint.config.js
import eslintTsTypeChecked from 'super-configs/eslint/ts-type-checked';

export default [
  ...eslintTsTypeChecked,
];
```

The short `eslint/ts-type-checked` import uses Node.js globals. Choose a runtime-specific import
from the table above for Browser or Bun projects.

#### Jest

Use this alongside the JavaScript, TypeScript, or React presets when your project has Jest tests.

```javascript
// eslint.config.js
import eslintTs from 'super-configs/eslint/ts';
import eslintJest from 'super-configs/eslint/jest';

export default [
  ...eslintTs,
  ...eslintJest,
];
```

#### Vitest

Use this alongside the JavaScript, TypeScript, or React presets when your project has Vitest tests.

```javascript
// eslint.config.js
import eslintTs from 'super-configs/eslint/ts';
import eslintVitest from 'super-configs/eslint/vitest';

export default [
  ...eslintTs,
  ...eslintVitest,
];
```

Common TypeScript library setup:

```javascript
// eslint.config.js
import eslintTs from 'super-configs/eslint/ts';

export default [
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
  },
  ...eslintTs,
];
```

#### React JSX

```javascript
// eslint.config.js
import eslintReactJsx from 'super-configs/eslint/react/jsx';

export default [
  ...eslintReactJsx,
];
```

#### React TSX

```javascript
// eslint.config.js
import eslintReactTsx from 'super-configs/eslint/react/tsx';

export default [
  ...eslintReactTsx,
];
```

Common React + TypeScript setup:

```javascript
// eslint.config.js
import eslintReactTsx from 'super-configs/eslint/react/tsx';

export default [
  {
    ignores: ['dist/**', 'coverage/**', 'storybook-static/**', 'node_modules/**'],
  },
  ...eslintReactTsx,
];
```

### Biome

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.16/schema.json",
  "extends": ["super-configs/biome"]
}
```

If your Biome version cannot resolve package exports, use the direct path:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.16/schema.json",
  "extends": ["./node_modules/super-configs/biome.json"]
}
```

### Commitlint

Use the shared Commitlint config:

```javascript
// commitlint.config.js
import commitlintConfig from 'super-configs/commitlint';

export default commitlintConfig;
```

Add a commit message check script:

```json
{
  "scripts": {
    "commitlint": "commitlint --from HEAD~1 --to HEAD --verbose"
  }
}
```

### Markdownlint

Point Markdownlint-compatible tools at the shared JSON config:

```javascript
import { lint, readConfig } from 'markdownlint/sync';

const config = readConfig('./node_modules/super-configs/markdownlint.json');
const results = lint({ files: ['README.md'], config });

console.dir(results, { colors: true, depth: null });
```

Or add a `.markdownlint.json` file for editors and CLI wrappers:

```json
{
  "extends": "./node_modules/super-configs/markdownlint.json"
}
```

### EditorConfig

Copy the shared template into a project root:

```bash
cp node_modules/super-configs/.editorconfig .editorconfig
```

### Jest

Use the shared Jest config:

```javascript
// jest.config.js
import jestConfig from 'super-configs/jest';

export default jestConfig;
```

Or extend it:

```javascript
// jest.config.js
import jestConfig from 'super-configs/jest';

export default {
  ...jestConfig,
  testMatch: ['**/*.test.ts'],
};
```

### Vitest

Use the shared Vitest config:

```typescript
// vitest.config.ts
import vitestConfig from 'super-configs/vitest';

export default vitestConfig;
```

Or extend it:

```typescript
// vitest.config.ts
import { mergeConfig } from 'vitest/config';
import vitestConfig from 'super-configs/vitest';

export default mergeConfig(vitestConfig, {
  test: {
    include: ['src/**/*.test.ts'],
  },
});
```

### Bun test

Bun does not support extending a package `bunfig.toml`. Copy the shared template into your project
root so relative coverage paths resolve inside your project:

```bash
cp node_modules/super-configs/lib/test/bunfig.toml bunfig.toml
```

The template enables text and LCOV coverage, writes reports to `coverage`, skips test files from
coverage, and ignores common generated directories. Run it with:

```bash
bun test
```

The same template is exposed through the `super-configs/bunfig` and
`super-configs/bunfig.toml` package subpaths for tooling that resolves package exports.

### Stylelint

Use the shared Stylelint config:

```javascript
// stylelint.config.js
import stylelintConfig from 'super-configs/stylelint';

export default stylelintConfig;
```

Or extend it:

```javascript
// stylelint.config.js
import stylelintConfig from 'super-configs/stylelint';

export default {
  ...stylelintConfig,
  rules: {
    ...stylelintConfig.rules,
    'selector-class-pattern': '^[a-z][a-zA-Z0-9]+$',
  },
};
```

### TypeDoc

Extend the shared TypeDoc config:

```json
{
  "$schema": "https://typedoc.org/schema.json",
  "extends": "./node_modules/super-configs/typedoc.json",
  "entryPoints": ["src/index.ts"],
  "out": "docs",
  "readme": "README.md",
  "exclude": ["**/*.test.ts", "**/*.spec.ts", "**/test/**"]
}
```

Add a docs script:

```json
{
  "scripts": {
    "docs": "typedoc --options typedoc.json"
  }
}
```

### Prettier

Prefer Biome for new projects. The Prettier export remains available for existing projects that still consume it.

```javascript
// prettier.config.js
import prettierConfig from 'super-configs/prettier';

export default prettierConfig;
```

Or extend the configuration:

```javascript
// prettier.config.js
import prettierConfig from 'super-configs/prettier';

export default {
  ...prettierConfig,
  // your overrides here
  printWidth: 120,
};
```

## Recipes

### Node.js Library

```javascript
// eslint.config.js
import { createEslintConfig } from 'super-configs/eslint';
import eslintVitest from 'super-configs/eslint/vitest';

export default [
  ...createEslintConfig({
    runtime: 'node',
    language: 'ts',
    typeChecked: true,
    ignores: ['dist/**', 'coverage/**'],
  }),
  ...eslintVitest,
];
```

```json
{
  "extends": "super-configs/tsconfig/node",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src/**/*.ts"]
}
```

### Browser App

```javascript
// eslint.config.js
import { createEslintConfig } from 'super-configs/eslint';

export default createEslintConfig({
  runtime: 'browser',
  language: 'ts',
  ignores: ['dist/**', 'coverage/**'],
});
```

### Bun Service

```javascript
// eslint.config.js
import { createEslintConfig } from 'super-configs/eslint';

export default createEslintConfig({
  runtime: 'bun',
  language: 'ts',
  typeChecked: true,
  ignores: ['dist/**', 'coverage/**'],
});
```

```bash
cp node_modules/super-configs/lib/test/bunfig.toml bunfig.toml
```

### React App

```javascript
// eslint.config.js
import eslintReactTsx from 'super-configs/eslint/react/tsx';
import eslintVitest from 'super-configs/eslint/vitest';

export default [
  {
    ignores: ['dist/**', 'coverage/**', 'storybook-static/**'],
  },
  ...eslintReactTsx,
  ...eslintVitest,
];
```

```json
{
  "extends": "super-configs/tsconfig/react",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
```

## Available Configurations

| Export | Description |
| ------ | ----------- |
| `super-configs/eslint` | ESLint config factory for Node.js, Browser, and Bun projects |
| `super-configs/eslint/js` | ESLint configuration for JavaScript |
| `super-configs/eslint/ts` | ESLint configuration for TypeScript |
| `super-configs/eslint/ts-type-checked` | Type-aware ESLint configuration for TypeScript |
| `super-configs/eslint/node/js` | ESLint configuration for Node.js JavaScript |
| `super-configs/eslint/node/ts` | ESLint configuration for Node.js TypeScript |
| `super-configs/eslint/node/ts-type-checked` | Type-aware ESLint configuration for Node.js TypeScript |
| `super-configs/eslint/browser/js` | ESLint configuration for Browser JavaScript |
| `super-configs/eslint/browser/ts` | ESLint configuration for Browser TypeScript |
| `super-configs/eslint/browser/ts-type-checked` | Type-aware ESLint configuration for Browser TypeScript |
| `super-configs/eslint/bun/js` | ESLint configuration for Bun JavaScript |
| `super-configs/eslint/bun/ts` | ESLint configuration for Bun TypeScript |
| `super-configs/eslint/bun/ts-type-checked` | Type-aware ESLint configuration for Bun TypeScript |
| `super-configs/eslint/jest` | ESLint overrides for Jest test files |
| `super-configs/eslint/vitest` | ESLint overrides for Vitest test files |
| `super-configs/eslint/react/jsx` | ESLint configuration for React with JSX |
| `super-configs/eslint/react/tsx` | ESLint configuration for React with TSX |
| `super-configs/biome` | Biome configuration for formatting, linting, and import organization |
| `super-configs/bunfig` | Bun test configuration template with coverage enabled |
| `super-configs/commitlint` | Commitlint configuration for Conventional Commits |
| `node_modules/super-configs/.editorconfig` | EditorConfig template for common project files |
| `super-configs/jest` | Jest configuration for TypeScript test projects |
| `super-configs/vitest` | Vitest configuration for TypeScript test projects |
| `super-configs/markdownlint` | Markdownlint configuration for Markdown docs |
| `super-configs/stylelint` | Stylelint configuration for CSS projects |
| `super-configs/typedoc` | TypeDoc configuration for TypeScript API docs |
| `super-configs/prettier` | Prettier configuration |

## Included Rules

### Code Quality

- **Curly braces** - Requires curly braces for all control statements (`curly`)
- **Strict equality** - Requires `===` and `!==` (`eqeqeq`)
- **Unused variables** - Warns on unused variables, ignoring args prefixed with `_`
- **Destructuring** - Prefer destructuring object properties and array items before using them
- **Environment variables** - Prefer destructuring `process.env` over bracket notation
- **Async flow** - Requires `async`/`await` instead of `.then()` and `.catch()`

Examples:

```javascript
// Invalid
if (isReady) start();

// Valid
if (isReady) {
  start();
}
```

```javascript
// Invalid
if (count == '1') {
  start();
}

// Valid
if (count === 1) {
  start();
}
```

```javascript
// Warns: `event` is unused
function handleClick(event) {
  save();
}

// Valid: ignored args can start with `_`
function handleClick(_event) {
  save();
}
```

```typescript
// Invalid
const userName = user.name;
const firstUser = users[0];
const input = { name: user['name'] as string };
function getName(name = user['name']) {
  return name;
}

// Valid
const { name } = user;
const [firstUser] = users;
const userName = name;
const input = { name };
function getName(name = user.name) {
  return name;
}
```

```javascript
// Invalid
const NODE_ENV = process.env['NODE_ENV'];

// Valid
const { NODE_ENV } = process.env;
```

```javascript
// Invalid
fetchUser()
  .then((user) => saveUser(user))
  .catch((error) => reportError(error));

// Valid
try {
  const user = await fetchUser();
  await saveUser(user);
} catch (error) {
  reportError(error);
}
```

Formatting and import organization are handled by Biome, not ESLint.

### ESLint Plugins

- `@eslint/js` - ESLint recommended rules
- `typescript-eslint` - TypeScript support
- `eslint-plugin-react` - React rules
- `eslint-plugin-react-hooks` - React Hooks rules
- `eslint-plugin-jsx-a11y` - JSX accessibility

### Biome Configuration

- Semicolons enabled
- Single quotes
- Double quotes in JSX attributes
- Print width: 100 characters
- Tab width: 2 spaces
- Trailing commas: all
- Arrow parens: always
- Import organization enabled
- Block statements required for control flow (`useBlockStatements`)

Examples:

```javascript
// Invalid
while (isRunning) tick();

// Valid
while (isRunning) {
  tick();
}
```

```javascript
// Invalid
const label = "ready"
const items = [one, two]

// Formatted
const label = 'ready';
const items = [one, two];
```

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Lint
npm run lint

# Format code
npm run format

# Run all checks
npm run check
```

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for details.

## License

MIT © Ivan
