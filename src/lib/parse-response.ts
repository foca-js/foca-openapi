import type { OpenAPIV3 } from 'openapi-types';
import { parseSchemaType } from './parse-schema';
import { refToObject } from './ref-to-object';

export const parseResponse = (
  docs: OpenAPIV3.Document,
  methodItem: OpenAPIV3.OperationObject,
) => {
  const response = refToObject(docs, methodItem.responses || {});
  const filteredResponse = Object.entries(response)
    .filter(([code]) => code.startsWith('2') || code === 'default')
    .map(([_, schema]) => refToObject(docs, schema));

  const contentTypes = filteredResponse
    .flatMap((item) => Object.keys(item.content || {}))
    .filter((item) => item !== '*/*');
  const types = filteredResponse
    .flatMap((item) => Object.values(item.content || {}))
    .map((item) => item.schema && refToObject(docs, item.schema))
    .filter(Boolean)
    .map((schema) => parseSchemaType(docs, schema || {}));

  return {
    responseTypes: [...new Set(contentTypes)],
    response: { types },
  };
};
