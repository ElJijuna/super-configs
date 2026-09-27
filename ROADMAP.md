# ROADMAP

Last updated: 2026-08-18

## Done

- Public TypeScript presets:
  - `super-configs/tsconfig/base`
  - `super-configs/tsconfig/node`
  - `super-configs/tsconfig/react`
  - `super-configs/tsconfig/react-native`
  - `super-configs/tsconfig/expo`
  - `super-configs/tsconfig/next`
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
  - `super-configs/eslint/expo/type-checked`
  - `super-configs/eslint/next/type-checked`
- Bun test template:
  - `super-configs/bunfig`
  - `super-configs/bunfig.toml`
  - source template at `src/test/bunfig.toml`
- Composable ESLint config factory:
  - `super-configs/eslint`
  - `createEslintConfig({ runtime, language, typeChecked, expo, next, react, reactNative,
    testFramework, ignores, overrides })`
  - supports Node.js, Browser, Bun, React, Next.js, React Native, and Expo
  - rejects type-aware JavaScript at runtime
- Init CLI:
  - local usage: `npx super-configs init`
  - global usage: `super-configs init`
  - creates ESLint, Biome, TypeScript, and optional Jest or Bun starter config files
  - skips existing files unless `--force` is passed
  - supports companion flags `--vitest`, `--jest`, `--next`, `--react`, `--react-native`, and
    `--expo`
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
  - dedicated `super-configs/eslint/expo` and `super-configs/eslint/expo/type-checked` presets
    composed from the official Expo flat configuration
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
  - Expo universal globals, Metro override, official plugin rules, and type-aware rules
  - React Native Biome diagnostics and native Jest/TypeScript preset mappings
- Dedicated CLI smoke tests cover:
  - CLI help output
  - temp project generation and companion flags
  - skip existing files and `--force`
  - invalid test framework combinations
  - complete React Native and Expo project generation
  - mutually exclusive React, React Native, and Expo project flags
  - complete Next.js project generation
- Factory options for companion presets:
  - `createEslintConfig({ testFramework: 'vitest' | 'jest' })` appends the test preset
  - `createEslintConfig({ react: true })` swaps the base preset for `react/tsx` or `react/jsx`
    and supports type-aware TSX
  - `createEslintConfig({ reactNative: true })` selects native JSX or TSX and supports
    `typeChecked`
  - `createEslintConfig({ expo: true })` selects the project-wide Expo preset and supports
    `typeChecked`
  - `createEslintConfig({ next: true })` selects Core Web Vitals and supports `typeChecked`
  - order stays ignores, base preset, test framework, overrides
- Init CLI emits a single factory call:
  - `eslint.config.js` is one `createEslintConfig({ ... })` call with no companion imports
  - `--react` maps to `react: true`, omits `runtime`, and preserves enabled `typeChecked`
  - `--expo` maps to `expo: true` instead of falling back to React Native ESLint
  - `--next` maps to `next: true` and generates `tsconfig/next`
  - `--vitest` and `--jest` map to `testFramework`
  - `--react --type-checked` selects the type-aware React TSX preset
  - README recipes use the same single-call shape
- GitHub Packages mirror:
  - the release workflow publishes every npm release to GitHub Packages as
    `@eljijuna/super-configs` in a separate job, so a failure never affects npm
  - README documents the `.npmrc` setup and the `super-configs@npm:@eljijuna/super-configs` alias
- Vitest 5:
  - `vitest` and `@vitest/coverage-v8` updated to `^5.0.2`
- React JSX preset lints `.jsx` files:
  - `super-configs/eslint/react/jsx` scopes its entries to `**/*.{js,jsx,mjs,cjs}`
  - export tests no longer add a `**/*.jsx` override that hid the missing glob
- ESLint 10 peer warnings documented:
  - README lists the npm `overrides` and pnpm `peerDependencyRules` for
    `eslint-plugin-react`, `eslint-plugin-jsx-a11y`, `eslint-plugin-import`, and
    `eslint-plugin-expo`, verified to give a clean install with a single ESLint 10
- Type declarations for root config exports:
  - `super-configs/vitest`, `jest`, `jest/expo`, `jest/react-native`, `commitlint`,
    `stylelint`, and `semantic-release` ship `.d.ts` files with a `types` export condition
  - export tests type-check a consumer with `tsc` and compare declared keys with runtime keys
