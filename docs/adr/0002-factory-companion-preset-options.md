# 0002. Add Companion Preset Options to the ESLint Factory

Date: 2026-07-25

## Status

Accepted

## Context

ADR [0001](0001-eslint-preset-subpaths-and-factory.md) left focused presets such as Jest, Vitest,
and React out of `createEslintConfig`, to be added later once their behavior was proven.

That behavior has now settled through the init CLI: `super-configs init` ships `--vitest`,
`--jest`, and `--react` flags, covered by CLI smoke tests, and every generated config composes the
same three presets in the same order. Consumers following the recipes repeat that composition by
hand:

```javascript
import { createEslintConfig } from 'super-configs/eslint';
import eslintVitest from 'super-configs/eslint/vitest';

export default [
  ...createEslintConfig({ runtime: 'node', language: 'ts' }),
  ...eslintVitest,
];
```

The ordering is load bearing. Companion test presets are scoped to `*.test.*` and `*.spec.*` files
and must come after the base preset to relax rules there, while consumer overrides must stay last.

## Decision

Add two factory options that compose the existing companion presets:

- `testFramework: 'vitest' | 'jest'` appends `eslint/vitest` or `eslint/jest`.
- `react: true` replaces the base preset with `eslint/react/tsx`, or `eslint/react/jsx` when
  `language` is `'js'`.

The resulting order is always ignores, base preset, test framework, overrides.

`testFramework` is a single union option rather than two booleans, so the "both Jest and Vitest"
combination the CLI rejects at parse time cannot be expressed at all.

`react` replaces the base preset instead of layering on top of it, matching what the CLI generates.
React presets carry their own globals, so `runtime` no longer applies when `react` is enabled.
Combining `react` with `typeChecked` throws, because no type-aware React preset exists yet.

## Consequences

The factory now covers every composition the init CLI produces, so recipes and generated configs
can shrink to one import.

Subpath presets stay canonical and unchanged, as required by ADR 0001. The factory keeps failing
early on invalid combinations rather than silently repairing them, with one documented exception:
`runtime` is ignored under `react`.

`super-configs/eslint` now pulls the React and test plugins into its module graph, since those
presets are static imports and already direct dependencies of the package.

The init CLI still emits the multi-import template. Migrating it to the factory options is tracked
in the roadmap and should be a separate, consumer-visible change.
