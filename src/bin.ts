#!/usr/bin/env node

import timers from 'node:timers/promises';
import { Listr } from 'listr2';
import minimist from 'minimist';
import colors from 'yoctocolors';
import { OpenAPIV3 } from 'openapi-types';
import type { OpenapiClientConfig } from './define-config';
import { pathToOpenapi } from './lib/path-to-openapi';
import { saveToFile } from './lib/save-to-file';
import { generateTemplate } from './lib/generate-template';
import { filterTag } from './lib/filter-tag';
import { filterUri } from './lib/filter-uri';
import { readConfig } from './lib/read-config';
import { SilentSpinner } from './silent-spinner';

const argv = minimist(process.argv.slice(2), {
  alias: { config: ['c'], env: ['e'] },
});
const silent = Boolean(argv['silent']);
const env = argv['env'] || process.env['NODE_ENV'] || 'development';
const configFile = argv['config'];

const sleep = () => timers.setTimeout(300);
const toArray = (value: any) => (Array.isArray(value) ? value : [value]);

const spinner = (silent ? new SilentSpinner([]) : new Listr([])) as Listr<{
  configs: OpenapiClientConfig[];
  docs: OpenAPIV3.Document[];
  projects: Record<string, string>;
}>;

spinner.add({
  title: '读取配置文件openapi.config.ts',
  task: async (ctx, task) => {
    const userConfig = readConfig(configFile);

    if (typeof userConfig === 'function') {
      task.title += ` ${colors.gray(env)}`;
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
      filterUri(ctx.docs[i]!, config);
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
        const project = await generateTemplate(ctx.docs[i]!, config);
        ctx.projects = { ...ctx.projects, ...project };
      }),
    );

    await sleep();
  },
});

spinner.add({
  title: '写入指定文件',
  task: async (ctx, task) => {
    const files = await Promise.all(
      ctx.configs.map((config) => {
        return saveToFile(config, ctx.projects);
      }),
    );
    task.title += ' ' + colors.gray(files.join(', '));
  },
});

await spinner.run();
