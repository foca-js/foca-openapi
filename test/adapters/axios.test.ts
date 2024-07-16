import { expect, test, vitest } from 'vitest';
import { methods } from '../../src';
import { utils } from '../../src/utils';
import { axiosAdapter } from '../../src/adapters/axios';
import { Axios } from 'axios';

const axios = new Axios({ baseURL: 'http://example.com' });

test.each(methods)('常规请求 %s', async (method) => {
  const adapter = axiosAdapter(axios);
  const spy = vitest.spyOn(axios, 'request').mockImplementation(async () => {
    return {
      data: { foo: 'bar' },
    } as any;
  });

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
  expect(spy).toHaveBeenCalledWith({
    url: '/foo',
    data: undefined,
    headers: {},
    method,
    timeout: 2000,
    responseType: 'json',
    params: undefined,
    withCredentials: undefined,
  });

  spy.mockRestore();
});

test('credentials字符串转换为布尔值', async () => {
  const adapter = axiosAdapter(axios);
  const spy = vitest.spyOn(axios, 'request').mockImplementation(async () => {
    return {
      data: { foo: 'bar' },
    } as any;
  });
  await adapter.request(
    {
      uri: '/foo',
      method: 'get',
      requestBodyType: 'application/json',
      responseType: 'json',
      headers: {},
      credentials: 'same-origin',
      timeout: 2000,
    },
    utils,
  );
  expect(spy).toHaveBeenLastCalledWith({
    url: '/foo',
    data: undefined,
    headers: {},
    method: 'get',
    timeout: 2000,
    responseType: 'json',
    params: undefined,
    withCredentials: true,
  });

  await adapter.request(
    {
      uri: '/foo',
      method: 'get',
      requestBodyType: 'application/json',
      responseType: 'json',
      headers: {},
      credentials: 'include',
      timeout: 2000,
    },
    utils,
  );
  expect(spy).toHaveBeenLastCalledWith({
    url: '/foo',
    data: undefined,
    headers: {},
    method: 'get',
    timeout: 2000,
    responseType: 'json',
    params: undefined,
    withCredentials: true,
  });

  await adapter.request(
    {
      uri: '/foo',
      method: 'get',
      requestBodyType: 'application/json',
      responseType: 'json',
      headers: {},
      credentials: 'omit',
      timeout: 2000,
    },
    utils,
  );
  expect(spy).toHaveBeenLastCalledWith({
    url: '/foo',
    data: undefined,
    headers: {},
    method: 'get',
    timeout: 2000,
    responseType: 'json',
    params: undefined,
    withCredentials: false,
  });

  spy.mockRestore();
});

test('字符串类型的响应', async () => {
  const adapter = axiosAdapter(axios);
  const spy = vitest.spyOn(axios, 'request').mockImplementation(async () => {
    return {
      data: 'foo-bar',
    } as any;
  });

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

  spy.mockRestore();
});
