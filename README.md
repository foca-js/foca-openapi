# foca-openapi

使用openapi文档生成请求服务

[![npm peer typescript version](https://img.shields.io/npm/dependency-version/foca-openapi/peer/typescript?logo=typescript)](https://github.com/microsoft/TypeScript)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/foca-js/foca-openapi/test.yml?branch=master&label=test&logo=vitest)](https://github.com/foca-js/foca-openapi/actions)
[![Codecov](https://img.shields.io/codecov/c/github/foca-js/foca-openapi?logo=codecov)](https://codecov.io/gh/foca-js/foca-openapi)
[![npm](https://img.shields.io/npm/v/foca-openapi?logo=npm)](https://www.npmjs.com/package/foca-openapi)
[![npm](https://img.shields.io/npm/dt/foca-openapi?logo=codeforces)](https://www.npmjs.com/package/foca-openapi)
[![npm bundle size (version)](https://img.shields.io/bundlephobia/minzip/foca-openapi?label=bundle+size&cacheSeconds=3600&logo=esbuild)](https://bundlephobia.com/package/foca-openapi@latest)
[![License](https://img.shields.io/github/license/foca-js/foca-openapi?logo=open-source-initiative)](https://github.com/foca-js/foca-openapi/blob/master/LICENSE)

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
  // 可以是本地路径，也可以是远程地址。格式为json或者yaml
  path: 'http://domain.com/openapi.json',
  // 只包含指定的路由，支持字符串或者正则表达式
  // includeUriPrefix: ['/admin'],
  // 只包含指定的标签
  // includeTag: ['admin', 'public'],
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

# 多配置场景

如果一个项目需要融合多个openapi文档，则可以用数组的形式配置

```typescript
import { defineConfig } from 'foca-openapi';

export default defineConfig([
  {
    path: 'http://domain.com/openapi_1.json',
    // 项目名称，必须是唯一的值
    projectName: 'foo',
  },
  {
    path: 'http://domain.com/openapi_2.json',
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
