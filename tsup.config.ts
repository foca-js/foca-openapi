import { readdirSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/bin.ts'],
    splitting: false,
    sourcemap: true,
    clean: true,
    format: ['esm'],
    platform: 'node',
    tsconfig: './tsconfig.json',
    target: 'node18',
    shims: false,
    dts: false,
    outExtension: () => ({ js: '.mjs' }),
  },
  {
    entry: ['src/index.ts'],
    splitting: false,
    sourcemap: true,
    clean: true,
    format: ['cjs', 'esm'],
    platform: 'node',
    tsconfig: './tsconfig.json',
    target: 'node18',
    shims: false,
    dts: true,
    legacyOutput: true,
    onSuccess: `echo '{"type":"module"}' > dist/esm/package.json`,
  },
  {
    entry: readdirSync(path.resolve('src', 'adapters')).map(
      (filename) => 'src/adapters/' + filename,
    ),
    splitting: false,
    sourcemap: true,
    clean: true,
    format: ['cjs', 'esm'],
    platform: 'node',
    tsconfig: './tsconfig.json',
    target: 'node18',
    shims: false,
    dts: true,
    legacyOutput: true,
    outDir: './adapters',
    onSuccess: `echo '{"type":"module"}' > adapters/esm/package.json`,
  },
]);
