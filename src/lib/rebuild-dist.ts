import fs from 'node:fs/promises';
import path from 'node:path';
import * as tsup from 'tsup';

export const rebuildDist = async (distDir: string, content: string) => {
  const src = path.normalize(path.join(distDir, '..', 'src'));

  await fs.writeFile(path.join(src, 'openapi-runtime.ts'), content);
  await tsup.build({
    entry: [path.join(src, 'index.ts')],
    outDir: distDir,
    splitting: true,
    sourcemap: true,
    clean: false,
    format: ['cjs', 'esm'],
    platform: 'node',
    target: 'es2020',
    shims: false,
    dts: true,
    legacyOutput: true,
    silent: true,
  });
};
