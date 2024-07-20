import type { OpenAPIV3 } from 'openapi-types';
import { parseSchemaType } from './parse-schema';
import { refToObject } from './ref-to-object';

export const parseRequestBody = (
  docs: OpenAPIV3.Document,
  methodItem: OpenAPIV3.OperationObject,
) => {
  const requestBody = refToObject(
    docs,
    methodItem.requestBody || ({ content: {} } satisfies OpenAPIV3.RequestBodyObject),
  );
  const contentTypes = Object.keys(requestBody.content).filter(
    (item) => !!requestBody.content[item]!.schema,
  );
  const types = contentTypes.map((contentType) => {
    const { schema } = requestBody.content[contentType]!;
    return parseSchemaType(docs, schema!);
  });
  return {
    contentTypes: contentTypes.filter((item) => item !== '*/*'),
    body: {
      types,
      optional: contentTypes.length === 0,
    },
  };
};
