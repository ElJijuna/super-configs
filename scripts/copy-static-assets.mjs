import { cp, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const target = resolve(root, 'lib/tsconfig');

await mkdir(target, { recursive: true });
await cp(resolve(root, 'src/tsconfig'), target, { recursive: true });
