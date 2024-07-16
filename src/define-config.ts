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
}

export const defineConfig = (options: OpenapiClientConfig | OpenapiClientConfig[]) => {
  return Array.isArray(options) ? options : [options];
};
