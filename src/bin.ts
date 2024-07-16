#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Listr } from 'listr2';
import { OpenAPIV3 } from 'openapi-types';
import type { OpenapiClientConfig } from './define-config';
import { pathToOpenapi } from './lib/path-to-openapi';
import { rebuildDist } from './lib/rebuild-dist';
import { generateTemplate } from './lib/generate-template';
import { filterTag } from './lib/filter-tag';
import { filterUrl } from './lib/filter-url';
import { readConfig } from './lib/read-config';

const sleep = () => new Promise((resolve) => setTimeout(resolve, 300));

const spinner = new Listr<{
  configs: OpenapiClientConfig[];
  docs: OpenAPIV3.Document[];
  projects: Record<string, string>;
}>([]);

spinner.add({
  title: '读取配置文件openapi.config.ts',
  task: async (ctx) => {
    ctx.configs = await readConfig();
    await sleep();
  },
});

spinner.add({
  title: '获取openapi文档',
  task: async (ctx) => {
    ctx.docs = await Promise.all(ctx.configs.map((config) => pathToOpenapi(config.path)));
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

    ctx.configs.forEach((config, i) => {
      ctx.projects = {
        ...ctx.projects,
        ...generateTemplate(ctx.docs[i]!, config.projectName),
      };
    });

    await sleep();
  },
});

spinner.add({
  title: '写入@aomex/openapi-client',
  task: async (ctx) => {
    const dist = path.dirname(fileURLToPath(import.meta.url));
    const content = Object.values(ctx.projects).join('\n');
    await rebuildDist(dist, content);
  },
});

spinner.run();
