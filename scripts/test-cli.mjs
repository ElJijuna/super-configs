import { spawnSync } from 'node:child_process';
import { access, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const cliPath = join(root, 'lib/cli/index.js');
const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};
const runCli = (cwd, ...args) =>
  spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: 'utf8',
  });
const runCliInit = (cwd, ...args) => runCli(cwd, 'init', ...args);
const cliHelp = runCli(root, '--help');

assert(cliHelp.status === 0, 'CLI help must exit successfully');
assert(cliHelp.stdout.includes('super-configs init'), 'CLI help must mention init command');
assert(cliHelp.stdout.includes('--vitest'), 'CLI help must mention test flags');
assert(cliHelp.stdout.includes('--react-native'), 'CLI help must mention React Native');
assert(cliHelp.stdout.includes('--expo'), 'CLI help must mention Expo');
assert(cliHelp.stdout.includes('--next'), 'CLI help must mention Next.js');

const bunCliTarget = await mkdtemp(join(tmpdir(), 'super-configs-bun-cli-'));
const bunCli = runCliInit(
  bunCliTarget,
  '--runtime',
  'bun',
  '--language',
  'ts',
  '--type-checked',
  '--vitest',
  '--scripts',
);

assert(bunCli.status === 0, `Bun CLI init must succeed: ${bunCli.stderr}`);
assert(
  await readFile(join(bunCliTarget, 'bunfig.toml'), 'utf8'),
  'Bun CLI init must create bunfig',
);

const bunCliEslint = await readFile(join(bunCliTarget, 'eslint.config.js'), 'utf8');
const bunCliPackageJson = JSON.parse(await readFile(join(bunCliTarget, 'package.json'), 'utf8'));

assert(
  bunCliEslint.includes("testFramework: 'vitest'"),
  'CLI --vitest must set the Vitest factory option',
);
assert(bunCliEslint.includes("runtime: 'bun'"), 'CLI --runtime bun must configure Bun runtime');
assert(
  bunCliEslint.includes("import { createEslintConfig } from 'super-configs/eslint';") &&
    !bunCliEslint.includes('super-configs/eslint/'),
  'CLI must generate a single factory import',
);
assert(
  bunCliPackageJson.scripts?.check === 'npm run lint && npm run format:check',
  'CLI --scripts must add check script',
);

const reactCliTarget = await mkdtemp(join(tmpdir(), 'super-configs-react-cli-'));
const reactCli = runCliInit(reactCliTarget, '--react', '--vitest');

assert(reactCli.status === 0, `React CLI init must succeed: ${reactCli.stderr}`);

const reactCliEslint = await readFile(join(reactCliTarget, 'eslint.config.js'), 'utf8');
const reactCliTsconfig = await readFile(join(reactCliTarget, 'tsconfig.json'), 'utf8');

assert(reactCliEslint.includes('react: true'), 'CLI --react must set the React factory option');
assert(
  reactCliEslint.includes("testFramework: 'vitest'"),
  'CLI --react --vitest must set the Vitest factory option',
);
assert(
  !reactCliEslint.includes('runtime:') && !reactCliEslint.includes('typeChecked:'),
  'CLI --react must omit options the React presets ignore',
);
assert(
  reactCliTsconfig.includes('"extends": "super-configs/tsconfig/react"'),
  'CLI --react must use React TSConfig',
);

const reactNativeCliTarget = await mkdtemp(join(tmpdir(), 'super-configs-react-native-cli-'));
const reactNativeCli = runCliInit(
  reactNativeCliTarget,
  '--react-native',
  '--type-checked',
  '--jest',
);

assert(reactNativeCli.status === 0, `React Native CLI init must succeed: ${reactNativeCli.stderr}`);

const reactNativeCliEslint = await readFile(join(reactNativeCliTarget, 'eslint.config.js'), 'utf8');
const reactNativeCliJest = await readFile(join(reactNativeCliTarget, 'jest.config.js'), 'utf8');
const reactNativeCliTsconfig = await readFile(join(reactNativeCliTarget, 'tsconfig.json'), 'utf8');

assert(
  reactNativeCliEslint.includes('reactNative: true'),
  'CLI --react-native must set the React Native factory option',
);
assert(
  reactNativeCliEslint.includes('typeChecked: true'),
  'CLI --react-native must preserve type-aware linting',
);
assert(!reactNativeCliEslint.includes('runtime:'), 'CLI --react-native must omit runtime globals');
assert(
  reactNativeCliJest.includes('super-configs/jest/react-native'),
  'CLI --react-native --jest must use the React Native Jest preset',
);
assert(
  reactNativeCliTsconfig.includes('"extends": "super-configs/tsconfig/react-native"'),
  'CLI --react-native must use the React Native TSConfig',
);

const expoCliTarget = await mkdtemp(join(tmpdir(), 'super-configs-expo-cli-'));
const expoCli = runCliInit(expoCliTarget, '--expo', '--type-checked', '--jest');

assert(expoCli.status === 0, `Expo CLI init must succeed: ${expoCli.stderr}`);

const expoCliEslint = await readFile(join(expoCliTarget, 'eslint.config.js'), 'utf8');
const expoCliBiome = await readFile(join(expoCliTarget, 'biome.json'), 'utf8');
const expoCliJest = await readFile(join(expoCliTarget, 'jest.config.js'), 'utf8');
const expoCliTsconfig = await readFile(join(expoCliTarget, 'tsconfig.json'), 'utf8');

