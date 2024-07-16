import { readFile } from 'fs/promises';
import path from 'node:path';
import type { OpenAPIV3 } from 'openapi-types';
import YAML from 'yaml';

export const pathToOpenapi = async (uri: string): Promise<OpenAPIV3.Document> => {
  let originContent: string;
  if (uri.startsWith('http:') || uri.startsWith('https:')) {
    const response = await fetch(uri, { method: 'get' });
    originContent = await response.text();
  } else {
    originContent = await readFile(path.resolve(uri), 'utf8');
  }

  if (originContent.startsWith('{')) {
    return JSON.parse(originContent);
  } else {
    return YAML.parse(originContent);
  }
};
