import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  copyNewFile,
  createBiomeConfig,
  createEslintConfig,
  createTsconfig,
  type InitOptions,
  main,
  mergePackageScripts,
  parseArgs,
  pathExists,
  runInit,
  writeNewFile,
} from '../src/cli/index.js';

const defaultOptions: InitOptions = {
  runtime: 'node',
  language: 'ts',
  typeChecked: false,
  force: false,
  jest: false,
  react: false,
  scripts: false,
  vitest: false,
};

describe('CLI argument parsing', () => {
  it('returns defaults when no arguments are provided', () => {
    expect(parseArgs([])).toEqual({ command: undefined, options: defaultOptions, help: false });
  });

  it('parses the command and every independent flag', () => {
    expect(
      parseArgs([
        'init',
        '--runtime',
        'bun',
        '--language',
        'ts',
        '--type-checked',
        '--force',
        '--jest',
        '--react',
        '--scripts',
        '-h',
      ]),
    ).toEqual({
      command: 'init',
      options: {
        ...defaultOptions,
        runtime: 'bun',
        typeChecked: true,
        force: true,
        jest: true,
        react: true,
        scripts: true,
      },
      help: true,
    });

    expect(parseArgs(['init', '--runtime', 'browser', '--language', 'js', '--vitest'])).toEqual({
      command: 'init',
      options: {
        ...defaultOptions,
        runtime: 'browser',
        language: 'js',
        vitest: true,
      },
      help: false,
    });
    expect(parseArgs(['--help']).help).toBe(true);
  });

  it.each([
    [['init', '--runtime', 'deno'], '--runtime must be one of: node, browser, bun'],
    [['init', '--language', 'coffee'], '--language must be one of: js, ts'],
    [['init', '--unknown'], 'Unknown option: --unknown'],
    [['init', '--language', 'js', '--type-checked'], '--type-checked requires --language ts'],
    [['init', '--jest', '--vitest'], 'choose either --jest or --vitest, not both'],
    [['init', '--language', 'js', '--react'], '--react requires --language ts'],
  ])('rejects invalid arguments: %s', (args, message) => {
    expect(() => parseArgs(args)).toThrowError(message);
  });
});

describe('CLI templates', () => {
  it.each([
    [{ ...defaultOptions, vitest: true }, 'eslintVitest'],
    [{ ...defaultOptions, jest: true }, 'eslintJest'],
    [defaultOptions, 'createEslintConfig'],
    [{ ...defaultOptions, react: true, vitest: true }, 'eslintVitest'],
    [{ ...defaultOptions, react: true, jest: true }, 'eslintJest'],
    [{ ...defaultOptions, react: true }, 'eslintReactTsx'],
  ] as const)('creates the expected ESLint template', (options, expectedImport) => {
    expect(createEslintConfig(options)).toContain(expectedImport);
  });

  it('includes the selected runtime and language in the generic ESLint template', () => {
    const config = createEslintConfig({
      ...defaultOptions,
      runtime: 'browser',
      language: 'js',
    });

    expect(config).toContain("runtime: 'browser'");
    expect(config).toContain("language: 'js'");
  });

  it.each([
    [{ ...defaultOptions, react: true }, 'react', 'src/**/*.tsx'],
    [{ ...defaultOptions, runtime: 'browser' }, 'react', 'src/**/*.tsx'],
    [defaultOptions, 'node', undefined],
  ] as const)('creates the expected TSConfig template', (options, preset, extraInclude) => {
    const config = createTsconfig(options);

    expect(config).toContain(`super-configs/tsconfig/${preset}`);

    if (extraInclude === undefined) {
      expect(config).not.toContain('src/**/*.tsx');
    } else {
      expect(config).toContain(extraInclude);
    }
  });

  it('creates the Biome template', () => {
    expect(JSON.parse(createBiomeConfig())).toEqual({
      $schema: 'https://biomejs.dev/schemas/2.4.16/schema.json',
      extends: ['super-configs/biome'],
    });
  });
});

