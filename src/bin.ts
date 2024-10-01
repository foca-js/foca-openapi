#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import timers from 'node:timers/promises';
import { Listr } from 'listr2';
import minimist from 'minimist';
import colors from 'yoctocolors';
import { OpenAPIV3 } from 'openapi-types';
import type { OpenapiClientConfig } from './define-config';
import { pathToOpenapi } from './lib/path-to-openapi';
import { rebuildDist } from './lib/rebuild-dist';
import { generateTemplate } from './lib/generate-template';
import { filterTag } from './lib/filter-tag';
import { filterUrl } from './lib/filter-url';
import { readConfig } from './lib/read-config';

const sleep = () => timers.setTimeout(300);

const toArray = (value: any) => (Array.isArray(value) ? value : [value]);

const spinner = new Listr<{
  configs: OpenapiClientConfig[];
  docs: OpenAPIV3.Document[];
  projects: Record<string, { dts: string; js: string }>;
}>([]);

spinner.add({
  title: '读取配置文件openapi.config.ts',
  task: async (ctx, task) => {
    const userConfig = readConfig();

    if (typeof userConfig === 'function') {
      const args = minimist(process.argv.slice(2), { alias: { env: ['e'] } });
      const env = args['env'] || process.env['NODE_ENV'] || 'development';
      task.title += ` [${colors.green(env)}]`;
      ctx.configs = toArray(await userConfig(env));
    } else {
      ctx.configs = toArray(userConfig);
    }

    await sleep();
  },
});

spinner.add({
  title: '获取openapi文档',
  task: async (ctx) => {
    ctx.docs = await Promise.all(
      ctx.configs.map((config) => pathToOpenapi(config.url, config.onDocumentLoaded)),
    );
    await sleep();
  },
});

spinner.add({
  title: '过滤指定标签',
  skip: (ctx) => {
    return ctx.configs.every(
      ({ includeTag: value }) => !value || (Array.isArray(value) && !value.length),
    );
  },
  task: async (ctx) => {
    ctx.configs.forEach((config, i) => {
      filterTag(ctx.docs[i]!, config);
    });
    await sleep();
  },
});

spinner.add({
  title: '过滤指定前缀',
  skip: (ctx) => {
    return ctx.configs.every(
      ({ includeUriPrefix: value }) => !value || (Array.isArray(value) && !value.length),
    );
  },
  task: async (ctx) => {
    ctx.configs.forEach((config, i) => {
      filterUrl(ctx.docs[i]!, config);
    });
    await sleep();
  },
});

spinner.add({
  title: '生成客户端',
  task: async (ctx) => {
    ctx.projects = {};

    await Promise.all(
      ctx.configs.map(async (config, i) => {
        ctx.projects = {
          ...ctx.projects,
          ...(await generateTemplate(ctx.docs[i]!, config)),
        };
      }),
    );

    await sleep();
  },
});

spinner.add({
  title: '写入@aomex/openapi-client',
  task: async (ctx) => {
    const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
    const jsContent = Object.values(ctx.projects)
      .map(({ js }) => js)
      .join('\n');
    const dtsContent = Object.values(ctx.projects)
      .map(({ dts }) => dts)
      .join('\n');
    await rebuildDist(root, jsContent, dtsContent, Object.keys(ctx.projects));
  },
});

spinner.run();
