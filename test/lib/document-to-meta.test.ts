import { expect, test } from 'vitest';
import { getBasicDocument } from '../mocks/get-basic-document';
import { documentToMeta } from '../../src/lib/document-to-meta';

test('key从路由获取', () => {
  const docs = getBasicDocument({
    '/users/{id}/{name}': {
      get: {
        operationId: 'abc',
        responses: {},
      },
    },
  });

  expect(documentToMeta(docs, 'method+uri')['get'][0]!.key).toBe(
    'get_users_by_id_by_name',
  );
});

test('key从operationId获取', () => {
  const docs = getBasicDocument({
    '/users/{id}/{name}': {
      get: {
        operationId: 'Abc_def IJK',
        responses: {},
      },
    },
  });

  expect(documentToMeta(docs, 'operationId')['get'][0]!.key).toBe('abc_def_ijk');
});
