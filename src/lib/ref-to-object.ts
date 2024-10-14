import type { OpenAPIV3 } from 'openapi-types';

export const refToObject = <T extends object>(
  docs: OpenAPIV3.Document,
  data: T | OpenAPIV3.ReferenceObject,
): T => {
  if ('$ref' in data) {
    const target = data.$ref.split('/').reduce<any>((carry, pathName) => {
      if (pathName === '#') return carry;
      return carry[pathName] || carry[decodeURIComponent(pathName)];
    }, docs);
    return target as T;
  }
  return data;
};
