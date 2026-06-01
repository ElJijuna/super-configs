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
| `super-configs/eslint/react/jsx` | ESLint configuration for React with JSX |
| `super-configs/eslint/react/tsx` | ESLint configuration for React with TSX |
| `super-configs/biome` | Biome configuration for formatting, linting, and import organization |
| `super-configs/prettier` | Prettier configuration |

## Included Rules

### Code Quality

- **Curly braces** - Requires curly braces for all control statements (`curly`)
- **Strict equality** - Requires `===` and `!==` (`eqeqeq`)
- **Single quotes** - Requires single quotes in JavaScript, TypeScript, and JSX
- **Semicolons** - Requires statements to end with semicolons
- **Unused variables** - Warns on unused variables, ignoring args prefixed with `_`

### ESLint Plugins

- `@eslint/js` - ESLint recommended rules
- `typescript-eslint` - TypeScript support
- `eslint-plugin-react` - React rules
- `eslint-plugin-react-hooks` - React Hooks rules
- `eslint-plugin-jsx-a11y` - JSX accessibility
- `eslint-plugin-import` - Import ordering and validation

### Biome Configuration

- Semi-colons enabled
- Single quotes
- Single quotes in JSX attributes
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
