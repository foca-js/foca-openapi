import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { require } from 'tsx/cjs/api';
import type { DefineConfigOptions } from '../define-config';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2), {
  alias: { config: ['c'] },
});

export const readConfig = () => {
  const { default: content } = require(pathToFileURL(
    path.resolve(argv['config'] || 'openapi.config.ts'),
  ).toString(), import.meta.url);
  return content as DefineConfigOptions;
};
