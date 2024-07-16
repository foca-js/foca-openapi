import type { OpenapiClientAdapter, Methods } from './lib/adapter';
import { utils } from './utils';

export namespace BaseOpenapiClient {
  export interface UserInputOpts {
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
  }

  export interface FullOpts extends UserInputOpts {
    params?: Record<string, any>;
    query?: Record<string, any>;
    body?: Record<string, any> | FormData;
  }

  export type Prettify<T> = {
    [K in keyof T]: T[K] extends object ? Prettify<T[K]> : T[K];
  } & {};
}

export abstract class BaseOpenapiClient {
  constructor(private readonly adapter: OpenapiClientAdapter) {}

  protected replaceURI(uri: string, params?: Record<string, any>) {
    if (!params) return uri;
    Object.entries(params).forEach(([key, value]) => {
      uri = uri.replace(new RegExp(`{${key}}`), value);
    });
    return uri;
  }

  protected request(uri: string, method: Methods, opts: BaseOpenapiClient.FullOpts) {
    const contentTypes = this.getContentTypes(uri, method);
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

  protected abstract getContentTypes(
    uri: string,
    method: string,
  ): [
    BaseOpenapiClient.UserInputOpts['requestBodyType'],
    BaseOpenapiClient.UserInputOpts['responseType'],
  ];
}
