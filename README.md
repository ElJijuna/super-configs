# super-configs

Shared ESLint and Prettier configurations for JavaScript, TypeScript, and React projects.

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
npm install eslint prettier typescript --save-dev
```

## Usage

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

### Prettier

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
| `super-configs/eslint/react/jsx` | ESLint configuration for React with JSX |
| `super-configs/eslint/react/tsx` | ESLint configuration for React with TSX |
| `super-configs/prettier` | Prettier configuration |

## Included Rules

### Code Style

- **Single quotes** - Enforces single quotes for strings (`quotes`)
- **Curly braces** - Requires curly braces for all control statements (`curly`)

### ESLint Plugins

- `@eslint/js` - ESLint recommended rules
- `typescript-eslint` - TypeScript support
- `eslint-plugin-react` - React rules
- `eslint-plugin-react-hooks` - React Hooks rules
- `eslint-plugin-jsx-a11y` - JSX accessibility
- `eslint-plugin-import` - Import ordering and validation
- `eslint-plugin-prettier` - Prettier integration

### Prettier Configuration

- Semi-colons enabled
- Single quotes
- Print width: 100 characters
- Tab width: 2 spaces
- Trailing commas: ES5
- Bracket spacing: true
- Arrow parens: avoid

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
```

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for details.

## License

MIT © Ivan
