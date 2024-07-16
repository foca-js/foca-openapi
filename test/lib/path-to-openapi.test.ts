import { expect, test, vitest } from 'vitest';
import { pathToOpenapi } from '../../src/lib/path-to-openapi';
import path from 'node:path';
import { readFileSync } from 'node:fs';

test('从本地获取json', async () => {
  const result = await pathToOpenapi('./openapi/openapi.json');
  expect(JSON.stringify(result)).toMatchFileSnapshot(
    path.resolve('openapi', 'openapi.json'),
  );
});

test('从本地获取yaml', async () => {
  const result = await pathToOpenapi('./openapi/openapi.yaml');
  expect(JSON.stringify(result)).toMatchFileSnapshot(
    path.resolve('openapi', 'openapi.json'),
  );
});

test('从远程获取', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = vitest.fn().mockResolvedValueOnce({
    ok: true,
    text: () => {
      return Promise.resolve(
        JSON.stringify(readFileSync(path.resolve('openapi', 'openapi.json'), 'utf8')),
      );
    },
  });
  const result = await pathToOpenapi('http://example.com');
  expect(result).toMatchFileSnapshot(path.resolve('openapi', 'openapi.json'));
  globalThis.fetch = originalFetch;
});

test('解析失败则直接报错', async () => {
  await expect(() => pathToOpenapi('./cli.ts')).rejects.toThrowError();
});
