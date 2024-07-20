import type { OpenAPIV3 } from 'openapi-types';
import { refToObject } from './ref-to-object';
import { generateComments } from './generate-comments';

export const parseSchemaType = (
  docs: OpenAPIV3.Document,
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
): string => {
  const parsed = refToObject(docs, schema);

  switch (parsed.type) {
    case 'array':
      return `${parseSchemaType(docs, parsed.items)}[]`;
    case 'boolean':
      return 'boolean';
    case 'integer':
    case 'number':
      return 'number';
    case 'object':
      const requiredProperties = parsed.required || [];
      const properties = Object.entries(parsed.properties || {}).map(([key, schema]) => {
        const schemaObj = refToObject(docs, schema);
        return `${generateComments(schemaObj)}${key}${requiredProperties.includes(key) ? '' : '?'}: ${parseSchemaType(docs, schemaObj)}`;
      });
      return `{ ${properties.join(';')} }`;
    case 'string':
      if (parsed.format === 'binary') return 'Blob';
      return 'string';
  }

  if (parsed.oneOf) {
    return parsed.oneOf.map((schema) => parseSchemaType(docs, schema)).join(' | ');
  }

  return 'never';
};
