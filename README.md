# super-configs

<p align="center">
  <img src="https://raw.githubusercontent.com/ElJijuna/super-configs/main/public/assets/super-configs.png" alt="super-configs logo" width="160" />
</p>

[![npm version](https://img.shields.io/npm/v/super-configs.svg)](https://www.npmjs.com/package/super-configs)
[![npm downloads](https://img.shields.io/npm/dm/super-configs.svg)](https://www.npmjs.com/package/super-configs)
[![license](https://img.shields.io/npm/l/super-configs.svg)](./LICENSE)
[![CI](https://github.com/ElJijuna/super-configs/actions/workflows/ci.yml/badge.svg)](https://github.com/ElJijuna/super-configs/actions/workflows/ci.yml)
[![Release](https://github.com/ElJijuna/super-configs/actions/workflows/publish.yml/badge.svg)](https://github.com/ElJijuna/super-configs/actions/workflows/publish.yml)
[![semantic-release](https://img.shields.io/badge/release-semantic--release-e10079?logo=semantic-release&logoColor=white)](https://semantic-release.gitbook.io/semantic-release/)
[![Web Audit Report](https://github.com/ElJijuna/super-configs/actions/workflows/web-audit-report.yml/badge.svg)](https://github.com/ElJijuna/super-configs/actions/workflows/web-audit-report.yml)
[![Node.js](https://img.shields.io/badge/node-20.19%20%7C%2022.13%20%7C%2024%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Commitlint](https://img.shields.io/badge/lint-Commitlint-000000)](https://commitlint.js.org/)
[![ESLint](https://img.shields.io/badge/lint-ESLint-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)
[![Biome](https://img.shields.io/badge/format-Biome-60A5FA)](https://biomejs.dev/)
[![Jest](https://img.shields.io/badge/test-Jest-C21325?logo=jest&logoColor=white)](https://jestjs.io/)
[![Vitest](https://img.shields.io/badge/test-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Bun](https://img.shields.io/badge/runtime-Bun-000000?logo=bun&logoColor=white)](https://bun.sh/)
[![Prettier](https://img.shields.io/badge/legacy-Prettier-F7B93E?logo=prettier&logoColor=black)](https://prettier.io/)
[![Markdownlint](https://img.shields.io/badge/lint-Markdown-000000?logo=markdown&logoColor=white)](https://github.com/DavidAnson/markdownlint)
[![Stylelint](https://img.shields.io/badge/lint-Stylelint-263238?logo=stylelint&logoColor=white)](https://stylelint.io/)
[![TypeDoc](https://img.shields.io/badge/docs-TypeDoc-9600ff)](https://typedoc.org/)

Shared ESLint, Biome, TypeScript, Jest, Vitest, Commitlint, Markdownlint, Stylelint, TypeDoc, and
legacy Prettier configurations for JavaScript, React, Next.js, React Native, Expo, Node.js,
Browser, Bun, CSS, and Markdown projects.

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
npm install eslint@^10 typescript@^6 --save-dev
```

ESLint 10 requires Node.js 20.19+, 22.13+, or 24+; odd-numbered Node.js releases are not
supported.

The Node.js TypeScript preset also requires Node.js declarations:

```bash
npm install @types/node --save-dev
```

TypeScript 6 consumers can keep using the standard `typescript` package. To compile with
TypeScript 7 while keeping TypeScript 6 available to tools such as typescript-eslint, TypeDoc,
and ts-jest, install both versions with aliases:

```bash
npm install \
  typescript@npm:@typescript/typescript6@^6.0.2 \
  @typescript/native@npm:typescript@^7.0.2 \
  --save-dev
```

With this setup, `tsc` runs TypeScript 7 and `tsc6` runs TypeScript 6. Consumers are not required
to migrate to TypeScript 7.

Biome, Commitlint, Jest, Vitest, Markdownlint, Stylelint, TypeDoc, and Prettier are optional peers.
Use Biome for new projects:

```bash
npm install @biomejs/biome --save-dev
```

The React Native TypeScript and Jest presets use the official packages for the installed React
Native version. React Native 0.85 and newer use the
[extracted Jest preset](https://reactnative.dev/blog/2026/04/07/react-native-0.85):

```bash
npm install @react-native/typescript-config @react-native/jest-preset jest @types/jest --save-dev
```

The Expo ESLint preset includes the official `eslint-config-expo` flat configuration. For Jest,
let Expo select versions compatible with the current SDK, as recommended in the
[Expo testing guide](https://docs.expo.dev/develop/unit-testing/):

```bash
npx expo install jest-expo jest @types/jest --dev
```

The Next.js presets use `eslint-config-next` 16 and expect Next.js 16 to be installed by the
application. They include the official Core Web Vitals and TypeScript rule sets.

Use Markdownlint for Markdown projects:

```bash
npm install markdownlint --save-dev
```

Use Commitlint for Conventional Commits:

```bash
npm install @commitlint/cli @commitlint/config-conventional --save-dev
```

Use Jest for TypeScript test projects:

```bash
npm install jest ts-jest --save-dev
```

Use Vitest for TypeScript test projects:

```bash
npm install vitest --save-dev
```

Use Stylelint for CSS projects:

```bash
npm install stylelint stylelint-config-standard --save-dev
```

Use TypeDoc for TypeScript API documentation:

```bash
npm install typedoc --save-dev
```

## Usage

### Root Export

Prefer subpath imports for config files. The root export is available when you want to import
multiple JavaScript configs from one place:

```javascript
import { eslintTs, prettierConfig } from 'super-configs';

export { eslintTs, prettierConfig };
```

### TypeScript

Extend the shared preset that matches your project. Define project-specific paths such as
`rootDir`, `outDir`, and `include` in your own `tsconfig.json`.

#### Node.js

```json
{
  "extends": "super-configs/tsconfig/node",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src/**/*.ts"]
}
```

#### React

```json
{
  "extends": "super-configs/tsconfig/react",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
```

#### Next.js

The Next.js preset enables the Next TypeScript plugin and the compiler options required by the
framework. Keep generated route declarations in the project-level `include` list:

```json
{
  "extends": "super-configs/tsconfig/next",
  "include": [
    "next-env.d.ts",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": ["node_modules"]
}
```

#### React Native

Install `@react-native/typescript-config` at the version matching React Native, then extend the
native preset. As described in the
[React Native TypeScript guide](https://reactnative.dev/docs/typescript), Babel and Metro perform
emission; TypeScript is used for type checking.

```json
{
  "extends": "super-configs/tsconfig/react-native"
}
```

#### Expo

The Expo preset follows the [Expo TypeScript guide](https://docs.expo.dev/guides/typescript/): it
extends `expo/tsconfig.base`, enables strict checking, and leaves Metro-specific options with Expo.
Include Expo's generated declarations in the project config:

```json
{
  "extends": "super-configs/tsconfig/expo",
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

### Recommended Project Setup

Install the shared config and the peer tools used by your project:

```bash
npm install super-configs eslint@^10 typescript@^6 @types/node @biomejs/biome --save-dev
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

### CLI

Run the init command from a local install:

```bash
npx super-configs init --runtime bun --language ts --type-checked
```

If installed globally, use the binary directly:

```bash
super-configs init --runtime node --language ts
```

The command creates starter config files and skips existing files unless `--force` is passed. The
generated `eslint.config.js` is a single [config factory](#config-factory) call, so companion flags
become factory options instead of extra imports.

Add companion presets and package scripts when needed:

```bash
super-configs init --runtime bun --language ts --type-checked --vitest --scripts
super-configs init --react --type-checked --vitest
super-configs init --next --type-checked --vitest --scripts
super-configs init --react-native --language ts --type-checked --jest --scripts
super-configs init --expo --language ts --type-checked --jest --scripts
```

`--jest` cannot be combined with `--vitest`. Choose only one of `--next`, `--react`,
`--react-native`, or `--expo`; invalid combinations fail before any file is written. `--next`
selects the Next.js ESLint and TSConfig presets. `--expo` selects the dedicated Expo ESLint preset,
the React Native Biome preset, the Expo TSConfig, and, with `--jest`, the Expo Jest preset.

### ESLint

#### Config factory

Use the factory when you want one import and a runtime switch. Defaults are Node.js and TypeScript.

```javascript
// eslint.config.js
import { createEslintConfig } from 'super-configs/eslint';

export default createEslintConfig({
  runtime: 'bun',
  language: 'ts',
  typeChecked: true,
  ignores: ['dist/**', 'coverage/**'],
});
```

| Option | Type | Default | Effect |
| --- | --- | --- | --- |
| `runtime` | `'node' \| 'browser' \| 'bun'` | `'node'` | Runtime globals for the base preset |
| `language` | `'js' \| 'ts'` | `'ts'` | Base preset language |
| `typeChecked` | `boolean` | `false` | Type-aware TypeScript rules; requires `language: 'ts'` |
| `expo` | `boolean` | `false` | Replaces the base preset with the official Expo flat config plus shared rules |
| `next` | `boolean` | `false` | Replaces the base preset with Next.js Core Web Vitals and TypeScript rules |
| `react` | `boolean` | `false` | Replaces the base preset with a React JSX/TSX preset; supports type-aware TSX |
| `reactNative` | `boolean` | `false` | Replaces the base preset with a React Native JSX/TSX preset; supports type-aware TSX |
| `testFramework` | `'vitest' \| 'jest'` | — | Appends the matching companion preset for `*.test.*` and `*.spec.*` files |
| `ignores` | `string[]` | `[]` | Prepended as a global ignores entry |
| `overrides` | `Linter.Config[]` | `[]` | Appended last so consumer rules win |

Companion presets keep the same order the manual imports use: ignores, base preset, test
framework, overrides.

```javascript
// eslint.config.js
import { createEslintConfig } from 'super-configs/eslint';

export default createEslintConfig({
  react: true,
  typeChecked: true,
  testFramework: 'vitest',
  ignores: ['dist/**', 'coverage/**', 'storybook-static/**'],
});
```

`react: true` uses the React presets as the base, so they provide their own globals and the
`runtime` option no longer applies. With TypeScript, `typeChecked: true` selects
`eslint/react/tsx-type-checked` and enables type-aware rules through the TypeScript project service.

#### Next.js

The Next.js presets compose the official `core-web-vitals` and `typescript` flat configurations,
including React, React Hooks, JSX accessibility, import, and `@next/next` rules.

```javascript
// eslint.config.js
import { createEslintConfig } from 'super-configs/eslint';

export default createEslintConfig({
  next: true,
  typeChecked: true,
  ignores: ['coverage/**'],
});
```

Use `super-configs/eslint/next` for the standard preset or
`super-configs/eslint/next/type-checked` to enable TypeScript project-service rules. Both presets
ignore `.next/**`, `out/**`, `build/**`, and `next-env.d.ts` through the official configuration.

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

#### Runtime presets

Choose an explicit runtime when code does not run in Node.js. The existing `eslint/js` and
`eslint/ts` imports remain Node.js defaults for backwards compatibility.

| Runtime | JavaScript | TypeScript | Type-checked TypeScript |
| --- | --- | --- | --- |
| Node.js | `super-configs/eslint/node/js` | `super-configs/eslint/node/ts` | `super-configs/eslint/node/ts-type-checked` |
| Browser | `super-configs/eslint/browser/js` | `super-configs/eslint/browser/ts` | `super-configs/eslint/browser/ts-type-checked` |
| Bun | `super-configs/eslint/bun/js` | `super-configs/eslint/bun/ts` | `super-configs/eslint/bun/ts-type-checked` |

```javascript
// eslint.config.js
import eslintBrowserTs from 'super-configs/eslint/browser/ts';

export default [
  ...eslintBrowserTs,
];
```

#### Type-aware TypeScript

Type-aware presets enable `typescript-eslint` recommended type-checked rules with
`parserOptions.projectService`. Each linted TypeScript file must belong to its nearest
`tsconfig.json`. Typed linting is slower but catches unsafe assignments, floating promises, and
other issues requiring TypeScript type information.

```javascript
// eslint.config.js
import eslintTsTypeChecked from 'super-configs/eslint/ts-type-checked';

export default [
  ...eslintTsTypeChecked,
];
```

The short `eslint/ts-type-checked` import uses Node.js globals. Choose a runtime-specific import
from the table above for Browser or Bun projects.

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

#### Vitest

Use this alongside the JavaScript, TypeScript, or React presets when your project has Vitest tests.

```javascript
// eslint.config.js
import eslintTs from 'super-configs/eslint/ts';
import eslintVitest from 'super-configs/eslint/vitest';

export default [
  ...eslintTs,
  ...eslintVitest,
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

For type-aware React and TypeScript rules, use the dedicated preset. Ensure the project TSConfig
includes every file linted by ESLint.

```javascript
// eslint.config.js
import eslintReactTsxTypeChecked from 'super-configs/eslint/react/tsx-type-checked';

export default [
  {
    ignores: ['dist/**', 'coverage/**', 'storybook-static/**', 'node_modules/**'],
  },
  ...eslintReactTsxTypeChecked,
];
```

#### React Native

Use the native presets for Metro-resolved JavaScript or TypeScript. They provide React Native
runtime globals, React Hooks rules, platform suffix support, and reject deep imports from
`react-native/Libraries/**`.

| Language | Preset |
| --- | --- |
| JavaScript and JSX | `super-configs/eslint/react-native/jsx` |
| TypeScript and TSX | `super-configs/eslint/react-native/tsx` |
| Type-aware TypeScript and TSX | `super-configs/eslint/react-native/tsx-type-checked` |

```javascript
// eslint.config.js
import { createEslintConfig } from 'super-configs/eslint';

export default createEslintConfig({
  reactNative: true,
  language: 'ts',
  typeChecked: true,
  testFramework: 'jest',
  ignores: ['coverage/**', 'android/**/build/**', 'ios/build/**'],
});
```

The React Native presets intentionally do not enable browser-only globals such as `document`.
Files ending in `.native.*`, `.ios.*`, and `.android.*` are covered by the normal JSX/TSX globs.

#### Expo

The Expo preset composes `eslint-config-expo/flat`, so application files receive Expo's
multi-environment globals. It also keeps Expo's Node.js override for `metro.config.js`, platform
extensions, import resolution, React rules, and Expo-specific rules.

```javascript
// eslint.config.js
import { createEslintConfig } from 'super-configs/eslint';

export default createEslintConfig({
  expo: true,
  language: 'ts',
  typeChecked: true,
  testFramework: 'jest',
  ignores: ['coverage/**', '.expo/**'],
});
```

Use `super-configs/eslint/expo` for the standard project-wide preset or
`super-configs/eslint/expo/type-checked` when TypeScript project-service rules are required.

### Biome

```json
{
  "$schema": "https://biomejs.dev/schemas/2.5.3/schema.json",
  "extends": ["super-configs/biome"]
}
```

React Native and Expo projects should use the native preset:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.5.3/schema.json",
  "extends": ["super-configs/biome/react-native"]
}
```

It adds Biome's React Native checks for internal deep imports, raw text outside `<Text>`, literal
colors, and platform-specific components. The color rule is a warning; the runtime and portability
rules are errors. These rules require Biome 2.4.13 or newer.

If your Biome version cannot resolve package exports, use the direct path:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.5.3/schema.json",
  "extends": ["./node_modules/super-configs/biome.json"]
}
```

For the React Native preset, the equivalent direct path is
`./node_modules/super-configs/biome.react-native.json`.

### Commitlint

Use the shared Commitlint config:

```javascript
// commitlint.config.js
import commitlintConfig from 'super-configs/commitlint';

export default commitlintConfig;
```

Add a commit message check script:

```json
{
  "scripts": {
    "commitlint": "commitlint --from HEAD~1 --to HEAD --verbose"
  }
}
```

### Markdownlint

Point Markdownlint-compatible tools at the shared JSON config:

```javascript
import { lint, readConfig } from 'markdownlint/sync';

const config = readConfig('./node_modules/super-configs/markdownlint.json');
const results = lint({ files: ['README.md'], config });

console.dir(results, { colors: true, depth: null });
```

Or add a `.markdownlint.json` file for editors and CLI wrappers:

```json
{
  "extends": "./node_modules/super-configs/markdownlint.json"
}
```

### EditorConfig

Copy the shared template into a project root:

```bash
cp node_modules/super-configs/.editorconfig .editorconfig
```

### Jest

Use the shared Jest config:

```javascript
// jest.config.js
import jestConfig from 'super-configs/jest';

export default jestConfig;
```

Or extend it:

```javascript
// jest.config.js
import jestConfig from 'super-configs/jest';

export default {
  ...jestConfig,
  testMatch: ['**/*.test.ts'],
};
```

React Native 0.85 and newer use the extracted native preset. Keep
`@react-native/jest-preset` aligned with the installed React Native version:

```javascript
// jest.config.js
export { default } from 'super-configs/jest/react-native';
```

Expo projects use `jest-expo`, which supplies Expo SDK mocks and the appropriate Babel transforms:

```javascript
// jest.config.js
export { default } from 'super-configs/jest/expo';
```

Both shared configurations leave `transform` and `testMatch` to their upstream native presets.
Extend the exported object only for project-specific setup files, module mappings, or coverage.

### Vitest

Use the shared Vitest config:

```typescript
// vitest.config.ts
import vitestConfig from 'super-configs/vitest';

export default vitestConfig;
```

Or extend it:

```typescript
// vitest.config.ts
import { mergeConfig } from 'vitest/config';
import vitestConfig from 'super-configs/vitest';

export default mergeConfig(vitestConfig, {
  test: {
    include: ['src/**/*.test.ts'],
  },
});
```

### Bun test

Bun does not support extending a package `bunfig.toml`. Copy the shared template into your project
root so relative coverage paths resolve inside your project:

```bash
cp node_modules/super-configs/lib/test/bunfig.toml bunfig.toml
```

The template enables text and LCOV coverage, writes reports to `coverage`, skips test files from
coverage, and ignores common generated directories. Run it with:

```bash
bun test
```

The same template is exposed through the `super-configs/bunfig` and
`super-configs/bunfig.toml` package subpaths for tooling that resolves package exports.

### Stylelint

Use the shared Stylelint config:

```javascript
// stylelint.config.js
import stylelintConfig from 'super-configs/stylelint';

export default stylelintConfig;
```

Or extend it:

```javascript
// stylelint.config.js
import stylelintConfig from 'super-configs/stylelint';

export default {
  ...stylelintConfig,
  rules: {
    ...stylelintConfig.rules,
    'selector-class-pattern': '^[a-z][a-zA-Z0-9]+$',
  },
};
```

### TypeDoc

Extend the shared TypeDoc config:

```json
{
  "$schema": "https://typedoc.org/schema.json",
  "extends": "./node_modules/super-configs/typedoc.json",
  "entryPoints": ["src/index.ts"],
  "out": "docs",
  "readme": "README.md",
  "exclude": ["**/*.test.ts", "**/*.spec.ts", "**/test/**"]
}
```

Add a docs script:

```json
{
  "scripts": {
    "docs": "typedoc --options typedoc.json"
  }
}
```

### Prettier

Prefer Biome for new projects. The Prettier export remains available for existing projects that
still consume it.

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

## Recipes

### Node.js Library

```javascript
// eslint.config.js
import { createEslintConfig } from 'super-configs/eslint';

export default createEslintConfig({
  runtime: 'node',
  language: 'ts',
  typeChecked: true,
  testFramework: 'vitest',
  ignores: ['dist/**', 'coverage/**'],
});
```

```json
{
  "extends": "super-configs/tsconfig/node",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src/**/*.ts"]
}
```

### Browser App

```javascript
// eslint.config.js
import { createEslintConfig } from 'super-configs/eslint';

export default createEslintConfig({
  runtime: 'browser',
  language: 'ts',
  ignores: ['dist/**', 'coverage/**'],
});
```

### Bun Service

```javascript
// eslint.config.js
import { createEslintConfig } from 'super-configs/eslint';

export default createEslintConfig({
  runtime: 'bun',
  language: 'ts',
  typeChecked: true,
  ignores: ['dist/**', 'coverage/**'],
});
```

```bash
cp node_modules/super-configs/lib/test/bunfig.toml bunfig.toml
```

### React App

```javascript
// eslint.config.js
import { createEslintConfig } from 'super-configs/eslint';

export default createEslintConfig({
  language: 'ts',
  react: true,
  typeChecked: true,
  testFramework: 'vitest',
  ignores: ['dist/**', 'coverage/**', 'storybook-static/**'],
});
```

```json
{
  "extends": "super-configs/tsconfig/react",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
```

### React Native App

Generate ESLint, Biome, TypeScript, and Jest configuration together:

```bash
super-configs init --react-native --language ts --type-checked --jest --scripts
```

The generated files select `eslint/react-native/tsx-type-checked`,
`biome/react-native`, `tsconfig/react-native`, and `jest/react-native`. The native TypeScript and
Jest packages must match the React Native version installed by the application.

### Next.js App

Generate the Core Web Vitals ESLint preset, type-aware TypeScript linting, Biome, and the Next.js
TSConfig together:

```bash
super-configs init --next --type-checked --vitest --scripts
```

The generated TSConfig includes both production and development route declarations from `.next`,
while the generated ESLint config ignores framework output.

### Expo App

Use the Expo flag instead of combining it with `--react-native`:

```bash
super-configs init --expo --language ts --type-checked --jest --scripts
```

This uses the dedicated Expo ESLint preset, the React Native Biome preset, plus `tsconfig/expo` and
`jest/expo`. The generated TSConfig includes `.expo/types/**/*.ts` and `expo-env.d.ts`.

## Available Configurations

| Export | Description |
| ------ | ----------- |
| `super-configs/eslint` | ESLint config factory for Node.js, Browser, Bun, React, Next.js, React Native, and Expo projects |
| `super-configs/eslint/js` | ESLint configuration for JavaScript |
| `super-configs/eslint/ts` | ESLint configuration for TypeScript |
| `super-configs/eslint/ts-type-checked` | Type-aware ESLint configuration for TypeScript |
| `super-configs/eslint/node/js` | ESLint configuration for Node.js JavaScript |
| `super-configs/eslint/node/ts` | ESLint configuration for Node.js TypeScript |
| `super-configs/eslint/node/ts-type-checked` | Type-aware ESLint configuration for Node.js TypeScript |
| `super-configs/eslint/browser/js` | ESLint configuration for Browser JavaScript |
| `super-configs/eslint/browser/ts` | ESLint configuration for Browser TypeScript |
| `super-configs/eslint/browser/ts-type-checked` | Type-aware ESLint configuration for Browser TypeScript |
| `super-configs/eslint/bun/js` | ESLint configuration for Bun JavaScript |
| `super-configs/eslint/bun/ts` | ESLint configuration for Bun TypeScript |
| `super-configs/eslint/bun/ts-type-checked` | Type-aware ESLint configuration for Bun TypeScript |
| `super-configs/eslint/expo` | Project-wide ESLint configuration based on the official Expo flat config |
| `super-configs/eslint/expo/type-checked` | Expo ESLint configuration with type-aware TypeScript rules |
| `super-configs/eslint/next` | Next.js Core Web Vitals and TypeScript ESLint configuration |
| `super-configs/eslint/next/type-checked` | Next.js ESLint configuration with type-aware TypeScript rules |
| `super-configs/eslint/jest` | ESLint overrides for Jest test files |
| `super-configs/eslint/vitest` | ESLint overrides for Vitest test files |
| `super-configs/eslint/react/jsx` | ESLint configuration for React with JSX |
| `super-configs/eslint/react/tsx` | ESLint configuration for React with TSX |
| `super-configs/eslint/react/tsx-type-checked` | Type-aware ESLint configuration for React with TSX |
| `super-configs/eslint/react-native/jsx` | ESLint configuration for React Native with JSX |
| `super-configs/eslint/react-native/tsx` | ESLint configuration for React Native with TSX |
| `super-configs/eslint/react-native/tsx-type-checked` | Type-aware ESLint configuration for React Native with TSX |
| `super-configs/biome` | Biome configuration for formatting, linting, and import organization |
| `super-configs/biome/react-native` | Biome configuration with explicit React Native rules |
| `super-configs/bunfig` | Bun test configuration template with coverage enabled |
| `super-configs/commitlint` | Commitlint configuration for Conventional Commits |
| `node_modules/super-configs/.editorconfig` | EditorConfig template for common project files |
| `super-configs/jest` | Jest configuration for TypeScript test projects |
| `super-configs/jest/react-native` | Jest configuration based on `@react-native/jest-preset` |
| `super-configs/jest/expo` | Jest configuration based on `jest-expo` |
| `super-configs/vitest` | Vitest configuration for TypeScript test projects |
| `super-configs/markdownlint` | Markdownlint configuration for Markdown docs |
| `super-configs/stylelint` | Stylelint configuration for CSS projects |
| `super-configs/typedoc` | TypeDoc configuration for TypeScript API docs |
| `super-configs/tsconfig/base` | Base strict TypeScript configuration |
| `super-configs/tsconfig/node` | TypeScript configuration for Node.js |
| `super-configs/tsconfig/react` | TypeScript configuration for React web projects |
| `super-configs/tsconfig/react-native` | Strict TypeScript configuration for React Native |
| `super-configs/tsconfig/expo` | Strict TypeScript configuration for Expo |
| `super-configs/tsconfig/next` | Strict TypeScript configuration with the Next.js plugin and bundler resolution |
| `super-configs/prettier` | Prettier configuration |

## Included Rules

### Code Quality

- **Curly braces** - Requires curly braces for all control statements (`curly`)
- **Strict equality** - Requires `===` and `!==` (`eqeqeq`)
- **Unused variables** - Warns on unused variables, ignoring args prefixed with `_`
- **Destructuring** - Prefer destructuring object properties and array items before using them
- **Environment variables** - Prefer destructuring `process.env` over bracket notation
- **Async flow** - Requires `async`/`await` instead of `.then()` and `.catch()`

Examples:

```javascript
// Invalid
if (isReady) start();

// Valid
if (isReady) {
  start();
}
```

```javascript
// Invalid
if (count == '1') {
  start();
}

// Valid
if (count === 1) {
  start();
}
```

```javascript
// Warns: `event` is unused
function handleClick(event) {
  save();
}

// Valid: ignored args can start with `_`
function handleClick(_event) {
  save();
}
```

```typescript
// Invalid
const userName = user.name;
const firstUser = users[0];
const input = { name: user['name'] as string };
function getName(name = user['name']) {
  return name;
}

// Valid
const { name } = user;
const [firstUser] = users;
const userName = name;
const input = { name };
function getName(name = user.name) {
  return name;
}
```

```javascript
// Invalid
const NODE_ENV = process.env['NODE_ENV'];

// Valid
const { NODE_ENV } = process.env;
```

```javascript
// Invalid
fetchUser()
  .then((user) => saveUser(user))
  .catch((error) => reportError(error));

// Valid
try {
  const user = await fetchUser();
  await saveUser(user);
} catch (error) {
  reportError(error);
}
```

Formatting and import organization are handled by Biome, not ESLint.

### ESLint Plugins

- `@eslint/js` - ESLint recommended rules
- `typescript-eslint` - TypeScript support
- `eslint-config-expo` - Official Expo globals, extensions, import resolution, and lint rules
- `eslint-config-next` - Official Next.js Core Web Vitals and TypeScript rules
- `eslint-plugin-react` - React rules
- `eslint-plugin-react-hooks` - React Hooks rules
- `eslint-plugin-jsx-a11y` - JSX accessibility

### React Native Rules

- React Native runtime globals without the browser-only `document` global
- React Hooks recommended rules for JSX and TSX
- Type-aware TypeScript rules through `parserOptions.projectService`
- Public React Native API imports instead of `react-native/Libraries/**`
- Platform files using `.native.*`, `.ios.*`, or `.android.*` suffixes

### Expo Rules

- Official `eslint-plugin-expo`, React, React Hooks, TypeScript, and import rules
- Universal Expo globals for Hermes and web application code
- Node.js globals scoped to `metro.config.js`
- Type-aware TypeScript rules through `parserOptions.projectService` in the typed preset
- Public React Native API imports instead of `react-native/Libraries/**`

### Next.js Rules

- Official `@next/next` Core Web Vitals rules
- Official React, React Hooks, JSX accessibility, import, and TypeScript rules
- Type-aware TypeScript rules through `parserOptions.projectService` in the typed preset
- Framework output and `next-env.d.ts` ignored by default

### Biome Configuration

- Semicolons enabled
- Single quotes
- Double quotes in JSX attributes
- Print width: 100 characters
- Tab width: 2 spaces
- Trailing commas: all
- Arrow parens: always
- Import organization enabled
- Block statements required for control flow (`useBlockStatements`)
- React Native deep imports, raw text, and misplaced platform components reported as errors
- React Native literal colors reported as warnings

Examples:

```javascript
// Invalid
while (isRunning) tick();

// Valid
while (isRunning) {
  tick();
}
```

```javascript
// Invalid
const label = "ready"
const items = [one, two]

// Formatted
const label = 'ready';
const items = [one, two];
```

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

# Type-check with the TypeScript 6 compiler
npm run typecheck:ts6

# Run the unit tests
npm test

# Run the unit tests with coverage thresholds
npm run test:coverage

# Verify that every declared package export resolves
npm run test:exports

# Run the init CLI smoke tests against a temporary project
npm run test:cli

# Run all checks
npm run check
```

`npm run check` is the required regression suite: it runs lint, Biome, the TypeScript 6 type check,
the build, the unit tests, export verification, and the CLI smoke tests, in that order. It does not
enforce coverage thresholds — run `npm run test:coverage` for those. Run `npm run pack:check` as
well whenever package exports or published files change.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for details.

## License

MIT © Ivan
