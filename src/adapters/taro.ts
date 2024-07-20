import type { Methods, OpenapiClientAdapter } from '../lib/adapter';
import type Taro from '@tarojs/taro';

/**
 * Taro适配器
 * ```typescript
 * import { OpenapiClient } from 'foca-openapi';
 * import Taro from '@tarojs/taro';
 * import { taroAdapter } from 'foca-openapi/adapters/taro';
 *
 * const adapter = taroAdapter({ request: Taro.request, baseURL: 'http://api.com' });
 * const client = new OpenapiClient(adapter);
 * ```
 */
export const taroAdapter = (opts: {
  request: typeof Taro.request;
  /**
   * 包含域名的地址，每次请求前都会拼接
   */
  baseURL?: string;
  /**
   * 获取状态码。默认值：`(result) => result.statusCode`
   */
  getStatusCode?: (result: Taro.request.SuccessCallbackResult) => number;
  /**
   * 请求失败回调函数，需要返回异常
   */
  onFail?: (
    result: Taro.request.SuccessCallbackResult,
    config: {
      uri: string;
      method: string;
      statusCode: number;
    },
  ) => Error;
  /**
   * 返回最终数据。默认值：`(res) => res.data`
   */
  returningData?: (response: Taro.request.SuccessCallbackResult) => any;
  /**
   * Taro.request()的默认参数，每次请求前都会合并对象
   */
  requestOptions?: Taro.request.Option;
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
        typeof opts.credentials === 'string'
          ? opts.credentials
          : opts.credentials === true
            ? 'same-origin'
            : 'omit';

      const result = await request({
        ...requestOptions,
        url: baseURL + utils.uriConcatQuery(opts.uri, opts.query),
        method: opts.method.toUpperCase() as `${Uppercase<Methods>}`,
        data: body,
        header: { ...requestOptions?.header, ...opts.headers },
        timeout: opts.timeout,
        credentials,
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
