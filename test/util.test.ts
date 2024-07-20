import { expect, test } from 'vitest';
import { utils } from '../src/utils';

test('查询字符串', () => {
  const result = utils.uriConcatQuery('/users', {
    foo: ['bar', 'baz'],
    age: 3,
  });
  expect(result).toMatchInlineSnapshot(`"/users?age=3&foo[]=bar&foo[]=baz"`);
});

test('拼接符号', () => {
  expect(utils.uriConcatQuery('/users?', { foo: 'bar' })).toMatchInlineSnapshot(
    `"/users?foo=bar"`,
  );
  expect(utils.uriConcatQuery('/users?ok', { foo: 'bar' })).toMatchInlineSnapshot(
    `"/users?ok&foo=bar"`,
  );
});
