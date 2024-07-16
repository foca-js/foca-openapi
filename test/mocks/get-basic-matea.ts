import type { Metas } from '../../src/lib/document-to-meta';

export const getBasicMetas = (merge?: Partial<Metas>): Metas => {
  return {
    get: [],
    post: [],
    put: [],
    patch: [],
    delete: [],
    ...merge,
  };
};
