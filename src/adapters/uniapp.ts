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
   * 返回最终数据。默认值：`(res) => res.data`
   */
  returningData?: (response: UniApp.RequestSuccessCallbackResult) => any;
  /**
   * uni.request()的默认参数，每次请求前都会合并对象
   */
  requestOptions?: UniApp.RequestOptions;
}): OpenapiClientAdapter => {
  const {
    returningData = (response) => response.data,
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

      return returningData(result);
    },
  };
};

uniappAdapter(uni);
