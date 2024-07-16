import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { readdir, rm, writeFile } from 'fs/promises';
import path from 'path';
import { afterEach, expect, test } from 'vitest';
import prettier from 'prettier';

const prettierOptions: prettier.Options = {
  ...(await prettier.resolveConfig((await prettier.resolveConfigFile())!)!),
  parser: 'typescript',
};

afterEach(async () => {
  const src = path.resolve('src');
  const files = await readdir(src, { recursive: true });
  await Promise.all(
    files
      .filter(
        (file) =>
          file.endsWith('.d.ts') ||
          file.endsWith('.d.mts') ||
          file.endsWith('.d.cts') ||
          file.endsWith('.js') ||
          file.endsWith('.js.map'),
      )
      .map((file) => rm(path.join(src, file))),
  );
  await writeFile(path.join(src, 'openapi-runtime.ts'), 'export {};\n');
});

test('生成 bin.mjs', { timeout: 15_000 }, async () => {
  try {
    await rm('dist', { recursive: true });
  } catch {}
  execSync('npx tsup', { encoding: 'utf8', stdio: 'inherit' });
  expect(existsSync(path.resolve('dist', 'bin.mjs')));
});

test('生成runtime并重新打包', { timeout: 15_000 }, async () => {
  const dts = path.resolve('src', 'index.d.ts');

  try {
    await rm(dts);
  } catch {}
  execSync('npx tsx src/bin.ts', { encoding: 'utf8', stdio: 'inherit' });
  await expect(
    prettier.format(
      readFileSync(path.resolve('src', 'openapi-runtime.ts'), 'utf8'),
      prettierOptions,
    ),
  ).resolves.toMatchSnapshot();
  expect(readFileSync(dts, 'utf8')).toContain('declare namespace OpenapiClient {');
});
