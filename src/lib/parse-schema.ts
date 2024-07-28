import type { OpenAPIV3 } from 'openapi-types';
import { refToObject } from './ref-to-object';
import { generateComments } from './generate-comments';

export const parseSchema = (
  docs: OpenAPIV3.Document,
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
): string => {
  const parsed = refToObject(docs, schema);
  const { ofType, nullable } = parseOf(docs, parsed);

  if (ofType) return `(${ofType}${nullable})`;

  if (parsed.enum?.length) {
    return `(${parsed.enum.map((item) => (typeof item === 'number' ? item : `"${item}"`)).join(' | ')}${nullable})`;
  }

  switch (parsed.type) {
    case 'boolean':
      return `(boolean${nullable})`;
    case 'integer':
    case 'number':
      return `(number${nullable})`;
    case 'string':
      if (parsed.format === 'binary') return `(Blob${nullable})`;
      return `(string${nullable})`;
    case 'array':
      return `((${parseSchema(docs, parsed.items)})[]${nullable})`;
    case 'object': {
      const requiredProperties = parsed.required || [];
      const properties = Object.entries(parsed.properties || {}).map(([key, schema]) => {
        const schemaObj = refToObject(docs, schema);
        return `${generateComments(schemaObj)}"${key}"${requiredProperties.includes(key) ? '' : '?'}: ${parseSchema(docs, schemaObj)}`;
      });
      return `({ ${properties.join(';')} }${nullable})`;
    }
    default:
      return 'unknown';
  }
};

const parseOf = (
  docs: OpenAPIV3.Document,
  schema: OpenAPIV3.SchemaObject,
): { nullable: string; ofType: string } => {
  if (!schema.oneOf?.length && !schema.anyOf?.length && !schema.allOf?.length) {
    return {
      nullable: schema.nullable ? ' | null' : '',
      ofType: '',
    };
  }

  const { oneOf = [], anyOf = [], allOf = [], nullable = false, ...rest } = schema;
  const oneTypes = new Set<string>();
  const anyTypes = new Set<string>();
  const allTypes = new Set<string>();

  const nullableSet = new Set<boolean>(
    oneOf
      .concat(anyOf)
      .concat(allOf)
      .map((item) => {
        const { nullable: itemNullable } = refToObject(docs, item);
        if (itemNullable !== undefined) return itemNullable;
        return nullable;
      }),
  );
  const additionalMergeOpts = nullableSet.size > 1 ? { nullable } : {};

  for (const one of oneOf) {
    oneTypes.add(
      parseSchema(docs, { ...rest, ...additionalMergeOpts, ...refToObject(docs, one) }),
    );
  }

  for (const any of anyOf) {
    anyTypes.add(
      parseSchema(docs, { ...rest, ...additionalMergeOpts, ...refToObject(docs, any) }),
    );
  }

  for (const all of allOf) {
    allTypes.add(
      parseSchema(docs, { ...rest, ...additionalMergeOpts, ...refToObject(docs, all) }),
    );
  }

  let oneType = oneTypes.size ? `(${[...oneTypes].join(' | ')})` : '';
  let anyType = anyTypes.size ? `(${[...anyTypes].join(' | ')})` : '';
  let allType = allTypes.size ? `(${[...allTypes].join(' & ')})` : '';

  if (oneType && oneType === anyType) anyType = '';
  if (oneType && oneType === allType) {
    allType = '';
    anyType = '';
  } else if (anyType && anyType === allType) {
    allType = '';
    oneType = '';
  }

  let unionType = [oneType, anyType].filter(Boolean).join(' | ');
  if (unionType) unionType = `(${unionType})`;

  let finalType = [unionType, allType].filter(Boolean).join(' & ');
  if (finalType) finalType = `(${finalType})`;

  return {
    nullable: nullableSet.size === 1 && [...nullableSet][0] === true ? ' | null' : '',
    ofType: finalType,
  };
};
