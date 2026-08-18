# ROADMAP

Last updated: 2026-08-17

## Done

- Public TypeScript presets:
  - `super-configs/tsconfig/base`
  - `super-configs/tsconfig/node`
  - `super-configs/tsconfig/react`
  - `super-configs/tsconfig/react-native`
  - `super-configs/tsconfig/expo`
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
  - `super-configs/eslint/react/tsx-type-checked`
- Bun test template:
  - `super-configs/bunfig`
  - `super-configs/bunfig.toml`
  - source template at `src/test/bunfig.toml`
- Composable ESLint config factory:
  - `super-configs/eslint`
  - `createEslintConfig({ runtime, language, typeChecked, react, reactNative, testFramework,
    ignores, overrides })`
  - supports Node.js, Browser, Bun, React, and React Native
  - rejects type-aware JavaScript at runtime
- Init CLI:
  - local usage: `npx super-configs init`
  - global usage: `super-configs init`
  - creates ESLint, Biome, TypeScript, and optional Jest or Bun starter config files
  - skips existing files unless `--force` is passed
  - supports companion flags `--vitest`, `--jest`, `--react`, `--react-native`, and `--expo`
  - supports optional package script insertion with `--scripts`
- Vitest ESLint preset:
  - `super-configs/eslint/vitest`
  - adds Vitest test globals for `*.test.*` and `*.spec.*`
  - keeps Jest and Vitest globals separate
- Docs matrix and recipes:
  - Available Configurations includes runtime and type-aware ESLint exports
  - recipes cover Node.js library, Browser app, Bun service, React app, React Native app, and Expo
    app
- React Native and Expo presets:
  - ESLint presets for JSX, TSX, and type-aware TSX
  - React Native runtime globals, React Hooks rules, and internal deep-import restrictions
  - `super-configs/biome/react-native` with native lint rules and shared formatting
  - `super-configs/tsconfig/react-native` and `super-configs/tsconfig/expo`
  - `super-configs/jest/react-native` and `super-configs/jest/expo`
  - CLI generation through mutually exclusive `--react-native` and `--expo` flags
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
  - React Native ESLint globals, platform filenames, deep imports, and type-aware rules
  - React type-aware parser service and rules
  - React Native Biome diagnostics and native Jest/TypeScript preset mappings
- Dedicated CLI smoke tests cover:
  - CLI help output
  - temp project generation and companion flags
  - skip existing files and `--force`
  - invalid test framework combinations
  - complete React Native and Expo project generation
  - mutually exclusive React, React Native, and Expo project flags
- Factory options for companion presets:
  - `createEslintConfig({ testFramework: 'vitest' | 'jest' })` appends the test preset
  - `createEslintConfig({ react: true })` swaps the base preset for `react/tsx` or `react/jsx`
    and supports type-aware TSX
  - `createEslintConfig({ reactNative: true })` selects native JSX or TSX and supports
    `typeChecked`
  - order stays ignores, base preset, test framework, overrides
- Init CLI emits a single factory call:
  - `eslint.config.js` is one `createEslintConfig({ ... })` call with no companion imports
  - `--react` maps to `react: true`, omits `runtime`, and preserves enabled `typeChecked`
  - `--vitest` and `--jest` map to `testFramework`
  - `--react --type-checked` selects the type-aware React TSX preset
  - README recipes use the same single-call shape

## Next

- Enforce the coverage thresholds in CI by running `test:coverage` from `npm run check`

## Validation Baseline

- Required before release: `npm run check`
- Required when package exports/files change: `npm run pack:check`
- Last memory save: codebase graph reindexed on 2026-07-18 with project name
  `Users-pilmee-Documents-Github-super-configs`
