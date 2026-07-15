# 0001. Keep ESLint Preset Subpaths Canonical, Add Factory as Convenience Layer

Date: 2026-07-15

## Status

Accepted

## Context

`super-configs` exposes ESLint presets as explicit package subpaths:

- `super-configs/eslint/js`
- `super-configs/eslint/ts`
- `super-configs/eslint/node/js`
- `super-configs/eslint/node/ts`
- `super-configs/eslint/browser/js`
- `super-configs/eslint/browser/ts`
- `super-configs/eslint/bun/js`
- `super-configs/eslint/bun/ts`
- type-aware TypeScript variants under `ts-type-checked`
- focused test and framework presets such as `eslint/jest`, `eslint/vitest`, and React presets

These subpaths are stable, easy to document, and map directly to package exports. They also keep
consumer config files transparent: importing a preset shows exactly which runtime and language are
being configured.

The package now also supports a composable factory:

```javascript
import { createEslintConfig } from 'super-configs/eslint';

export default createEslintConfig({
  runtime: 'bun',
  language: 'ts',
  typeChecked: true,
});
```

The factory reduces boilerplate for common setup flows and powers the init CLI.

## Decision

Keep explicit ESLint preset subpaths as the canonical low-level API.

Expose `super-configs/eslint` as a convenience layer that composes the same internal builders used
by the subpath presets.

The factory must remain additive:

- no replacement or deprecation of existing subpaths
- no hidden runtime detection
- runtime and language choices stay explicit
- invalid combinations, such as type-aware JavaScript, fail early
- focused presets such as Jest, Vitest, and React remain separate imports unless deliberately added
  to the factory later

## Consequences

Consumers can choose between two clear styles:

- explicit subpath imports for maximum clarity and stable docs
- factory import for generated configs and concise setup

The package keeps backwards compatibility while still improving ergonomics. Export validation must
cover both surfaces so the factory cannot drift away from the subpath presets.

Future additions should first decide whether they are:

- a canonical preset subpath
- a factory option
- a separate companion preset

When unsure, prefer a subpath first, then add factory support after the behavior is proven.
