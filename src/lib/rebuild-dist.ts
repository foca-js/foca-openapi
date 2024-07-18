import fs from 'node:fs/promises';
import path from 'node:path';
import * as tsup from 'tsup';

export const rebuildDist = async (distDir: string, content: string) => {
  const src = path.normalize(path.join(distDir, '..', 'src'));
  const packageJson = await fs.readFile(path.join(distDir, '..', 'package.json'), 'utf8');
  const deps = Object.keys(JSON.parse(packageJson).dependencies);

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
    external: deps,
  });
};
