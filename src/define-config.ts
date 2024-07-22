import type { OpenAPIV3 } from 'openapi-types';

export interface OpenapiClientConfig {
  /**
   * openapi本地或者远程文件，支持格式：`yaml | json`
   */
  path: string;
  /**
   * 过滤指定路由前缀的接口
   */
  includeUriPrefix?: string | RegExp | (string | RegExp)[];
  /**
   * 过滤指定标签
   */
  includeTag?: string | string[];
  /**
   * 路径参数替换规则。默认：`{*}`
   *
   * - /users/{id}
   * - /users/{id}/posts
   */
  paramsFormat?: string;
  /**
   * 项目名称，提供多个openapi路径时必须填写。
   * 比如项目名为`demo`，则导出的类为`OpenapiClientDemo`
   */
  projectName?: string;
  /**
   * 类的生成方式。默认值：`rest`
   * - `rest`       仅生成 **get|post|put|patch|delete** 几个固定方法，uri作为第一个参数传入。
   * - `rpc`        把 method+uri 拼接成一个方法。
   * - `rpc-group`  在rpc模式的基础上，根据tags把方法归类到不同的分组中。如果没有提供tags，则默认合并到`default`分组
   *
   * ```typescript
   * const client = new OpenapiClient();
   *
   * // rest模式
   * await client.get('/users/{id}', opts);
   * // rpc模式
   * await client.getUsersById(opts);
   * // rpc-group模式
   * await client.user.getUsersById(opts);
   * ```
   */
  classMode?: 'rest' | 'rpc' | 'rpc-group';
  /**
   * 加载完openapi文档后的事件，允许直接对文档进行修改
   */
  onDocumentLoaded?: (doc: OpenAPIV3.Document) => OpenAPIV3.Document | void;
}

export const defineConfig = (options: OpenapiClientConfig | OpenapiClientConfig[]) => {
  return Array.isArray(options) ? options : [options];
};
