import { expect, test, vitest } from 'vitest';
import { MockOpenapiClient } from './mocks/mock-openapi-client';

test('生成请求', async () => {
  const spy = vitest.fn();
  const client = new MockOpenapiClient({
    async request(opts) {
      spy(opts);
      return 'foo-bar';
    },
  });

  const result = await client['request']('/users', 'post', {});
  expect(result).toBe('foo-bar');
  expect(spy).toBeCalledWith({
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    requestBodyType: 'application/json',
    responseType: 'json',
    uri: '/users',
  });
});

test('替换路径参数', async () => {
  const spy = vitest.fn();
  const client = new MockOpenapiClient({
    async request(opts) {
      spy(opts);
      return 'foo-bar';
    },
  });

  await client['request']('/users/{id}/{name}', 'post', {
    params: { id: 1, name: 'abc', name1: 'abc' },
  });
  expect(spy).toBeCalledWith({
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    requestBodyType: 'application/json',
    responseType: 'json',
    uri: '/users/1/abc',
    params: { id: 1, name: 'abc', name1: 'abc' },
  });
});
