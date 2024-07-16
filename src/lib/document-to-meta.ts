import type { OpenAPIV3 } from 'openapi-types';
import { methods, type Methods } from './adapter';
import { snakeCase } from 'lodash-es';
import { parseParameters } from './parse-parameters';
import { parseRequestBody } from './parse-request-body';
import { parseResponse } from './parse-response';

export type Metas = Record<
  Methods,
  {
    key: string;
    uri: string;
    contentTypes: string[];
    query: { optional: boolean; types: [string] | [] };
    params: { optional: boolean; types: [string] | [] };
    body: { optional: boolean; types: string[] };
    response: { types: string[] };
    responseTypes: string[];
  }[]
>;

export const documentToMeta = (docs: OpenAPIV3.Document) => {
  const metas: Metas = {
    get: [],
    post: [],
    put: [],
    patch: [],
    delete: [],
  };

  Object.entries(docs.paths).forEach(([uri, pathItem]) => {
    methods.forEach((method) => {
      if (pathItem?.[method]) {
        const methodItem = pathItem[method];
        metas[method].push({
          uri,
          key:
            methodItem.operationId ||
            snakeCase(`${method}_${uri.replaceAll(':', '_by_')}`),
          query: parseParameters(docs, pathItem, methodItem, 'query'),
          params: parseParameters(docs, pathItem, methodItem, 'path'),
          ...parseRequestBody(docs, methodItem),
          ...parseResponse(docs, methodItem),
        });
      }
    });
  });

  return metas;
};
