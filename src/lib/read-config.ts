import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { require } from 'tsx/cjs/api';
import type { DefineConfigOptions } from '../define-config';

export const readConfig = () => {
  const { default: content } = require(pathToFileURL(
    path.resolve('openapi.config.ts'),
  ).toString(), import.meta.url);
  return content as DefineConfigOptions;
};
