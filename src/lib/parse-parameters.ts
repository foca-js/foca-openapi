import type { OpenAPIV3 } from 'openapi-types';
import { refToObject } from './ref-to-object';
import { generateComments } from './generate-comments';
import { parseSchema } from './parse-schema';

export const parseParameters = (
  docs: OpenAPIV3.Document,
  pathItem: OpenAPIV3.PathItemObject,
  methodItem: OpenAPIV3.OperationObject,
  key: string,
  looseInputNumber?: boolean,
): { optional: boolean; types: [string] | [] } => {
  const parameters = (methodItem.parameters || [])
    .concat(pathItem.parameters || [])
    .map((parameter) => refToObject(docs, parameter))
    .filter((parameter) => parameter.in === key);

  const types = parameters
    .map((parameter) => {
      if (!parameter.schema) return '';
      return `${generateComments(parameter)}${parameter.name}${parameter.required ? '' : '?'}: ${parseSchema(docs, parameter.schema)}
      `;
    })
    .filter(Boolean)
    .map((type) => {
      if (!looseInputNumber) return type;
      return type
        .replaceAll('(number)', '(number | string.Number)')
        .replaceAll('(number | null)', '(number | string.Number | null)');
    });

  return {
    optional: parameters.every((parameter) => !parameter.required),
    types: types.length ? [`{ ${types.join(';\n')} }`] : [],
  };
};
