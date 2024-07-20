export interface OpenapiClientConfig {
  /**
   * openapi本地或者远程文件
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
   * 类的生成方式。默认值：`method`
   * - `method`，仅生成 `get|post|put|patch|delete` 几个方法，uri作为第一个参数传入
   * - `uri`，所有的 method+uri 都会重新拼接成一个方法，比如`postUsersById()`
   */
  classMode?: 'method' | 'uri';
}

export const defineConfig = (options: OpenapiClientConfig | OpenapiClientConfig[]) => {
  return Array.isArray(options) ? options : [options];
};
