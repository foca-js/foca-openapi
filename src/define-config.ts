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
   * 类的生成方式。默认值：`method`
   * - `method`，仅生成 **get|post|put|patch|delete** 几个方法，uri作为第一个参数传入
   * - `uri`，把 method+uri 拼接成一个方法，比如 **POST /users/{id}** 会变成 **postUsersById()**
   */
  classMode?: 'method' | 'uri';
  /**
   * 根据Tag生成不同的分组，以类似 **client.user.getUsers()** 这种方式调用。仅在 `classMode=uri` 场景下生效。默认值：`true`
   *
   * 如果没有提供tags，则默认合并到`default`分组
   */
  tagToGroup?: boolean;
}

export const defineConfig = (options: OpenapiClientConfig | OpenapiClientConfig[]) => {
  return Array.isArray(options) ? options : [options];
};
