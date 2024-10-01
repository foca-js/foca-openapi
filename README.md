# foca-openapi

使用openapi文档生成请求服务。支持 **Openapi 3.0**

[![npm peer typescript version](https://img.shields.io/npm/dependency-version/foca-openapi/peer/typescript?logo=typescript)](https://github.com/microsoft/TypeScript)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/foca-js/foca-openapi/test.yml?branch=main&label=test&logo=vitest)](https://github.com/foca-js/foca-openapi/actions)
[![Codecov](https://img.shields.io/codecov/c/github/foca-js/foca-openapi?logo=codecov)](https://codecov.io/gh/foca-js/foca-openapi)
[![npm](https://img.shields.io/npm/v/foca-openapi?logo=npm)](https://www.npmjs.com/package/foca-openapi)
[![npm](https://img.shields.io/npm/dt/foca-openapi?logo=codeforces)](https://www.npmjs.com/package/foca-openapi)
[![npm bundle size (version)](https://img.shields.io/bundlephobia/minzip/foca-openapi?label=bundle+size&cacheSeconds=3600&logo=esbuild)](https://bundlephobia.com/package/foca-openapi@latest)
[![License](https://img.shields.io/github/license/foca-js/foca-openapi?logo=open-source-initiative)](https://github.com/foca-js/foca-openapi/blob/main/LICENSE)

# 安装

```bash
pnpm add foca-openapi
```

# 使用

## 1. 创建配置文件

在项目根目录下创建一个名为 `openapi.config.ts` 的文件

```typescript
import { defineConfig } from 'foca-openapi';

export default defineConfig({
  // 可以是本地路径，也可以是远程地址
  url: 'http://domain.com/openapi.json',
});
```

## 2. 执行指令

指令的作用是把openapi文档转换为前端服务，代码会自动合并到库文件中

```bash
npx foca-openapi
```

## 3. 创建服务

使用合适的请求适配器创建好服务后，就可以导出给各个模块使用了

```typescript
// ./src/services/http.ts
import { OpenapiClient } from 'foca-openapi';
import { fetchAdapter } from 'foca-openapi/adapters/fetch';

const adapter = fetchAdapter({ baseURL: 'http://api.com' });
export const client = new OpenapiClient(adapter);
```

# 适配器

引入形式
`import { xxAdapter } from 'foca-openapi/adapters/xx';`

当前已内置多个适配器，可满足大部分需求。如果无法满足项目需求则可以自行创建适配器（或者提issue）

- axios
- fetch
- taro
- uniapp

# 多配置场景

如果一个项目需要融合多个openapi文档，则可以用数组的形式配置

```typescript
import { defineConfig } from 'foca-openapi';

export default defineConfig([
  {
    url: 'http://domain.com/openapi_1.json',
    // 项目名称，必须是唯一的值
    projectName: 'foo',
  },
  {
    url: 'http://domain.com/openapi_2.json',
    // 项目名称，必须是唯一的值
    projectName: 'bar',
  },
]);
```

执行指令后就会生成两个类

```typescript
import { OpenapiClientFoo, OpenapiClientBar } from 'foca-openapi';

export const fooClient = new OpenapiClientFoo(adapter1);
export const barClient = new OpenapiClientBar(adapter2);
```

# 环境变量

不同运行环境下，可能需要使用不同的服务端，比如开发一套服务，生产一套服务。因此执行指令时可以传入`-env`参数

```bash
npx foca-openapi --env development
npx foca-openapi --env production
```

配置文件使用回调函数的形式接收环境变量，并返回配置

```typescript
import { defineConfig } from 'foca-openapi';

export default defineConfig((env) => {
  return {
    url:
      env === 'production'
        ? 'https://api.com/openapi.json'
        : 'http://localhost:3000/openapi.json',
  };
});
```

# 参数

### url

类型：`string`<br>

openapi本地或者远程文件，支持格式：`yaml | json`

### includeUriPrefix

类型：`string | string[] | RegExp | RegExp[]`

过滤指定路由前缀的接口

### includeTag

类型：`string | string[]`

过滤指定标签

### projectName

类型：`string`

项目名称，提供多个openapi路径时必须填写。比如项目名为`demo`，则导出的类为`OpenapiClientDemo`

### classMode

类型：`'rest' | 'rpc' | 'rpc-group'`<br>
默认值：`'rest'`

类的生成方式。

| 模式      | 描述                                                                                                    | 优点                                             |
| --------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| rest      | 仅生成统一的 **get,post,put,patch,delete** 几个方法<br>参考：[rest-mode.js](./openapi/rest-mode.js)     | 1. 运行时代码少<br>2. 不暴露接口，安全性高       |
| rpc       | 把 method+uri 拼接成一个新方法<br>参考：[rpc-mode.js](./openapi/rpc-mode.js)                            | 1. 拥有独立的注释文档                            |
| rpc-group | 基于rpc模式，根据tags把方法归类到不同的分组中<br>参考：[rpc-group-mode.js](./openapi/rpc-group-mode.js) | 1. 拥有独立的注释文档<br>2. 能更快地找到目标接口 |

```typescript
const client = new OpenapiClient();

// rest模式
await client.get('/users/{id}', opts);
// rpc模式
await client.getUsersById(opts);
// rpc-group模式
await client.user.getUsersById(opts);
```

**注意**：rpc-group模式下，如果没有提供tags，则默认合并到`default`分组

### onDocumentLoaded

类型：`(docs: Document) => Document | void`

加载完openapi文档后的事件，允许直接对文档进行修改
