import { expect, test } from 'vitest';
import { getBasicDocument } from '../mocks/get-basic-document';
import { parseResponse } from '../../src/lib/parse-response';

test('从response字段获取', () => {
  const docs = getBasicDocument({
    '/': {
      get: {
        responses: {
          200: {
            description: '',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { foo: { type: 'string' } } },
              },
            },
          },
        },
      },
    },
  });
  const result = parseResponse(docs, docs.paths['/']!.get!);
  expect(result).toMatchInlineSnapshot(`
    {
      "response": {
        "types": [
          "({ "foo"?: (string) })",
        ],
      },
      "responseTypes": [
        "application/json",
      ],
    }
  `);
});

test('只保留2xx状态', () => {
  const docs = getBasicDocument({
    '/': {
      get: {
        responses: {
          200: {
            description: '',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { foo: { type: 'string' } } },
              },
            },
          },
          '20x': {
            description: '',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { foo1: { type: 'string' } } },
              },
            },
          },
          400: {
            description: '',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { foo2: { type: 'string' } } },
              },
            },
          },
        },
      },
    },
  });
  const result = parseResponse(docs, docs.paths['/']!.get!);
  expect(result).toMatchInlineSnapshot(`
    {
      "response": {
        "types": [
          "({ "foo"?: (string) })",
          "({ "foo1"?: (string) })",
        ],
      },
      "responseTypes": [
        "application/json",
      ],
    }
  `);
});

test('*/* 类型被忽略', () => {
  const docs = getBasicDocument({
    '/': {
      get: {
        responses: {
          200: {
            description: '',
            content: {
              '*/*': {
                schema: { type: 'object', properties: { foo: { type: 'string' } } },
              },
            },
          },
        },
      },
    },
  });
  const result = parseResponse(docs, docs.paths['/']!.get!);
  expect(result).toMatchInlineSnapshot(`
    {
      "response": {
        "types": [
          "({ "foo"?: (string) })",
        ],
      },
      "responseTypes": [],
    }
  `);
});
