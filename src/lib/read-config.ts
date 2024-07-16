import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { tsImport } from 'tsx/esm/api';
import type { OpenapiClientConfig } from '../define-config';

export const readConfig = async () => {
  const { default: content } = await tsImport(
    pathToFileURL(path.resolve('openapi.config.ts')).toString(),
    import.meta.url,
  );
  return content as OpenapiClientConfig[];
};
