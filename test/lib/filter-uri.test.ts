import { expect, test } from 'vitest';
import { getBasicDocument } from '../mocks/get-basic-document';
import { filterUri } from '../../src/lib/filter-uri';

test('未指定过滤路由则不处理', () => {
  const docs = getBasicDocument({
    '/': {},
    '/test/a': {},
    '/test/b': {},
    '/other': {},
  });

  filterUri(docs, { url: '' });
  expect(Object.keys(docs.paths)).toMatchInlineSnapshot(`
    [
      "/",
      "/test/a",
      "/test/b",
      "/other",
    ]
  `);
  filterUri(docs, { url: '', includeUriPrefix: [] });
  expect(Object.keys(docs.paths)).toMatchInlineSnapshot(`
    [
      "/",
      "/test/a",
      "/test/b",
      "/other",
    ]
  `);
});

test('不符合前缀的路由被删除', () => {
  const docs = getBasicDocument({
    '/': {},
    '/test/a': {},
    '/test/b': {},
    '/other': {},
  });

  filterUri(docs, { url: '', includeUriPrefix: '/test' });
  expect(Object.keys(docs.paths)).toMatchInlineSnapshot(`
    [
      "/test/a",
      "/test/b",
    ]
  `);
});

test('同时过滤多个路由', () => {
  const docs = getBasicDocument({
    '/': {},
    '/test/a': {},
    '/test/b': {},
    '/other/a/b/c': {},
    '/foo/bar': {},
  });

  filterUri(docs, { url: '', includeUriPrefix: ['/test', '/foo'] });
  expect(Object.keys(docs.paths)).toMatchInlineSnapshot(`
    [
      "/test/a",
      "/test/b",
      "/foo/bar",
    ]
  `);
});

test('支持正则表达式', () => {
  const docs = getBasicDocument({
    '/': {},
    '/test/a': {},
    '/test/b': {},
    '/other/a/b/c': {},
    '/foo/bar': {},
  });

  filterUri(docs, { url: '', includeUriPrefix: [/\/a/] });
  expect(Object.keys(docs.paths)).toMatchInlineSnapshot(`
    [
      "/test/a",
      "/other/a/b/c",
    ]
  `);
});