describe('CLI file operations', () => {
  let directory: string;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'super-configs-test-'));
  });

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it('detects paths and writes new files without overwriting by default', async () => {
    const target = join(directory, 'config.txt');

    expect(await pathExists(target)).toBe(false);
    expect(await writeNewFile(target, 'first', false)).toBe(true);
    expect(await pathExists(target)).toBe(true);
    expect(await writeNewFile(target, 'second', false)).toBe(false);
    expect(await readFile(target, 'utf8')).toBe('first');
    expect(await writeNewFile(target, 'forced', true)).toBe(true);
    expect(await readFile(target, 'utf8')).toBe('forced');
  });

  it('copies new files and supports forced replacement', async () => {
    const source = join(directory, 'source.txt');
    const target = join(directory, 'target.txt');

    await writeFile(source, 'source');

    expect(await copyNewFile(source, target, false)).toBe(true);
    await writeFile(source, 'updated');
    expect(await copyNewFile(source, target, false)).toBe(false);
    expect(await copyNewFile(source, target, true)).toBe(true);
    expect(await readFile(target, 'utf8')).toBe('updated');
  });

  it('creates package scripts and preserves existing commands', async () => {
    const target = join(directory, 'package.json');

    expect(await mergePackageScripts(target, false)).toBe(true);
    const created = JSON.parse(await readFile(target, 'utf8'));

    expect(created.scripts.check).toBe('npm run lint && npm run format:check');

    created.scripts.lint = 'custom-lint';
    await writeFile(target, JSON.stringify(created));
    expect(await mergePackageScripts(target, false)).toBe(false);
    expect(await mergePackageScripts(target, true)).toBe(true);
    const forced = JSON.parse(await readFile(target, 'utf8'));

    expect(forced.scripts.lint).toBe('eslint .');
  });

  it('adds scripts when package.json has no scripts property', async () => {
    const target = join(directory, 'package.json');

    await writeFile(target, '{"name":"fixture"}');

    expect(await mergePackageScripts(target, false)).toBe(true);
    expect(JSON.parse(await readFile(target, 'utf8')).scripts.lint).toBe('eslint .');
  });

  it('initializes TypeScript files and reports skipped files on a second run', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const originalDirectory = process.cwd();

    try {
      process.chdir(directory);
      await runInit(defaultOptions);
    } finally {
      process.chdir(originalDirectory);
    }

    expect(await pathExists(join(directory, 'eslint.config.js'))).toBe(true);
    expect(await pathExists(join(directory, 'biome.json'))).toBe(true);
    expect(await pathExists(join(directory, 'tsconfig.json'))).toBe(true);
    expect(log).toHaveBeenCalledWith('created tsconfig.json');

    log.mockClear();
    await runInit(defaultOptions, { cwd: directory });
    expect(log).toHaveBeenCalledWith('skipped eslint.config.js (exists; use --force to overwrite)');
  });

  it('initializes Bun JavaScript projects with test config and package scripts', async () => {
    const packageRoot = join(directory, 'package-root');
    const project = join(directory, 'project');

    await mkdir(join(packageRoot, 'lib/test'), { recursive: true });
    await mkdir(project);
    await writeFile(join(packageRoot, 'lib/test/bunfig.toml'), '[test]\ncoverage = true\n');
    vi.spyOn(console, 'log').mockImplementation(() => undefined);

    await runInit(
      { ...defaultOptions, runtime: 'bun', language: 'js', scripts: true },
      { cwd: project, root: packageRoot },
    );

    expect(await pathExists(join(project, 'tsconfig.json'))).toBe(false);
    expect(await readFile(join(project, 'bunfig.toml'), 'utf8')).toContain('coverage = true');
    expect(
      JSON.parse(await readFile(join(project, 'package.json'), 'utf8')).scripts,
    ).toHaveProperty('check');

    await runInit(
      { ...defaultOptions, runtime: 'bun', language: 'js', scripts: true },
      { cwd: project, root: packageRoot },
    );
  });

  it('handles help, unknown commands, and init through the main entry point', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    await main([], { cwd: directory });
    await main(['--help'], { cwd: directory });
    expect(log).toHaveBeenCalledTimes(2);
    await expect(main(['unknown'], { cwd: directory })).rejects.toThrowError(
      'Unknown command: unknown',
    );
    await main(['init', '--language', 'js'], { cwd: directory });
    expect(await pathExists(join(directory, 'eslint.config.js'))).toBe(true);
  });
});
