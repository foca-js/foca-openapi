import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import { beforeAll, expect, test } from 'vitest';

beforeAll(async () => {
  try {
    await rm('dist', { recursive: true });
  } catch {}
  execSync('pnpm build', { encoding: 'utf8', stdio: 'inherit' });
}, 15_000);

test('生成 bin.mjs', async () => {
  expect(existsSync(path.resolve('dist', 'bin.mjs')));
});

test('写入指定文件', { timeout: 9_000 }, async () => {
  execSync('node dist/bin.mjs', { encoding: 'utf8', stdio: 'inherit' });
  expect(readFileSync(path.resolve('src', 'openapi', 'openapi.ts'), 'utf8')).toContain(
    'export namespace OpenapiClient {',
  );
});

test('配置数组生成多个client', { timeout: 9_000 }, async () => {
  execSync('node dist/bin.mjs -c openapi-array.config.ts', {
    encoding: 'utf8',
    stdio: 'inherit',
  });
  expect(readFileSync(path.resolve('src', 'openapi', 'foo.ts'), 'utf8')).toContain(
    'export namespace OpenapiClientFoo {',
  );
  expect(readFileSync(path.resolve('src', 'openapi', 'bar.ts'), 'utf8')).toContain(
    'export namespace OpenapiClientBar {',
  );
});

test('静默模式', { timeout: 9_000 }, async () => {
  execSync('node dist/bin.mjs --silent', { encoding: 'utf8', stdio: 'inherit' });
  expect(readFileSync(path.resolve('src', 'openapi', 'openapi.ts'), 'utf8')).toContain(
    'export namespace OpenapiClient {',
  );
});
