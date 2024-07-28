import { expect, test } from 'vitest';
import { getBasicDocument } from '../mocks/get-basic-document';
import { parseRequestBody } from '../../src/lib/parse-request-body';

test('从requestBody字段获取', () => {
  const docs = getBasicDocument({
    '/': {
      get: {
        responses: {},
        requestBody: {
          content: {
            'application/json': {
              schema: { type: 'object', properties: { foo: { type: 'string' } } },
            },
          },
        },
      },
    },
  });

  const result = parseRequestBody(docs, docs.paths['/']!.get!);
  expect(result).toMatchInlineSnapshot(`
    {
      "body": {
        "optional": false,
        "types": [
          "({ "foo"?: (string) })",
        ],
      },
      "contentTypes": [
        "application/json",
      ],
    }
  `);
});

test('多个返回类型', () => {
  const docs = getBasicDocument({
    '/': {
      get: {
        responses: {},
        requestBody: {
          content: {
            'application/json': {
              schema: { type: 'object', properties: { foo: { type: 'string' } } },
            },
            'text/plain': { schema: { type: 'string' } },
          },
        },
      },
    },
  });

  const result = parseRequestBody(docs, docs.paths['/']!.get!);
  expect(result).toMatchInlineSnapshot(`
    {
      "body": {
        "optional": false,
        "types": [
          "({ "foo"?: (string) })",
          "(string)",
        ],
      },
      "contentTypes": [
        "application/json",
        "text/plain",
      ],
    }
  `);
});

test('没有requestBody则认为是选填的', () => {
  const docs = getBasicDocument({
    '/': {
      get: {
        responses: {},
      },
    },
  });

  const result = parseRequestBody(docs, docs.paths['/']!.get!);
  expect(result).toMatchInlineSnapshot(`
    {
      "body": {
        "optional": true,
        "types": [],
      },
      "contentTypes": [],
    }
  `);
});

test('没有schema则认为是选填的', () => {
  const docs = getBasicDocument({
    '/': {
      get: {
        responses: {},
        requestBody: {
          content: {
            'application/json': {},
          },
        },
      },
    },
  });

  const result = parseRequestBody(docs, docs.paths['/']!.get!);
  expect(result).toMatchInlineSnapshot(`
    {
      "body": {
        "optional": true,
        "types": [],
      },
      "contentTypes": [],
    }
  `);
});

test('*/* 类型被忽略', () => {
  const docs = getBasicDocument({
    '/': {
      get: {
        responses: {},
        requestBody: {
          content: {
            '*/*': {
              schema: { type: 'object', properties: { foo: { type: 'string' } } },
            },
          },
        },
      },
    },
  });

  const result = parseRequestBody(docs, docs.paths['/']!.get!);
  expect(result).toMatchInlineSnapshot(`
    {
      "body": {
        "optional": false,
        "types": [
          "({ "foo"?: (string) })",
        ],
      },
      "contentTypes": [],
    }
  `);
});
