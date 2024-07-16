import type { OpenAPIV3 } from 'openapi-types';
import type { OpenapiClientConfig } from '../define-config';

export const filterUrl = (docs: OpenAPIV3.Document, config: OpenapiClientConfig) => {
  if (!config.includeUriPrefix) return;
  const patterns = Array.isArray(config.includeUriPrefix)
    ? config.includeUriPrefix
    : [config.includeUriPrefix];
  if (!patterns.length) return;

  Object.keys(docs.paths).forEach((uri) => {
    const keep = patterns.some((pattern) => {
      return typeof pattern === 'string' ? uri.startsWith(pattern) : pattern.test(uri);
    });
    keep || Reflect.deleteProperty(docs.paths, uri);
  });
};
