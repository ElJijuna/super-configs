import { cp, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tsconfigTarget = resolve(root, 'lib/tsconfig');
const testTarget = resolve(root, 'lib/test');

await mkdir(tsconfigTarget, { recursive: true });
await mkdir(testTarget, { recursive: true });
await cp(resolve(root, 'src/tsconfig'), tsconfigTarget, { recursive: true });
await cp(resolve(root, 'src/test/bunfig.toml'), resolve(testTarget, 'bunfig.toml'));