- Shared semantic-release config:
  - `super-configs/semantic-release` releases from `main` with Conventional Commits, changelog,
    npm, git, and GitHub plugins
  - this repository's `.releaserc.json` extends it
  - export tests load it through semantic-release `get-config` from a consumer and this repository
- Strict TypeScript add-on:
  - `super-configs/tsconfig/strict` enables `verbatimModuleSyntax`, `isolatedModules`,
    `noUncheckedIndexedAccess`, and `noImplicitOverride`
  - stacks on any runtime preset with `"extends": ["super-configs/tsconfig/node",
    "super-configs/tsconfig/strict"]`
  - export tests compile a stacked consumer and check each option reports its error
- Runtime TypeScript presets matching the ESLint runtimes:
  - `super-configs/tsconfig/browser`: DOM libraries, bundler resolution, and `"types": []` so
    Node.js globals do not leak into browser code
  - `super-configs/tsconfig/bun`: Bun's recommended options (`"module": "Preserve"`, bundler
    resolution, `.ts` import extensions, `noEmit`) with `@types/bun` as an optional peer
  - `super-configs init --runtime browser|bun` generates the matching TSConfig instead of
    `react` or `node`
  - export tests compile both presets stacked with `strict` and check foreign globals fail
- Vitest coverage defaults:
  - `super-configs/vitest` sets `coverage.provider: 'v8'` and
    `coverage.include: ['src/**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}']`, so untested source files
    are reported without pulling in JSON or other non-code files
  - README documents that `mergeConfig` adds consumer globs to the default and that
    `coverage.exclude` narrows it
  - this repository's `vitest.repo.config.ts` relies on the shared defaults
- Vitest React preset:
  - `super-configs/vitest/react` extends the shared Vitest config with a `jsdom` environment
  - `jsdom` and `happy-dom` are optional peers; README shows the one-line happy-dom override
  - export tests render a component with React Testing Library under both environments and
    check that cleanup between tests works

## Pending

### Release

- Reusable release workflow (`workflow_call`) at `.github/workflows/release.yml`:
  - runs checks, semantic-release to npm, then mirrors to GitHub Packages as `@eljijuna/<name>`
  - consumers call it with `uses: ElJijuna/super-configs/.github/workflows/release.yml@v1` and
    `secrets: inherit`
  - inputs for the Node.js version, check command, and GitHub Packages scope

### Testing

- Enforce the coverage thresholds in CI by running `test:coverage` from `npm run check`

### New tools

- Git hooks from the CLI (`super-configs init --hooks`): Husky or Lefthook with a Commitlint
  `commit-msg` hook and lint-staged
- Build preset for libraries with tsdown (tsup is in maintenance mode), covering the shared
  `format: ['esm', 'cjs']`, `dts`, `sourcemap`, and `target: 'es2022'` options
- Knip config for unused files, dependencies, and exports
- Playwright config for E2E tests, aimed at the React and Next.js presets
- Lower priority: Renovate shareable preset (`github>ElJijuna/super-configs`) and an Oxlint
  evaluation as a faster ESLint alternative

### ESLint 10

- Drop the ESLint 10 peer workarounds (`overrides` in `package.json`, README "ESLint 10 peer
  warnings") once `eslint-plugin-react`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-import`
  declare ESLint 10 support and `eslint-plugin-expo` stops depending on `eslint@^9`

### Consumer repositories

- `express-realtime`: delete `super-configs.d.ts` now that `super-configs/vitest` ships types
- `code-languages`, `express-realtime`: replace `.releaserc.json` with
  `{ "extends": "super-configs/semantic-release" }`
- `code-languages`: use `super-configs/commitlint` instead of its local
  `commitlint.config.cjs`, and extend a `super-configs/tsconfig` preset
- `express-realtime`, `express-frontend-metrics-collector`, `code-languages`: stack
  `super-configs/tsconfig/strict` and drop the repeated strictness options

## Validation Baseline

- Required before release: `npm run check`
- Required when package exports/files change: `npm run pack:check`
- Last memory save: codebase graph reindexed on 2026-07-18 with project name
  `Users-pilmee-Documents-Github-super-configs`
