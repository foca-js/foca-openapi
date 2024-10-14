import { test, expect } from 'vitest';
import { getBasicDocument } from '../mocks/get-basic-document';
import { refToObject } from '../../src/lib/ref-to-object';

test('中文被转译', () => {
  const docs = getBasicDocument();
  docs.components ||= {};
  docs.components.parameters ||= {};
  docs.components.parameters['你好'] = { name: 'foo', in: 'query' };

  expect(refToObject(docs, { $ref: '#/components/parameters/你好' })).toMatchObject({
    in: 'query',
    name: 'foo',
  });

  expect(
    refToObject(docs, { $ref: '#/components/parameters/%E4%BD%A0%E5%A5%BD' }),
  ).toMatchObject({
    in: 'query',
    name: 'foo',
  });
});
