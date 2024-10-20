import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { require } from 'tsx/cjs/api';
import type { DefineConfigOptions } from '../define-config';

export const readConfig = (configFile: string = 'openapi.config.ts') => {
  const { default: content } = require(pathToFileURL(
    path.resolve(configFile),
  ).toString(), import.meta.url);
  return content as DefineConfigOptions;
};