assert(
  expoCliEslint.includes('expo: true'),
  'CLI --expo must use the dedicated Expo ESLint preset',
);
assert(
  !expoCliEslint.includes('reactNative: true'),
  'CLI --expo must not fall back to React Native ESLint',
);
assert(expoCliEslint.includes('typeChecked: true'), 'CLI --expo must preserve type-aware linting');
assert(
  expoCliBiome.includes('super-configs/biome/react-native'),
  'CLI --expo must use the React Native Biome preset',
);
assert(
  expoCliJest.includes('super-configs/jest/expo'),
  'CLI --expo --jest must use the Expo Jest preset',
);
assert(
  expoCliTsconfig.includes('"extends": "super-configs/tsconfig/expo"'),
  'CLI --expo must use the Expo TSConfig',
);
assert(
  expoCliTsconfig.includes('".expo/types/**/*.ts"'),
  'CLI --expo must include generated Expo types',
);

const nextCliTarget = await mkdtemp(join(tmpdir(), 'super-configs-next-cli-'));
const nextCli = runCliInit(nextCliTarget, '--next', '--type-checked', '--vitest');

assert(nextCli.status === 0, `Next.js CLI init must succeed: ${nextCli.stderr}`);

const nextCliEslint = await readFile(join(nextCliTarget, 'eslint.config.js'), 'utf8');
const nextCliTsconfig = await readFile(join(nextCliTarget, 'tsconfig.json'), 'utf8');

assert(nextCliEslint.includes('next: true'), 'CLI --next must use the Next.js ESLint preset');
assert(nextCliEslint.includes('typeChecked: true'), 'CLI --next must preserve type-aware linting');
assert(!nextCliEslint.includes('runtime:'), 'CLI --next must omit runtime globals');
assert(
  nextCliTsconfig.includes('"extends": "super-configs/tsconfig/next"'),
  'CLI --next must use the Next.js TSConfig',
);
assert(
  nextCliTsconfig.includes('".next/dev/types/**/*.ts"'),
  'CLI --next must include generated development route types',
);

const mixedReactCliTarget = await mkdtemp(join(tmpdir(), 'super-configs-mixed-react-cli-'));
const mixedReactCli = runCliInit(mixedReactCliTarget, '--react', '--react-native');

assert(mixedReactCli.status === 1, 'CLI must reject --react with --react-native');
assert(
  mixedReactCli.stderr.includes('choose one of --next, --react, --react-native, or --expo'),
  'CLI must explain mixed React framework rejection',
);

const mixedNativeCliTarget = await mkdtemp(join(tmpdir(), 'super-configs-mixed-native-cli-'));
const mixedNativeCli = runCliInit(mixedNativeCliTarget, '--react-native', '--expo');

assert(mixedNativeCli.status === 1, 'CLI must reject --react-native with --expo');

const mixedTestCliTarget = await mkdtemp(join(tmpdir(), 'super-configs-mixed-test-cli-'));
const mixedTestCli = runCliInit(mixedTestCliTarget, '--jest', '--vitest');

assert(mixedTestCli.status === 1, 'CLI must reject --jest with --vitest');
assert(
  mixedTestCli.stderr.includes('choose either --jest or --vitest'),
  'CLI must explain mixed test framework rejection',
);

const typeCheckedReactCliTarget = await mkdtemp(join(tmpdir(), 'super-configs-react-tc-cli-'));
const typeCheckedReactCli = runCliInit(typeCheckedReactCliTarget, '--react', '--type-checked');

assert(
  typeCheckedReactCli.status === 0,
  `Type-checked React CLI init must succeed: ${typeCheckedReactCli.stderr}`,
);

const typeCheckedReactCliEslint = await readFile(
  join(typeCheckedReactCliTarget, 'eslint.config.js'),
  'utf8',
);

assert(
  typeCheckedReactCliEslint.includes('react: true') &&
    typeCheckedReactCliEslint.includes('typeChecked: true'),
  'CLI --react --type-checked must enable the type-checked React preset',
);

const jsCliTarget = await mkdtemp(join(tmpdir(), 'super-configs-js-cli-'));
const jsCli = runCliInit(jsCliTarget, '--language', 'js');

assert(jsCli.status === 0, `JS CLI init must succeed: ${jsCli.stderr}`);

try {
  await access(join(jsCliTarget, 'tsconfig.json'));

  throw new Error('CLI --language js must not create tsconfig');
} catch (error) {
  assert(error?.code === 'ENOENT', 'CLI --language js must not create tsconfig');
}

const existingCliTarget = await mkdtemp(join(tmpdir(), 'super-configs-existing-cli-'));

await writeFile(join(existingCliTarget, 'eslint.config.js'), '// keep\n');

const existingCli = runCliInit(existingCliTarget);

assert(existingCli.status === 0, `Existing-file CLI init must succeed: ${existingCli.stderr}`);
assert(
  existingCli.stdout.includes('skipped eslint.config.js'),
  'CLI must skip existing files without --force',
);
assert(
  (await readFile(join(existingCliTarget, 'eslint.config.js'), 'utf8')) === '// keep\n',
  'CLI must not overwrite existing files without --force',
);

const forcedCli = runCliInit(existingCliTarget, '--force');

assert(forcedCli.status === 0, `Forced CLI init must succeed: ${forcedCli.stderr}`);
assert(
  (await readFile(join(existingCliTarget, 'eslint.config.js'), 'utf8')).includes(
    'super-configs/eslint',
  ),
  'CLI --force must overwrite existing files',
);

console.log('cli ok');
