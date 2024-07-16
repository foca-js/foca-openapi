import type { OpenAPIV3 } from 'openapi-types';
import type { OpenapiClientConfig } from '../define-config';
import { methods } from './adapter';
import { intersection } from 'lodash-es';

export const filterTag = (docs: OpenAPIV3.Document, config: OpenapiClientConfig) => {
  if (!config.includeTag) return;
  const tags = Array.isArray(config.includeTag) ? config.includeTag : [config.includeTag];
  if (!tags.length) return;

  Object.keys(docs.paths).forEach((uri) => {
    const pathItem = docs.paths[uri]!;
    methods.forEach((method) => {
      const methodItem = pathItem[method];
      if (
        !methodItem ||
        !methodItem.tags ||
        !intersection(methodItem.tags, tags).length
      ) {
        Reflect.deleteProperty(pathItem, method);
      }
    });
  });
};
