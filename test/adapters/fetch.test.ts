import { afterEach, beforeEach, expect, test, vitest, type Mock } from 'vitest';
import { methods } from '../../src';
import { utils } from '../../src/utils';
import { fetchAdapter } from '../../src/adapters/fetch';

const originalFetch = globalThis.fetch;
let spy: Mock;

beforeEach(() => {
  spy = vitest.fn().mockResolvedValueOnce({
    ok: true,
    json: () => {
      return { foo: 'bar' };
    },
    text: () => 'foo-bar',
  });
  globalThis.fetch = spy;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test.each(methods)('常规请求 %s', async (method) => {
  const adapter = fetchAdapter({ baseURL: 'http://example.com' });
  const response = await adapter.request(
    {
      uri: '/foo',
      method,
      requestBodyType: 'application/json',
      responseType: 'json',
      headers: {},
      timeout: 2000,
    },
    utils,
  );
  expect(response).toMatchObject({ foo: 'bar' });
  expect(spy).toHaveBeenCalledWith('http://example.com/foo', {
    body: undefined,
    credentials: 'omit',
    headers: {},
    method,
  });
});

test('credentials=true时转换成same-origin', async () => {
  const adapter = fetchAdapter({ baseURL: 'http://example.com' });
  const response = await adapter.request(
    {
      uri: '/foo',
      method: 'get',
      requestBodyType: 'application/json',
      responseType: 'json',
      headers: {},
      credentials: true,
    },
    utils,
  );
  expect(response).toMatchObject({ foo: 'bar' });
  expect(spy).toHaveBeenCalledWith('http://example.com/foo', {
    body: undefined,
    credentials: 'same-origin',
    headers: {},
    method: 'get',
  });
});

test('credentials是字符串直接使用', async () => {
  const adapter = fetchAdapter({ baseURL: 'http://example.com' });
  const response = await adapter.request(
    {
      uri: '/foo',
      method: 'get',
      requestBodyType: 'application/json',
      responseType: 'json',
      headers: {},
      credentials: 'include',
    },
    utils,
  );
  expect(response).toMatchObject({ foo: 'bar' });
  expect(spy).toHaveBeenCalledWith('http://example.com/foo', {
    body: undefined,
    credentials: 'include',
    headers: {},
    method: 'get',
  });
});

test('字符串类型的响应', async () => {
  const adapter = fetchAdapter({ baseURL: 'http://example.com' });
  const response = await adapter.request(
    {
      uri: '/foo',
      method: 'get',
      requestBodyType: 'application/json',
      responseType: 'text',
      headers: {},
      credentials: true,
    },
    utils,
  );
  expect(response).toBe('foo-bar');
});
