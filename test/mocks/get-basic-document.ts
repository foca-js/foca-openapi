import type { OpenAPIV3 } from 'openapi-types';

export const getBasicDocument = (
  additional: OpenAPIV3.PathsObject = {},
): OpenAPIV3.Document => {
  return {
    openapi: '3.0.3',
    paths: {
      ...additional,
    },
    info: {
      title: 'abc',
      version: '0.0.2',
      description: 'No desc',
    },
  };
};
