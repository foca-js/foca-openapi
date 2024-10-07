import type { OpenapiClientAdapter } from '../lib/adapter';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * axios 适配器
 * ```typescript
 * import { OpenapiClient } from 'foca-openapi';
 * import { axiosAdapter } from 'foca-openapi/adapters/axios';
 * import axios from 'axios';
 *
 * axios.defaults.baseURL = 'https//api.com';
 *
 * const client = new OpenapiClient(axiosAdapter(axios));
 * ```
 * @param axios axios实例
 * @param returningData 返回最终数据。默认值：`(res) => res.data`
 *
 */
export const axiosAdapter = (
  axios: { request: (config: object) => Promise<AxiosResponse> },
  returningData: (response: AxiosResponse) => any = (response) => response.data,
): OpenapiClientAdapter<AxiosRequestConfig> => {
  return {
    async request(opts, utils) {
      const body = utils.formatBody(opts.requestBodyType, opts.body);
      const credentials =
        opts.credentials === 'omit' || opts.credentials === false
          ? false
          : typeof opts.credentials === 'string' || opts.credentials === true
            ? true
            : undefined;
      const config: AxiosRequestConfig = {
        url: opts.uri,
        method: opts.method,
        params: opts.query,
        data: body,
        headers: opts.headers,
        timeout: opts.timeout,
        withCredentials: credentials,
        responseType: opts.responseType,
      };

      const result = await axios.request(opts.onBeforeRequest?.(config) || config);

      return returningData(result);
    },
  };
};
