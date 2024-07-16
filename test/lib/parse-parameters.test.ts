import { expect, test } from 'vitest';
import { getBasicDocument } from '../mocks/get-basic-document';
import { parseParameters } from '../../src/lib/parse-parameters';

const docs = getBasicDocument({
  '/': {
    parameters: [
      {
        name: 'bazz',
        in: 'query',
        required: true,
        schema: { type: 'string' },
      },
    ],
    get: {
      responses: {},
      parameters: [
        {
          name: 'foo',
          in: 'query',
          required: true,
          schema: { type: 'integer' },
        },
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
        },
        {
          name: 'bar',
          in: 'query',
          required: false,
          schema: { type: 'integer' },
        },
        { $ref: '#/components/parameters/refA' },
        { $ref: '#/components/parameters/refB' },
      ],
    },
  },
});

docs.components = {
  parameters: {
    refA: {
      name: 'ref_a',
      in: 'query',
      required: false,
      schema: { type: 'integer' },
    },
    refB: {
      name: 'ref_b',
      in: 'path',
      required: true,
      schema: { type: 'integer' },
    },
  },
};

test('解析查询字符串', () => {
  const result = parseParameters(docs, docs.paths['/']!, docs.paths['/']!.get!, 'query');
  expect(result).toMatchInlineSnapshot(`
    {
      "optional": false,
      "types": [
        "{ foo: number
          ;
    bar?: number
          ;
    ref_a?: number
          ;
    bazz: string
           }",
      ],
    }
  `);
});

test('解析路径参数', () => {
  const result = parseParameters(docs, docs.paths['/']!, docs.paths['/']!.get!, 'path');
  expect(result).toMatchInlineSnapshot(`
    {
      "optional": false,
      "types": [
        "{ id: number
          ;
    ref_b: number
           }",
      ],
    }
  `);
});

test('未找到参数则变成可选', () => {
  const result = parseParameters(docs, docs.paths['/']!, docs.paths['/']!.get!, 'path_a');
  expect(result).toMatchInlineSnapshot(`
    {
      "optional": true,
      "types": [],
    }
  `);
});

test('允许参数内没有schema结构', () => {
  const docs = getBasicDocument({
    '/': {
      get: {
        parameters: [
          {
            name: 'foo',
            in: 'query',
            required: true,
          },
          {
            name: 'bar',
            in: 'query',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {},
      },
    },
  });
  const result = parseParameters(docs, docs.paths['/']!, docs.paths['/']!.get!, 'query');
  expect(result).toMatchInlineSnapshot(`
    {
      "optional": false,
      "types": [
        "{ bar: string
           }",
      ],
    }
  `);
});

test('所有结构都不是必填时，optional=true', () => {
  const docs = getBasicDocument({
    '/': {
      get: {
        parameters: [
          {
            name: 'foo',
            in: 'query',
            required: false,
            schema: { type: 'string' },
          },
          {
            name: 'bar',
            in: 'query',
            required: false,
            schema: { type: 'string' },
          },
        ],
        responses: {},
      },
    },
  });
  const result = parseParameters(docs, docs.paths['/']!, docs.paths['/']!.get!, 'query');
  expect(result).toMatchInlineSnapshot(`
    {
      "optional": true,
      "types": [
        "{ foo?: string
          ;
    bar?: string
           }",
      ],
    }
  `);
});
