import { expect, test } from 'vitest';
import { parseSchemaType } from '../../src/lib/parse-schema-type';
import { getBasicDocument } from '../mocks/get-basic-document';

const docs = getBasicDocument();

test('字符串', () => {
  const type = parseSchemaType(docs, { type: 'string' });
  expect(type).toMatchInlineSnapshot(`"string"`);
});

test('数字', () => {
  expect(parseSchemaType(docs, { type: 'number' })).toMatchInlineSnapshot(`"number"`);
  expect(parseSchemaType(docs, { type: 'integer' })).toMatchInlineSnapshot(`"number"`);
});

test('布尔', () => {
  const type = parseSchemaType(docs, { type: 'boolean' });
  expect(type).toMatchInlineSnapshot(`"boolean"`);
});

test('数组', () => {
  const type = parseSchemaType(docs, { type: 'array', items: { type: 'string' } });
  expect(type).toMatchInlineSnapshot(`"string[]"`);
});

test('对象数组', () => {
  const type = parseSchemaType(docs, {
    type: 'array',
    items: { type: 'object', properties: { foo: { type: 'string' } }, required: ['foo'] },
  });
  expect(type).toMatchInlineSnapshot(`"{ foo: string }[]"`);
});

test('对象', () => {
  const type = parseSchemaType(docs, {
    type: 'object',
    properties: { foo: { type: 'string' } },
  });
  expect(type).toMatchInlineSnapshot(`"{ foo?: string }"`);
});

test('空对象', () => {
  const type = parseSchemaType(docs, { type: 'object' });
  expect(type).toMatchInlineSnapshot(`"{  }"`);
});

test('文件', () => {
  const type = parseSchemaType(docs, { type: 'string', format: 'binary' });
  expect(type).toMatchInlineSnapshot(`"Blob"`);
});

test('oneOf', () => {
  const type = parseSchemaType(docs, {
    oneOf: [{ type: 'string' }, { type: 'boolean' }, { type: 'integer' }],
  });
  expect(type).toMatchInlineSnapshot(`"string | boolean | number"`);
});

test('未知类型', () => {
  // @ts-expect-error
  const type = parseSchemaType(docs, { type: 'any' });
  expect(type).toMatchInlineSnapshot(`"never"`);
});
