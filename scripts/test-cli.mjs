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
  bunCliEslint.includes("import eslintVitest from 'super-configs/eslint/vitest';"),
  'CLI --vitest must add Vitest import',
);
assert(bunCliEslint.includes("runtime: 'bun'"), 'CLI --runtime bun must configure Bun runtime');
assert(
  bunCliPackageJson.scripts?.check === 'npm run lint && npm run format:check',
  'CLI --scripts must add check script',
);

const reactCliTarget = await mkdtemp(join(tmpdir(), 'super-configs-react-cli-'));
const reactCli = runCliInit(reactCliTarget, '--react', '--vitest');

assert(reactCli.status === 0, `React CLI init must succeed: ${reactCli.stderr}`);

const reactCliEslint = await readFile(join(reactCliTarget, 'eslint.config.js'), 'utf8');
const reactCliTsconfig = await readFile(join(reactCliTarget, 'tsconfig.json'), 'utf8');

assert(
  reactCliEslint.includes("import eslintReactTsx from 'super-configs/eslint/react/tsx';"),
  'CLI --react must add React TSX import',
);
assert(
  reactCliEslint.includes("import eslintVitest from 'super-configs/eslint/vitest';"),
  'CLI --react --vitest must add Vitest import',
);
assert(
  reactCliTsconfig.includes('"extends": "super-configs/tsconfig/react"'),
  'CLI --react must use React TSConfig',
);

const mixedTestCliTarget = await mkdtemp(join(tmpdir(), 'super-configs-mixed-test-cli-'));
const mixedTestCli = runCliInit(mixedTestCliTarget, '--jest', '--vitest');

assert(mixedTestCli.status === 1, 'CLI must reject --jest with --vitest');
assert(
  mixedTestCli.stderr.includes('choose either --jest or --vitest'),
  'CLI must explain mixed test framework rejection',
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
