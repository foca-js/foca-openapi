import type { OpenAPIV3 } from 'openapi-types';
import { refToObject } from './ref-to-object';
import { generateComments } from './generate-comments';
import { parseSchemaType } from './parse-schema-type';

export const parseParameters = (
  docs: OpenAPIV3.Document,
  pathItem: OpenAPIV3.PathItemObject,
  methodItem: OpenAPIV3.OperationObject,
  key: string,
): { optional: boolean; types: [string] | [] } => {
  const parameters = (methodItem.parameters || [])
    .concat(pathItem.parameters || [])
    .map((parameter) => refToObject(docs, parameter))
    .filter((parameter) => parameter.in === key);

  const types = parameters
    .map((parameter) => {
      if (!parameter.schema) return '';
      return `${generateComments(parameter)}${parameter.name}${parameter.required ? '' : '?'}: ${parseSchemaType(docs, parameter.schema)}
      `;
    })
    .filter(Boolean);
  return {
    optional: parameters.every((parameter) => !parameter.required),
    types: types.length ? [`{ ${types.join(';\n')} }`] : [],
  };
};