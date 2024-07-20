/// <reference types="@dcloudio/types" />
import type { OpenapiClientAdapter } from '../lib/adapter';

/**
 * uni-app适配器
 * ```typescript
 * import { OpenapiClient } from 'foca-openapi';
 * import { uniappAdapter } from 'foca-openapi/adapters/uniapp';
 *
 * const adapter = uniappAdapter({ request: uni.request, baseURL: 'http://api.com' });
 * const client = new OpenapiClient(adapter);
 * ```
 */
export const uniappAdapter = (opts: {
  request: typeof uni.request;
  /**
   * 包含域名的地址，每次请求前都会拼接
   */
  baseURL?: string;
  /**
   * 获取状态码。默认值：`(result) => result.statusCode`
   */
  getStatusCode?: (result: UniApp.RequestSuccessCallbackResult) => number;
  /**
   * 请求失败回调函数，需要返回异常
   */
  onFail?: (
    result: UniApp.RequestSuccessCallbackResult,
    config: {
      uri: string;
      method: string;
      statusCode: number;
    },
  ) => Error;
  /**
   * 返回最终数据。默认值：`(result) => result.data`
   */
  returningData?: (result: UniApp.RequestSuccessCallbackResult) => any;
  /**
   * uni.request()的默认参数，每次请求前都会合并对象
   */
  requestOptions?: UniApp.RequestOptions;
}): OpenapiClientAdapter => {
  const {
    returningData = (result) => result.data,
    getStatusCode = (result) => result.statusCode,
    onFail = (_, config) => {
      throw new Error(`请求接口"${config.uri}"失败，状态码：${config.statusCode}`);
    },
    request,
    baseURL = '',
    requestOptions,
  } = opts;

  return {
    async request(opts, utils) {
      const body = utils.formatBody(opts.requestBodyType, opts.body);
      const credentials =
        opts.credentials === 'omit' || opts.credentials === false
          ? false
          : typeof opts.credentials === 'string' || opts.credentials === true
            ? true
            : undefined;

      const result = await request({
        ...requestOptions,
        url: baseURL + utils.uriConcatQuery(opts.uri, opts.query),
        method: opts.method.toUpperCase() as any,
        data: body,
        header: { ...requestOptions?.header, ...opts.headers },
        timeout: opts.timeout,
        withCredentials: credentials,
        dataType: opts.responseType === 'json' ? 'json' : undefined,
        responseType: opts.responseType === 'text' ? 'text' : undefined,
      });

      const statusCode = getStatusCode(result);
      if (statusCode >= 400) {
        return Promise.reject(
          onFail(result, { uri: opts.uri, method: opts.method, statusCode }),
        );
      } else {
        return returningData(result);
      }
    },
  };
};

uniappAdapter(uni);
