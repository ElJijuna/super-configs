# super-configs

Shared ESLint, Biome, and legacy Prettier configurations for JavaScript, TypeScript, and React projects.

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

Biome and Prettier are optional peers. Use Biome for new projects:

```bash
npm install @biomejs/biome --save-dev
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
| `super-configs/prettier` | Prettier configuration |

## Included Rules

### Code Quality

- **Curly braces** - Requires curly braces for all control statements (`curly`)
- **Strict equality** - Requires `===` and `!==` (`eqeqeq`)
- **Unused variables** - Warns on unused variables, ignoring args prefixed with `_`

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
