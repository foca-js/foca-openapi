import { expect, test, vitest } from 'vitest';
import { pathToOpenapi } from '../../src/lib/path-to-openapi';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import type { OpenAPIV3 } from 'openapi-types';
import axios from 'foca-axios';

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
  const originalFetch = axios.request;
  axios.request = vitest.fn().mockImplementation(async () => {
    return JSON.stringify(readFileSync(path.resolve('openapi', 'openapi.json'), 'utf8'));
  });
  const result = await pathToOpenapi('http://example.com');
  expect(result).toMatchFileSnapshot(path.resolve('openapi', 'openapi.json'));
  axios.request = originalFetch;
});

test('支持加载事件', async () => {
  let eventDocs: OpenAPIV3.Document | undefined;
  const result = await pathToOpenapi('./openapi/openapi.json', (docs) => {
    eventDocs = docs;
  });
  expect(result).toBe(eventDocs);
  expect(JSON.stringify(result)).toMatchFileSnapshot(
    path.resolve('openapi', 'openapi.json'),
  );
});

test('解析失败则直接报错', async () => {
  await expect(() => pathToOpenapi('./cli.ts')).rejects.toThrowError();
});
