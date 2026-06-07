# super-configs

[![npm version](https://img.shields.io/npm/v/super-configs.svg)](https://www.npmjs.com/package/super-configs)
[![npm downloads](https://img.shields.io/npm/dm/super-configs.svg)](https://www.npmjs.com/package/super-configs)
[![license](https://img.shields.io/npm/l/super-configs.svg)](./LICENSE)
[![CI](https://github.com/ElJijuna/super-configs/actions/workflows/ci.yml/badge.svg)](https://github.com/ElJijuna/super-configs/actions/workflows/ci.yml)
[![Release](https://github.com/ElJijuna/super-configs/actions/workflows/publish.yml/badge.svg)](https://github.com/ElJijuna/super-configs/actions/workflows/publish.yml)
[![semantic-release](https://img.shields.io/badge/release-semantic--release-e10079?logo=semantic-release&logoColor=white)](https://semantic-release.gitbook.io/semantic-release/)
[![Web Audit Report](https://github.com/ElJijuna/super-configs/actions/workflows/web-audit-report.yml/badge.svg)](https://github.com/ElJijuna/super-configs/actions/workflows/web-audit-report.yml)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![ESLint](https://img.shields.io/badge/lint-ESLint-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)
[![Biome](https://img.shields.io/badge/format-Biome-60A5FA)](https://biomejs.dev/)
[![Prettier](https://img.shields.io/badge/legacy-Prettier-F7B93E?logo=prettier&logoColor=black)](https://prettier.io/)
[![Markdownlint](https://img.shields.io/badge/lint-Markdown-000000?logo=markdown&logoColor=white)](https://github.com/DavidAnson/markdownlint)
[![TypeDoc](https://img.shields.io/badge/docs-TypeDoc-9600ff)](https://typedoc.org/)

Shared ESLint, Biome, Markdownlint, TypeDoc, and legacy Prettier configurations for JavaScript, TypeScript, React, and Markdown projects.

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
npm install eslint typescript --save-dev
```

Biome, Markdownlint, TypeDoc, and Prettier are optional peers. Use Biome for new projects:

```bash
npm install @biomejs/biome --save-dev
```

Use Markdownlint for Markdown projects:

```bash
npm install markdownlint --save-dev
```

Use TypeDoc for TypeScript API documentation:

```bash
npm install typedoc --save-dev
```

## Usage

### Recommended Project Setup

Install the shared config and the peer tools used by your project:

```bash
npm install super-configs eslint typescript @biomejs/biome --save-dev
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

### ESLint

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

## Available Configurations

| Export | Description |
| ------ | ----------- |
| `super-configs/eslint/js` | ESLint configuration for JavaScript |
| `super-configs/eslint/ts` | ESLint configuration for TypeScript |
| `super-configs/eslint/jest` | ESLint overrides for Jest test files |
| `super-configs/eslint/react/jsx` | ESLint configuration for React with JSX |
| `super-configs/eslint/react/tsx` | ESLint configuration for React with TSX |
| `super-configs/biome` | Biome configuration for formatting, linting, and import organization |
| `node_modules/super-configs/.editorconfig` | EditorConfig template for common project files |
| `super-configs/markdownlint` | Markdownlint configuration for Markdown docs |
| `super-configs/typedoc` | TypeDoc configuration for TypeScript API docs |
| `super-configs/prettier` | Prettier configuration |

## Included Rules

### Code Quality

- **Curly braces** - Requires curly braces for all control statements (`curly`)
- **Strict equality** - Requires `===` and `!==` (`eqeqeq`)
- **Unused variables** - Warns on unused variables, ignoring args prefixed with `_`

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
