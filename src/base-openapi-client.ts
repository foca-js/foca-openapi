import type { OpenapiClientAdapter, Methods } from './lib/adapter';
import { utils } from './utils';

export namespace string {
  /**
   * '12345'
   */
  export type Number = string;
  export type BigInt = string;
  /**
   * 2020-02-12T07:20:50.52Z
   */
  export type DateTime = string;
  /**
   * 2020-02-12
   */
  export type Date = string;
  /**
   * 07:20:50.52Z
   */
  export type Time = string;
  /**
   * example@gmail.com
   */
  export type Email = string;
  /**
   * https://example.com/foo/bar
   */
  export type Uri = string;
  /**
   * 127.0.0.1
   */
  export type IPv4 = string;
  /**
   * 2001:0DB8:0000:0023:0008:0800:200C:417A
   */
  export type IPv6 = string;
}

export namespace BaseOpenapiClient {
  export interface UserInputOpts<T extends object = object> {
    headers?: Record<string, unknown>;
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
    requestBodyType?: 'multipart/form-data' | 'application/json' | (string & {});
    /**
     * 响应类型
     */
    responseType?: 'json' | 'text';
    /**
     * 请求之前动态修改配置
     */
    onBeforeRequest?: (options: T) => T | void;
  }

  export interface FullOpts<T extends object = object> extends UserInputOpts<T> {
    params?: Record<string, any>;
    query?: Record<string, any>;
    body?: Record<string, any> | FormData;
  }

  export type Prettify<T> = {
    [K in keyof T]: T[K] extends object ? Prettify<T[K]> : T[K];
  } & {};
}

export abstract class BaseOpenapiClient<T extends object = object> {
  constructor(private readonly adapter: OpenapiClientAdapter<T>) {}

  protected replaceURI(uri: string, params?: Record<string, any>) {
    if (!params) return uri;
    Object.entries(params).forEach(([key, value]) => {
      uri = uri.replace(new RegExp(`{${key}}`), value);
    });
    return uri;
  }

  protected request(
    uri: string,
    method: Methods,
    opts: BaseOpenapiClient.FullOpts<T> = {},
  ) {
    const contentTypes = this.pickContentTypes(uri, method);
    const requestBodyType = opts.requestBodyType || contentTypes[0] || 'application/json';
    const responseType = opts.responseType || contentTypes[1] || 'json';
    const headers = opts.headers || {};
    if (
      !Object.hasOwn(headers, 'Content-Type') &&
      !Object.hasOwn(headers, 'content-type')
    ) {
      headers['Content-Type'] = requestBodyType;
    }

    const formattedUri = this.replaceURI(uri, opts.params);

    return this.adapter.request(
      {
        uri: formattedUri,
        method,
        ...opts,
        requestBodyType,
        responseType,
        headers,
      },
      utils,
    );
  }

  protected pickContentTypes(
    _uri: string,
    _method: string,
  ): [
    BaseOpenapiClient.UserInputOpts['requestBodyType'],
    BaseOpenapiClient.UserInputOpts['responseType'],
  ] {
    return [void 0, void 0];
  }
}
