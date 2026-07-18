# ROADMAP

Last updated: 2026-07-18

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
- Init CLI:
  - local usage: `npx super-configs init`
  - global usage: `super-configs init`
  - creates ESLint, Biome, TypeScript, and Bun starter config files
  - skips existing files unless `--force` is passed
  - supports companion flags `--vitest`, `--jest`, and `--react`
  - supports optional package script insertion with `--scripts`
- Vitest ESLint preset:
  - `super-configs/eslint/vitest`
  - adds Vitest test globals for `*.test.*` and `*.spec.*`
  - keeps Jest and Vitest globals separate
- Docs matrix and recipes:
  - Available Configurations includes runtime and type-aware ESLint exports
  - recipes cover Node.js library, Browser app, Bun service, and React app
- ADRs:
  - `docs/adr/0001-eslint-preset-subpaths-and-factory.md`
  - documents why preset subpaths stay canonical
  - documents factory as a convenience layer over existing presets
- Export validation covers:
  - runtime globals per ESLint preset
  - type-aware parser service
  - TSConfig JSON exports
  - Bun config export aliases
  - ESLint factory behavior
  - published CLI bin file
  - Jest vs Vitest ESLint globals
- Dedicated CLI smoke tests cover:
  - CLI help output
  - temp project generation and companion flags
  - skip existing files and `--force`
  - invalid test framework combinations

## Next

- Consider factory options for companion presets after CLI behavior settles

## Validation Baseline

- Required before release: `npm run check`
- Required when package exports/files change: `npm run pack:check`
- Last memory save: codebase graph reindexed on 2026-07-18 with project name
  `Users-pilmee-Documents-Github-super-configs`
