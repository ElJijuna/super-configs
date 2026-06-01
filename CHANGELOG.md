## [1.1.1](https://github.com/ElJijuna/super-configs/compare/v1.1.0...v1.1.1) (2026-06-01)

### Bug Fixes

* error in indentation ([e6f0a8f](https://github.com/ElJijuna/super-configs/commit/e6f0a8faaa5af44ea9381729412971b44c662637))

## [1.1.0](https://github.com/ElJijuna/super-configs/compare/v1.0.0...v1.1.0) (2026-06-01)

### Features

* add common jest config ([851124b](https://github.com/ElJijuna/super-configs/commit/851124b0dbe7ad1e9bc30b05043e977e5ff5d5f9))
* enforce multiline brace style ([644ad79](https://github.com/ElJijuna/super-configs/commit/644ad798cd77dfb72998122dad2b9dfba1c5a2fe))
* require blank lines after const declarations ([9bee0c4](https://github.com/ElJijuna/super-configs/commit/9bee0c4fd3d6e0d070941a7e0b2a502e336f132d))
* require blank lines before return statements ([df3f72e](https://github.com/ElJijuna/super-configs/commit/df3f72e2666f24d423fdb3bdb86d351844fc24f5))
* require blank lines before try blocks ([a171186](https://github.com/ElJijuna/super-configs/commit/a171186df9e7b861686f1deab42f26ef752cab4a))

### Bug Fixes

* solve lint errors ([db0130c](https://github.com/ElJijuna/super-configs/commit/db0130c2de655e09711ddd4c3ba39a40c257f22e))

## 1.0.0 (2026-06-01)

### Features

* add rules quotes, semi. ([e553e64](https://github.com/ElJijuna/super-configs/commit/e553e64dff30efb55e9165d4e0861a8ef635f03e))
* add workflow to publish and update configs ([0b4b29f](https://github.com/ElJijuna/super-configs/commit/0b4b29f2f4d970eb37db2bcdf23d55b35a7e93a6))
* update project config and fix actions to automatic publish. ([8548427](https://github.com/ElJijuna/super-configs/commit/8548427bdeed221ba610f800cba44a09bed2c61d))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-28

### Added

- Initial release
- ESLint configuration for JavaScript (`eslint/js`)
- ESLint configuration for TypeScript (`eslint/ts`)
- ESLint configuration for React JSX (`eslint/react/jsx`)
- ESLint configuration for React TSX (`eslint/react/tsx`)
- Prettier configuration (`prettier`)
- Flat config support for ESLint 9+
- Single quotes enforcement rule
- Curly braces requirement rule
- Import ordering rules for React configurations
- TypeScript type declarations
- README documentation

### Features

- **ESLint JavaScript Config**: Basic JavaScript linting with Prettier integration
- **ESLint TypeScript Config**: Full TypeScript support with `@typescript-eslint`
- **ESLint React JSX Config**: React (JSX) with hooks, accessibility, and import ordering
- **ESLint React TSX Config**: React (TSX) with TypeScript, hooks, accessibility, and import ordering
- **Prettier Config**: Opinionated Prettier configuration with single quotes, semicolons, and 100 char line width

[1.0.0]: https://github.com/ElJijuna/super-configs/releases/tag/v1.0.0
