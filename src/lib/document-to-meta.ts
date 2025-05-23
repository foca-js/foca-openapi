import type { OpenAPIV3 } from 'openapi-types';
import { methods, type Methods } from './adapter';
import { snakeCase } from 'lodash-es';
import { parseParameters } from './parse-parameters';
import { parseRequestBody } from './parse-request-body';
import { parseResponse } from './parse-response';
import type { OpenapiClientConfig } from '../define-config';

export type Metas = Record<
  Methods,
  {
    key: string;
    uri: string;
    method: Methods;
    operationId?: string;
    contentTypes: string[];
    query: { optional: boolean; types: [string] | [] };
    params: { optional: boolean; types: [string] | [] };
    body: { optional: boolean; types: string[] };
    response: { types: string[] };
    responseTypes: string[];
    description?: string;
    deprecated?: boolean;
    tags: string[];
  }[]
>;

export const documentToMeta = (
  docs: OpenAPIV3.Document,
  rpcName: OpenapiClientConfig['rpcName'],
  looseInputNumber?: boolean,
) => {
  const metas: Metas = {
    get: [],
    post: [],
    put: [],
    patch: [],
    delete: [],
  };

  Object.entries(docs.paths).forEach(([uri, pathItem]) => {
    methods.forEach((method) => {
      if (!pathItem || !pathItem[method]) return;
      const methodItem = pathItem[method]!;
      metas[method].push({
        uri,
        method,
        key: snakeCase(
          rpcName === 'operationId' && methodItem.operationId
            ? methodItem.operationId
            : `${method}_${uri.replaceAll(/{(.+?)}/g, '_by_$1')}`,
        ),
        query: parseParameters(docs, pathItem, methodItem, 'query', looseInputNumber),
        params: parseParameters(docs, pathItem, methodItem, 'path', looseInputNumber),
        ...parseRequestBody(docs, methodItem),
        ...parseResponse(docs, methodItem),
        deprecated: methodItem.deprecated,
        description: methodItem.description,
        tags: methodItem.tags && methodItem.tags.length ? methodItem.tags : ['default'],
      });
    });
  });

  return metas;
};
