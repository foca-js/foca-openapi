import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { rm } from 'fs/promises';
import path from 'path';
import { beforeAll, expect, test } from 'vitest';

beforeAll(async () => {
  try {
    await rm('dist', { recursive: true });
  } catch {}
  execSync('npx tsup', { encoding: 'utf8', stdio: 'inherit' });
}, 15_000);

test('生成 bin.mjs', async () => {
  expect(existsSync(path.resolve('dist', 'bin.mjs')));
});

test('生成runtime并合并代码', { timeout: 9_000 }, async () => {
  execSync('node dist/bin.mjs', { encoding: 'utf8', stdio: 'inherit' });
  expect(readFileSync(path.resolve('dist', 'index.d.ts'), 'utf8')).toContain(
    'declare namespace OpenapiClient {',
  );
});
