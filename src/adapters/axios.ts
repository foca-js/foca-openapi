import type { OpenapiClientAdapter } from '../lib/adapter';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 *
 * @param axios axios实例
 * @param returningData 返回最终数据。默认值：`(res) => res.data`
 */
export const axiosAdapter = (
  axios: { request: (config: AxiosRequestConfig) => Promise<AxiosResponse> },
  returningData: (response: AxiosResponse) => any = (response) => response.data,
): OpenapiClientAdapter => {
  return {
    async request(opts, utils) {
      const body = utils.formatBody(opts.requestBodyType, opts.body);
      const credentials =
        opts.credentials === 'omit' || opts.credentials === false
          ? false
          : typeof opts.credentials === 'string' || opts.credentials === true
            ? true
            : undefined;

      const result = await axios.request({
        url: opts.uri,
        method: opts.method,
        params: opts.query,
        data: body,
        headers: opts.headers,
        timeout: opts.timeout,
        withCredentials: credentials,
        responseType: opts.responseType,
      });

      return returningData(result);
    },
  };
};
