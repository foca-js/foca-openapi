import { readFile } from 'fs/promises';
import path from 'node:path';
import type { OpenAPIV3 } from 'openapi-types';
import YAML from 'yaml';
import type { OpenapiClientConfig } from '../define-config';

export const pathToOpenapi = async (
  uri: string,
  onLoaded?: OpenapiClientConfig['onDocumentLoaded'],
): Promise<OpenAPIV3.Document> => {
  let originContent: string;
  if (uri.startsWith('http:') || uri.startsWith('https:')) {
    const response = await fetch(uri, { method: 'get' });
    originContent = await response.text();
  } else {
    originContent = await readFile(path.resolve(uri), 'utf8');
  }

  let document: OpenAPIV3.Document;
  if (originContent.startsWith('{')) {
    document = JSON.parse(originContent);
  } else {
    document = YAML.parse(originContent);
  }

  return onLoaded?.(document) || document;
};
