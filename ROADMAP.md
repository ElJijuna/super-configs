# ROADMAP

Last updated: 2026-07-14

## Done

- Public TypeScript presets:
  - `super-configs/tsconfig/base`
  - `super-configs/tsconfig/node`
  - `super-configs/tsconfig/react`
- Runtime-specific ESLint presets:
  - `super-configs/eslint/node/js`
  - `super-configs/eslint/node/ts`
  - `super-configs/eslint/browser/js`
  - `super-configs/eslint/browser/ts`
  - `super-configs/eslint/bun/js`
  - `super-configs/eslint/bun/ts`
- Type-aware TypeScript ESLint presets:
  - `super-configs/eslint/ts-type-checked`
  - `super-configs/eslint/node/ts-type-checked`
  - `super-configs/eslint/browser/ts-type-checked`
  - `super-configs/eslint/bun/ts-type-checked`
- Bun test template:
  - `super-configs/bunfig`
  - `super-configs/bunfig.toml`
  - source template at `src/test/bunfig.toml`
- Composable ESLint config factory:
  - `super-configs/eslint`
  - `createEslintConfig({ runtime, language, typeChecked, ignores, overrides })`
  - supports Node.js, Browser, and Bun
  - rejects type-aware JavaScript at runtime
- Export validation covers:
  - runtime globals per ESLint preset
  - type-aware parser service
  - TSConfig JSON exports
  - Bun config export aliases
  - ESLint factory behavior

## Next

- Add init CLI:
  - scaffold common config files from installed presets
  - support Node, Browser, Bun, React, Jest, Vitest choices
  - avoid overwriting existing project config unless explicit
- Add Vitest ESLint/test preset:
  - document pairing with TypeScript/Bun projects
  - validate export map and package contents
- Improve docs matrix:
  - include all runtime and type-aware ESLint exports in Available Configurations
  - add short recipes for Node library, Browser app, Bun service, React app
- Consider ADRs:
  - document why preset subpaths remain canonical
  - document factory as convenience layer over existing presets

## Validation Baseline

- Required before release: `npm run check`
- Required when package exports/files change: `npm run pack:check`
- Last memory save: codebase graph reindexed on 2026-07-14 with project name
  `Users-pilmee-Documents-Github-super-configs`
