import { describe, expect, test } from 'vitest';
import { parseSchema } from '../../src/lib/parse-schema';
import { getBasicDocument } from '../mocks/get-basic-document';

const docs = getBasicDocument();

describe('常规', () => {
  test('数字', () => {
    expect(parseSchema(docs, { type: 'number' })).toMatchInlineSnapshot(`"number"`);
    expect(parseSchema(docs, { type: 'integer' })).toMatchInlineSnapshot(`"number"`);
  });

  test('字符串', () => {
    const type = parseSchema(docs, { type: 'string' });
    expect(type).toMatchInlineSnapshot(`"string"`);
  });

  test('布尔', () => {
    const type = parseSchema(docs, { type: 'boolean' });
    expect(type).toMatchInlineSnapshot(`"boolean"`);
  });

  test('数组', () => {
    const type = parseSchema(docs, { type: 'array', items: { type: 'string' } });
    expect(type).toMatchInlineSnapshot(`"(string)[]"`);
  });

  test('对象数组', () => {
    const type = parseSchema(docs, {
      type: 'array',
      items: {
        type: 'object',
        properties: { foo: { type: 'string' } },
        required: ['foo'],
      },
    });
    expect(type).toMatchInlineSnapshot(`"({ foo: string })[]"`);
  });

  test('对象', () => {
    const type = parseSchema(docs, {
      type: 'object',
      properties: { foo: { type: 'string' } },
    });
    expect(type).toMatchInlineSnapshot(`"{ foo?: string }"`);
  });

  test('对象属性包含描述', () => {
    const type = parseSchema(docs, {
      type: 'object',
      properties: { foo: { type: 'string', description: 'foo=bar' } },
    });
    expect(type).toMatchInlineSnapshot(`
      "{ 
      /**
      * foo=bar 
      */
      foo?: string }"
    `);
  });

  test('空对象', () => {
    const type = parseSchema(docs, { type: 'object' });
    expect(type).toMatchInlineSnapshot(`"{  }"`);
  });

  test('文件', () => {
    const type = parseSchema(docs, { type: 'string', format: 'binary' });
    expect(type).toMatchInlineSnapshot(`"Blob"`);
  });

  test('oneOf', () => {
    const type = parseSchema(docs, {
      oneOf: [{ type: 'string' }, { type: 'boolean' }, { type: 'integer' }],
    });
    expect(type).toMatchInlineSnapshot(`"string | boolean | number"`);
  });

  test('枚举', () => {
    expect(
      parseSchema(docs, { enum: ['foo', 'bar', 'baz', 1, 2] }),
    ).toMatchInlineSnapshot(`""foo" | "bar" | "baz" | 1 | 2"`);
  });
});

describe('nullable', () => {
  test('数字', () => {
    expect(parseSchema(docs, { type: 'number', nullable: true })).toMatchInlineSnapshot(
      `"number | null"`,
    );
  });

  test('字符串', () => {
    expect(parseSchema(docs, { type: 'string', nullable: true })).toMatchInlineSnapshot(
      `"string | null"`,
    );
  });

  test('布尔', () => {
    expect(parseSchema(docs, { type: 'boolean', nullable: true })).toMatchInlineSnapshot(
      `"boolean | null"`,
    );
  });

  test('数组', () => {
    expect(
      parseSchema(docs, { type: 'array', items: { type: 'string' }, nullable: true }),
    ).toMatchInlineSnapshot(`"(string)[] | null"`);
  });

  test('数组内', () => {
    expect(
      parseSchema(docs, { type: 'array', items: { type: 'string', nullable: true } }),
    ).toMatchInlineSnapshot(`"(string | null)[]"`);
  });

  test('对象', () => {
    expect(parseSchema(docs, { type: 'object', nullable: true })).toMatchInlineSnapshot(
      `"{  } | null"`,
    );
  });

  test('对象内', () => {
    expect(
      parseSchema(docs, {
        type: 'object',
        properties: { foo: { type: 'string', nullable: true } },
      }),
    ).toMatchInlineSnapshot(`"{ foo?: string | null }"`);
  });

  test('二进制', () => {
    expect(
      parseSchema(docs, { type: 'string', format: 'binary', nullable: true }),
    ).toMatchInlineSnapshot(`"Blob | null"`);
  });

  test('枚举', () => {
    expect(
      parseSchema(docs, { enum: ['foo', 'bar', 'baz'], nullable: true }),
    ).toMatchInlineSnapshot(`""foo" | "bar" | "baz" | null"`);
  });
});

test('未知类型', () => {
  // @ts-expect-error
  const type = parseSchema(docs, { type: 'any' });
  expect(type).toMatchInlineSnapshot(`"unknown"`);
});
