import { expect, test } from 'vitest';
import { generateComments } from '../../src/lib/generate-comments';

test('空值', () => {
  expect(generateComments({})).toMatchInlineSnapshot(`""`);
});

test('未废弃', () => {
  expect(generateComments({ deprecated: false })).toMatchInlineSnapshot(`""`);
});

test('废弃', () => {
  expect(generateComments({ deprecated: true })).toMatchInlineSnapshot(`
    "
    /**
    * @deprecated 
    */
    "
  `);
});

test('空描述', () => {
  expect(generateComments({ description: '' })).toMatchInlineSnapshot(`""`);
});

test('描述', () => {
  expect(generateComments({ description: 'foo === bar' })).toMatchInlineSnapshot(`
    "
    /**
    * foo === bar 
    */
    "
  `);
});

test('废弃+描述', () => {
  expect(generateComments({ description: 'foo === bar', deprecated: true }))
    .toMatchInlineSnapshot(`
    "
    /**
    * foo === bar
    * @deprecated 
    */
    "
  `);
});
