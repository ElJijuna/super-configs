#!/usr/bin/env node
import { access, copyFile, writeFile } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

type Runtime = 'node' | 'browser' | 'bun';
type Language = 'js' | 'ts';

interface InitOptions {
  runtime: Runtime;
  language: Language;
  typeChecked: boolean;
  force: boolean;
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const cwd = process.cwd();
const helpText = `Usage:
  super-configs init [options]

Options:
  --runtime <node|browser|bun>  Runtime globals to configure. Default: node
  --language <js|ts>            Project language. Default: ts
  --type-checked                Enable type-aware TypeScript ESLint
  --force                       Overwrite existing config files
  -h, --help                    Show help
`;
const parseArgs = (args: string[]): { command?: string; options: InitOptions; help: boolean } => {
  const options: InitOptions = {
    runtime: 'node',
    language: 'ts',
    typeChecked: false,
    force: false,
  };

  let command: string | undefined;
  let help = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (!command && !arg.startsWith('-')) {
      command = arg;
      continue;
    }

    if (arg === '-h' || arg === '--help') {
      help = true;
      continue;
    }

    if (arg === '--type-checked') {
      options.typeChecked = true;
      continue;
    }

    if (arg === '--force') {
      options.force = true;
      continue;
    }

    if (arg === '--runtime') {
      const runtime = args[index + 1];

      if (runtime !== 'node' && runtime !== 'browser' && runtime !== 'bun') {
        throw new Error('--runtime must be one of: node, browser, bun');
      }

      options.runtime = runtime;
      index += 1;
      continue;
    }

    if (arg === '--language') {
      const language = args[index + 1];

      if (language !== 'js' && language !== 'ts') {
        throw new Error('--language must be one of: js, ts');
      }

      options.language = language;
      index += 1;
      continue;
    }

    throw new Error(`Unknown option: ${arg}`);
  }

  if (options.language === 'js' && options.typeChecked) {
    throw new Error('--type-checked requires --language ts');
  }

  return { command, options, help };
};
const pathExists = async (path: string): Promise<boolean> => {
  try {
    await access(path);

    return true;
  } catch {
    return false;
  }
};
const writeNewFile = async (path: string, contents: string, force: boolean): Promise<boolean> => {
  if (!force && (await pathExists(path))) {
    return false;
  }

  await writeFile(path, contents);

  return true;
};
const copyNewFile = async (source: string, target: string, force: boolean): Promise<boolean> => {
  if (!force && (await pathExists(target))) {
    return false;
  }

  await copyFile(source, target);

  return true;
};
const createEslintConfig = (
  options: InitOptions,
): string => `import { createEslintConfig } from 'super-configs/eslint';

export default createEslintConfig({
  runtime: '${options.runtime}',
  language: '${options.language}',
  typeChecked: ${options.typeChecked},
  ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
});
`;
const createTsconfig = (options: InitOptions): string => {
  const preset = options.runtime === 'browser' ? 'react' : 'node';

  return `{
  "extends": "super-configs/tsconfig/${preset}",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src/**/*.ts"${preset === 'react' ? ', "src/**/*.tsx"' : ''}]
}
`;
};
const createBiomeConfig = (): string => `{
  "$schema": "https://biomejs.dev/schemas/2.4.16/schema.json",
  "extends": ["super-configs/biome"]
}
`;
const runInit = async (options: InitOptions): Promise<void> => {
  const changed: string[] = [];
  const skipped: string[] = [];
  const write = async (target: string, contents: string) => {
    const written = await writeNewFile(resolve(cwd, target), contents, options.force);

    (written ? changed : skipped).push(target);
  };
  const copy = async (source: string, target: string) => {
    const copied = await copyNewFile(resolve(root, source), resolve(cwd, target), options.force);

    (copied ? changed : skipped).push(target);
  };

  await write('eslint.config.js', createEslintConfig(options));
  await write('biome.json', createBiomeConfig());

  if (options.language === 'ts') {
    await write('tsconfig.json', createTsconfig(options));
  }

  if (options.runtime === 'bun') {
    await copy('lib/test/bunfig.toml', 'bunfig.toml');
  }

  for (const file of changed) {
    console.log(`created ${file}`);
  }

  for (const file of skipped) {
    console.log(`skipped ${file} (exists; use --force to overwrite)`);
  }
};

try {
  const { command, options, help } = parseArgs(process.argv.slice(2));

  if (help || !command) {
    console.log(helpText);
    process.exit(0);
  }

  if (command !== 'init') {
    throw new Error(`Unknown command: ${command}`);
  }

  await runInit(options);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);

  console.error(`${basename(process.argv[1] ?? 'super-configs')}: ${message}`);
  process.exit(1);
}
