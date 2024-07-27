import type { OpenAPIV3 } from 'openapi-types';
import { refToObject } from './ref-to-object';
import { generateComments } from './generate-comments';

export const parseSchema = (
  docs: OpenAPIV3.Document,
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
): string => {
  const parsed = refToObject(docs, schema);
  const nullable = parsed.nullable ? ' | null' : '';

  if (parsed.enum?.length) {
    return `${parsed.enum.map((item) => (typeof item === 'number' ? item : `"${item}"`)).join(' | ')}${nullable}`;
  }

  if (parsed.oneOf) {
    return parsed.oneOf.map((schema) => parseSchema(docs, schema)).join(' | ');
  }

  switch (parsed.type) {
    case 'array':
      return `(${parseSchema(docs, parsed.items)})[]${nullable}`;
    case 'boolean':
      return `boolean${nullable}`;
    case 'integer':
    case 'number':
      return `number${nullable}`;
    case 'object':
      const requiredProperties = parsed.required || [];
      const properties = Object.entries(parsed.properties || {}).map(([key, schema]) => {
        const schemaObj = refToObject(docs, schema);
        return `${generateComments(schemaObj)}${key}${requiredProperties.includes(key) ? '' : '?'}: ${parseSchema(docs, schemaObj)}`;
      });
      return `{ ${properties.join(';')} }${nullable}`;
    case 'string':
      if (parsed.format === 'binary') return `Blob${nullable}`;
      return `string${nullable}`;
  }

  return 'unknown';
};
