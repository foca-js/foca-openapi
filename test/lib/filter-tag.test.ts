import { expect, test } from 'vitest';
import { getBasicDocument } from '../mocks/get-basic-document';
import { filterTag } from '../../src/lib/filter-tag';

test('未指定过滤标签则不处理', () => {
  const docs = getBasicDocument({
    '/': {
      get: { responses: {} },
      post: { tags: ['abc'], responses: {} },
      put: { tags: ['abc', 'def'], responses: {} },
    },
  });

  filterTag(docs, { path: '' });
  expect(Object.keys(docs.paths['/'] || {})).toMatchInlineSnapshot(`
    [
      "get",
      "post",
      "put",
    ]
  `);
  filterTag(docs, { path: '', includeTag: [] });
  expect(Object.keys(docs.paths['/'] || {})).toMatchInlineSnapshot(`
    [
      "get",
      "post",
      "put",
    ]
  `);
});

test('未提供标签的接口会被删除', () => {
  const docs = getBasicDocument({
    '/': {
      get: { responses: {} },
      post: { tags: ['abc'], responses: {} },
      put: { tags: ['abc', 'def'], responses: {} },
    },
  });

  filterTag(docs, { path: '', includeTag: 'abc' });
  expect(Object.keys(docs.paths['/'] || {})).toMatchInlineSnapshot(`
    [
      "post",
      "put",
    ]
  `);
});

test('不符合的标签被删除', () => {
  const docs = getBasicDocument({
    '/': {
      get: { responses: {} },
      post: { tags: ['abc'], responses: {} },
      put: { tags: ['abc', 'def'], responses: {} },
      patch: { tags: ['ac', 'def'], responses: {} },
    },
  });

  filterTag(docs, { path: '', includeTag: 'def' });
  expect(Object.keys(docs.paths['/'] || {})).toMatchInlineSnapshot(`
    [
      "put",
      "patch",
    ]
  `);
});

test('同时过滤多个标签', () => {
  const docs = getBasicDocument({
    '/': {
      get: { responses: {} },
      post: { tags: ['abc'], responses: {} },
      put: { tags: ['ijk', 'mn'], responses: {} },
      patch: { tags: ['ac', 'def'], responses: {} },
      delete: { tags: ['ac', 'abc', 'bc'], responses: {} },
    },
  });

  filterTag(docs, { path: '', includeTag: ['mn', 'def'] });
  expect(Object.keys(docs.paths['/'] || {})).toMatchInlineSnapshot(`
    [
      "put",
      "patch",
    ]
  `);
});
