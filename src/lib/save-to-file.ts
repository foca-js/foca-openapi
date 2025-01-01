import path from 'node:path';
import { kebabCase } from 'lodash-es';
import { mkdir, writeFile } from 'node:fs/promises';
import type { OpenapiClientConfig } from '../define-config';

export const saveToFile = async (
  config: Pick<OpenapiClientConfig, 'projectName' | 'outputFile'>,
  projects: Record<string, string>,
) => {
  const outputFile =
    config.outputFile?.replaceAll(path.sep, path.posix.sep) ||
    path.posix.join(
      'src',
      'openapi',
      `${config.projectName ? kebabCase(config.projectName) : 'openapi'}.ts`,
    );
  const fullPath = path.posix.resolve(outputFile);
  const projectContent = projects[config.projectName ?? '']!;
  await mkdir(path.posix.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, projectContent);
  return outputFile;
};
