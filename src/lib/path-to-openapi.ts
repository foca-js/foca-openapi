import { readFile } from 'fs/promises';
import path from 'node:path';
import type { OpenAPIV3 } from 'openapi-types';
import YAML from 'yaml';
import type { OpenapiClientConfig } from '../define-config';
import axios from 'foca-axios';

export const pathToOpenapi = async (
  uri: string,
  onLoaded?: OpenapiClientConfig['onDocumentLoaded'],
): Promise<OpenAPIV3.Document> => {
  let originContent: string;
  if (uri.startsWith('http:') || uri.startsWith('https:')) {
    // 使用fetch时会出现偶发性错误：`connect ECONNREFUSED 0.0.0.0:443`
    originContent = await axios.get(uri, { responseType: 'text' });
  } else {
    originContent = await readFile(path.resolve(uri), 'utf8');
  }

  let document: OpenAPIV3.Document;
  try {
    document = JSON.parse(originContent);
  } catch {
    document = YAML.parse(originContent);
  }

  return onLoaded?.(document) || document;
};
