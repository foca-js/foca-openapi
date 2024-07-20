import type { utils } from '../utils';

export const methods = <const>['get', 'post', 'put', 'patch', 'delete'];

export type Methods = (typeof methods)[number];

export interface OpenapiClientAdapter<T extends object = object> {
  request(
    opts: {
      /**
       * 路由
       */
      uri: string;
      /**
       * 请求方法
       */
      method: Methods;
      /**
       * 路径参数
       */
      params?: Record<string, any>;
      /**
       * 查询字符串
       */
      query?: Record<string, any>;
      /**
       * 请求实体
       */
      body?: Record<string, any>;
      /**
       * 超时时间。单位：`ms`
       */
      timeout?: number;
      /**
       * 携带cookie
       */
      credentials?: boolean | 'same-origin' | 'include' | 'omit';
      /**
       * 请求实体类型
       */
      requestBodyType: 'multipart/form-data' | 'application/json' | (string & {});
      /**
       * 响应类型
       */
      responseType: 'json' | 'text';
      /**
       * 请求报文
       */
      headers: Record<string, any>;
      /**
       * 请求之前动态修改配置
       */
      onBeforeRequest?: (options: T) => T | void;
    },
    helper: typeof utils,
  ): Promise<any>;
}
